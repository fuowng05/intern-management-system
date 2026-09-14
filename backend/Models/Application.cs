namespace InternshipManagement.Api.Models;

public class Application
{
    public Guid Id { get; set; }

    public Guid StudentId { get; set; }

    public Guid PeriodId { get; set; }

    public Guid CompanyId { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public StudentProfile Student { get; set; } = null!;

    public InternshipPeriod Period { get; set; } = null!;

    public Company Company { get; set; } = null!;
}
