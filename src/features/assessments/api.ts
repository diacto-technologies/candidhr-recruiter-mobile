import { apiClient } from "../../api/client";
import { API_ENDPOINTS } from "../../api/endpoints";
import {
  AssessmentListResponse,
  AssignedAssessmentListResponse,
  AssignedFilterParams,
} from "./types";

export const assessmentsApi = {
  getAssessments: async (
    page: number = 1
  ): Promise<AssessmentListResponse> => {
    const url = `${API_ENDPOINTS.ASSESSMENTS.LIST}?page=${page}`;

    const res = await apiClient.get(url);
    return res?.data ?? res;
  },

  getAssignedAssessments: async (
    params: AssignedFilterParams
  ): Promise<AssignedAssessmentListResponse> => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );

    const query = new URLSearchParams(cleanParams as any).toString();
    const baseUrl = API_ENDPOINTS.ASSESSMENTS.ASSIGNEDLIST;
    const url = query ? `${baseUrl}?${query}` : baseUrl;

    const res = await apiClient.get(url);
    return res?.data ?? res;
  },
};

