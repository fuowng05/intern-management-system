using System.Security.Claims;
using InternshipManagement.Api.Data;
using InternshipManagement.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InternshipManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public NotificationController(ApplicationDbContext context)
    {
        _context = context;
    }

    // =========================
    // GET MY NOTIFICATIONS
    // =========================

    [HttpGet("my")]
    public async Task<IActionResult> GetMyNotifications()
    {
        var userIdString = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid token."
            });
        }

        var notifications = await _context.Notifications
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id,
                x.Title,
                x.Message,
                x.IsRead,
                x.CreatedAt
            })
            .ToListAsync();

        return Ok(new
        {
            success = true,
            data = notifications
        });
    }

    // =========================
    // GET UNREAD
    // =========================

    [HttpGet("unread")]
    public async Task<IActionResult> GetUnread()
    {
        var userIdString = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid token."
            });
        }

        var notifications = await _context.Notifications
            .Where(x =>
                x.UserId == userId &&
                !x.IsRead)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id,
                x.Title,
                x.Message,
                x.IsRead,
                x.CreatedAt
            })
            .ToListAsync();

        return Ok(new
        {
            success = true,
            count = notifications.Count,
            data = notifications
        });
    }

    // =========================
    // MARK AS READ
    // =========================

    [HttpPut("{id:guid}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var userIdString = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid token."
            });
        }

        var notification = await _context.Notifications
            .FirstOrDefaultAsync(x =>
                x.Id == id &&
                x.UserId == userId);

        if (notification == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Notification not found."
            });
        }

        notification.IsRead = true;
        notification.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Notification marked as read."
        });
    }

    // =========================
    // MARK ALL AS READ
    // =========================

    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userIdString = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid token."
            });
        }

        var notifications = await _context.Notifications
            .Where(x =>
                x.UserId == userId &&
                !x.IsRead)
            .ToListAsync();

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
            notification.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "All notifications marked as read.",
            count = notifications.Count
        });
    }

    // =========================
    // CREATE NOTIFICATION
    // =========================

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(
        CreateNotificationRequest request)
    {
        if (request.UserId == Guid.Empty)
        {
            return BadRequest(new
            {
                success = false,
                message = "UserId is required."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Title) ||
            string.IsNullOrWhiteSpace(request.Message))
        {
            return BadRequest(new
            {
                success = false,
                message = "Title and message are required."
            });
        }

        var userExists = await _context.Users
            .AnyAsync(x => x.Id == request.UserId);

        if (!userExists)
        {
            return NotFound(new
            {
                success = false,
                message = "User not found."
            });
        }

        var notification = new Notification
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            Title = request.Title.Trim(),
            Message = request.Message.Trim(),
            IsRead = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Notifications.Add(notification);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Notification created successfully.",
            data = new
            {
                notification.Id,
                notification.UserId,
                notification.Title,
                notification.Message,
                notification.IsRead,
                notification.CreatedAt
            }
        });
    }

    // =========================
    // DELETE
    // =========================

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userIdString = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid token."
            });
        }

        var notification = await _context.Notifications
            .FirstOrDefaultAsync(x =>
                x.Id == id &&
                x.UserId == userId);

        if (notification == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Notification not found."
            });
        }

        _context.Notifications.Remove(notification);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Notification deleted successfully."
        });
    }
}

public class CreateNotificationRequest
{
    public Guid UserId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;
}
