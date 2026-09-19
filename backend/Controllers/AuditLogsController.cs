using InternshipManagement.Api.Authorization;
using InternshipManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternshipManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[HasPermission("AUDIT_VIEW")]
public class AuditLogsController : ControllerBase
{
    private readonly IAuditLogService _service;

    public AuditLogsController(
        IAuditLogService service)
    {
        _service = service;
    }

    // =========================================================
    // GET /api/AuditLogs
    // =========================================================
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var logs =
            await _service.GetAllAsync();

        return Ok(logs);
    }

    // =========================================================
    // GET /api/AuditLogs/{id}
    // =========================================================
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(
        Guid id)
    {
        var log =
            await _service.GetByIdAsync(id);

        if (log == null)
        {
            return NotFound(new
            {
                message =
                    "Không tìm thấy Audit Log."
            });
        }

        return Ok(log);
    }

    // =========================================================
    // GET /api/AuditLogs/entity/Evaluation/{id}
    // =========================================================
    [HttpGet("entity/{entityType}/{entityId:guid}")]
    public async Task<IActionResult> GetByEntity(
        string entityType,
        Guid entityId)
    {
        var logs =
            await _service.GetByEntityAsync(
                entityType,
                entityId);

        return Ok(logs);
    }
}