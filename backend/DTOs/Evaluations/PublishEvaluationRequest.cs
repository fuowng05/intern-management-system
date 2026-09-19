using System.ComponentModel.DataAnnotations;

namespace InternshipManagement.Api.DTOs.Evaluations;

public class PublishEvaluationRequest
{
    [Required]
    public long RowVersion { get; set; }
}