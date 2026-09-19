namespace InternshipManagement.Api.Models;

public class EvaluationCriterion
{
    public Guid Id { get; set; }

    public Guid EvaluationId { get; set; }

    // Nếu null => tiêu chí do Mentor tự thêm
    public Guid? SourceItemId { get; set; }

    public string Name { get; set; } = string.Empty;

    public decimal Weight { get; set; }

    public decimal? Score { get; set; }

    public bool IsMandatory { get; set; }

    public decimal? MinPassScore { get; set; }

    public string? Comment { get; set; }

    public int DisplayOrder { get; set; }

    public Evaluation Evaluation { get; set; } = null!;

    public CriteriaTemplateItem? SourceItem { get; set; }
}