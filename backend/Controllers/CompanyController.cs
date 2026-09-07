using InternshipManagement.Api.Data;
using InternshipManagement.Api.DTOs;
using InternshipManagement.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InternshipManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CompanyController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CompanyController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Company
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var companies = await _context.Companies
            .AsNoTracking()
            .Select(c => new
            {
                c.Id,
                c.Name,
                c.Field,
                c.CreatedAt,
                c.UpdatedAt
            })
            .OrderBy(c => c.Name)
            .ToListAsync();

        return Ok(new
        {
            success = true,
            data = companies
        });
    }

    // GET: api/Company/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var company = await _context.Companies
            .AsNoTracking()
            .Where(c => c.Id == id)
            .Select(c => new
            {
                c.Id,
                c.Name,
                c.Field,
                c.CreatedAt,
                c.UpdatedAt
            })
            .FirstOrDefaultAsync();

        if (company == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Company not found."
            });
        }

        return Ok(new
        {
            success = true,
            data = company
        });
    }

    // POST: api/Company
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(
        CreateCompanyRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new
            {
                success = false,
                message = "Company name is required."
            });
        }

        var name = request.Name.Trim();

        var exists = await _context.Companies
            .AnyAsync(c => c.Name.ToLower() == name.ToLower());

        if (exists)
        {
            return Conflict(new
            {
                success = false,
                message = "Company already exists."
            });
        }

        var company = new Company
        {
            Id = Guid.NewGuid(),
            Name = name,
            Field = request.Field?.Trim() ?? string.Empty,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Companies.Add(company);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = company.Id },
            new
            {
                success = true,
                message = "Company created successfully.",
                data = new
                {
                    company.Id,
                    company.Name,
                    company.Field,
                    company.CreatedAt,
                    company.UpdatedAt
                }
            });
    }

    // PUT: api/Company/{id}
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateCompanyRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new
            {
                success = false,
                message = "Company name is required."
            });
        }

        var company = await _context.Companies
            .FirstOrDefaultAsync(c => c.Id == id);

        if (company == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Company not found."
            });
        }

        var name = request.Name.Trim();

        var duplicate = await _context.Companies
            .AnyAsync(c =>
                c.Id != id &&
                c.Name.ToLower() == name.ToLower());

        if (duplicate)
        {
            return Conflict(new
            {
                success = false,
                message = "Another company with this name already exists."
            });
        }

        company.Name = name;
        company.Field = request.Field?.Trim() ?? string.Empty;
        company.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Company updated successfully.",
            data = new
            {
                company.Id,
                company.Name,
                company.Field,
                company.CreatedAt,
                company.UpdatedAt
            }
        });
    }

    // DELETE: api/Company/{id}
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var company = await _context.Companies
            .FirstOrDefaultAsync(c => c.Id == id);

        if (company == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Company not found."
            });
        }

        var hasApplications = await _context.Applications
            .AnyAsync(a => a.CompanyId == id);

        if (hasApplications)
        {
            return BadRequest(new
            {
                success = false,
                message = "Cannot delete company because it has applications."
            });
        }

        var hasUsers = await _context.Users
            .AnyAsync(u => u.CompanyId == id);

        if (hasUsers)
        {
            return BadRequest(new
            {
                success = false,
                message = "Cannot delete company because it has users."
            });
        }

        _context.Companies.Remove(company);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Company deleted successfully."
        });
    }
}
