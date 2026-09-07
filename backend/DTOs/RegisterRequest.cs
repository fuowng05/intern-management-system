namespace InternshipManagement.Api.DTOs;

public class RegisterRequest
{
    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string Role { get; set; } = "Student";

    public string? FullName { get; set; }

    public string? StudentCode { get; set; }

    public string? Major { get; set; }

    public string? Phone { get; set; }
}