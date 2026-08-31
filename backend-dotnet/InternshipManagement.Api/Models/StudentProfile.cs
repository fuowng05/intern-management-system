namespace InternshipManagement.Api.Models;

public class StudentProfile
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string? StudentCode { get; set; }

    public string? Major { get; set; }

    public string? Phone { get; set; }

    public User User { get; set; } = null!;

    public ICollection<Application> Applications { get; set; }
        = new List<Application>();
}