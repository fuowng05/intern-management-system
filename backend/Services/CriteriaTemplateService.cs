using InternshipManagement.Api.Data;
using InternshipManagement.Api.DTOs.CriteriaTemplates;
using InternshipManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace InternshipManagement.Api.Services;

public class CriteriaTemplateService : ICriteriaTemplateService
{
    private readonly ApplicationDbContext _context;

    public CriteriaTemplateService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<CriteriaTemplateResponse>> GetAllAsync()
    {
        var templates = await Query()
            .OrderByDescending(t => t.Version)
            .ThenBy(t => t.Code)
            .ToListAsync();

        return templates
            .Select(MapToResponse)
            .ToList();
    }

    public async Task<CriteriaTemplateResponse?> GetByIdAsync(Guid id)
    {
        var template = await Query()
            .FirstOrDefaultAsync(t => t.Id == id);

        return template == null
            ? null
            : MapToResponse(template);
    }

    public async Task<CriteriaTemplateResponse> CreateAsync(
        CreateCriteriaTemplateRequest request)
    {
        var period = await _context.InternshipPeriods
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == request.PeriodId);

        if (period == null)
        {
            throw new InvalidOperationException(
                "Không tìm thấy đợt thực tập.");
        }

        if (request.MinItems < 1)
        {
            throw new InvalidOperationException(
                "MinItems phải lớn hơn hoặc bằng 1.");
        }

        if (request.MaxItems < request.MinItems)
        {
            throw new InvalidOperationException(
                "MaxItems phải lớn hơn hoặc bằng MinItems.");
        }

        if (request.MaxItems > 8)
        {
            throw new InvalidOperationException(
                "Template không được có quá 8 tiêu chí.");
        }

        var code = request.Code
            .Trim()
            .ToUpperInvariant();

        var existingVersions = await _context.CriteriaTemplates
            .Where(t =>
                t.PeriodId == request.PeriodId &&
                t.Code == code)
            .Select(t => t.Version)
            .ToListAsync();

        var nextVersion = existingVersions.Count == 0
            ? 1
            : existingVersions.Max() + 1;

        var template = new CriteriaTemplate
        {
            Id = Guid.NewGuid(),
            PeriodId = request.PeriodId,
            Code = code,
            Name = request.Name.Trim(),

            Version = nextVersion,
            Status = "DRAFT",

            MinItems = request.MinItems,
            MaxItems = request.MaxItems,
            AllowWeightEdit = request.AllowWeightEdit,

            IssuedBy = null,
            IssuedAt = null
        };

        _context.CriteriaTemplates.Add(template);

        await _context.SaveChangesAsync();

