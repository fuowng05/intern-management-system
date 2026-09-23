import api from "../api/axios";

import type {
  AddCriteriaTemplateItemRequest,
  CreateCriteriaTemplateRequest,
  CriteriaTemplateResponse,
} from "../types/criteriaTemplate";

const criteriaTemplateService = {
  async getAll(): Promise<CriteriaTemplateResponse[]> {
    const response =
      await api.get<CriteriaTemplateResponse[]>(
        "/CriteriaTemplates"
      );

    return response.data;
  },

  async getById(
    id: string
  ): Promise<CriteriaTemplateResponse> {
    const response =
      await api.get<CriteriaTemplateResponse>(
        `/CriteriaTemplates/${id}`
      );

    return response.data;
  },

  async create(
    request: CreateCriteriaTemplateRequest
  ): Promise<CriteriaTemplateResponse> {
    const response =
      await api.post<CriteriaTemplateResponse>(
        "/CriteriaTemplates",
        request
      );

    return response.data;
  },

  async addItem(
    templateId: string,
    request: AddCriteriaTemplateItemRequest
  ): Promise<CriteriaTemplateResponse> {
    const response =
      await api.post<CriteriaTemplateResponse>(
        `/CriteriaTemplates/${templateId}/items`,
        request
      );

    return response.data;
  },

  async deleteItem(
    templateId: string,
    itemId: string
  ): Promise<void> {
    await api.delete(
      `/CriteriaTemplates/${templateId}/items/${itemId}`
    );
  },

  async issue(
    templateId: string
  ): Promise<CriteriaTemplateResponse> {
    const response =
      await api.put<CriteriaTemplateResponse>(
        `/CriteriaTemplates/${templateId}/issue`
      );

    return response.data;
  },
};

export default criteriaTemplateService;