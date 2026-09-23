import axios from "axios";
import api from "../api/axios";

import type {
  AssignmentResponse,
  CreateAssignmentRequest,
} from "../types/assignment";

const assignmentService = {
  async getByApplication(
    applicationId: string
  ): Promise<AssignmentResponse | null> {
    try {
      const response =
        await api.get<AssignmentResponse>(
          `/Assignments/application/${applicationId}`
        );

      return response.data;
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 404
      ) {
        return null;
      }

      throw error;
    }
  },

  async create(
    request: CreateAssignmentRequest
  ): Promise<AssignmentResponse> {
    const response =
      await api.post<AssignmentResponse>(
        "/Assignments",
        request
      );

    return response.data;
  },
};

export default assignmentService;