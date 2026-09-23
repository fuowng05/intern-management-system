import api from "../api/axios";

import type {
  CompanyResponse,
  CreateCompanyRequest,
  UpdateCompanyRequest,
} from "../types/company";

const companyService = {
  async getAll(): Promise<CompanyResponse[]> {
    const response =
      await api.get<CompanyResponse[]>(
        "/Companies"
      );

    return response.data;
  },

  async getById(
    id: string
  ): Promise<CompanyResponse> {
    const response =
      await api.get<CompanyResponse>(
        `/Companies/${id}`
      );

    return response.data;
  },

  async create(
    request: CreateCompanyRequest
  ): Promise<CompanyResponse> {
    const response =
      await api.post<CompanyResponse>(
        "/Companies",
        request
      );

    return response.data;
  },

  async update(
    id: string,
    request: UpdateCompanyRequest
  ): Promise<CompanyResponse> {
    const response =
      await api.put<CompanyResponse>(
        `/Companies/${id}`,
        request
      );

    return response.data;
  },

  async deactivate(id: string): Promise<void> {
    await api.delete(`/Companies/${id}`);
  },
};

export default companyService;