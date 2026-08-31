using System.Security.Claims;
using InternshipManagement.Api.Data;
using InternshipManagement.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InternshipManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StudentController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public StudentController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ==========================================
    // GET: api/Student/me
    // Lấy thông tin sinh viên đang đăng nhập
    // ==========================================

    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid token."
            });
        }

        var profile = await _context.StudentProfiles
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.UserId == userId.Value);

        if (profile == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Student profile not found."
            });
        }

        return Ok(new
        {
            success = true,
            data = new
            {
                id = profile.Id,
                userId = profile.UserId,
                fullName = profile.FullName,
                studentCode = profile.StudentCode,
                major = profile.Major,
                phone = profile.Phone
            }
        });
    }

    // ==========================================
    // GET: api/Student/{id}
    // Lấy thông tin một sinh viên
    // ==========================================

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetStudent(Guid id)
    {
        var profile = await _context.StudentProfiles
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (profile == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Student not found."
            });
        }

        return Ok(new
        {
            success = true,
            data = new
            {
                id = profile.Id,
                userId = profile.UserId,
                fullName = profile.FullName,
                studentCode = profile.StudentCode,
                major = profile.Major,
                phone = profile.Phone
            }
        });
    }

    // ==========================================
    // GET: api/Student
    // Danh sách sinh viên
    // ==========================================

    [HttpGet]
    public async Task<IActionResult> GetStudents()
    {
        var students = await _context.StudentProfiles
            .AsNoTracking()
            .OrderBy(x => x.FullName)
            .Select(x => new
            {
                id = x.Id,
                userId = x.UserId,
                fullName = x.FullName,
                studentCode = x.StudentCode,
                major = x.Major,
                phone = x.Phone
            })
            .ToListAsync();

        return Ok(new
        {
            success = true,
            data = students
        });
    }

    // ==========================================
    // PUT: api/Student/me
    // Cập nhật profile sinh viên
    // ==========================================

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMyProfile(
        UpdateStudentProfileRequest request)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid token."
            });
        }

        var profile = await _context.StudentProfiles
            .FirstOrDefaultAsync(x => x.UserId == userId.Value);

        if (profile == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Student profile not found."
            });
        }

        if (!string.IsNullOrWhiteSpace(request.FullName))
        {
            profile.FullName = request.FullName.Trim();
        }

        if (request.StudentCode != null)
        {
            profile.StudentCode = request.StudentCode.Trim();
        }

        if (request.Major != null)
        {
            profile.Major = request.Major.Trim();
        }

        if (request.Phone != null)
        {
            profile.Phone = request.Phone.Trim();
        }


        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Student profile updated successfully.",
            data = new
            {
                id = profile.Id,
                userId = profile.UserId,
                fullName = profile.FullName,
                studentCode = profile.StudentCode,
                major = profile.Major,
                phone = profile.Phone
            }
        });
    }

    // ==========================================
    // Helper
    // ==========================================

    private Guid? GetCurrentUserId()
    {
        var userIdString = User.FindFirst(
            ClaimTypes.NameIdentifier
        )?.Value;

        if (Guid.TryParse(userIdString, out var userId))
        {
            return userId;
        }

        return null;
    }
}

// ==========================================
// Request DTO
// ==========================================

public class UpdateStudentProfileRequest
{
    public string? FullName { get; set; }

    public string? StudentCode { get; set; }

    public string? Major { get; set; }

    public string? Phone { get; set; }
}
