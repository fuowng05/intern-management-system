namespace InternshipManagement.Api.Models;

public class InternshipPeriod
{
    public Guid Id { get; set; }

    public string Code { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public string Status { get; set; } = "OPEN";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Application> Applications { get; set; }
        = new List<Application>();
}