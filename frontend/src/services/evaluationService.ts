import api from "../api/axios";

import type {
  EvaluationResponse,
  UpdateCriterionRequest,
  UpdateMentorCommentRequest,
  PublishedEvaluationResponse,

} from "../types/evaluation";

const evaluationService = {
  async getMy(): Promise<EvaluationResponse[]> {
    const response =
      await api.get<EvaluationResponse[]>("/Evaluations/my");

    return response.data;
  },

  async getById(
    id: string
  ): Promise<EvaluationResponse> {
    const response =
      await api.get<EvaluationResponse>(
        `/Evaluations/${id}`
      );

    return response.data;
  },

  async updateCriterion(
    evaluationId: string,
    criterionId: string,
    request: UpdateCriterionRequest
  ): Promise<EvaluationResponse> {
    const response =
      await api.put<EvaluationResponse>(
        `/Evaluations/${evaluationId}/criteria/${criterionId}`,
        request
      );

    return response.data;
  },

  async updateComment(
    evaluationId: string,
    request: UpdateMentorCommentRequest
  ): Promise<EvaluationResponse> {
    const response =
      await api.put<EvaluationResponse>(
        `/Evaluations/${evaluationId}/comment`,
        request
      );

    return response.data;
  },

  async submit(
    evaluationId: string,
    rowVersion: number
  ): Promise<EvaluationResponse> {
    const response =
      await api.put<EvaluationResponse>(
        `/Evaluations/${evaluationId}/submit`,
        null,
        {
          params: { rowVersion },
        }
      );

    return response.data;
  },
  async getSubmitted(): Promise<EvaluationResponse[]> {
    const response =
      await api.get<EvaluationResponse[]>(
        "/Evaluations/submitted"
      );
  
    return response.data;
  },
  
  async returnEvaluation(
    evaluationId: string,
    reason: string,
    rowVersion: number
  ): Promise<EvaluationResponse> {
    const response =
      await api.put<EvaluationResponse>(
        `/Evaluations/${evaluationId}/return`,
        {
          reason,
          rowVersion,
        }
      );
  
    return response.data;
  },
  
  async publish(
    evaluationId: string,
    rowVersion: number
  ): Promise<EvaluationResponse> {
    const response =
      await api.put<EvaluationResponse>(
        `/Evaluations/${evaluationId}/publish`,
        {
          rowVersion,
        }
      );
  
    return response.data;
  },

  async getMyPublishedResults(): Promise<
    PublishedEvaluationResponse[]
  > {
    const response =
      await api.get<PublishedEvaluationResponse[]>(
        "/Evaluations/student/my-results"
      );

    return response.data;
  },

  async getMyPublishedResult(
    evaluationId: string
  ): Promise<PublishedEvaluationResponse> {
    const response =
      await api.get<PublishedEvaluationResponse>(
        `/Evaluations/student/my-results/${evaluationId}`
      );

  return response.data;
},
};


export default evaluationService;

