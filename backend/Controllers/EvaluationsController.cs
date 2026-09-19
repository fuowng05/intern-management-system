using System.Security.Claims;
using InternshipManagement.Api.DTOs.Evaluations;
using InternshipManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InternshipManagement.Api.Authorization;

namespace InternshipManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EvaluationsController : ControllerBase
{
    private readonly IEvaluationService _service;

    public EvaluationsController(
        IEvaluationService service)
    {
        _service = service;
    }


    // Mentor xem Evaluation của mình
// Mentor xem Evaluation của mình
    [HttpGet("my")]
    [HasPermission("EVALUATION_VIEW_SELF")]
    public async Task<IActionResult> GetMy()
    {
        var mentorId = GetCurrentUserId();

        if (mentorId == null)
        {
            return Unauthorized();
        }

        return Ok(
            await _service.GetMyEvaluationsAsync(
                mentorId.Value));
    }

    // Tạm cho Admin/Mentor xem chi tiết.
    // Sau này thêm Student + Reviewer theo trạng thái.
   [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> GetById(Guid id)
    {
        var evaluation = await _service.GetByIdAsync(id);

        if (evaluation == null)
        {
            return NotFound(new
            {
                message = "Không tìm thấy Evaluation."
            });
        }

        var currentUserId = GetCurrentUserId();

        if (currentUserId == null)
        {
            return Unauthorized();
        }

        var hasViewAll = User.Claims.Any(c =>
            c.Type == "permission" &&
            c.Value.Equals(
                "EVALUATION_VIEW_ALL",
                StringComparison.OrdinalIgnoreCase));

        var hasViewSelf = User.Claims.Any(c =>
            c.Type == "permission" &&
            c.Value.Equals(
                "EVALUATION_VIEW_SELF",
                StringComparison.OrdinalIgnoreCase));

        if (hasViewAll)
        {
            return Ok(evaluation);
        }

        if (hasViewSelf &&
            evaluation.MentorId == currentUserId.Value)
        {
            return Ok(evaluation);
        }

        return Forbid();
    }
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
    // Mentor chấm/sửa một tiêu chí
    [HttpPut("{evaluationId:guid}/criteria/{criterionId:guid}")]
    [HasPermission("EVALUATION_SCORE")]
    public async Task<IActionResult> UpdateCriterion(
        Guid evaluationId,
        Guid criterionId,
        [FromBody] UpdateEvaluationCriterionRequest request)
        {
        var mentorId = GetCurrentUserId();

        if (mentorId == null)
            return Unauthorized();

        var evaluation =
            await _service.UpdateCriterionAsync(
                evaluationId,
                criterionId,
                mentorId.Value,
                request);

        if (evaluation == null)
        {
            return NotFound(new
            {
                message = "Không tìm thấy Evaluation."
            });
        }

        return Ok(evaluation);
    }


    // Mentor cập nhật nhận xét chung
    // Mentor cập nhật nhận xét
    [HttpPut("{id:guid}/comment")]
    [HasPermission("EVALUATION_SCORE")]
    public async Task<IActionResult> UpdateComment(
        Guid id,
        [FromBody] UpdateMentorCommentRequest request)
    {
        var mentorId = GetCurrentUserId();

        if (mentorId == null)
            return Unauthorized();

        var evaluation =
            await _service.UpdateMentorCommentAsync(
                id,
                mentorId.Value,
                request);

        if (evaluation == null)
        {
            return NotFound(new
            {
                message = "Không tìm thấy Evaluation."
            });
        }

        return Ok(evaluation);
    }


    // Mentor submit
    // Mentor submit
    [HttpPut("{id:guid}/submit")]
    [HasPermission("EVALUATION_SUBMIT")]
    public async Task<IActionResult> Submit(
        Guid id,
        [FromQuery] long rowVersion)
    {
        var mentorId = GetCurrentUserId();

        if (mentorId == null)
            return Unauthorized();

        var evaluation =
            await _service.SubmitAsync(
                id,
                mentorId.Value,
                rowVersion);

        if (evaluation == null)
        {
            return NotFound(new
            {
                message = "Không tìm thấy Evaluation."
            });
        }

        return Ok(evaluation);
    }

    // Reviewer xem danh sách chờ duyệt
    [HttpGet("submitted")]
    [HasPermission("EVALUATION_REVIEW")]
public async Task<IActionResult> GetSubmitted()
{
    var evaluations =
        await _service.GetSubmittedAsync();

    return Ok(evaluations);
}


    // Reviewer trả lại
   [HttpPut("{id:guid}/return")]
    [HasPermission("EVALUATION_RETURN")]
    public async Task<IActionResult> Return(
        Guid id,
        [FromBody] ReturnEvaluationRequest request)
    {
        var reviewerId = GetCurrentUserId();

        if (reviewerId == null)
        {
            return Unauthorized(new
            {
                message = "JWT không chứa UserId hợp lệ."
            });
        }

        var evaluation =
            await _service.ReturnAsync(
                id,
                reviewerId.Value,
                request);

        if (evaluation == null)
        {
            return NotFound(new
            {
                message = "Không tìm thấy Evaluation."
            });
        }

        return Ok(evaluation);
    }

    // Reviewer publish
    [HttpPut("{id:guid}/publish")]
    [HasPermission("EVALUATION_PUBLISH")]
    public async Task<IActionResult> Publish(
        Guid id,
        [FromBody] PublishEvaluationRequest request)
    {
        var reviewerId = GetCurrentUserId();

        if (reviewerId == null)
        {
            return Unauthorized(new
            {
                message = "JWT không chứa UserId hợp lệ."
            });
        }

        var evaluation =
            await _service.PublishAsync(
                id,
                reviewerId.Value,
                request);

        if (evaluation == null)
        {
            return NotFound(new
            {
                message = "Không tìm thấy Evaluation."
            });
        }

        return Ok(evaluation);
    }

    // Student xem kết quả của mình
    [HttpGet("student/my-results")]
    [HasPermission("RESULT_VIEW_SELF")]
    public async Task<IActionResult> GetMyPublishedResults()
    {
        var studentId = GetCurrentUserId();

        if (studentId == null)
        {
            return Unauthorized(new
            {
                message = "JWT không chứa UserId hợp lệ."
            });
        }

        var results =
            await _service.GetMyPublishedResultsAsync(
                studentId.Value);

        return Ok(results);
    }


    [HttpGet("student/my-results/{id:guid}")]
    [HasPermission("RESULT_VIEW_SELF")]
    public async Task<IActionResult> GetMyPublishedResult(
        Guid id)
    {
        var studentId = GetCurrentUserId();

        if (studentId == null)
        {
            return Unauthorized(new
            {
                message = "JWT không chứa UserId hợp lệ."
            });
        }

        var result =
            await _service.GetMyPublishedResultByIdAsync(
                id,
                studentId.Value);

        if (result == null)
        {
            return NotFound(new
            {
                message =
                    "Không tìm thấy kết quả đã công bố."
            });
        }

        return Ok(result);
    }
}