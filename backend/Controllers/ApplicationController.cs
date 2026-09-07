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
public class ApplicationController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ApplicationController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Application
    // Student: xem đơn của chính mình
    // Admin/Company: xem tất cả
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userIdString = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid token."
            });
        }

        var role = User.FindFirstValue(ClaimTypes.Role);

        var query = _context.Applications
            .Include(x => x.Student)
            .Include(x => x.Company)
            .Include(x => x.Period)
            .AsQueryable();

        if (role?.Equals("Student",
            StringComparison.OrdinalIgnoreCase) == true)
        {
            var student = await _context.StudentProfiles
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (student == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Student profile not found."
                });
            }

            query = query.Where(x => x.StudentId == student.Id);
        }

        var applications = await query
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id,
                x.Status,
                x.CreatedAt,
                x.UpdatedAt,

                Student = new
                {
                    x.Student.Id,
                    x.Student.FullName,
                    x.Student.StudentCode,
                    x.Student.Major
                },

                Company = new
                {
                    x.Company.Id,
                    x.Company.Name,
                    x.Company.Field
                },

                Period = new
                {
                    x.Period.Id,
                    x.Period.Code,
                    x.Period.StartDate,
                    x.Period.EndDate,
                    x.Period.Status
                }
            })
            .ToListAsync();

        return Ok(new
        {
            success = true,
            data = applications
        });
    }

    // GET: api/Application/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var application = await _context.Applications
            .Include(x => x.Student)
            .Include(x => x.Company)
            .Include(x => x.Period)
            .Include(x => x.Assignment)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (application == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Application not found."
            });
        }

        return Ok(new
        {
            success = true,
            data = new
            {
                application.Id,
                application.Status,
                application.CreatedAt,
                application.UpdatedAt,

                Student = new
                {
                    application.Student.Id,
                    application.Student.FullName,
                    application.Student.StudentCode,
                    application.Student.Major,
                    application.Student.Phone
                },

                Company = new
                {
                    application.Company.Id,
                    application.Company.Name,
                    application.Company.Field
                },

                Period = new
                {
                    application.Period.Id,
                    application.Period.Code,
                    application.Period.StartDate,
                    application.Period.EndDate,
                    application.Period.Status
                },

                Assignment = application.Assignment == null
                    ? null
                    : new
                    {
                        application.Assignment.Id,
                        application.Assignment.MentorId,
                        application.Assignment.AssignedBy,
                        application.Assignment.CreatedAt
                    }
            }
        });
    }

    // POST: api/Application
    // Student tạo đơn đăng ký thực tập
    [HttpPost]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> Create(
        CreateApplicationRequest request)
    {
        var userIdString = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid token."
            });
        }

        var student = await _context.StudentProfiles
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (student == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Student profile not found."
            });
        }

        var company = await _context.Companies
            .FirstOrDefaultAsync(x => x.Id == request.CompanyId);

        if (company == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Company not found."
            });
        }

        var period = await _context.InternshipPeriods
            .FirstOrDefaultAsync(x => x.Id == request.PeriodId);

        if (period == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Internship period not found."
            });
        }

        if (!period.Status.Equals(
            "OPEN",
            StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new
            {
                success = false,
                message = "This internship period is not open."
            });
        }

        var existingApplication =
            await _context.Applications.AnyAsync(x =>
                x.StudentId == student.Id &&
                x.PeriodId == request.PeriodId);

        if (existingApplication)
        {
            return Conflict(new
            {
                success = false,
                message =
                    "You have already applied for this internship period."
            });
        }

        var application = new Application
        {
            Id = Guid.NewGuid(),
            StudentId = student.Id,
            PeriodId = request.PeriodId,
            CompanyId = request.CompanyId,
            Status = "PENDING",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Applications.Add(application);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Application submitted successfully.",
            data = new
            {
                application.Id,
                application.StudentId,
                application.CompanyId,
                application.PeriodId,
                application.Status,
                application.CreatedAt
            }
        });
    }

    // PUT: api/Application/{id}/status
    // Admin/Company cập nhật trạng thái
    [HttpPut("{id:guid}/status")]
    [Authorize(Roles = "Admin,Company")]
    public async Task<IActionResult> UpdateStatus(
        Guid id,
        UpdateApplicationStatusRequest request)
    {
        var application = await _context.Applications
            .FirstOrDefaultAsync(x => x.Id == id);

        if (application == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Application not found."
            });
        }

        var allowedStatuses = new[]
        {
            "PENDING",
            "APPROVED",
            "REJECTED"
        };

        var status = request.Status?.Trim().ToUpper();

        if (string.IsNullOrWhiteSpace(status) ||
            !allowedStatuses.Contains(status))
        {
            return BadRequest(new
            {
                success = false,
                message =
                    "Status must be PENDING, APPROVED, or REJECTED."
            });
        }

        application.Status = status;
        application.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Application status updated successfully.",
            data = new
            {
                application.Id,
                application.Status,
                application.UpdatedAt
            }
        });
    }

    // DELETE: api/Application/{id}
    // Student chỉ được xóa đơn PENDING
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userIdString = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid token."
            });
        }

        var student = await _context.StudentProfiles
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (student == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Student profile not found."
            });
        }

        var application = await _context.Applications
            .FirstOrDefaultAsync(x =>
                x.Id == id &&
                x.StudentId == student.Id);

        if (application == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Application not found."
            });
        }

        if (!application.Status.Equals(
            "PENDING",
            StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new
            {
                success = false,
                message =
                    "Only pending applications can be deleted."
            });
        }

        _context.Applications.Remove(application);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Application deleted successfully."
        });
    }
}

// =========================
// DTOs
// =========================

public class CreateApplicationRequest
{
    public Guid CompanyId { get; set; }

    public Guid PeriodId { get; set; }
}

public class UpdateApplicationStatusRequest
{
    public string? Status { get; set; }
}
