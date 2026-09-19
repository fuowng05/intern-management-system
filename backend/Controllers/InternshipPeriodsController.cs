using InternshipManagement.Api.Authorization;
using InternshipManagement.Api.DTOs.InternshipPeriods;
using InternshipManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternshipManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InternshipPeriodsController : ControllerBase
{
    private readonly IInternshipPeriodService _service;

    public InternshipPeriodsController(
        IInternshipPeriodService service)
    {
        _service = service;
    }

    // =========================================================
    // 1. XEM DANH SÁCH ĐỢT THỰC TẬP
    // GET /api/InternshipPeriods
    // =========================================================
    [HttpGet]
    [HasPermission("INTERNSHIP_PERIOD_VIEW")]
    public async Task<IActionResult> GetAll()
    {
        var periods = await _service.GetAllAsync();

        return Ok(periods);
    }

    // =========================================================
    // 2. XEM CHI TIẾT ĐỢT THỰC TẬP
    // GET /api/InternshipPeriods/{id}
    // =========================================================
    [HttpGet("{id:guid}")]
    [HasPermission("INTERNSHIP_PERIOD_VIEW")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var period = await _service.GetByIdAsync(id);

        if (period == null)
        {
            return NotFound(new
            {
                message = "Không tìm thấy đợt thực tập."
            });
        }

        return Ok(period);
    }

    // =========================================================
    // 3. TẠO ĐỢT THỰC TẬP
    // POST /api/InternshipPeriods
    // =========================================================
    [HttpPost]
    [HasPermission("INTERNSHIP_PERIOD_MANAGE")]
    public async Task<IActionResult> Create(
        [FromBody] CreateInternshipPeriodRequest request)
    {
        var period = await _service.CreateAsync(request);

        return CreatedAtAction(
            nameof(GetById),
            new
            {
                id = period.Id
            },
            period);
    }

    // =========================================================
    // 4. CẬP NHẬT ĐỢT THỰC TẬP
    // PUT /api/InternshipPeriods/{id}
    // =========================================================
    [HttpPut("{id:guid}")]
    [HasPermission("INTERNSHIP_PERIOD_MANAGE")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateInternshipPeriodRequest request)
    {
        var period = await _service.UpdateAsync(
            id,
            request);

        if (period == null)
        {
            return NotFound(new
            {
                message = "Không tìm thấy đợt thực tập."
            });
        }

        return Ok(period);
    }

    // =========================================================
    // 5. XÓA ĐỢT THỰC TẬP
    // DELETE /api/InternshipPeriods/{id}
    // =========================================================
    [HttpDelete("{id:guid}")]
    [HasPermission("INTERNSHIP_PERIOD_MANAGE")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _service.DeleteAsync(id);

        if (!success)
        {
            return NotFound(new
            {
                message = "Không tìm thấy đợt thực tập."
            });
        }

        return Ok(new
        {
            message = "Xóa đợt thực tập thành công."
        });
    }
}