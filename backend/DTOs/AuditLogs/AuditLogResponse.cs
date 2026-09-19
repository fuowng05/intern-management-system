namespace InternshipManagement.Api.DTOs.AuditLogs;

public class AuditLogResponse
{
    public Guid Id { get; set; }

    public Guid? ActorUserId { get; set; }

    public string? ActorName { get; set; }

    public string? ActorEmail { get; set; }

    public string Action { get; set; } = string.Empty;

    public string EntityType { get; set; } = string.Empty;

    public Guid EntityId { get; set; }

    public string? OldStatus { get; set; }

    public string? NewStatus { get; set; }

    public string? Reason { get; set; }

    public string CorrelationId { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}