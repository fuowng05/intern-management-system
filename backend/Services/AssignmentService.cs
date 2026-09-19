using InternshipManagement.Api.Data;
using InternshipManagement.Api.DTOs.Assignments;
using InternshipManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace InternshipManagement.Api.Services;

public class AssignmentService : IAssignmentService
{
    private readonly ApplicationDbContext _context;

    public AssignmentService(ApplicationDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // 1. CREATE ASSIGNMENT
    //
    // Application APPROVED
    //        ↓
    // Create Assignment
    //        +
    // Create Evaluation DRAFT
    //        +
    // Snapshot EvaluationCriteria
    //
    // Tất cả thực hiện trong cùng transaction.
    // =========================================================
    public async Task<AssignmentResponse> CreateAsync(
        Guid assignedBy,
        CreateAssignmentRequest request)
    {
        // -----------------------------------------------------
        // 1. Kiểm tra Application
        // -----------------------------------------------------
        var application = await _context.Applications
            .Include(a => a.Student)
            .Include(a => a.Company)
            .FirstOrDefaultAsync(a =>
                a.Id == request.ApplicationId);

        if (application == null)
        {
            throw new InvalidOperationException(
                "Không tìm thấy đơn đăng ký thực tập.");
        }

        // -----------------------------------------------------
        // 2. Application phải APPROVED
        // -----------------------------------------------------
        if (!string.Equals(
                application.Status,
                "APPROVED",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(
                "Chỉ đơn đã APPROVED mới được phân công Mentor.");
        }

        // -----------------------------------------------------
        // 3. Application chưa được Assignment
        // -----------------------------------------------------
        var assignmentExists =
            await _context.Assignments
                .AnyAsync(a =>
                    a.ApplicationId ==
                    request.ApplicationId);

        if (assignmentExists)
        {
            throw new InvalidOperationException(
                "Đơn đăng ký này đã được phân công Mentor.");
        }

        // -----------------------------------------------------
        // 4. Application chưa có Evaluation
        // -----------------------------------------------------
        var evaluationExists =
            await _context.Evaluations
                .AnyAsync(e =>
                    e.ApplicationId ==
                    application.Id);

        if (evaluationExists)
        {
            throw new InvalidOperationException(
                "Application này đã có Evaluation.");
        }

        // -----------------------------------------------------
        // 5. Kiểm tra Mentor
        // -----------------------------------------------------
        var mentor = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u =>
                u.Id == request.MentorId);

        if (mentor == null)
        {
            throw new InvalidOperationException(
                "Không tìm thấy Mentor.");
        }

        if (!mentor.IsActive)
        {
            throw new InvalidOperationException(
                "Tài khoản Mentor hiện không hoạt động.");
        }

        var isMentor = await _context.UserRoles
            .AsNoTracking()
            .AnyAsync(ur =>
                ur.UserId == mentor.Id &&
                ur.Role.Code == "MENTOR");

        if (!isMentor)
        {
            throw new InvalidOperationException(
                "Người được phân công không có vai trò Mentor.");
        }

        // -----------------------------------------------------
        // 6. Mentor phải thuộc đúng Company
        // -----------------------------------------------------
        if (mentor.CompanyId !=
            application.CompanyId)
        {
            throw new InvalidOperationException(
                "Mentor không thuộc doanh nghiệp của đơn thực tập.");
        }

        // -----------------------------------------------------
        // 7. Kiểm tra người thực hiện phân công
        // -----------------------------------------------------
        var assigner = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u =>
                u.Id == assignedBy &&
                u.IsActive);

        if (assigner == null)
        {
            throw new InvalidOperationException(
                "Không tìm thấy người thực hiện phân công.");
        }

        // -----------------------------------------------------
        // 8. Tìm CriteriaTemplate PUBLISHED
        // thuộc đúng InternshipPeriod
        //
        // Nếu có nhiều version thì lấy version mới nhất.
        // -----------------------------------------------------
        var template =
            await _context.CriteriaTemplates
                .Include(t => t.Items)
                .Where(t =>
                    t.PeriodId ==
                        application.PeriodId &&
                    t.Status == "PUBLISHED")
                .OrderByDescending(t =>
                    t.Version)
                .FirstOrDefaultAsync();

        if (template == null)
        {
            throw new InvalidOperationException(
                "Đợt thực tập chưa có Criteria Template PUBLISHED. " +
                "Hãy publish bộ tiêu chí trước khi phân công Mentor.");
        }

        // -----------------------------------------------------
        // 9. Kiểm tra số lượng Criteria
        // -----------------------------------------------------
        if (template.Items.Count <
                template.MinItems ||
            template.Items.Count >
                template.MaxItems)
        {
            throw new InvalidOperationException(
                $"Template phải có từ " +
                $"{template.MinItems} đến " +
                $"{template.MaxItems} tiêu chí.");
        }

        // -----------------------------------------------------
        // 10. Kiểm tra Weight
        // -----------------------------------------------------
        var totalWeight =
            template.Items.Sum(i =>
                i.DefaultWeight);

        if (totalWeight != 100m)
        {
            throw new InvalidOperationException(
                $"Tổng trọng số của template phải bằng 100%. " +
                $"Hiện tại là {totalWeight}%.");
        }
        var hasMandatoryItem =
            template.Items.Any(i => i.IsMandatory);

        if (!hasMandatoryItem)
        {
            throw new InvalidOperationException(
                "Criteria Template phải có ít nhất một tiêu chí bắt buộc.");
        }

        // -----------------------------------------------------
        // 11. TRANSACTION
        //
        // Assignment
        // Evaluation
        // EvaluationCriteria
        // AuditLog
        //
        // hoặc tất cả thành công,
        // hoặc tất cả rollback.
        // -----------------------------------------------------
        await using var transaction =
            await _context.Database
                .BeginTransactionAsync();

        try
        {
            var now = DateTime.UtcNow;

            // -------------------------------------------------
            // 12. Create Assignment
            // -------------------------------------------------
            var assignment = new Assignment
            {
                Id = Guid.NewGuid(),

                ApplicationId =
                    application.Id,

                MentorId =
                    mentor.Id,

                AssignedBy =
                    assignedBy,

                AssignedAt =
                    now
            };

            _context.Assignments.Add(
                assignment);

            // -------------------------------------------------
            // 13. Create Evaluation DRAFT
            // -------------------------------------------------
            var evaluation = new Evaluation
            {
                Id = Guid.NewGuid(),

                ApplicationId =
                    application.Id,

                TemplateId =
                    template.Id,

                MentorId =
                    mentor.Id,

                ReviewerId =
                    null,

                Status =
                    "DRAFT",

                WeightTotal =
                    totalWeight,

                TotalScore =
                    null,

                Classification =
                    null,

                Result =
                    null,

                MentorComment =
                    null,

                ReturnReason =
                    null,

                Version =
                    1,

                RowVersion =
                    0,

                SubmittedAt =
                    null,

                ReviewedAt =
                    null,

                PublishedAt =
                    null
            };

            _context.Evaluations.Add(
                evaluation);

            // -------------------------------------------------
            // 14. Snapshot Criteria Template
            // -------------------------------------------------
            foreach (var sourceItem in
                     template.Items
                         .OrderBy(i =>
                             i.DisplayOrder))
            {
                var criterion =
                    new EvaluationCriterion
                    {
                        Id =
                            Guid.NewGuid(),

                        EvaluationId =
                            evaluation.Id,

                        SourceItemId =
                            sourceItem.Id,

                        Name =
                            sourceItem.Name,

                        Weight =
                            sourceItem.DefaultWeight,

                        Score =
                            null,

                        IsMandatory =
                            sourceItem.IsMandatory,

                        MinPassScore =
                            sourceItem.MinPassScore,

                        Comment =
                            null,

                        DisplayOrder =
                            sourceItem.DisplayOrder
                    };

                _context.EvaluationCriteria.Add(
                    criterion);
            }

            // -------------------------------------------------
            // 15. Audit Log
            // -------------------------------------------------
            var auditLog = new AuditLog
            {
                Id = Guid.NewGuid(),

                ActorUserId =
                    assignedBy,

                Action =
                    "ASSIGN_MENTOR",

                EntityType =
                    "Application",

                EntityId =
                    application.Id,

                OldStatus =
                    application.Status,

                NewStatus =
                    application.Status,

                Reason =
                    $"Assigned Mentor {mentor.Id}; " +
                    $"created Evaluation {evaluation.Id}.",

                CorrelationId =
                    Guid.NewGuid().ToString(),

                CreatedAt =
                    now
            };

            _context.AuditLogs.Add(
                auditLog);

            // -------------------------------------------------
            // 16. Save
            // -------------------------------------------------
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            // -------------------------------------------------
            // 17. Response
            // -------------------------------------------------
            var result =
                await GetByIdAsync(
                    assignment.Id);

            return result!;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }


    // =========================================================
    // 2. GET ASSIGNMENT BY ID
    // =========================================================
    public async Task<AssignmentResponse?> GetByIdAsync(
        Guid id)
    {
        return await Query()
            .Where(a =>
                a.Id == id)
            .Select(a =>
                new AssignmentResponse
                {
                    Id =
                        a.Id,

                    ApplicationId =
                        a.ApplicationId,

                    StudentId =
                        a.Application.StudentId,

                    StudentName =
                        a.Application.Student.FullName,

                    StudentEmail =
                        a.Application.Student.Email,

                    CompanyId =
                        a.Application.CompanyId,

                    CompanyName =
                        a.Application.Company.Name,

                    MentorId =
                        a.MentorId,

                    MentorName =
                        a.Mentor.FullName,

                    MentorEmail =
                        a.Mentor.Email,

                    AssignedBy =
                        a.AssignedBy,

                    AssignedByName =
                        a.AssignedByUser.FullName,

                    AssignedAt =
                        a.AssignedAt
                })
            .FirstOrDefaultAsync();
    }


    // =========================================================
    // 3. GET ASSIGNMENT BY APPLICATION
    // =========================================================
    public async Task<AssignmentResponse?>
        GetByApplicationIdAsync(
            Guid applicationId)
    {
        return await Query()
            .Where(a =>
                a.ApplicationId ==
                applicationId)
            .Select(a =>
                new AssignmentResponse
                {
                    Id =
                        a.Id,

                    ApplicationId =
                        a.ApplicationId,

                    StudentId =
                        a.Application.StudentId,

                    StudentName =
                        a.Application.Student.FullName,

                    StudentEmail =
                        a.Application.Student.Email,

                    CompanyId =
                        a.Application.CompanyId,

                    CompanyName =
                        a.Application.Company.Name,

                    MentorId =
                        a.MentorId,

                    MentorName =
                        a.Mentor.FullName,

                    MentorEmail =
                        a.Mentor.Email,

                    AssignedBy =
                        a.AssignedBy,

                    AssignedByName =
                        a.AssignedByUser.FullName,

                    AssignedAt =
                        a.AssignedAt
                })
            .FirstOrDefaultAsync();
    }


    // =========================================================
    // 4. GET MY ASSIGNMENTS
    // Mentor xem sinh viên mình phụ trách
    // =========================================================
    public async Task<List<AssignmentResponse>>
        GetMyAssignmentsAsync(
            Guid mentorId)
    {
        return await Query()
            .Where(a =>
                a.MentorId ==
                mentorId)
            .OrderByDescending(a =>
                a.AssignedAt)
            .Select(a =>
                new AssignmentResponse
                {
                    Id =
                        a.Id,

                    ApplicationId =
                        a.ApplicationId,

                    StudentId =
                        a.Application.StudentId,

                    StudentName =
                        a.Application.Student.FullName,

                    StudentEmail =
                        a.Application.Student.Email,

                    CompanyId =
                        a.Application.CompanyId,

                    CompanyName =
                        a.Application.Company.Name,

                    MentorId =
                        a.MentorId,

                    MentorName =
                        a.Mentor.FullName,

                    MentorEmail =
                        a.Mentor.Email,

                    AssignedBy =
                        a.AssignedBy,

                    AssignedByName =
                        a.AssignedByUser.FullName,

                    AssignedAt =
                        a.AssignedAt
                })
            .ToListAsync();
    }


    // =========================================================
    // QUERY
    // =========================================================
    private IQueryable<Assignment> Query()
    {
        return _context.Assignments
            .AsNoTracking()

            .Include(a =>
                a.Application)
                .ThenInclude(a =>
                    a.Student)

            .Include(a =>
                a.Application)
                .ThenInclude(a =>
                    a.Company)

            .Include(a =>
                a.Mentor)

            .Include(a =>
                a.AssignedByUser);
    }
}