namespace InternshipManagement.Api.Models;

public class Evaluation
{
    public Guid Id { get; set; }

    public Guid ApplicationId { get; set; }

    public Guid? TemplateId { get; set; }

    public Guid MentorId { get; set; }

    public Guid? ReviewerId { get; set; }

    public string Status { get; set; } = "DRAFT";

    public decimal WeightTotal { get; set; } = 0m;

    public decimal? TotalScore { get; set; }

    public string? Classification { get; set; }

    public string? Result { get; set; }

    public string? MentorComment { get; set; }

    public string? ReturnReason { get; set; }

    public int Version { get; set; } = 1;

    public long RowVersion { get; set; } = 0;

    public DateTime? SubmittedAt { get; set; }

    public DateTime? ReviewedAt { get; set; }

    public DateTime? PublishedAt { get; set; }

    public Application Application { get; set; } = null!;

    public CriteriaTemplate? Template { get; set; }

    public User Mentor { get; set; } = null!;

    public User? Reviewer { get; set; }

    public ICollection<EvaluationCriterion> Criteria { get; set; }
        = new List<EvaluationCriterion>();

    public ICollection<EvaluationPublication> Publications { get; set; }
        = new List<EvaluationPublication>();
}