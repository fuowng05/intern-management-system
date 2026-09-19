using InternshipManagement.Api.Authorization;
using InternshipManagement.Api.DTOs.Companies;
using InternshipManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternshipManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CompaniesController : ControllerBase
{
    private readonly ICompanyService _companyService;

    public CompaniesController(ICompanyService companyService)
    {
        _companyService = companyService;
    }

    // =========================================================
    // 1. XEM DANH SÁCH DOANH NGHIỆP
    // GET /api/Companies
    // =========================================================
    [HttpGet]
    [HasPermission("COMPANY_VIEW")]
    public async Task<IActionResult> GetAll()
    {
        var companies =
            await _companyService.GetAllAsync();

        return Ok(companies);
    }

    // =========================================================
    // 2. XEM CHI TIẾT DOANH NGHIỆP
    // GET /api/Companies/{id}
    // =========================================================
    [HttpGet("{id:guid}")]
    [HasPermission("COMPANY_VIEW")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var company =
            await _companyService.GetByIdAsync(id);

        if (company == null)
        {
            return NotFound(new
            {
                message = "Không tìm thấy doanh nghiệp."
            });
        }

        return Ok(company);
    }

    // =========================================================
    // 3. TẠO DOANH NGHIỆP
    // POST /api/Companies
    // =========================================================
    [HttpPost]
    [HasPermission("COMPANY_MANAGE")]
    public async Task<IActionResult> Create(
        [FromBody] CreateCompanyRequest request)
    {
        var company =
            await _companyService.CreateAsync(request);

        return CreatedAtAction(
            nameof(GetById),
            new
            {
                id = company.Id
            },
            company);
    }

    // =========================================================
    // 4. CẬP NHẬT DOANH NGHIỆP
    // PUT /api/Companies/{id}
    // =========================================================
    [HttpPut("{id:guid}")]
    [HasPermission("COMPANY_MANAGE")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateCompanyRequest request)
    {
        var company =
            await _companyService.UpdateAsync(
                id,
                request);

        if (company == null)
        {
            return NotFound(new
            {
                message = "Không tìm thấy doanh nghiệp."
            });
        }

        return Ok(company);
    }

    // =========================================================
    // 5. NGỪNG HOẠT ĐỘNG DOANH NGHIỆP
    // DELETE /api/Companies/{id}
    // =========================================================
    [HttpDelete("{id:guid}")]
    [HasPermission("COMPANY_MANAGE")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success =
            await _companyService.DeleteAsync(id);

        if (!success)
        {
            return NotFound(new
            {
                message = "Không tìm thấy doanh nghiệp."
            });
        }

        return Ok(new
        {
            message = "Đã ngừng hoạt động doanh nghiệp."
        });
    }
}