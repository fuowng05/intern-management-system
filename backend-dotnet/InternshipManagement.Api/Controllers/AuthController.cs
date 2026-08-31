using System.Security.Cryptography;
using System.Text;
using System.Security.Claims;
using InternshipManagement.Api.Data;
using InternshipManagement.Api.DTOs;
using InternshipManagement.Api.Models;
using InternshipManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InternshipManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly JwtService _jwtService;

    public AuthController(
        ApplicationDbContext context,
        JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new
            {
                success = false,
                message = "Email and password are required."
            });
        }

        var email = request.Email.Trim().ToLower();

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == email);

        if (existingUser != null)
        {
            return Conflict(new
            {
                success = false,
                message = "Email already exists."
            });
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = email,
            PasswordHash = HashPassword(request.Password),
            Role = string.IsNullOrWhiteSpace(request.Role)
                ? "Student"
                : request.Role,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);

        if (user.Role.Equals("Student",
            StringComparison.OrdinalIgnoreCase))
        {
            var profile = new StudentProfile
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                FullName = request.FullName ?? "",
                StudentCode = request.StudentCode,
                Major = request.Major,
                Phone = request.Phone
            };

            _context.StudentProfiles.Add(profile);
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Registration successful.",
            userId = user.Id
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginRequest request)
    {
        var email = request.Email.Trim().ToLower();

        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == email);

        if (user == null ||
            !VerifyPassword(
                request.Password,
                user.PasswordHash))
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid email or password."
            });
        }

        var token = _jwtService.GenerateToken(user);

        return Ok(new AuthResponse
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email,
            Role = user.Role
        });
    }

    [HttpGet("me")]
[Authorize]
public async Task<IActionResult> Me()
{
    var userIdString = User.FindFirst(
        ClaimTypes.NameIdentifier
    )?.Value;

    if (!Guid.TryParse(userIdString, out var userId))
    {
        return Unauthorized(new
        {
            success = false,
            message = "Invalid token."
        });
    }

    var user = await _context.Users
        .Include(x => x.StudentProfile)
        .FirstOrDefaultAsync(x => x.Id == userId);

    if (user == null)
    {
        return NotFound(new
        {
            success = false,
            message = "User not found."
        });
    }

    return Ok(new
    {
        success = true,
        data = new
        {
            id = user.Id,
            email = user.Email,
            role = user.Role,
            companyId = user.CompanyId,

            studentProfile = user.StudentProfile == null
                ? null
                : new
                {
                    id = user.StudentProfile.Id,
                    fullName = user.StudentProfile.FullName,
                    studentCode = user.StudentProfile.StudentCode,
                    major = user.StudentProfile.Major,
                    phone = user.StudentProfile.Phone
                }
        }
    });
}

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();

        var bytes = Encoding.UTF8.GetBytes(password);

        var hash = sha256.ComputeHash(bytes);

        return Convert.ToBase64String(hash);
    }

    private static bool VerifyPassword(
        string password,
        string passwordHash)
    {
        return HashPassword(password) == passwordHash;
    }
}
