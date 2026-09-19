namespace InternshipManagement.Api.DTOs.Applications;

public class ApplicationResponse
{
    public Guid Id { get; set; }

    public Guid StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string StudentEmail { get; set; } = string.Empty;

    public Guid PeriodId { get; set; }
    public string PeriodCode { get; set; } = string.Empty;
    public string PeriodName { get; set; } = string.Empty;

    public Guid CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public Guid? DecidedBy { get; set; }
    public DateTime? DecidedAt { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}