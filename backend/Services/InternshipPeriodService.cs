using InternshipManagement.Api.Data;
using InternshipManagement.Api.DTOs.InternshipPeriods;
using InternshipManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace InternshipManagement.Api.Services;

public class InternshipPeriodService : IInternshipPeriodService
{
    private readonly ApplicationDbContext _context;

    private static readonly string[] AllowedStatuses =
    {
        "DRAFT",
        "OPEN",
        "CLOSED"
    };

    public InternshipPeriodService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<InternshipPeriodResponse>> GetAllAsync()
    {
        return await _context.InternshipPeriods
            .AsNoTracking()
            .OrderByDescending(p => p.StartDate)
            .Select(p => new InternshipPeriodResponse
            {
                Id = p.Id,
                Code = p.Code,
                Name = p.Name,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                Status = p.Status,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<InternshipPeriodResponse?> GetByIdAsync(Guid id)
    {
        return await _context.InternshipPeriods
            .AsNoTracking()
            .Where(p => p.Id == id)
            .Select(p => new InternshipPeriodResponse
            {
                Id = p.Id,
                Code = p.Code,
                Name = p.Name,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                Status = p.Status,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<InternshipPeriodResponse> CreateAsync(
        CreateInternshipPeriodRequest request)
    {
        ValidateDates(request.StartDate, request.EndDate);

        var code = request.Code
            .Trim()
            .ToUpperInvariant();

        var codeExists = await _context.InternshipPeriods
            .AnyAsync(p => p.Code == code);

        if (codeExists)
        {
            throw new InvalidOperationException(
                "Mã đợt thực tập đã tồn tại.");
        }

        var period = new InternshipPeriod
        {
            Id = Guid.NewGuid(),
            Code = code,
            Name = request.Name.Trim(),
            StartDate = request.StartDate,
            EndDate = request.EndDate,

            // Đợt mới luôn bắt đầu ở trạng thái nháp
            Status = "DRAFT",

            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.InternshipPeriods.Add(period);

        await _context.SaveChangesAsync();

        return MapToResponse(period);
    }

    public async Task<InternshipPeriodResponse?> UpdateAsync(
        Guid id,
        UpdateInternshipPeriodRequest request)
    {
        var period = await _context.InternshipPeriods
            .FirstOrDefaultAsync(p => p.Id == id);

        if (period == null)
        {
            return null;
        }

        ValidateDates(request.StartDate, request.EndDate);

        var code = request.Code
            .Trim()
            .ToUpperInvariant();

        var status = request.Status
            .Trim()
            .ToUpperInvariant();

        if (!AllowedStatuses.Contains(status))
        {
            throw new InvalidOperationException(
                "Trạng thái không hợp lệ. " +
                "Chỉ chấp nhận DRAFT, OPEN hoặc CLOSED.");
        }

        var duplicateCode = await _context.InternshipPeriods
            .AnyAsync(p =>
                p.Code == code &&
                p.Id != id);

        if (duplicateCode)
        {
            throw new InvalidOperationException(
                "Mã đợt thực tập đã được sử dụng.");
        }

        period.Code = code;
        period.Name = request.Name.Trim();
        period.StartDate = request.StartDate;
        period.EndDate = request.EndDate;
        period.Status = status;
        period.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToResponse(period);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var period = await _context.InternshipPeriods
            .FirstOrDefaultAsync(p => p.Id == id);

        if (period == null)
        {
            return false;
        }

        var hasApplications = await _context.Applications
            .AnyAsync(a => a.PeriodId == id);

        if (hasApplications)
        {
            throw new InvalidOperationException(
                "Không thể xóa đợt thực tập đã có đơn đăng ký.");
        }

        _context.InternshipPeriods.Remove(period);

        await _context.SaveChangesAsync();

        return true;
    }

    private static void ValidateDates(
        DateTime startDate,
        DateTime endDate)
    {
        if (endDate <= startDate)
        {
            throw new InvalidOperationException(
                "Ngày kết thúc phải sau ngày bắt đầu.");
        }
    }

    private static InternshipPeriodResponse MapToResponse(
        InternshipPeriod period)
    {
        return new InternshipPeriodResponse
        {
            Id = period.Id,
            Code = period.Code,
            Name = period.Name,
            StartDate = period.StartDate,
            EndDate = period.EndDate,
            Status = period.Status,
            CreatedAt = period.CreatedAt,
            UpdatedAt = period.UpdatedAt
        };
    }
}