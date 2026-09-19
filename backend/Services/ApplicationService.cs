using InternshipManagement.Api.Data;
using InternshipManagement.Api.DTOs.Applications;
using InternshipManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace InternshipManagement.Api.Services;

public class ApplicationService : IApplicationService
{
    private readonly ApplicationDbContext _context;

    public ApplicationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ApplicationResponse>> GetAllAsync()
    {
        return await BaseQuery()
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => MapToResponse(a))
            .ToListAsync();
    }

    public async Task<List<ApplicationResponse>> GetMyApplicationsAsync(
        Guid studentId)
    {
        return await BaseQuery()
            .Where(a => a.StudentId == studentId)
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => MapToResponse(a))
            .ToListAsync();
    }

    public async Task<ApplicationResponse?> GetByIdAsync(Guid id)
    {
        return await BaseQuery()
            .Where(a => a.Id == id)
            .Select(a => MapToResponse(a))
            .FirstOrDefaultAsync();
    }

    public async Task<ApplicationResponse> CreateAsync(
        Guid studentId,
        CreateApplicationRequest request)
    {
        var student = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u =>
                u.Id == studentId &&
                u.IsActive);

        if (student == null)
        {
            throw new InvalidOperationException(
                "Không tìm thấy tài khoản sinh viên.");
        }

        var isStudent = await _context.UserRoles
            .AsNoTracking()
            .AnyAsync(ur =>
                ur.UserId == student.Id &&
                ur.Role.Code == "STUDENT");

        if (!isStudent)
        {
            throw new InvalidOperationException(
                "Chỉ sinh viên mới được nộp đơn thực tập.");
        }
        var period = await _context.InternshipPeriods
            .AsNoTracking()
            .FirstOrDefaultAsync(p =>
                p.Id == request.PeriodId);

        if (period == null)
        {
            throw new InvalidOperationException(
                "Không tìm thấy đợt thực tập.");
        }

        if (!string.Equals(
                period.Status,
                "OPEN",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(
                "Đợt thực tập hiện không mở đăng ký.");
        }

        var company = await _context.Companies
            .AsNoTracking()
            .FirstOrDefaultAsync(c =>
                c.Id == request.CompanyId);

        if (company == null)
        {
            throw new InvalidOperationException(
                "Không tìm thấy doanh nghiệp.");
        }

        if (!company.IsActive)
        {
            throw new InvalidOperationException(
                "Doanh nghiệp hiện không hoạt động.");
        }

        // Theo schema hiện tại:
        // một Student chỉ có một Application trong một Period.
        var alreadyApplied = await _context.Applications
            .AnyAsync(a =>
                a.StudentId == studentId &&
                a.PeriodId == request.PeriodId);

        if (alreadyApplied)
        {
            throw new InvalidOperationException(
                "Bạn đã đăng ký thực tập trong đợt này.");
        }

        var application = new Application
        {
            Id = Guid.NewGuid(),

            StudentId = studentId,
            PeriodId = request.PeriodId,
            CompanyId = request.CompanyId,

            Status = "PENDING",

            DecidedBy = null,
            DecidedAt = null,

            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Applications.Add(application);

        await _context.SaveChangesAsync();

        var result = await GetByIdAsync(application.Id);

        return result!;
    }

    public async Task<ApplicationResponse?> DecideAsync(
        Guid applicationId,
        Guid decidedBy,
        DecideApplicationRequest request)
    {
        var application = await _context.Applications
            .FirstOrDefaultAsync(a =>
                a.Id == applicationId);

        if (application == null)
        {
            return null;
        }
        var deciderExists = await _context.Users
            .AsNoTracking()
            .AnyAsync(u =>
                u.Id == decidedBy &&
                u.IsActive);

        if (!deciderExists)
        {
            throw new InvalidOperationException(
                "Không tìm thấy người xét duyệt.");
        }

        if (!string.Equals(
                application.Status,
                "PENDING",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(
                "Chỉ đơn đang PENDING mới được xét duyệt.");
        }

        var decision = request.Decision
            .Trim()
            .ToUpperInvariant();

        if (decision != "APPROVED" &&
            decision != "REJECTED")
        {
            throw new InvalidOperationException(
                "Quyết định chỉ được là APPROVED hoặc REJECTED.");
        }

        application.Status = decision;
        application.DecidedBy = decidedBy;
        application.DecidedAt = DateTime.UtcNow;
        application.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(application.Id);
    }

    private IQueryable<Application> BaseQuery()
    {
        return _context.Applications
            .AsNoTracking()
            .Include(a => a.Student)
            .Include(a => a.Period)
            .Include(a => a.Company);
    }

    private static ApplicationResponse MapToResponse(
        Application application)
    {
        return new ApplicationResponse
        {
            Id = application.Id,

            StudentId = application.StudentId,
            StudentName = application.Student.FullName,
            StudentEmail = application.Student.Email,

            PeriodId = application.PeriodId,
            PeriodCode = application.Period.Code,
            PeriodName = application.Period.Name,

            CompanyId = application.CompanyId,
            CompanyName = application.Company.Name,

            Status = application.Status,

            DecidedBy = application.DecidedBy,
            DecidedAt = application.DecidedAt,

            CreatedAt = application.CreatedAt,
            UpdatedAt = application.UpdatedAt
        };
    }
}