using InternshipManagement.Api.DTOs.AuditLogs;

namespace InternshipManagement.Api.Services;

public interface IAuditLogService
{
    Task<List<AuditLogResponse>> GetAllAsync();

    Task<AuditLogResponse?> GetByIdAsync(Guid id);

    Task<List<AuditLogResponse>> GetByEntityAsync(
        string entityType,
        Guid entityId);
}