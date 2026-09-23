import api from "../api/axios";

import type {
  EvaluationResultReportResponse,
} from "../types/report";

const reportService = {
  async getEvaluationResults(): Promise<
    EvaluationResultReportResponse[]
  > {
    const response = await api.get<
      EvaluationResultReportResponse[]
    >("/Reports/evaluation-results");

    return response.data;
  },
};

export default reportService;