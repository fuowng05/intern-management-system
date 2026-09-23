namespace InternshipManagement.Api.DTOs.Users;

public class MentorResponse
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public Guid? CompanyId { get; set; }

    public string? CompanyName { get; set; }
}