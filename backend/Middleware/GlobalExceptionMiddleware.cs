using System.Text.Json;
using InternshipManagement.Api.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace InternshipManagement.Api.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (EvaluationConflictException ex)
        {
            await WriteErrorAsync(
                context,
                StatusCodes.Status409Conflict,
                ex.Code,
                ex.Message);
        }
        catch (ConcurrencyConflictException ex)
        {
            await WriteErrorAsync(
                context,
                StatusCodes.Status409Conflict,
                "EVAL_CONCURRENT_UPDATE",
                ex.Message);
        }
        catch (DbUpdateConcurrencyException ex)
        {
            _logger.LogWarning(
                ex,
                "Database concurrency conflict.");

            await WriteErrorAsync(
                context,
                StatusCodes.Status409Conflict,
                "EVAL_CONCURRENT_UPDATE",
                "Dữ liệu đã được thay đổi bởi một yêu cầu khác. Hãy tải lại dữ liệu.");
        }
        catch (ForbiddenException ex)
        {
            await WriteErrorAsync(
                context,
                StatusCodes.Status403Forbidden,
                "FORBIDDEN",
                ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            await WriteErrorAsync(
                context,
                StatusCodes.Status400BadRequest,
                "BUSINESS_RULE_VIOLATION",
                ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Unhandled exception.");

            await WriteErrorAsync(
                context,
                StatusCodes.Status500InternalServerError,
                "INTERNAL_SERVER_ERROR",
                "Đã xảy ra lỗi hệ thống.");
        }
    }

    private static async Task WriteErrorAsync(
        HttpContext context,
        int statusCode,
        string code,
        string message)
    {
        if (context.Response.HasStarted)
        {
            return;
        }

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        var response = new
        {
            status = statusCode,
            code,
            message,
            traceId = context.TraceIdentifier
        };

        await context.Response.WriteAsync(
            JsonSerializer.Serialize(response));
    }
}