namespace InternshipManagement.Api.DTOs.Assignments;

public class AssignmentResponse
{
    public Guid Id { get; set; }

    public Guid ApplicationId { get; set; }

    public Guid StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string StudentEmail { get; set; } = string.Empty;

    public Guid CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;

    public Guid MentorId { get; set; }
    public string MentorName { get; set; } = string.Empty;
    public string MentorEmail { get; set; } = string.Empty;

    public Guid AssignedBy { get; set; }
    public string AssignedByName { get; set; } = string.Empty;

    public DateTime AssignedAt { get; set; }
}