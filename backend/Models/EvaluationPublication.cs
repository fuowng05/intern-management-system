namespace InternshipManagement.Api.Models;

public class EvaluationPublication
{
    public Guid Id { get; set; }

    public Guid EvaluationId { get; set; }

    public int Version { get; set; }

    public string SnapshotJson { get; set; } = string.Empty;

    public decimal TotalScore { get; set; }

    public string Classification { get; set; } = string.Empty;

    public string Result { get; set; } = string.Empty;

    public Guid PublishedBy { get; set; }

    public DateTime PublishedAt { get; set; } = DateTime.UtcNow;

    public Evaluation Evaluation { get; set; } = null!;

    public User PublishedByUser { get; set; } = null!;
}