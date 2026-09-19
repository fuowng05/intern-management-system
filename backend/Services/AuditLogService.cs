using InternshipManagement.Api.Data;
using InternshipManagement.Api.DTOs.AuditLogs;
using Microsoft.EntityFrameworkCore;

namespace InternshipManagement.Api.Services;

public class AuditLogService : IAuditLogService
{
    private readonly ApplicationDbContext _context;

    public AuditLogService(
        ApplicationDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // GET ALL
    // =========================================================
    public async Task<List<AuditLogResponse>> GetAllAsync()
    {
        return await _context.AuditLogs
            .AsNoTracking()
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new AuditLogResponse
            {
                Id = a.Id,

                ActorUserId = a.ActorUserId,

                ActorName =
                    a.ActorUser != null
                        ? a.ActorUser.FullName
                        : null,

                ActorEmail =
                    a.ActorUser != null
                        ? a.ActorUser.Email
                        : null,

                Action = a.Action,

                EntityType = a.EntityType,

                EntityId = a.EntityId,

                OldStatus = a.OldStatus,

                NewStatus = a.NewStatus,

                Reason = a.Reason,

                CorrelationId = a.CorrelationId,

                CreatedAt = a.CreatedAt
            })
            .ToListAsync();
    }

    // =========================================================
    // GET BY ID
    // =========================================================
    public async Task<AuditLogResponse?> GetByIdAsync(
        Guid id)
    {
        return await _context.AuditLogs
            .AsNoTracking()
            .Where(a => a.Id == id)
            .Select(a => new AuditLogResponse
            {
                Id = a.Id,

                ActorUserId = a.ActorUserId,

                ActorName =
                    a.ActorUser != null
                        ? a.ActorUser.FullName
                        : null,

                ActorEmail =
                    a.ActorUser != null
                        ? a.ActorUser.Email
                        : null,

                Action = a.Action,

                EntityType = a.EntityType,

                EntityId = a.EntityId,

                OldStatus = a.OldStatus,

                NewStatus = a.NewStatus,

                Reason = a.Reason,

                CorrelationId = a.CorrelationId,

                CreatedAt = a.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    // =========================================================
    // GET HISTORY OF ENTITY
    // =========================================================
    public async Task<List<AuditLogResponse>> GetByEntityAsync(
        string entityType,
        Guid entityId)
    {
        var normalizedEntityType =
            entityType.Trim();

        return await _context.AuditLogs
            .AsNoTracking()
            .Where(a =>
                a.EntityType == normalizedEntityType &&
                a.EntityId == entityId)
            .OrderBy(a => a.CreatedAt)
            .Select(a => new AuditLogResponse
            {
                Id = a.Id,

                ActorUserId = a.ActorUserId,

                ActorName =
                    a.ActorUser != null
                        ? a.ActorUser.FullName
                        : null,

                ActorEmail =
                    a.ActorUser != null
                        ? a.ActorUser.Email
                        : null,

                Action = a.Action,

                EntityType = a.EntityType,

                EntityId = a.EntityId,

                OldStatus = a.OldStatus,

                NewStatus = a.NewStatus,

                Reason = a.Reason,

                CorrelationId = a.CorrelationId,

                CreatedAt = a.CreatedAt
            })
            .ToListAsync();
    }
}