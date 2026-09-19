using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using InternshipManagement.Api.Configuration;
using InternshipManagement.Api.Models;
using Microsoft.IdentityModel.Tokens;

namespace InternshipManagement.Api.Services;

public class JwtService : IJwtService
{
    private readonly JwtSettings _jwtSettings;

    public JwtService(JwtSettings jwtSettings)
    {
        _jwtSettings = jwtSettings;
    }

    public string GenerateToken(
        User user,
        IEnumerable<string> roles,
        IEnumerable<string> permissions)
    {
        var claims = new List<Claim>
        {
            new(
                JwtRegisteredClaimNames.Sub,
                user.Id.ToString()),

            new(
                ClaimTypes.NameIdentifier,
                user.Id.ToString()),

            new(
                JwtRegisteredClaimNames.Email,
                user.Email),

            new(
                ClaimTypes.Email,
                user.Email),

            new(
                ClaimTypes.Name,
                user.FullName)
        };

        // =====================================================
        // ROLE CLAIMS
        // =====================================================
        foreach (var role in roles
                     .Where(r =>
                         !string.IsNullOrWhiteSpace(r))
                     .Distinct(
                         StringComparer.OrdinalIgnoreCase))
        {
            claims.Add(
                new Claim(
                    ClaimTypes.Role,
                    role));
        }

        // =====================================================
        // PERMISSION CLAIMS
        // =====================================================
        foreach (var permission in permissions
                     .Where(p =>
                         !string.IsNullOrWhiteSpace(p))
                     .Distinct(
                         StringComparer.OrdinalIgnoreCase))
        {
            claims.Add(
                new Claim(
                    "permission",
                    permission));
        }

        var key =
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    _jwtSettings.Key));

        var credentials =
            new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

        var expires =
            DateTime.UtcNow.AddMinutes(
                _jwtSettings.ExpirationMinutes);

        var token =
            new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: credentials);

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}