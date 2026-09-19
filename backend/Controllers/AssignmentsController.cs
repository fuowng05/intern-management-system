using System.Security.Claims;
using InternshipManagement.Api.Authorization;
using InternshipManagement.Api.DTOs.Assignments;
using InternshipManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternshipManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssignmentsController : ControllerBase
{
    private readonly IAssignmentService _service;

    public AssignmentsController(
        IAssignmentService service)
    {
        _service = service;
    }

    // =========================================================
    // 1. TẠO PHÂN CÔNG MENTOR
    // POST /api/Assignments
    // =========================================================
    [HttpPost]
    [HasPermission("ASSIGNMENT_CREATE")]
    public async Task<IActionResult> Create(
        [FromBody] CreateAssignmentRequest request)
    {
        var assignedBy = GetCurrentUserId();

        if (assignedBy == null)
        {
            return Unauthorized(new
            {
                message = "JWT không chứa UserId hợp lệ."
            });
        }

        var assignment =
            await _service.CreateAsync(
                assignedBy.Value,
                request);

        return CreatedAtAction(
            nameof(GetById),
            new
            {
                id = assignment.Id
            },
            assignment);
    }

    // =========================================================
    // 2. XEM ASSIGNMENT THEO ID
    // GET /api/Assignments/{id}
    // =========================================================
    [HttpGet("{id:guid}")]
    [HasPermission("ASSIGNMENT_VIEW_ALL")]   
    public async Task<IActionResult> GetById(Guid id)
    {
        var assignment =
            await _service.GetByIdAsync(id);

        if (assignment == null)
        {
            return NotFound(new
            {
                message = "Không tìm thấy phân công."
            });
        }

        return Ok(assignment);
    }

    // =========================================================
    // 3. XEM ASSIGNMENT THEO APPLICATION
    // GET /api/Assignments/application/{applicationId}
    // =========================================================
    [HttpGet("application/{applicationId:guid}")]
    [HasPermission("ASSIGNMENT_VIEW_ALL")]
    public async Task<IActionResult> GetByApplication(
        Guid applicationId)
    {
        var assignment =
            await _service.GetByApplicationIdAsync(
                applicationId);

        if (assignment == null)
        {
            return NotFound(new
            {
                message =
                    "Application này chưa được phân công Mentor."
            });
        }

        return Ok(assignment);
    }

    // =========================================================
    // 4. MENTOR XEM DANH SÁCH SINH VIÊN MÌNH PHỤ TRÁCH
    // GET /api/Assignments/my
    // =========================================================
    [HttpGet("my")]
    [HasPermission("ASSIGNMENT_VIEW_SELF")]
    public async Task<IActionResult> GetMyAssignments()
    {
        var mentorId = GetCurrentUserId();

        if (mentorId == null)
        {
            return Unauthorized(new
            {
                message = "JWT không chứa UserId hợp lệ."
            });
        }

        var assignments =
            await _service.GetMyAssignmentsAsync(
                mentorId.Value);

        return Ok(assignments);
    }

    // =========================================================
    // HELPER: LẤY USER ID TỪ JWT
    // =========================================================
    private Guid? GetCurrentUserId()
    {
        var value =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub");

        return Guid.TryParse(
            value,
            out var id)
            ? id
            : null;
    }
}