        return (await GetByIdAsync(template.Id))!;
    }

    public async Task<CriteriaTemplateResponse?> AddItemAsync(
        Guid templateId,
        AddCriteriaTemplateItemRequest request)
    {
        var template = await _context.CriteriaTemplates
            .Include(t => t.Items)
            .FirstOrDefaultAsync(t => t.Id == templateId);

        if (template == null)
        {
            return null;
        }

        EnsureDraft(template);

        if (template.Items.Count >= template.MaxItems)
        {
            throw new InvalidOperationException(
                $"Template chỉ được có tối đa {template.MaxItems} tiêu chí.");
        }

        if (request.DefaultWeight <= 0 ||
            request.DefaultWeight > 100)
        {
            throw new InvalidOperationException(
                "Trọng số phải lớn hơn 0 và không vượt quá 100.");
        }

        var currentWeight = template.Items
            .Sum(i => i.DefaultWeight);

        if (currentWeight + request.DefaultWeight > 100m)
        {
            throw new InvalidOperationException(
                "Tổng trọng số các tiêu chí không được vượt quá 100%.");
        }

        if (request.MinPassScore is < 0 or > 10)
        {
            throw new InvalidOperationException(
                "Điểm đạt tối thiểu phải nằm trong khoảng 0 đến 10.");
        }

        var item = new CriteriaTemplateItem
        {
            Id = Guid.NewGuid(),
            TemplateId = template.Id,
            Name = request.Name.Trim(),
            DefaultWeight = request.DefaultWeight,
            IsMandatory = request.IsMandatory,
            MinPassScore = request.MinPassScore,
            DisplayOrder = request.DisplayOrder
        };

        _context.CriteriaTemplateItems.Add(item);

        await _context.SaveChangesAsync();

        return await GetByIdAsync(templateId);
    }

    public async Task<bool> DeleteItemAsync(
        Guid templateId,
        Guid itemId)
    {
        var template = await _context.CriteriaTemplates
            .Include(t => t.Items)
            .FirstOrDefaultAsync(t => t.Id == templateId);

        if (template == null)
        {
            return false;
        }

        EnsureDraft(template);

        var item = template.Items
            .FirstOrDefault(i => i.Id == itemId);

        if (item == null)
        {
            return false;
        }

        _context.CriteriaTemplateItems.Remove(item);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<CriteriaTemplateResponse?> IssueAsync(
        Guid templateId,
        Guid issuedBy)
    {
        var template = await _context.CriteriaTemplates
            .Include(t => t.Items)
            .FirstOrDefaultAsync(t => t.Id == templateId);

        if (template == null)
        {
            return null;
        }

        EnsureDraft(template);

        var issuerExists = await _context.Users
            .AnyAsync(u =>
                u.Id == issuedBy &&
                u.IsActive);

        if (!issuerExists)
        {
            throw new InvalidOperationException(
                "Không tìm thấy người phát hành template.");
        }

        var itemCount = template.Items.Count;

        if (itemCount < template.MinItems ||
            itemCount > template.MaxItems)
        {
            throw new InvalidOperationException(
                $"Template phải có từ {template.MinItems} " +
                $"đến {template.MaxItems} tiêu chí.");
        }

        var totalWeight = template.Items
            .Sum(i => i.DefaultWeight);

        if (totalWeight != 100m)
        {
            throw new InvalidOperationException(
                $"Tổng trọng số phải bằng 100%. Hiện tại là {totalWeight}%.");
        }
        var hasMandatoryItem =
            template.Items.Any(i => i.IsMandatory);

        if (!hasMandatoryItem)
        {
            throw new InvalidOperationException(
                "Template phải có ít nhất một tiêu chí bắt buộc.");
        }

        template.Status = "PUBLISHED";
        template.IssuedBy = issuedBy;
        template.IssuedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(template.Id);
    }

    private IQueryable<CriteriaTemplate> Query()
    {
        return _context.CriteriaTemplates
            .AsNoTracking()
            .Include(t => t.Period)
            .Include(t => t.Items);
    }

    private static void EnsureDraft(
        CriteriaTemplate template)
    {
        if (!string.Equals(
                template.Status,
                "DRAFT",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(
                "Chỉ template DRAFT mới được chỉnh sửa.");
        }
    }

    private static CriteriaTemplateResponse MapToResponse(
        CriteriaTemplate template)
    {
        var items = template.Items
            .OrderBy(i => i.DisplayOrder)
            .Select(i => new CriteriaTemplateItemResponse
            {
                Id = i.Id,
                Name = i.Name,
                DefaultWeight = i.DefaultWeight,
                IsMandatory = i.IsMandatory,
                MinPassScore = i.MinPassScore,
                DisplayOrder = i.DisplayOrder
            })
            .ToList();

        return new CriteriaTemplateResponse
        {
            Id = template.Id,

            PeriodId = template.PeriodId,
            PeriodCode = template.Period.Code,

            Code = template.Code,
            Name = template.Name,

            Version = template.Version,
            Status = template.Status,

            MinItems = template.MinItems,
            MaxItems = template.MaxItems,
            AllowWeightEdit = template.AllowWeightEdit,

            WeightTotal = items.Sum(i => i.DefaultWeight),

            IssuedBy = template.IssuedBy,
            IssuedAt = template.IssuedAt,

            Items = items
        };
    }
}