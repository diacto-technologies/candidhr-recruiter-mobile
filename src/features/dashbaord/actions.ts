import { ANALYTICS_ACTION_TYPES } from "./constants";

export const getAnalyticsRequestAction = (jobId?: string) => ({
  type: ANALYTICS_ACTION_TYPES.GET_ANALYTICS_REQUEST,
  payload: { jobId },
});

export const clearAnalyticsAction = () => ({
  type: ANALYTICS_ACTION_TYPES.CLEAR_ANALYTICS,
});

export const getWeeklyGraphRequestAction = () => ({
  type: ANALYTICS_ACTION_TYPES.GET_WEEKLY_GRAPH_REQUEST,
});

export const getStageGraphRequestAction = (jobId?: string) => ({
  type: ANALYTICS_ACTION_TYPES.GET_STAGE_GRAPH_REQUEST,
  payload: { jobId },
});

export const getFeatureConsumptionRequestAction = (jobId?: string) => ({
  type: ANALYTICS_ACTION_TYPES.GET_FEATURE_CONSUMPTION_REQUEST,
  payload: { jobId },
});

export const getStageGraphOverviewRequestAction = (jobId?: string) => ({
  type: ANALYTICS_ACTION_TYPES.GET_STAGE_GRAPH_OVERVIEW_REQUEST,
  payload: { jobId },
});