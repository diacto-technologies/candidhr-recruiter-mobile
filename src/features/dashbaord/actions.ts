import { ANALYTICS_ACTION_TYPES } from "./constants";

export const getAnalyticsRequestAction = () => ({
  type: ANALYTICS_ACTION_TYPES.GET_ANALYTICS_REQUEST,
});

export const clearAnalyticsAction = () => ({
  type: ANALYTICS_ACTION_TYPES.CLEAR_ANALYTICS,
});

export const getStageGraphRequestAction = () => ({
  type: ANALYTICS_ACTION_TYPES.GET_STAGE_GRAPH_REQUEST,
});

export const getFeatureConsumptionRequestAction = () => ({
  type: ANALYTICS_ACTION_TYPES.GET_FEATURE_CONSUMPTION_REQUEST,
});

export const getWeeklyGraphRequestAction = () => ({
  type: ANALYTICS_ACTION_TYPES.GET_WEEKLY_GRAPH_REQUEST,
});

export const getStageGraphOverviewRequestAction = () => ({
  type: ANALYTICS_ACTION_TYPES.GET_STAGE_GRAPH_OVERVIEW_REQUEST,
});