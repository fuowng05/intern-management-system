using System.ComponentModel.DataAnnotations;

namespace InternshipManagement.Api.DTOs.Companies;

public class CreateCompanyRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string TaxCode { get; set; } = string.Empty;

    [EmailAddress]
    [MaxLength(320)]
    public string? ContactEmail { get; set; }
}