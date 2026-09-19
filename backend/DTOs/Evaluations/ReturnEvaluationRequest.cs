using System.ComponentModel.DataAnnotations;

namespace InternshipManagement.Api.DTOs.Evaluations;

public class ReturnEvaluationRequest
{
    [Required]
    [MaxLength(500)]
    public string Reason { get; set; } = string.Empty;

    [Required]
    public long RowVersion { get; set; }
}