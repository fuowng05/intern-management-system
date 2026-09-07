namespace InternshipManagement.Api.Models;

public class Evaluation
{
    public Guid Id { get; set; }

    public Guid ApplicationId { get; set; }

    public decimal TotalScore { get; set; }

    public string FinalStatus { get; set; } = "IN_PROGRESS";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Application Application { get; set; } = null!;

    public ICollection<EvaluationCriterion> Criteria { get; set; }
        = new List<EvaluationCriterion>();
}