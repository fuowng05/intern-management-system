using InternshipManagement.Api.DTOs.Users;

namespace InternshipManagement.Api.Services;

public interface IUserService
{
    Task<List<MentorResponse>> GetMentorsAsync(
        Guid? companyId = null);
}