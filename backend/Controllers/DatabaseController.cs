using InternshipManagement.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InternshipManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DatabaseController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DatabaseController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("test")]
    public async Task<IActionResult> TestConnection()
    {
        var canConnect = await _context.Database.CanConnectAsync();

        return Ok(new
        {
            connected = canConnect,
            database = _context.Database.GetDbConnection().Database
        });
    }
}
