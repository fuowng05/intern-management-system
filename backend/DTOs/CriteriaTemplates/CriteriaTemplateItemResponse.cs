namespace InternshipManagement.Api.DTOs.CriteriaTemplates;

public class CriteriaTemplateItemResponse
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public decimal DefaultWeight { get; set; }

    public bool IsMandatory { get; set; }

    public decimal? MinPassScore { get; set; }

    public int DisplayOrder { get; set; }
}