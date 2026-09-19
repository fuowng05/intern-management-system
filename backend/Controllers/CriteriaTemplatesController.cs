using System.Security.Claims;
using InternshipManagement.Api.Authorization;
using InternshipManagement.Api.DTOs.CriteriaTemplates;
using InternshipManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternshipManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CriteriaTemplatesController : ControllerBase
{
    private readonly ICriteriaTemplateService _service;

    public CriteriaTemplatesController(
        ICriteriaTemplateService service)
    {
        _service = service;
    }

    // =========================================================
    // 1. XEM DANH SÁCH TEMPLATE
    // GET /api/CriteriaTemplates
    // =========================================================
    [HttpGet]
    [HasPermission("CRITERIA_TEMPLATE_VIEW")]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    // =========================================================
    // 2. XEM CHI TIẾT TEMPLATE
    // GET /api/CriteriaTemplates/{id}
    // =========================================================
    [HttpGet("{id:guid}")]
    [HasPermission("CRITERIA_TEMPLATE_VIEW")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var template =
            await _service.GetByIdAsync(id);

        if (template == null)
        {
            return NotFound(new
            {
                message = "Không tìm thấy template."
            });
        }

        return Ok(template);
    }

    // =========================================================
    // 3. TẠO TEMPLATE
    // POST /api/CriteriaTemplates
    // =========================================================
    [HttpPost]
    [HasPermission("CRITERIA_TEMPLATE_MANAGE")]
    public async Task<IActionResult> Create(
        [FromBody] CreateCriteriaTemplateRequest request)
    {
        var template =
            await _service.CreateAsync(request);

        return CreatedAtAction(
            nameof(GetById),
            new
            {
                id = template.Id
            },
            template);
    }

    // =========================================================
    // 4. THÊM TIÊU CHÍ VÀO TEMPLATE
    // POST /api/CriteriaTemplates/{id}/items
    // =========================================================
    [HttpPost("{id:guid}/items")]
    [HasPermission("CRITERIA_TEMPLATE_MANAGE")]
    public async Task<IActionResult> AddItem(
        Guid id,
        [FromBody] AddCriteriaTemplateItemRequest request)
    {
        var template =
            await _service.AddItemAsync(
                id,
                request);

        if (template == null)
        {
            return NotFound(new
            {
                message = "Không tìm thấy template."
            });
        }

        return Ok(template);
    }

    // =========================================================
    // 5. XÓA TIÊU CHÍ KHỎI TEMPLATE
    // DELETE /api/CriteriaTemplates/{templateId}/items/{itemId}
    // =========================================================
    [HttpDelete("{templateId:guid}/items/{itemId:guid}")]
    [HasPermission("CRITERIA_TEMPLATE_MANAGE")]
    public async Task<IActionResult> DeleteItem(
        Guid templateId,
        Guid itemId)
    {
        var success =
            await _service.DeleteItemAsync(
                templateId,
                itemId);

        if (!success)
        {
            return NotFound(new
            {
                message =
                    "Không tìm thấy template hoặc tiêu chí."
            });
        }

        return Ok(new
        {
            message = "Xóa tiêu chí thành công."
        });
    }

    // =========================================================
    // 6. PHÁT HÀNH TEMPLATE
    // PUT /api/CriteriaTemplates/{id}/issue
    // =========================================================
    [HttpPut("{id:guid}/issue")]
    [HasPermission("CRITERIA_TEMPLATE_MANAGE")]
    public async Task<IActionResult> Issue(Guid id)
    {
        var adminId = GetCurrentUserId();

        if (adminId == null)
        {
            return Unauthorized(new
            {
                message = "JWT không chứa UserId hợp lệ."
            });
        }

        var template =
            await _service.IssueAsync(
                id,
                adminId.Value);

        if (template == null)
        {
            return NotFound(new
            {
                message = "Không tìm thấy template."
            });
        }

        return Ok(template);
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