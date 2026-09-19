using System.ComponentModel.DataAnnotations;

namespace InternshipManagement.Api.DTOs.CriteriaTemplates;

public class CreateCriteriaTemplateRequest
{
    [Required]
    public Guid PeriodId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    public int MinItems { get; set; } = 3;

    public int MaxItems { get; set; } = 8;

    public bool AllowWeightEdit { get; set; } = true;
}