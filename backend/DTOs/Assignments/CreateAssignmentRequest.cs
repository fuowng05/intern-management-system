using System.ComponentModel.DataAnnotations;

namespace InternshipManagement.Api.DTOs.Assignments;

public class CreateAssignmentRequest
{
    [Required]
    public Guid ApplicationId { get; set; }

    [Required]
    public Guid MentorId { get; set; }
}