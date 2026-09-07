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
public class EvaluationController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public EvaluationController(ApplicationDbContext context)
    {
        _context = context;
    }

    // =========================
    // GET ALL
    // =========================

    [HttpGet]
    [Authorize(Roles = "Admin,Mentor")]
    public async Task<IActionResult> GetAll()
    {
        var evaluations = await _context.Evaluations
            .Include(x => x.Criteria)
            .Include(x => x.Application)
                .ThenInclude(x => x.Student)
            .Include(x => x.Application)
                .ThenInclude(x => x.Company)
            .Select(x => new
            {
                x.Id,
                x.ApplicationId,
                x.TotalScore,
                x.FinalStatus,
                x.CreatedAt,
                x.UpdatedAt,

                student = new
                {
                    x.Application.Student.Id,
                    x.Application.Student.FullName,
                    x.Application.Student.StudentCode
                },

                company = new
                {
                    x.Application.Company.Id,
                    x.Application.Company.Name
                },

                criteria = x.Criteria.Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Weight,
                    c.Score
                })
            })
            .ToListAsync();

        return Ok(new
        {
            success = true,
            data = evaluations
        });
    }

    // =========================
    // GET BY ID
    // =========================

    [HttpGet("{id:guid}")]
    [Authorize(Roles = "Admin,Mentor")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var evaluation = await _context.Evaluations
            .Include(x => x.Criteria)
            .Include(x => x.Application)
                .ThenInclude(x => x.Student)
            .Include(x => x.Application)
                .ThenInclude(x => x.Company)
            .Where(x => x.Id == id)
            .Select(x => new
            {
                x.Id,
                x.ApplicationId,
                x.TotalScore,
                x.FinalStatus,
                x.CreatedAt,
                x.UpdatedAt,

                student = new
                {
                    x.Application.Student.Id,
                    x.Application.Student.FullName,
                    x.Application.Student.StudentCode
                },

                company = new
                {
                    x.Application.Company.Id,
                    x.Application.Company.Name
                },

                criteria = x.Criteria.Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Weight,
                    c.Score
                })
            })
            .FirstOrDefaultAsync();

        if (evaluation == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Evaluation not found."
            });
        }

        return Ok(new
        {
            success = true,
            data = evaluation
        });
    }

    // =========================
    // CREATE
    // =========================

    [HttpPost]
    [Authorize(Roles = "Admin,Mentor")]
    public async Task<IActionResult> Create(
        CreateEvaluationRequest request)
    {
        var application = await _context.Applications
            .FirstOrDefaultAsync(x =>
                x.Id == request.ApplicationId);

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
                    "Only approved applications can be evaluated."
            });
        }

        var existing = await _context.Evaluations
            .AnyAsync(x =>
                x.ApplicationId == request.ApplicationId);

        if (existing)
        {
            return Conflict(new
            {
                success = false,
                message =
                    "An evaluation already exists for this application."
            });
        }

        if (request.Criteria == null ||
            request.Criteria.Count == 0)
        {
            return BadRequest(new
            {
                success = false,
                message = "At least one evaluation criterion is required."
            });
        }

        var totalWeight = request.Criteria
            .Sum(x => x.Weight);

        if (totalWeight != 100)
        {
            return BadRequest(new
            {
                success = false,
                message =
                    "The total weight of criteria must equal 100."
            });
        }

        foreach (var criterion in request.Criteria)
        {
            if (string.IsNullOrWhiteSpace(criterion.Name))
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Criterion name is required."
                });
            }

            if (criterion.Weight <= 0)
            {
                return BadRequest(new
                {
                    success = false,
                    message =
                        "Criterion weight must be greater than 0."
                });
            }

            if (criterion.Score.HasValue &&
                (criterion.Score < 0 ||
                 criterion.Score > 10))
            {
                return BadRequest(new
                {
                    success = false,
                    message =
                        "Criterion score must be between 0 and 10."
                });
            }
        }

        var evaluation = new Evaluation
        {
            Id = Guid.NewGuid(),
            ApplicationId = request.ApplicationId,
            TotalScore = CalculateTotalScore(request.Criteria),
            FinalStatus = CalculateFinalStatus(request.Criteria),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        foreach (var criterion in request.Criteria)
        {
            evaluation.Criteria.Add(
                new EvaluationCriterion
                {
                    Id = Guid.NewGuid(),
                    EvaluationId = evaluation.Id,
                    Name = criterion.Name.Trim(),
                    Weight = criterion.Weight,
                    Score = criterion.Score,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });
        }

        _context.Evaluations.Add(evaluation);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Evaluation created successfully.",
            data = new
            {
                evaluation.Id,
                evaluation.ApplicationId,
                evaluation.TotalScore,
                evaluation.FinalStatus
            }
        });
    }

    // =========================
    // UPDATE
    // =========================

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Mentor")]
    public async Task<IActionResult> Update(
        Guid id,
        CreateEvaluationRequest request)
    {
        var evaluation = await _context.Evaluations
            .Include(x => x.Criteria)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (evaluation == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Evaluation not found."
            });
        }

        if (evaluation.ApplicationId != request.ApplicationId)
        {
            return BadRequest(new
            {
                success = false,
                message =
                    "ApplicationId cannot be changed."
            });
        }

        var totalWeight = request.Criteria.Sum(x => x.Weight);

        if (totalWeight != 100)
        {
            return BadRequest(new
            {
                success = false,
                message =
                    "The total weight of criteria must equal 100."
            });
        }

await _context.EvaluationCriteria
    .Where(x => x.EvaluationId == evaluation.Id)
    .ExecuteDeleteAsync();

foreach (var criterion in request.Criteria)
{
    _context.EvaluationCriteria.Add(
        new EvaluationCriterion
        {
            Id = Guid.NewGuid(),
            EvaluationId = evaluation.Id,
            Name = criterion.Name.Trim(),
            Weight = criterion.Weight,
            Score = criterion.Score,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });
}

        evaluation.TotalScore =
            CalculateTotalScore(request.Criteria);

        evaluation.FinalStatus =
            CalculateFinalStatus(request.Criteria);

        evaluation.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Evaluation updated successfully.",
            data = new
            {
                evaluation.Id,
                evaluation.TotalScore,
                evaluation.FinalStatus
            }
        });
    }

    // =========================
    // DELETE
    // =========================

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var evaluation = await _context.Evaluations
            .FirstOrDefaultAsync(x => x.Id == id);

        if (evaluation == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Evaluation not found."
            });
        }

        _context.Evaluations.Remove(evaluation);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Evaluation deleted successfully."
        });
    }

    // =========================
    // CALCULATE SCORE
    // =========================

    private static decimal CalculateTotalScore(
        IEnumerable<CreateEvaluationCriterionRequest> criteria)
    {
        decimal total = 0;

        foreach (var criterion in criteria)
        {
            if (criterion.Score.HasValue)
            {
                total +=
                    criterion.Score.Value *
                    criterion.Weight /
                    100;
            }
        }

        return Math.Round(total, 2);
    }

    private static string CalculateFinalStatus(
        IEnumerable<CreateEvaluationCriterionRequest> criteria)
    {
        if (criteria.Any(x => !x.Score.HasValue))
        {
            return "IN_PROGRESS";
        }

        var totalScore = CalculateTotalScore(criteria);

        return totalScore >= 5
            ? "PASSED"
            : "FAILED";
    }
}
