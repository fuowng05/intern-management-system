using InternshipManagement.Api.Authorization;
using InternshipManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternshipManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(
        IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("evaluation-results")]
    [HasPermission("REPORT_VIEW")]
    public async Task<IActionResult> GetEvaluationResults()
    {
        var result =
            await _reportService.GetEvaluationResultsAsync();

        return Ok(result);
    }
}