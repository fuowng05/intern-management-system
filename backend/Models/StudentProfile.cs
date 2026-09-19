namespace InternshipManagement.Api.Models;

public class StudentProfile
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string StudentCode { get; set; } = string.Empty;

    public string? ClassName { get; set; }

    public string? Major { get; set; }

    public string? Cohort { get; set; }

    public User User { get; set; } = null!;
}