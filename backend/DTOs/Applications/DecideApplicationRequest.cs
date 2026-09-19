using System.ComponentModel.DataAnnotations;

namespace InternshipManagement.Api.DTOs.Applications;

public class DecideApplicationRequest
{
    [Required]
    public string Decision { get; set; } = string.Empty;
}