using System.Security.Claims;
using InternshipManagement.Api.Authorization;
using InternshipManagement.Api.DTOs.Applications;
using InternshipManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternshipManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly IApplicationService _service;

    public ApplicationsController(IApplicationService service)
    {
        _service = service;
    }

    // =========================================================
    // 1. ADMIN XEM TẤT CẢ ĐƠN
    // GET /api/Applications
    // =========================================================
    [HttpGet]
    [HasPermission("APPLICATION_VIEW_ALL")]
    public async Task<IActionResult> GetAll()
    {
        var applications = await _service.GetAllAsync();

        return Ok(applications);
    }

    // =========================================================
    // 2. STUDENT XEM ĐƠN CỦA CHÍNH MÌNH
    // GET /api/Applications/my
    // =========================================================
    [HttpGet("my")]
    [HasPermission("APPLICATION_VIEW_SELF")]
    public async Task<IActionResult> GetMyApplications()
    {
        var studentId = GetCurrentUserId();

        if (studentId == null)
        {
            return Unauthorized(new
            {
                message = "JWT không chứa UserId hợp lệ."
            });
        }

        var applications =
            await _service.GetMyApplicationsAsync(
                studentId.Value);

        return Ok(applications);
    }

    // =========================================================
    // 3. ADMIN XEM CHI TIẾT ĐƠN
    // GET /api/Applications/{id}
    // =========================================================
    [HttpGet("{id:guid}")]
    [HasPermission("APPLICATION_VIEW_ALL")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var application =
            await _service.GetByIdAsync(id);

        if (application == null)
        {
            return NotFound(new
            {
                message = "Không tìm thấy đơn đăng ký."
            });
        }

        return Ok(application);
    }

    // =========================================================
    // 4. STUDENT NỘP ĐƠN
    // POST /api/Applications
    // =========================================================
    [HttpPost]
    [HasPermission("APPLICATION_CREATE")]
    public async Task<IActionResult> Create(
        [FromBody] CreateApplicationRequest request)
    {
        var studentId = GetCurrentUserId();

        if (studentId == null)
        {
            return Unauthorized(new
            {
                message = "JWT không chứa UserId hợp lệ."
            });
        }

        var application =
            await _service.CreateAsync(
                studentId.Value,
                request);

        return CreatedAtAction(
            nameof(GetById),
            new
            {
                id = application.Id
            },
            application);
    }

    // =========================================================
    // 5. ADMIN DUYỆT / TỪ CHỐI ĐƠN
    // PUT /api/Applications/{id}/decision
    // =========================================================
    [HttpPut("{id:guid}/decision")]
    [HasPermission("APPLICATION_DECIDE")]
    public async Task<IActionResult> Decide(
        Guid id,
        [FromBody] DecideApplicationRequest request)
    {
        var adminId = GetCurrentUserId();

        if (adminId == null)
        {
            return Unauthorized(new
            {
                message = "JWT không chứa UserId hợp lệ."
            });
        }

        var application =
            await _service.DecideAsync(
                id,
                adminId.Value,
                request);

        if (application == null)
        {
            return NotFound(new
            {
                message = "Không tìm thấy đơn đăng ký."
            });
        }

        return Ok(application);
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