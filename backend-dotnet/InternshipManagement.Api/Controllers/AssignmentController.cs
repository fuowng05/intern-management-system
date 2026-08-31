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
public class AssignmentController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AssignmentController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Assignment
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var assignments = await _context.Assignments
            .Include(x => x.Application)
                .ThenInclude(x => x.Student)
            .Include(x => x.Application)
                .ThenInclude(x => x.Company)
            .Include(x => x.Application)
                .ThenInclude(x => x.Period)
            .Include(x => x.Mentor)
            .Include(x => x.Assigner)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id,
                x.ApplicationId,
                x.MentorId,
                x.AssignedBy,
                x.CreatedAt,
                x.UpdatedAt,

                Student = new
                {
                    x.Application.Student.Id,
                    x.Application.Student.FullName,
                    x.Application.Student.StudentCode
                },

                Company = new
                {
                    x.Application.Company.Id,
                    x.Application.Company.Name
                },

                Period = new
                {
                    x.Application.Period.Id,
                    x.Application.Period.Code
                },

                Mentor = new
                {
                    x.Mentor.Id,
                    x.Mentor.Email,
                    x.Mentor.Role
                },

                Assigner = new
                {
                    x.Assigner.Id,
                    x.Assigner.Email,
                    x.Assigner.Role
                }
            })
            .ToListAsync();

        return Ok(new
        {
            success = true,
            data = assignments
        });
    }

    // GET: api/Assignment/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var assignment = await _context.Assignments
            .Include(x => x.Application)
                .ThenInclude(x => x.Student)
            .Include(x => x.Application)
                .ThenInclude(x => x.Company)
            .Include(x => x.Application)
                .ThenInclude(x => x.Period)
            .Include(x => x.Mentor)
            .Include(x => x.Assigner)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (assignment == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Assignment not found."
            });
        }

        return Ok(new
        {
            success = true,
            data = new
            {
                assignment.Id,
                assignment.ApplicationId,
                assignment.MentorId,
                assignment.AssignedBy,
                assignment.CreatedAt,
                assignment.UpdatedAt,

                Student = new
                {
                    assignment.Application.Student.Id,
                    assignment.Application.Student.FullName,
                    assignment.Application.Student.StudentCode
                },

                Company = new
                {
                    assignment.Application.Company.Id,
                    assignment.Application.Company.Name
                },

                Period = new
                {
                    assignment.Application.Period.Id,
                    assignment.Application.Period.Code
                },

                Mentor = new
                {
                    assignment.Mentor.Id,
                    assignment.Mentor.Email,
                    assignment.Mentor.Role
                }
            }
        });
    }

    // POST: api/Assignment
    // Admin phân công Mentor
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(
        CreateAssignmentRequest request)
    {
        var assignerIdString = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(assignerIdString, out var assignerId))
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid token."
            });
        }

        var application = await _context.Applications
            .FirstOrDefaultAsync(x => x.Id == request.ApplicationId);

        if (application == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Application not found."
            });
        }

        if (!application.Status.Equals(
            "APPROVED",
            StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new
            {
                success = false,
                message =
                    "Only approved applications can be assigned."
            });
        }

        var mentor = await _context.Users
            .FirstOrDefaultAsync(x => x.Id == request.MentorId);

        if (mentor == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Mentor not found."
            });
        }

        if (!mentor.Role.Equals(
            "Mentor",
            StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new
            {
                success = false,
                message = "Selected user is not a Mentor."
            });
        }

        var existingAssignment =
            await _context.Assignments
                .FirstOrDefaultAsync(x =>
                    x.ApplicationId == request.ApplicationId);

        if (existingAssignment != null)
        {
            return Conflict(new
            {
                success = false,
                message =
                    "This application has already been assigned."
            });
        }

        var assignment = new Assignment
        {
            Id = Guid.NewGuid(),
            ApplicationId = request.ApplicationId,
            MentorId = request.MentorId,
            AssignedBy = assignerId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Assignments.Add(assignment);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Mentor assigned successfully.",
            data = new
            {
                assignment.Id,
                assignment.ApplicationId,
                assignment.MentorId,
                assignment.AssignedBy,
                assignment.CreatedAt
            }
        });
    }

    // PUT: api/Assignment/{id}
    // Admin đổi Mentor
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateAssignmentRequest request)
    {
        var assignment = await _context.Assignments
            .FirstOrDefaultAsync(x => x.Id == id);

        if (assignment == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Assignment not found."
            });
        }

        var mentor = await _context.Users
            .FirstOrDefaultAsync(x => x.Id == request.MentorId);

        if (mentor == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Mentor not found."
            });
        }

        if (!mentor.Role.Equals(
            "Mentor",
            StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new
            {
                success = false,
                message = "Selected user is not a Mentor."
            });
        }

        assignment.MentorId = request.MentorId;
        assignment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Assignment updated successfully.",
            data = new
            {
                assignment.Id,
                assignment.ApplicationId,
                assignment.MentorId,
                assignment.AssignedBy,
                assignment.UpdatedAt
            }
        });
    }

    // DELETE: api/Assignment/{id}
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var assignment = await _context.Assignments
            .FirstOrDefaultAsync(x => x.Id == id);

        if (assignment == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Assignment not found."
            });
        }

        _context.Assignments.Remove(assignment);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Assignment deleted successfully."
        });
    }
}

// =========================
// DTOs
// =========================

public class CreateAssignmentRequest
{
    public Guid ApplicationId { get; set; }

    public Guid MentorId { get; set; }
}

public class UpdateAssignmentRequest
{
    public Guid MentorId { get; set; }
}
