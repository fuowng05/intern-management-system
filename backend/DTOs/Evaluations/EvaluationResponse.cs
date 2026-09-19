namespace InternshipManagement.Api.DTOs.Evaluations;

public class EvaluationResponse
{
    public Guid Id { get; set; }

    public Guid ApplicationId { get; set; }

    public Guid StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;

    public Guid CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;

    public Guid? TemplateId { get; set; }
    public string? TemplateName { get; set; }

    public Guid MentorId { get; set; }
    public string MentorName { get; set; } = string.Empty;

    public Guid? ReviewerId { get; set; }

    public string Status { get; set; } = string.Empty;

    public decimal WeightTotal { get; set; }

    public decimal? TotalScore { get; set; }

    public string? Classification { get; set; }

    public string? Result { get; set; }

    public string? MentorComment { get; set; }

    public string? ReturnReason { get; set; }

    public int Version { get; set; }

    public long RowVersion { get; set; }

    public DateTime? SubmittedAt { get; set; }

    public DateTime? ReviewedAt { get; set; }

    public DateTime? PublishedAt { get; set; }

    public List<EvaluationCriterionResponse> Criteria { get; set; }
        = new();
}