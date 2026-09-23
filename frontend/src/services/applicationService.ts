import api from "../api/axios";

import type {
  ApplicationResponse,
  CreateApplicationRequest,
  DecideApplicationRequest,
} from "../types/application";

const applicationService = {
  // =========================
  // ADMIN
  // =========================

  async getAll(): Promise<ApplicationResponse[]> {
    const response =
      await api.get<ApplicationResponse[]>("/Applications");

    return response.data;
  },

  async getById(
    id: string
  ): Promise<ApplicationResponse> {
    const response =
      await api.get<ApplicationResponse>(
        `/Applications/${id}`
      );

    return response.data;
  },

  async decide(
    id: string,
    decision: DecideApplicationRequest["decision"]
  ): Promise<ApplicationResponse> {
    const request: DecideApplicationRequest = {
      decision,
    };

    const response =
      await api.put<ApplicationResponse>(
        `/Applications/${id}/decision`,
        request
      );

    return response.data;
  },

  // =========================
  // STUDENT
  // =========================

  async getMyApplications(): Promise<
    ApplicationResponse[]
  > {
    const response =
      await api.get<ApplicationResponse[]>(
        "/Applications/my"
      );

    return response.data;
  },

  async create(
    request: CreateApplicationRequest
  ): Promise<ApplicationResponse> {
    const response =
      await api.post<ApplicationResponse>(
        "/Applications",
        request
      );

    return response.data;
  },
};

export default applicationService;