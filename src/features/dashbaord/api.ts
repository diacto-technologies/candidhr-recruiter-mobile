import { apiClient } from "../../api/client";
import { AnalyticsDetails, ApplicantsStageGraph, ApplicantsStageGraphOverviewResponse, FeatureConsumptionResponse, WeeklyGraphResponse } from "./types";
import { API_ENDPOINTS } from "../../api/endpoints";

export const dashboardApi = {

  getAnalytics: async (jobId?: string | null): Promise<AnalyticsDetails> => {
    const query = jobId ? `?job_id=${jobId}` : "";
    return apiClient.get(`${API_ENDPOINTS.DASHBOARD.ANALYTICS}${query}`);
  },
  getWeeklyGraph: async (): Promise<WeeklyGraphResponse> =>
    apiClient.get(API_ENDPOINTS.DASHBOARD.WEEKLY_GRAPH),

  getApplicantsStageGraph: async (jobId?: string | null): Promise<ApplicantsStageGraph> => {
    const query = jobId ? `?job_id=${jobId}` : "";
    return apiClient.get(`${API_ENDPOINTS.DASHBOARD.APPLICANT_STAGE_GRAPH}${query}`);
  },

  getFeatureConsumption: async (jobId?: string | null): Promise<FeatureConsumptionResponse> => {
    const query = jobId ? `?job_id=${jobId}` : "";
    return apiClient.get(`${API_ENDPOINTS.DASHBOARD.FEATURE_CONSUMPTION}${query}`);
  },

  getApplicantsStageGraphOverview: async (
    jobId?: string | null
  ): Promise<ApplicantsStageGraphOverviewResponse> => {
    const query = jobId ? `?job_id=${jobId}` : "";
    return apiClient.get(`${API_ENDPOINTS.DASHBOARD.APPLICANT_STAGE_GRAPH_OVERVIEW}${query}`);
  },

};
