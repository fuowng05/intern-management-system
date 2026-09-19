using InternshipManagement.Api.DTOs.Auth;

namespace InternshipManagement.Api.Services;

public interface IAuthService
{
    Task<bool> RegisterAsync(RegisterRequest request);

    Task<AuthResponse?> LoginAsync(LoginRequest request);

    Task<AuthResponse?> RefreshAsync(string refreshToken);

    Task<bool> LogoutAsync(string refreshToken);
}