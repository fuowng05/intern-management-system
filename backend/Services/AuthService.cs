using InternshipManagement.Api.Data;
using InternshipManagement.Api.DTOs.Auth;
using InternshipManagement.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace InternshipManagement.Api.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly PasswordHasher<User> _passwordHasher;

    public AuthService(ApplicationDbContext context)
    {
        _context = context;
        _passwordHasher = new PasswordHasher<User>();
    }

    public async Task<bool> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (existingUser != null)
        {
            return false;
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            Role = "Student",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        user.PasswordHash = _passwordHasher.HashPassword(
            user,
            request.Password
        );

        var studentProfile = new StudentProfile
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            FullName = request.FullName,
            StudentCode = request.StudentCode,
            Major = request.Major,
            Phone = request.Phone
        };

        _context.Users.Add(user);
        _context.StudentProfiles.Add(studentProfile);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
        {
            return false;
        }

        var result = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            request.Password
        );

        return result == PasswordVerificationResult.Success;
    }
}
