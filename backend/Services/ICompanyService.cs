using InternshipManagement.Api.DTOs.Companies;

namespace InternshipManagement.Api.Services;

public interface ICompanyService
{
    Task<List<CompanyResponse>> GetAllAsync();

    Task<CompanyResponse?> GetByIdAsync(Guid id);

    Task<CompanyResponse> CreateAsync(CreateCompanyRequest request);

    Task<CompanyResponse?> UpdateAsync(
        Guid id,
        UpdateCompanyRequest request
    );

    Task<bool> DeleteAsync(Guid id);
}