using InternshipManagement.Api.Authorization;
using InternshipManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternshipManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _service;

    public UsersController(IUserService service)
    {
        _service = service;
    }

    // =========================================================
    // ADMIN LẤY DANH SÁCH MENTOR
    //
    // GET /api/Users/mentors
    // GET /api/Users/mentors?companyId={guid}
    // =========================================================
    [HttpGet("mentors")]
    [HasPermission("ASSIGNMENT_CREATE")]
    public async Task<IActionResult> GetMentors(
        [FromQuery] Guid? companyId)
    {
        var mentors =
            await _service.GetMentorsAsync(companyId);

        return Ok(mentors);
    }
}