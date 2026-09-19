using InternshipManagement.Api.DTOs.Assignments;

namespace InternshipManagement.Api.Services;

public interface IAssignmentService
{
    Task<AssignmentResponse> CreateAsync(
        Guid assignedBy,
        CreateAssignmentRequest request);

    Task<AssignmentResponse?> GetByIdAsync(Guid id);

    Task<AssignmentResponse?> GetByApplicationIdAsync(
        Guid applicationId);

    Task<List<AssignmentResponse>> GetMyAssignmentsAsync(
        Guid mentorId);
}