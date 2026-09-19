using System.ComponentModel.DataAnnotations;

namespace InternshipManagement.Api.DTOs.Evaluations;

public class UpdateEvaluationCriterionRequest
{
    [Range(0, 10)]
    public decimal Score { get; set; }

    [MaxLength(1000)]
    public string? Comment { get; set; }

    [Required]
    public long RowVersion { get; set; }
}