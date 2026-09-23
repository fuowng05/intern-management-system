export interface AuditLogResponse {
    id: string;
  
    actorUserId: string | null;
    actorName: string | null;
    actorEmail: string | null;
  
    action: string;
  
    entityType: string;
    entityId: string;
  
    oldStatus: string | null;
    newStatus: string | null;
  
    reason: string | null;
  
    correlationId: string;
  
    createdAt: string;
  }