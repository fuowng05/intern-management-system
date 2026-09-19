namespace InternshipManagement.Api.Models;

public class CriteriaTemplateItem
{
    public Guid Id { get; set; }

    public Guid TemplateId { get; set; }

    public string Name { get; set; } = string.Empty;

    public decimal DefaultWeight { get; set; }

    public bool IsMandatory { get; set; }

    public decimal? MinPassScore { get; set; }

    public int DisplayOrder { get; set; }

    public CriteriaTemplate Template { get; set; } = null!;
}