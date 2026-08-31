namespace InternshipManagement.Api.Models;

public class EvaluationCriterion
{
    public Guid Id { get; set; }

    public Guid EvaluationId { get; set; }

    public string Name { get; set; } = string.Empty;

    public decimal Weight { get; set; }

    public decimal? Score { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Evaluation Evaluation { get; set; } = null!;
}