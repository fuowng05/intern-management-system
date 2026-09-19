using System.ComponentModel.DataAnnotations;

namespace InternshipManagement.Api.DTOs.Evaluations;

public class UpdateMentorCommentRequest
{
    [MaxLength(2000)]
    public string? MentorComment { get; set; }

    [Required]
    public long RowVersion { get; set; }
}