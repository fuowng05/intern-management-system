import api from "../api/axios";

import type {
  CreateInternshipPeriodRequest,
  InternshipPeriodResponse,
  UpdateInternshipPeriodRequest,
} from "../types/internshipPeriod";

const internshipPeriodService = {
  async getAll(): Promise<InternshipPeriodResponse[]> {
    const response =
      await api.get<InternshipPeriodResponse[]>(
        "/InternshipPeriods"
      );

    return response.data;
  },

  async getById(
    id: string
  ): Promise<InternshipPeriodResponse> {
    const response =
      await api.get<InternshipPeriodResponse>(
        `/InternshipPeriods/${id}`
      );

    return response.data;
  },

  async create(
    request: CreateInternshipPeriodRequest
  ): Promise<InternshipPeriodResponse> {
    const response =
      await api.post<InternshipPeriodResponse>(
        "/InternshipPeriods",
        request
      );

    return response.data;
  },

  async update(
    id: string,
    request: UpdateInternshipPeriodRequest
  ): Promise<InternshipPeriodResponse> {
    const response =
      await api.put<InternshipPeriodResponse>(
        `/InternshipPeriods/${id}`,
        request
      );

    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/InternshipPeriods/${id}`);
  },
};

export default internshipPeriodService;