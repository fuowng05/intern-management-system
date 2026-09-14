using InternshipManagement.Api.DTOs.Auth;

namespace InternshipManagement.Api.Services;

public interface IAuthService
{
    Task<bool> RegisterAsync(RegisterRequest request);

    Task<bool> LoginAsync(LoginRequest request);
}
