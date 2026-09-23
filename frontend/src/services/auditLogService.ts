import api from "../api/axios";

import type {
  AuditLogResponse,
} from "../types/auditLog";

const auditLogService = {
  async getAll(): Promise<
    AuditLogResponse[]
  > {
    const response = await api.get<
      AuditLogResponse[]
    >("/AuditLogs");

    return response.data;
  },

  async getById(
    id: string
  ): Promise<AuditLogResponse> {
    const response =
      await api.get<AuditLogResponse>(
        `/AuditLogs/${id}`
      );

    return response.data;
  },

  async getByEntity(
    entityType: string,
    entityId: string
  ): Promise<AuditLogResponse[]> {
    const response = await api.get<
      AuditLogResponse[]
    >(
      `/AuditLogs/entity/${encodeURIComponent(
        entityType
      )}/${entityId}`
    );

    return response.data;
  },
};

export default auditLogService;