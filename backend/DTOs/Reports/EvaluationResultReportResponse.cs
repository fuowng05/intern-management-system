namespace InternshipManagement.Api.DTOs.Reports;

public class EvaluationResultReportResponse
{
    public Guid EvaluationId { get; set; }

    public string StudentCode { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;

    public string CompanyName { get; set; } = string.Empty;

    public string PeriodCode { get; set; } = string.Empty;
    public string PeriodName { get; set; } = string.Empty;

    public string MentorName { get; set; } = string.Empty;

    public decimal TotalScore { get; set; }
    public string Classification { get; set; } = string.Empty;
    public string Result { get; set; } = string.Empty;

    public DateTime? PublishedAt { get; set; }
}