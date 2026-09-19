using InternshipManagement.Api.Data;
using InternshipManagement.Api.DTOs.Evaluations;
using InternshipManagement.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using InternshipManagement.Api.Exceptions;

namespace InternshipManagement.Api.Services;

public class EvaluationService : IEvaluationService
{
    private readonly ApplicationDbContext _context;

    public EvaluationService(ApplicationDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // 1. CREATE EVALUATION
    // Mentor tạo Evaluation từ Application + Criteria Template
    // =========================================================
    

    // =========================================================
    // 2. GET EVALUATION BY ID
    // =========================================================
    public async Task<EvaluationResponse?> GetByIdAsync(Guid id)
    {
        var evaluation = await Query()
            .FirstOrDefaultAsync(e => e.Id == id);

        return evaluation == null
            ? null
            : MapToResponse(evaluation);
    }

    // =========================================================
    // 3. GET MY EVALUATIONS
    // Mentor xem danh sách Evaluation của mình
    // =========================================================
    public async Task<List<EvaluationResponse>> GetMyEvaluationsAsync(
        Guid mentorId)
    {
        var evaluations = await Query()
            .Where(e => e.MentorId == mentorId)
            .OrderByDescending(e => e.SubmittedAt)
            .ThenBy(e => e.Application.Student.FullName)
            .ToListAsync();

        return evaluations
            .Select(MapToResponse)
            .ToList();
    }

    // =========================================================
    // 4. UPDATE CRITERION
    // Mentor chấm hoặc sửa điểm một tiêu chí
    // =========================================================
    public async Task<EvaluationResponse?> UpdateCriterionAsync(
        Guid evaluationId,
        Guid criterionId,
        Guid mentorId,
        UpdateEvaluationCriterionRequest request)
    {
        var evaluation = await _context.Evaluations
            .Include(e => e.Criteria)
            .FirstOrDefaultAsync(e =>
                e.Id == evaluationId);

        if (evaluation == null)
        {
            return null;
        }

        // -----------------------------------------------------
        // Kiểm tra quyền Mentor
        // -----------------------------------------------------
        EnsureMentorOwnsEvaluation(
            evaluation,
            mentorId);

        // -----------------------------------------------------
        // Chỉ DRAFT mới được sửa
        // -----------------------------------------------------
        EnsureEditable(evaluation);
        // -----------------------------------------------------
        // Optimistic concurrency
        // -----------------------------------------------------
        EnsureRowVersion(
            evaluation,
            request.RowVersion);

        // -----------------------------------------------------
        // Score phải từ 0 đến 10
        // -----------------------------------------------------
        if (request.Score < 0m ||
            request.Score > 10m)
        {
            throw new InvalidOperationException(
                "Điểm phải nằm trong khoảng từ 0 đến 10.");
        }

        // -----------------------------------------------------
        // Tìm Criterion
        // -----------------------------------------------------
        var criterion = evaluation.Criteria
            .FirstOrDefault(c =>
                c.Id == criterionId);

        if (criterion == null)
        {
            throw new InvalidOperationException(
                "Không tìm thấy tiêu chí trong Evaluation.");
        }

        // -----------------------------------------------------
        // Update
        // -----------------------------------------------------
        criterion.Score = request.Score;

        criterion.Comment =
            string.IsNullOrWhiteSpace(request.Comment)
                ? null
                : request.Comment.Trim();

        // -----------------------------------------------------
        // Tính lại TotalScore
        // -----------------------------------------------------
        RecalculateTotalScore(evaluation);

        // -----------------------------------------------------
        // Tăng RowVersion
        // -----------------------------------------------------
        evaluation.RowVersion++;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(evaluation.Id);
    }

    // =========================================================
    // 5. UPDATE MENTOR COMMENT
    // =========================================================
    public async Task<EvaluationResponse?> UpdateMentorCommentAsync(
        Guid evaluationId,
        Guid mentorId,
        UpdateMentorCommentRequest request)
    {
        var evaluation = await _context.Evaluations
            .FirstOrDefaultAsync(e =>
                e.Id == evaluationId);

        if (evaluation == null)
        {
            return null;
        }

        EnsureMentorOwnsEvaluation(
            evaluation,
            mentorId);

        EnsureEditable(evaluation);
        
        EnsureRowVersion(
            evaluation,
            request.RowVersion);

        evaluation.MentorComment =
            string.IsNullOrWhiteSpace(
                request.MentorComment)
                ? null
                : request.MentorComment.Trim();

        evaluation.RowVersion++;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(evaluation.Id);
    }

    // =========================================================
    // 6. SUBMIT EVALUATION
    // DRAFT -> SUBMITTED
    // =========================================================
    public async Task<EvaluationResponse?> SubmitAsync(
        Guid evaluationId,
        Guid mentorId,
        long rowVersion)
    {
        var evaluation = await _context.Evaluations
            .Include(e => e.Criteria)
            .FirstOrDefaultAsync(e =>
                e.Id == evaluationId);

        if (evaluation == null)
        {
            return null;
        }

        // Mentor phải sở hữu Evaluation
        EnsureMentorOwnsEvaluation(
            evaluation,
            mentorId);

        // Chỉ DRAFT hoặc RETURNED được submit
        EnsureEditable(evaluation);

        // Optimistic concurrency
        EnsureRowVersion(
            evaluation,
            rowVersion);

        // Phải có tiêu chí
        if (evaluation.Criteria.Count == 0)
        {
            throw new InvalidOperationException(
                "Evaluation chưa có tiêu chí.");
        }

        // Tổng trọng số phải = 100
        var totalWeight =
            evaluation.Criteria.Sum(c => c.Weight);

        if (totalWeight != 100m)
        {
            throw new EvaluationConflictException(
                "EVAL_WEIGHT_SUM_INVALID",
                "Tổng trọng số các tiêu chí phải bằng 100%.");
        }

        evaluation.WeightTotal = totalWeight;

        // Tất cả tiêu chí phải có điểm
        var missingScores = evaluation.Criteria
            .Where(c => !c.Score.HasValue)
            .OrderBy(c => c.DisplayOrder)
            .Select(c => c.Name)
            .ToList();

        if (missingScores.Count > 0)
        {
            throw new EvaluationConflictException(
                "EVAL_NOT_READY",
                $"Chưa chấm điểm đầy đủ: {string.Join(", ", missingScores)}");
        }

        // Kiểm tra 0 <= Score <= 10
        var invalidScore = evaluation.Criteria
            .FirstOrDefault(c =>
                c.Score.HasValue &&
                (c.Score.Value < 0m ||
                c.Score.Value > 10m));

        if (invalidScore != null)
        {
            throw new InvalidOperationException(
                $"Điểm của tiêu chí '{invalidScore.Name}' " +
                "không nằm trong khoảng 0 đến 10.");
        }

        // Tính lại điểm tổng
        RecalculateTotalScore(evaluation);

        if (!evaluation.TotalScore.HasValue)
        {
            throw new InvalidOperationException(
                "Không thể tính tổng điểm Evaluation.");
        }

        // Kiểm tra tiêu chí bắt buộc
        var failedMandatory = evaluation.Criteria
            .Where(c =>
                c.IsMandatory &&
                c.MinPassScore.HasValue &&
                c.Score.HasValue &&
                c.Score.Value < c.MinPassScore.Value)
            .ToList();

        // Phải dùng PASSED / FAILED theo CHECK constraint DB
        evaluation.Result =
            evaluation.TotalScore.Value < 5m ||
            failedMandatory.Count > 0
                ? "FAILED"
                : "PASSED";

        evaluation.Classification =
            GetClassification(
                evaluation.TotalScore.Value);

        // Lưu trạng thái trước khi chuyển
        var oldStatus = evaluation.Status;

        var isResubmission =
            string.Equals(
                oldStatus,
                "RETURNED",
                StringComparison.OrdinalIgnoreCase);

        // DRAFT/RETURNED -> SUBMITTED
        evaluation.Status = "SUBMITTED";

        evaluation.SubmittedAt =
            DateTime.UtcNow;

        // Khi submit lại, lần review trước đã kết thúc
        evaluation.ReturnReason = null;

        if (isResubmission)
        {
            evaluation.ReviewerId = null;
            evaluation.ReviewedAt = null;

            // Phiên bản nội dung mới sau khi Mentor sửa
            evaluation.Version++;
        }

        evaluation.RowVersion++;

        // Ghi lịch sử chuyển trạng thái
        var auditLog = new AuditLog
        {
            Id = Guid.NewGuid(),

            ActorUserId = mentorId,

            Action =
                isResubmission
                    ? "RESUBMIT"
                    : "SUBMIT",

            EntityType = "Evaluation",

            EntityId = evaluation.Id,

            OldStatus = oldStatus,

            NewStatus = "SUBMITTED",

            Reason = null,

            CorrelationId =
                Guid.NewGuid().ToString(),

            CreatedAt =
                DateTime.UtcNow
        };

        _context.AuditLogs.Add(auditLog);

        await _context.SaveChangesAsync();

        return await GetByIdAsync(
            evaluation.Id);
    }
    public async Task<List<EvaluationResponse>> GetSubmittedAsync()
    {
        var evaluations = await Query()
            .Where(e => e.Status == "SUBMITTED")
            .OrderBy(e => e.SubmittedAt)
            .ToListAsync();

        return evaluations
            .Select(MapToResponse)
            .ToList();
    }

    public async Task<EvaluationResponse?> ReturnAsync(
    Guid evaluationId,
    Guid reviewerId,
    ReturnEvaluationRequest request)
    {
        var evaluation = await _context.Evaluations
            .FirstOrDefaultAsync(e =>
                e.Id == evaluationId);

        if (evaluation == null)
        {
            return null;
        }

        // Chỉ SUBMITTED mới được Reviewer xử lý
        if (!string.Equals(
                evaluation.Status,
                "SUBMITTED",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new EvaluationConflictException(
                "EVAL_STATE_INVALID",
                "Chỉ Evaluation ở trạng thái SUBMITTED mới được trả lại.");
        }

        // Reviewer không được là Mentor
        if (evaluation.MentorId == reviewerId)
        {
            throw new InvalidOperationException(
                "Reviewer không được đồng thời là Mentor của Evaluation.");
        }

        // Optimistic concurrency
        EnsureRowVersion(
            evaluation,
            request.RowVersion);

        if (string.IsNullOrWhiteSpace(request.Reason))
        {
            throw new InvalidOperationException(
                "Phải nhập lý do trả lại Evaluation.");
        }

        var reviewer = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u =>
                u.Id == reviewerId &&
                u.IsActive);

        if (reviewer == null)
        {
            throw new InvalidOperationException(
                "Không tìm thấy Reviewer hoặc tài khoản đã bị khóa.");
        }

        var canReview = await _context.UserRoles
            .AsNoTracking()
            .AnyAsync(ur =>
                ur.UserId == reviewer.Id &&
                (ur.Role.Code == "REVIEWER" ||
                ur.Role.Code == "ADMIN"));

        if (!canReview)
        {
            throw new InvalidOperationException(
                "Người dùng không có quyền Reviewer.");
        }

        var oldStatus = evaluation.Status;

        evaluation.ReviewerId = reviewerId;

        evaluation.Status = "RETURNED";

        evaluation.ReturnReason =
            request.Reason.Trim();

        evaluation.ReviewedAt =
            DateTime.UtcNow;

        evaluation.RowVersion++;

        // Audit log
        var auditLog = new AuditLog
        {
            Id = Guid.NewGuid(),

            ActorUserId = reviewerId,

            Action = "RETURN",

            EntityType = "Evaluation",

            EntityId = evaluation.Id,

            OldStatus = oldStatus,

            NewStatus = "RETURNED",

            Reason = evaluation.ReturnReason,

            CorrelationId =
                Guid.NewGuid().ToString(),

            CreatedAt =
                DateTime.UtcNow
        };

        _context.AuditLogs.Add(auditLog);

        await _context.SaveChangesAsync();

        return await GetByIdAsync(
            evaluation.Id);
    }

    public async Task<EvaluationResponse?> PublishAsync(
        Guid evaluationId,
        Guid reviewerId,
        PublishEvaluationRequest request)
    {
        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            var evaluation = await _context.Evaluations
                .Include(e => e.Criteria)
                .Include(e => e.Application)
                    .ThenInclude(a => a.Student)
                .Include(e => e.Application)
                    .ThenInclude(a => a.Company)
                .Include(e => e.Template)
                .Include(e => e.Mentor)
                .FirstOrDefaultAsync(e =>
                    e.Id == evaluationId);

            if (evaluation == null)
            {
                await transaction.RollbackAsync();
                return null;
            }

            // Chỉ SUBMITTED mới được publish
            if (!string.Equals(
                    evaluation.Status,
                    "SUBMITTED",
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new EvaluationConflictException(
                    "EVAL_STATE_INVALID",
                    "Chỉ Evaluation ở trạng thái SUBMITTED mới được công bố.");
            }

            // Optimistic concurrency
            EnsureRowVersion(
                evaluation,
                request.RowVersion);

            // Reviewer không được là Mentor
            if (evaluation.MentorId == reviewerId)
            {
                throw new InvalidOperationException(
                    "Reviewer không được đồng thời là Mentor của Evaluation.");
            }

            // Kiểm tra Reviewer
            var reviewer = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u =>
                    u.Id == reviewerId &&
                    u.IsActive);

            if (reviewer == null)
            {
                throw new InvalidOperationException(
                    "Không tìm thấy Reviewer hoặc tài khoản đã bị khóa.");
            }

            var canReview = await _context.UserRoles
                .AsNoTracking()
                .AnyAsync(ur =>
                    ur.UserId == reviewer.Id &&
                    (ur.Role.Code == "REVIEWER" ||
                    ur.Role.Code == "ADMIN"));

            if (!canReview)
            {
                throw new InvalidOperationException(
                    "Người dùng không có quyền Reviewer.");
            }
            // Evaluation phải hoàn chỉnh
            if (!evaluation.TotalScore.HasValue)
            {
                throw new InvalidOperationException(
                    "Evaluation chưa có TotalScore.");
            }

            if (string.IsNullOrWhiteSpace(
                    evaluation.Classification))
            {
                throw new InvalidOperationException(
                    "Evaluation chưa có Classification.");
            }

            if (string.IsNullOrWhiteSpace(
                    evaluation.Result))
            {
                throw new InvalidOperationException(
                    "Evaluation chưa có Result.");
            }

            if (evaluation.Criteria.Count == 0 ||
                evaluation.Criteria.Any(c =>
                    !c.Score.HasValue))
            {
                throw new EvaluationConflictException(
                    "EVAL_NOT_READY",
                    "Evaluation chưa được chấm đầy đủ tất cả tiêu chí.");
            }

            // Không được publish cùng version hai lần
            var publicationExists =
                await _context.EvaluationPublications
                    .AnyAsync(p =>
                        p.EvaluationId == evaluation.Id &&
                        p.Version == evaluation.Version);

            if (publicationExists)
            {
                throw new InvalidOperationException(
                    $"Evaluation Version {evaluation.Version} " +
                    "đã được publish.");
            }

            var now = DateTime.UtcNow;
            var oldStatus = evaluation.Status;

            // Tạo immutable snapshot
            var snapshot = new
            {
                EvaluationId = evaluation.Id,

                evaluation.Version,

                Application = new
                {
                    evaluation.ApplicationId,

                    StudentId =
                        evaluation.Application.StudentId,

                    StudentName =
                        evaluation.Application.Student.FullName,

                    CompanyId =
                        evaluation.Application.CompanyId,

                    CompanyName =
                        evaluation.Application.Company.Name
                },

                Template = new
                {
                    evaluation.TemplateId,

                    Name =
                        evaluation.Template?.Name
                },

                Mentor = new
                {
                    evaluation.MentorId,

                    Name =
                        evaluation.Mentor.FullName
                },

                Reviewer = new
                {
                    Id = reviewer.Id,
                    reviewer.FullName
                },

                evaluation.WeightTotal,
                evaluation.TotalScore,
                evaluation.Classification,
                evaluation.Result,
                evaluation.MentorComment,

                Criteria = evaluation.Criteria
                    .OrderBy(c => c.DisplayOrder)
                    .Select(c => new
                    {
                        c.Id,
                        c.SourceItemId,
                        c.Name,
                        c.Weight,
                        c.Score,
                        c.IsMandatory,
                        c.MinPassScore,
                        c.Comment,
                        c.DisplayOrder
                    })
                    .ToList(),

                PublishedAt = now
            };

            var snapshotJson =
                JsonSerializer.Serialize(snapshot);

            // Update Evaluation
            evaluation.ReviewerId = reviewerId;
            evaluation.Status = "PUBLISHED";
            evaluation.ReturnReason = null;
            evaluation.ReviewedAt = now;
            evaluation.PublishedAt = now;
            evaluation.RowVersion++;

            // Append-only publication
            var publication =
                new EvaluationPublication
                {
                    Id = Guid.NewGuid(),

                    EvaluationId =
                        evaluation.Id,

                    Version =
                        evaluation.Version,

                    SnapshotJson =
                        snapshotJson,

                    TotalScore =
                        evaluation.TotalScore.Value,

                    Classification =
                        evaluation.Classification!,

                    Result =
                        evaluation.Result!,

                    PublishedBy =
                        reviewerId,

                    PublishedAt =
                        now
                };

            _context.EvaluationPublications.Add(
                publication);

            // Audit
            var auditLog = new AuditLog
            {
                Id = Guid.NewGuid(),

                ActorUserId =
                    reviewerId,

                Action =
                    "PUBLISH",

                EntityType =
                    "Evaluation",

                EntityId =
                    evaluation.Id,

                OldStatus =
                    oldStatus,

                NewStatus =
                    "PUBLISHED",

                Reason =
                    null,

                CorrelationId =
                    Guid.NewGuid().ToString(),

                CreatedAt =
                    now
            };

            _context.AuditLogs.Add(
                auditLog);

            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return await GetByIdAsync(
                evaluation.Id);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<List<PublishedEvaluationResponse>>
        GetMyPublishedResultsAsync(Guid studentId)
    {
        var publications =
            await _context.EvaluationPublications
                .AsNoTracking()
                .Include(p => p.Evaluation)
                    .ThenInclude(e => e.Application)
                .Where(p =>
                    p.Evaluation.Status == "PUBLISHED" &&
                    p.Evaluation.Application.StudentId == studentId)
                .OrderByDescending(p => p.PublishedAt)
                .ToListAsync();

        return publications
            .Select(MapPublicationToResponse)
            .ToList();
    }


    public async Task<PublishedEvaluationResponse?>
        GetMyPublishedResultByIdAsync(
            Guid evaluationId,
            Guid studentId)
    {
        var publication =
            await _context.EvaluationPublications
                .AsNoTracking()
                .Include(p => p.Evaluation)
                    .ThenInclude(e => e.Application)
                .Where(p =>
                    p.EvaluationId == evaluationId &&
                    p.Evaluation.Status == "PUBLISHED" &&
                    p.Evaluation.Application.StudentId == studentId)
                .OrderByDescending(p => p.Version)
                .FirstOrDefaultAsync();

        return publication == null
            ? null
            : MapPublicationToResponse(publication);
    }
    // =========================================================
    // QUERY
    // Load đầy đủ dữ liệu dùng cho response
    // =========================================================
    private IQueryable<Evaluation> Query()
    {
        return _context.Evaluations
            .AsNoTracking()

            .Include(e => e.Application)
                .ThenInclude(a => a.Student)

            .Include(e => e.Application)
                .ThenInclude(a => a.Company)

            .Include(e => e.Template)

            .Include(e => e.Mentor)

            .Include(e => e.Criteria);
    }

    // =========================================================
    // MAP ENTITY -> RESPONSE DTO
    // =========================================================
    private static EvaluationResponse MapToResponse(
        Evaluation evaluation)
    {
        return new EvaluationResponse
        {
            Id = evaluation.Id,

            ApplicationId =
                evaluation.ApplicationId,

            StudentId =
                evaluation.Application.StudentId,

            StudentName =
                evaluation.Application.Student.FullName,

            CompanyId =
                evaluation.Application.CompanyId,

            CompanyName =
                evaluation.Application.Company.Name,

            TemplateId =
                evaluation.TemplateId,

            TemplateName =
                evaluation.Template?.Name,

            MentorId =
                evaluation.MentorId,

            MentorName =
                evaluation.Mentor.FullName,

            ReviewerId =
                evaluation.ReviewerId,

            Status =
                evaluation.Status,

            WeightTotal =
                evaluation.WeightTotal,

            TotalScore =
                evaluation.TotalScore,

            Classification =
                evaluation.Classification,

            Result =
                evaluation.Result,

            MentorComment =
                evaluation.MentorComment,

            ReturnReason =
                evaluation.ReturnReason,

            Version =
                evaluation.Version,

            RowVersion =
                evaluation.RowVersion,

            SubmittedAt =
                evaluation.SubmittedAt,

            ReviewedAt =
                evaluation.ReviewedAt,

            PublishedAt =
                evaluation.PublishedAt,

            Criteria = evaluation.Criteria
                .OrderBy(c => c.DisplayOrder)
                .Select(c =>
                    new EvaluationCriterionResponse
                    {
                        Id = c.Id,

                        SourceItemId =
                            c.SourceItemId,

                        Name =
                            c.Name,

                        Weight =
                            c.Weight,

                        Score =
                            c.Score,

                        IsMandatory =
                            c.IsMandatory,

                        MinPassScore =
                            c.MinPassScore,

                        Comment =
                            c.Comment,

                        DisplayOrder =
                            c.DisplayOrder
                    })
                .ToList()
        };
    }

    // =========================================================
    // HELPER: Mentor ownership
    // =========================================================
    private static void EnsureMentorOwnsEvaluation(
        Evaluation evaluation,
        Guid mentorId)
    {
        if (evaluation.MentorId != mentorId)
        {
            throw new ForbiddenException(
                "Bạn không có quyền thao tác trên Evaluation này.");
        }
    }

    // =========================================================
    // HELPER: Evaluation phải DRAFT
    // =========================================================
    private static void EnsureEditable(Evaluation evaluation)
    {
        if (evaluation.Status != "DRAFT" &&
            evaluation.Status != "RETURNED")
        {
        throw new EvaluationConflictException(
            "EVAL_STATE_INVALID",
            "Chỉ Evaluation ở trạng thái DRAFT hoặc RETURNED mới được submit.");
        }
    }

    // =========================================================
    // HELPER: Optimistic Concurrency
    // =========================================================
    private static void EnsureRowVersion(
        Evaluation evaluation,
        long requestRowVersion)
    {
        if (evaluation.RowVersion != requestRowVersion)
        {
            throw new ConcurrencyConflictException(
                $"Dữ liệu đã thay đổi. " +
                $"RowVersion hiện tại là {evaluation.RowVersion}. " +
                "Hãy tải lại Evaluation.");
        }
    }

    // =========================================================
    // HELPER: Tính TotalScore
    //
    // TotalScore =
    // Score * Weight / 100
    //
    // Chỉ tính khi TẤT CẢ criteria đã có Score
    // =========================================================
    private static void RecalculateTotalScore(
        Evaluation evaluation)
    {
        if (evaluation.Criteria.Count == 0)
        {
            evaluation.TotalScore = null;
            return;
        }

        evaluation.WeightTotal =
            evaluation.Criteria.Sum(c => c.Weight);

        if (evaluation.Criteria.Any(
                c => !c.Score.HasValue))
        {
            evaluation.TotalScore = null;
            return;
        }

        var totalScore =
            evaluation.Criteria.Sum(c =>
                c.Score!.Value *
                c.Weight /
                100m);

        evaluation.TotalScore =
            Math.Round(
                totalScore,
                2,
                MidpointRounding.AwayFromZero);
    }

    // =========================================================
    // HELPER: Xếp loại
    // =========================================================
    private static string GetClassification(decimal score)
    {
        if (score >= 9m)
        {
            return "EXCELLENT";
        }

        if (score >= 8m)
        {
            return "VERY_GOOD";
        }

        if (score >= 7m)
        {
            return "GOOD";
        }

        if (score >= 5.5m)
        {
            return "AVERAGE";
        }

        if (score >= 5m)
        {
            return "WEAK_AVERAGE";
        }

        return "FAIL";
    }
    private static PublishedEvaluationResponse
    MapPublicationToResponse(
        EvaluationPublication publication)
    {
        using var document =
            JsonDocument.Parse(
                publication.SnapshotJson);

        return new PublishedEvaluationResponse
        {
            EvaluationId =
                publication.EvaluationId,

            Version =
                publication.Version,

            TotalScore =
                publication.TotalScore,

            Classification =
                publication.Classification,

            Result =
                publication.Result,

            PublishedAt =
                publication.PublishedAt,

            Snapshot =
                document.RootElement.Clone()
        };
    }
}