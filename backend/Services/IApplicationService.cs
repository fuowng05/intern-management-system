using InternshipManagement.Api.DTOs.Applications;

namespace InternshipManagement.Api.Services;

public interface IApplicationService
{
    Task<List<ApplicationResponse>> GetAllAsync();

    Task<List<ApplicationResponse>> GetMyApplicationsAsync(
        Guid studentId);

    Task<ApplicationResponse?> GetByIdAsync(Guid id);

    Task<ApplicationResponse> CreateAsync(
        Guid studentId,
        CreateApplicationRequest request);

    Task<ApplicationResponse?> DecideAsync(
        Guid applicationId,
        Guid decidedBy,
        DecideApplicationRequest request);
}