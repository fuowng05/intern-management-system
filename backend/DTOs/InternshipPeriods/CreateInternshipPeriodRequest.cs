using System.ComponentModel.DataAnnotations;

namespace InternshipManagement.Api.DTOs.InternshipPeriods;

public class CreateInternshipPeriodRequest
{
    [Required]
    [MaxLength(50)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }
}