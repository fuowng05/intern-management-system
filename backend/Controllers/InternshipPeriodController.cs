using InternshipManagement.Api.Data;
using InternshipManagement.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InternshipManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InternshipPeriodController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public InternshipPeriodController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/InternshipPeriod
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var periods = await _context.InternshipPeriods
            .OrderByDescending(x => x.StartDate)
            .Select(x => new
            {
                x.Id,
                x.Code,
                x.StartDate,
                x.EndDate,
                x.Status,
                x.CreatedAt,
                x.UpdatedAt
            })
            .ToListAsync();

        return Ok(new
        {
            success = true,
            data = periods
        });
    }

    // GET: api/InternshipPeriod/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var period = await _context.InternshipPeriods
            .Where(x => x.Id == id)
            .Select(x => new
            {
                x.Id,
                x.Code,
                x.StartDate,
                x.EndDate,
                x.Status,
                x.CreatedAt,
                x.UpdatedAt
            })
            .FirstOrDefaultAsync();

        if (period == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Internship period not found."
            });
        }

        return Ok(new
        {
            success = true,
            data = period
        });
    }

    // POST: api/InternshipPeriod
    [HttpPost]
    public async Task<IActionResult> Create(InternshipPeriod request)
    {
        if (string.IsNullOrWhiteSpace(request.Code))
        {
            return BadRequest(new
            {
                success = false,
                message = "Period code is required."
            });
        }

        if (request.StartDate >= request.EndDate)
        {
            return BadRequest(new
            {
                success = false,
                message = "Start date must be before end date."
            });
        }

        var code = request.Code.Trim().ToUpper();

        var exists = await _context.InternshipPeriods
            .AnyAsync(x => x.Code == code);

        if (exists)
        {
            return Conflict(new
            {
                success = false,
                message = "Internship period code already exists."
            });
        }

        var period = new InternshipPeriod
        {
            Id = Guid.NewGuid(),
            Code = code,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Status = string.IsNullOrWhiteSpace(request.Status)
                ? "OPEN"
                : request.Status.Trim().ToUpper(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.InternshipPeriods.Add(period);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Internship period created successfully.",
            data = new
            {
                period.Id,
                period.Code,
                period.StartDate,
                period.EndDate,
                period.Status
            }
        });
    }

    // PUT: api/InternshipPeriod/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        InternshipPeriod request)
    {
        var period = await _context.InternshipPeriods
            .FirstOrDefaultAsync(x => x.Id == id);

        if (period == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Internship period not found."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Code))
        {
            return BadRequest(new
            {
                success = false,
                message = "Period code is required."
            });
        }

        if (request.StartDate >= request.EndDate)
        {
            return BadRequest(new
            {
                success = false,
                message = "Start date must be before end date."
            });
        }

        var code = request.Code.Trim().ToUpper();

        var duplicate = await _context.InternshipPeriods
            .AnyAsync(x => x.Code == code && x.Id != id);

        if (duplicate)
        {
            return Conflict(new
            {
                success = false,
                message = "Internship period code already exists."
            });
        }

        period.Code = code;
        period.StartDate = request.StartDate;
        period.EndDate = request.EndDate;
        period.Status = string.IsNullOrWhiteSpace(request.Status)
            ? period.Status
            : request.Status.Trim().ToUpper();
        period.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Internship period updated successfully.",
            data = new
            {
                period.Id,
                period.Code,
                period.StartDate,
                period.EndDate,
                period.Status,
                period.UpdatedAt
            }
        });
    }

    // DELETE: api/InternshipPeriod/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var period = await _context.InternshipPeriods
            .FirstOrDefaultAsync(x => x.Id == id);

        if (period == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Internship period not found."
            });
        }

        var hasApplications = await _context.Applications
            .AnyAsync(x => x.PeriodId == id);

        if (hasApplications)
        {
            return BadRequest(new
            {
                success = false,
                message = "Cannot delete a period that has applications."
            });
        }

        _context.InternshipPeriods.Remove(period);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Internship period deleted successfully."
        });
    }
}
