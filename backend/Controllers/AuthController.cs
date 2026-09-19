using InternshipManagement.Api.DTOs.Auth;
using InternshipManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InternshipManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(
        IAuthService authService)
    {
        _authService = authService;
    }

    // =========================================================
    // REGISTER
    // =========================================================
    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterRequest request)
    {
        var result =
            await _authService.RegisterAsync(
                request);

        if (!result)
        {
            return BadRequest(new
            {
                message =
                    "Email hoặc mã sinh viên đã tồn tại."
            });
        }

        return Ok(new
        {
            message =
                "Đăng ký thành công."
        });
    }

    // =========================================================
    // LOGIN
    // =========================================================
    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginRequest request)
    {
        var result =
            await _authService.LoginAsync(
                request);

        if (result == null)
        {
            return Unauthorized(new
            {
                message =
                    "Email hoặc mật khẩu không đúng."
            });
        }

        return Ok(new
        {
            message =
                "Đăng nhập thành công.",

            accessToken =
                result.AccessToken,

            refreshToken =
                result.RefreshToken,

            refreshTokenExpiresAt =
                result.RefreshTokenExpiresAt
        });
    }

    // =========================================================
    // REFRESH TOKEN
    // =========================================================
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(
        [FromBody] RefreshTokenRequest request)
    {
        var result =
            await _authService.RefreshAsync(
                request.RefreshToken);

        if (result == null)
        {
            return Unauthorized(new
            {
                message =
                    "Refresh token không hợp lệ hoặc đã hết hạn."
            });
        }

        return Ok(new
        {
            message =
                "Làm mới token thành công.",

            accessToken =
                result.AccessToken,

            refreshToken =
                result.RefreshToken,

            refreshTokenExpiresAt =
                result.RefreshTokenExpiresAt
        });
    }

    // =========================================================
    // LOGOUT
    // =========================================================
    [HttpPost("logout")]
    public async Task<IActionResult> Logout(
        [FromBody] RefreshTokenRequest request)
    {
        var result =
            await _authService.LogoutAsync(
                request.RefreshToken);

        if (!result)
        {
            return BadRequest(new
            {
                message =
                    "Refresh token không hợp lệ."
            });
        }

        return Ok(new
        {
            message =
                "Đăng xuất thành công."
        });
    }

    // =========================================================
    // CURRENT USER
    // =========================================================
    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        return Ok(new
        {
            userId =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub"),

            email =
                User.FindFirstValue(
                    ClaimTypes.Email)
                ?? User.FindFirstValue("email"),

            roles =
                User.FindAll(
                        ClaimTypes.Role)
                    .Select(c => c.Value)
                    .ToList(),

            permissions =
                User.FindAll("permission")
                    .Select(c => c.Value)
                    .ToList()
        });
    }
}