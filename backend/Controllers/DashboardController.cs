using InternshipManagement.Api.Authorization;
using InternshipManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternshipManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(
        IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet]
    [HasPermission("DASHBOARD_VIEW")]
    public async Task<IActionResult> GetDashboard()
    {
        var result =
            await _dashboardService.GetDashboardAsync();

        return Ok(result);
    }
}