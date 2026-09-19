using InternshipManagement.Api.Data;
using InternshipManagement.Api.DTOs.Auth;
using InternshipManagement.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace InternshipManagement.Api.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly PasswordHasher<User> _passwordHasher;
    private readonly IJwtService _jwtService;

    public AuthService(
        ApplicationDbContext context,
        IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;

        _passwordHasher =
            new PasswordHasher<User>();
    }

    // =========================================================
    // REGISTER STUDENT
    // =========================================================
    public async Task<bool> RegisterAsync(
        RegisterRequest request)
    {
        var normalizedEmail =
            request.Email
                .Trim()
                .ToLowerInvariant();

        var existingUser =
            await _context.Users
                .AnyAsync(u =>
                    u.Email == normalizedEmail);

        if (existingUser)
        {
            return false;
        }

        // StudentCode phải unique.
        if (string.IsNullOrWhiteSpace(
                request.StudentCode))
        {
            return false;
        }

        var normalizedStudentCode =
            request.StudentCode
                .Trim();

        var studentCodeExists =
            await _context.StudentProfiles
                .AnyAsync(s =>
                    s.StudentCode ==
                    normalizedStudentCode);

        if (studentCodeExists)
        {
            return false;
        }

        // =====================================================
        // Tìm Role Student từ bảng Roles
        // =====================================================
        var studentRole =
            await _context.Roles
                .FirstOrDefaultAsync(r =>
                r.Code == "STUDENT");

        if (studentRole == null)
        {
            throw new InvalidOperationException(
                "Role Student chưa tồn tại trong hệ thống.");
        }

        await using var transaction =
            await _context.Database
                .BeginTransactionAsync();

        try
        {
            var now = DateTime.UtcNow;

            // =================================================
            // USER
            // =================================================
            var user = new User
            {
                Id = Guid.NewGuid(),

                Email =
                    normalizedEmail,

                FullName =
                    request.FullName.Trim(),

                IsActive =
                    true,

                FailedLoginCount =
                    0,

                CreatedAt =
                    now,

                UpdatedAt =
                    now
            };

            user.PasswordHash =
                _passwordHasher.HashPassword(
                    user,
                    request.Password);

            // =================================================
            // STUDENT PROFILE
            // =================================================
            var profile =
                new StudentProfile
                {
                    Id =
                        Guid.NewGuid(),

                    UserId =
                        user.Id,

                    StudentCode =
                        normalizedStudentCode,

                    Major =
                        request.Major,

                    ClassName =
                        null,

                    Cohort =
                        null
                };

            // =================================================
            // USER ROLE
            // =================================================
            var userRole =
                new UserRole
                {
                    UserId =
                        user.Id,

                    RoleId =
                        studentRole.Id
                };

            _context.Users.Add(user);

            _context.StudentProfiles.Add(
                profile);

            _context.UserRoles.Add(
                userRole);

            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return true;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    // =========================================================
    // LOGIN
    // =========================================================
   public async Task<AuthResponse?> LoginAsync(
    LoginRequest request)
{
    var normalizedEmail =
        request.Email.Trim().ToLowerInvariant();

    var user =
        await _context.Users
            .FirstOrDefaultAsync(u =>
                u.Email == normalizedEmail);

    if (user == null || !user.IsActive)
    {
        return null;
    }

    var result =
        _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            request.Password);

    if (result == PasswordVerificationResult.Failed)
    {
        user.FailedLoginCount++;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return null;
    }

    user.FailedLoginCount = 0;
    user.UpdatedAt = DateTime.UtcNow;

    if (result ==
        PasswordVerificationResult.SuccessRehashNeeded)
    {
        user.PasswordHash =
            _passwordHasher.HashPassword(
                user,
                request.Password);
    }

    var roles =
        await _context.UserRoles
            .AsNoTracking()
            .Where(ur => ur.UserId == user.Id)
            .Select(ur => ur.Role.Name)
            .Distinct()
            .ToListAsync();

    if (roles.Count == 0)
    {
        throw new InvalidOperationException(
            "Tài khoản chưa được gán Role trong RBAC.");
    }

    var permissions =
        await (
            from ur in _context.UserRoles.AsNoTracking()
            join rp in _context.RolePermissions.AsNoTracking()
                on ur.RoleId equals rp.RoleId
            join p in _context.Permissions.AsNoTracking()
                on rp.PermissionId equals p.Id
            where ur.UserId == user.Id
            select p.Code
        )
        .Distinct()
        .ToListAsync();

    var accessToken =
        _jwtService.GenerateToken(
            user,
            roles,
            permissions);

    var rawRefreshToken =
        GenerateRefreshToken();

    var now = DateTime.UtcNow;

    var refreshToken = new RefreshToken
    {
        Id = Guid.NewGuid(),
        UserId = user.Id,
        TokenHash = HashRefreshToken(rawRefreshToken),

        // Refresh token tồn tại 7 ngày
        ExpiresAt = now.AddDays(7),

        RevokedAt = null,
        ReplacedById = null,
        CreatedAt = now
    };

    _context.RefreshTokens.Add(refreshToken);

    await _context.SaveChangesAsync();

    return new AuthResponse
    {
        AccessToken = accessToken,
        RefreshToken = rawRefreshToken,
        RefreshTokenExpiresAt = refreshToken.ExpiresAt
    };
}

public async Task<AuthResponse?> RefreshAsync(
    string refreshToken)
{
    if (string.IsNullOrWhiteSpace(refreshToken))
    {
        return null;
    }

    var tokenHash =
        HashRefreshToken(refreshToken);

    var oldToken =
        await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt =>
                rt.TokenHash == tokenHash);

    if (oldToken == null)
    {
        return null;
    }

    var now = DateTime.UtcNow;

    // Token đã bị revoke
    if (oldToken.RevokedAt != null)
    {
        return null;
    }

    // Token hết hạn
    if (oldToken.ExpiresAt <= now)
    {
        return null;
    }

    var user = oldToken.User;

    if (!user.IsActive)
    {
        return null;
    }

    var roles =
        await _context.UserRoles
            .AsNoTracking()
            .Where(ur => ur.UserId == user.Id)
            .Select(ur => ur.Role.Name)
            .Distinct()
            .ToListAsync();

    if (roles.Count == 0)
    {
        return null;
    }

    var permissions =
        await (
            from ur in _context.UserRoles.AsNoTracking()
            join rp in _context.RolePermissions.AsNoTracking()
                on ur.RoleId equals rp.RoleId
            join p in _context.Permissions.AsNoTracking()
                on rp.PermissionId equals p.Id
            where ur.UserId == user.Id
            select p.Code
        )
        .Distinct()
        .ToListAsync();

    // ==========================================
    // ROTATE REFRESH TOKEN
    // ==========================================

    var newRawRefreshToken =
        GenerateRefreshToken();

    var newRefreshToken =
        new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,

            TokenHash =
                HashRefreshToken(
                    newRawRefreshToken),

            ExpiresAt =
                now.AddDays(7),

            CreatedAt =
                now
        };

    // Token cũ không còn sử dụng được
    oldToken.RevokedAt = now;

    oldToken.ReplacedById =
        newRefreshToken.Id;

    _context.RefreshTokens.Add(
        newRefreshToken);

    await _context.SaveChangesAsync();

    var accessToken =
        _jwtService.GenerateToken(
            user,
            roles,
            permissions);

    return new AuthResponse
    {
        AccessToken = accessToken,

        RefreshToken =
            newRawRefreshToken,

        RefreshTokenExpiresAt =
            newRefreshToken.ExpiresAt
    };
}
public async Task<bool> LogoutAsync(
    string refreshToken)
{
    if (string.IsNullOrWhiteSpace(refreshToken))
    {
        return false;
    }

    var tokenHash =
        HashRefreshToken(refreshToken);

    var token =
        await _context.RefreshTokens
            .FirstOrDefaultAsync(rt =>
                rt.TokenHash == tokenHash);

    if (token == null)
    {
        return false;
    }

    if (token.RevokedAt != null)
    {
        return true;
    }

    token.RevokedAt =
        DateTime.UtcNow;

    await _context.SaveChangesAsync();

    return true;
}
private static string GenerateRefreshToken()
{
    var bytes =
        RandomNumberGenerator.GetBytes(64);

    return Convert.ToBase64String(bytes);
}

private static string HashRefreshToken(
    string refreshToken)
{
    var bytes =
        Encoding.UTF8.GetBytes(
            refreshToken);

    var hash =
        SHA256.HashData(bytes);

    return Convert.ToHexString(hash)
        .ToLowerInvariant();
}
}