using System.ComponentModel.DataAnnotations;

namespace InternshipManagement.Api.DTOs.CriteriaTemplates;

public class AddCriteriaTemplateItemRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Range(0.01, 100)]
    public decimal DefaultWeight { get; set; }

    public bool IsMandatory { get; set; } = true;

    [Range(0, 10)]
    public decimal? MinPassScore { get; set; }

    public int DisplayOrder { get; set; }
}