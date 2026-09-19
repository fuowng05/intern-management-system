using InternshipManagement.Api.Data;
using InternshipManagement.Api.DTOs.Companies;
using InternshipManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace InternshipManagement.Api.Services;

public class CompanyService : ICompanyService
{
    private readonly ApplicationDbContext _context;

    public CompanyService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<CompanyResponse>> GetAllAsync()
    {
        return await _context.Companies
            .AsNoTracking()
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new CompanyResponse
            {
                Id = c.Id,
                Name = c.Name,
                TaxCode = c.TaxCode,
                ContactEmail = c.ContactEmail,
                IsActive = c.IsActive,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<CompanyResponse?> GetByIdAsync(Guid id)
    {
        return await _context.Companies
            .AsNoTracking()
            .Where(c => c.Id == id)
            .Select(c => new CompanyResponse
            {
                Id = c.Id,
                Name = c.Name,
                TaxCode = c.TaxCode,
                ContactEmail = c.ContactEmail,
                IsActive = c.IsActive,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<CompanyResponse> CreateAsync(
        CreateCompanyRequest request)
    {
        var taxCode = request.TaxCode.Trim();

        var taxCodeExists = await _context.Companies
            .AnyAsync(c => c.TaxCode == taxCode);

        if (taxCodeExists)
        {
            throw new InvalidOperationException(
                "Mã số thuế đã tồn tại."
            );
        }

        var company = new Company
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            TaxCode = taxCode,
            ContactEmail = string.IsNullOrWhiteSpace(request.ContactEmail)
                ? null
                : request.ContactEmail.Trim().ToLowerInvariant(),
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Companies.Add(company);

        await _context.SaveChangesAsync();

        return MapToResponse(company);
    }

    public async Task<CompanyResponse?> UpdateAsync(
        Guid id,
        UpdateCompanyRequest request)
    {
        var company = await _context.Companies
            .FirstOrDefaultAsync(c => c.Id == id);

        if (company == null)
        {
            return null;
        }

        var taxCode = request.TaxCode.Trim();

        var taxCodeExists = await _context.Companies
            .AnyAsync(c =>
                c.TaxCode == taxCode &&
                c.Id != id
            );

        if (taxCodeExists)
        {
            throw new InvalidOperationException(
                "Mã số thuế đã được sử dụng bởi doanh nghiệp khác."
            );
        }

        company.Name = request.Name.Trim();
        company.TaxCode = taxCode;

        company.ContactEmail =
            string.IsNullOrWhiteSpace(request.ContactEmail)
                ? null
                : request.ContactEmail.Trim().ToLowerInvariant();

        company.IsActive = request.IsActive;
        company.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToResponse(company);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var company = await _context.Companies
            .FirstOrDefaultAsync(c => c.Id == id);

        if (company == null)
        {
            return false;
        }

        // Không xóa cứng doanh nghiệp.
        // Chỉ chuyển sang trạng thái ngừng hoạt động.
        company.IsActive = false;
        company.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    private static CompanyResponse MapToResponse(Company company)
    {
        return new CompanyResponse
        {
            Id = company.Id,
            Name = company.Name,
            TaxCode = company.TaxCode,
            ContactEmail = company.ContactEmail,
            IsActive = company.IsActive,
            CreatedAt = company.CreatedAt,
            UpdatedAt = company.UpdatedAt
        };
    }
}