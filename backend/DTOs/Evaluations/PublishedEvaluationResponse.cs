using System.Text.Json;

namespace InternshipManagement.Api.DTOs.Evaluations;

public class PublishedEvaluationResponse
{
    public Guid EvaluationId { get; set; }

    public int Version { get; set; }

    public decimal TotalScore { get; set; }

    public string Classification { get; set; } = string.Empty;

    public string Result { get; set; } = string.Empty;

    public DateTime PublishedAt { get; set; }

    public JsonElement Snapshot { get; set; }
}