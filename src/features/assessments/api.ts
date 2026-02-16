import { apiClient } from "../../api/client";
import { API_ENDPOINTS } from "../../api/endpoints";
import { AssessmentListResponse } from "./types";

export const assessmentsApi = {
  getAssessments: async (
    page: number = 1
  ): Promise<AssessmentListResponse> => {
    const url = `${API_ENDPOINTS.ASSESSMENTS.LIST}?page=${page}`;

    const res = await apiClient.get(url);
    return res?.data ?? res;
  },
};
