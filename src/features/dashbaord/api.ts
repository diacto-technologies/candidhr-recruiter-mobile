import { apiClient } from "../../api/client";
import { AnalyticsDetails, ApplicantsStageGraph, ApplicantsStageGraphOverviewResponse, FeatureConsumptionResponse, WeeklyGraphResponse } from "./types";
import { API_ENDPOINTS } from "../../api/endpoints";

export const dashboardApi = {
  
  getAnalytics: async (): Promise<AnalyticsDetails> => {
    return apiClient.get(API_ENDPOINTS.DASHBOARD.ANALYTICS);
  },
  
  getApplicantsStageGraph: async (): Promise<ApplicantsStageGraph> => {
    return apiClient.get(API_ENDPOINTS.DASHBOARD.APPLICANT_STAGE_GRAPH);
  },
  
  getFeatureConsumption: async (): Promise<FeatureConsumptionResponse> => {
    return apiClient.get(API_ENDPOINTS.DASHBOARD.FEATURE_CONSUMPTION);
  },
  
  getWeeklyGraph: async (): Promise<WeeklyGraphResponse> =>
    apiClient.get(API_ENDPOINTS.DASHBOARD.WEEKLY_GRAPH),

  getApplicantsStageGraphOverview: async (): Promise<ApplicantsStageGraphOverviewResponse> => {
    return apiClient.get(API_ENDPOINTS.DASHBOARD.APPLICANT_STAGE_GRAPH_OVERVIEW);
},
};
