using InternshipManagement.Api.DTOs.Evaluations;

namespace InternshipManagement.Api.Services;

public interface IEvaluationService
{
    // =========================================================
    // 1. CREATE EVALUATION
    // Mentor tạo Evaluation từ Application + Criteria Template
    // =========================================================


    // =========================================================
    // 2. GET EVALUATION BY ID
    // =========================================================
    Task<EvaluationResponse?> GetByIdAsync(
        Guid id);


    // =========================================================
    // 3. GET MY EVALUATIONS
    // Mentor xem danh sách Evaluation của mình
    // =========================================================
    Task<List<EvaluationResponse>> GetMyEvaluationsAsync(
        Guid mentorId);


    // =========================================================
    // 4. UPDATE CRITERION
    // Mentor chấm hoặc sửa điểm một tiêu chí
    // =========================================================
    Task<EvaluationResponse?> UpdateCriterionAsync(
        Guid evaluationId,
        Guid criterionId,
        Guid mentorId,
        UpdateEvaluationCriterionRequest request);


    // =========================================================
    // 5. UPDATE MENTOR COMMENT
    // Mentor cập nhật nhận xét chung
    // =========================================================
    Task<EvaluationResponse?> UpdateMentorCommentAsync(
        Guid evaluationId,
        Guid mentorId,
        UpdateMentorCommentRequest request);


    // =========================================================
    // 6. SUBMIT / RESUBMIT
    //
    // DRAFT    -> SUBMITTED
    // RETURNED -> SUBMITTED
    // =========================================================
    Task<EvaluationResponse?> SubmitAsync(
        Guid evaluationId,
        Guid mentorId,
        long rowVersion);


    // =========================================================
    // 7. GET SUBMITTED
    // Reviewer xem danh sách Evaluation đang chờ duyệt
    // =========================================================
    Task<List<EvaluationResponse>> GetSubmittedAsync();


    // =========================================================
    // 8. RETURN EVALUATION
    //
    // SUBMITTED -> RETURNED
    // =========================================================
    Task<EvaluationResponse?> ReturnAsync(
        Guid evaluationId,
        Guid reviewerId,
        ReturnEvaluationRequest request);


    // =========================================================
    // 9. PUBLISH EVALUATION
    //
    // SUBMITTED -> PUBLISHED
    //
    // Đồng thời tạo:
    // - EvaluationPublication
    // - SnapshotJson
    // - AuditLog
    // =========================================================
    Task<EvaluationResponse?> PublishAsync(
        Guid evaluationId,
        Guid reviewerId,
        PublishEvaluationRequest request);


    // =========================================================
    // 10. STUDENT - GET MY PUBLISHED RESULTS
    //
    // Student chỉ xem kết quả đã PUBLISHED của chính mình
    // =========================================================
    Task<List<PublishedEvaluationResponse>>
        GetMyPublishedResultsAsync(
            Guid studentId);


    // =========================================================
    // 11. STUDENT - GET PUBLISHED RESULT BY EVALUATION ID
    //
    // Student chỉ xem Evaluation thuộc chính mình
    // =========================================================
    Task<PublishedEvaluationResponse?>
        GetMyPublishedResultByIdAsync(
            Guid evaluationId,
            Guid studentId);
}