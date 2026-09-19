using InternshipManagement.Api.DTOs.InternshipPeriods;

namespace InternshipManagement.Api.Services;

public interface IInternshipPeriodService
{
    Task<List<InternshipPeriodResponse>> GetAllAsync();

    Task<InternshipPeriodResponse?> GetByIdAsync(Guid id);

    Task<InternshipPeriodResponse> CreateAsync(
        CreateInternshipPeriodRequest request);

    Task<InternshipPeriodResponse?> UpdateAsync(
        Guid id,
        UpdateInternshipPeriodRequest request);

    Task<bool> DeleteAsync(Guid id);
}