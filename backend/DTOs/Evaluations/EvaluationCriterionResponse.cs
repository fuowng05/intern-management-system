namespace InternshipManagement.Api.DTOs.Evaluations;

public class EvaluationCriterionResponse
{
    public Guid Id { get; set; }

    public Guid? SourceItemId { get; set; }

    public string Name { get; set; } = string.Empty;

    public decimal Weight { get; set; }

    public decimal? Score { get; set; }

    public bool IsMandatory { get; set; }

    public decimal? MinPassScore { get; set; }

    public string? Comment { get; set; }

    public int DisplayOrder { get; set; }
}