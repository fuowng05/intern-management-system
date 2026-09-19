using InternshipManagement.Api.Models;

namespace InternshipManagement.Api.Services;

public interface IJwtService
{
    string GenerateToken(
        User user,
        IEnumerable<string> roles,
        IEnumerable<string> permissions);
}