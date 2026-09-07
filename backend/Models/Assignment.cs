namespace InternshipManagement.Api.Models;

public class Assignment
{
    public Guid Id { get; set; }

    public Guid ApplicationId { get; set; }

    public Guid MentorId { get; set; }

    public Guid AssignedBy { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Application Application { get; set; } = null!;

    public User Mentor { get; set; } = null!;

    public User Assigner { get; set; } = null!;
}