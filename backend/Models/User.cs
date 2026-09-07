namespace InternshipManagement.Api.Models;

public class User
{
    public Guid Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;

    public Guid? CompanyId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Company? Company { get; set; }

    public StudentProfile? StudentProfile { get; set; }

    public ICollection<Assignment> MentorAssignments { get; set; }
        = new List<Assignment>();

    public ICollection<Assignment> CreatedAssignments { get; set; }
        = new List<Assignment>();

    public ICollection<Notification> Notifications { get; set; }
        = new List<Notification>();
}