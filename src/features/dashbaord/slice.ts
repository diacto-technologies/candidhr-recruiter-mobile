import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AnalyticsState, AnalyticsDetails, ApplicantsStageGraph, FeatureConsumptionResponse, WeeklyGraphResponse, WeeklyGraphItem, ApplicantsStageGraphOverviewResponse } from "./types";

const initialState: AnalyticsState = {
  data: null,
  applicantStageGraph: null,
  featureConsumption: null,
  loading: false,
  error: null,
  isLoaded: false,
  stageGraphLoading: false,
  weeklyGraph: null,
  weeklyGraphLoading: false,
  stageGraphOverview: null,
  stageGraphOverviewLoading: false,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    getAnalyticsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getAnalyticsSuccess: (state, action: PayloadAction<AnalyticsDetails>) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
      state.isLoaded = true;
    },
    getAnalyticsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearAnalytics: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.isLoaded = false;
    },

    getStageGraphRequest: (state) => {
      state.stageGraphLoading = true;
      state.error = null;
    },

    getStageGraphSuccess: (state, action: PayloadAction<ApplicantsStageGraph>) => {
      state.stageGraphLoading = false;
      state.applicantStageGraph = action.payload;
    },

    getStageGraphFailure: (state, action: PayloadAction<string>) => {
      state.stageGraphLoading = false;
      state.error = action.payload;
    },

    getFeatureConsumptionRequest: (state) => {
      state.loading = true;
    },

    getFeatureConsumptionSuccess: (
      state,
      action: PayloadAction<FeatureConsumptionResponse>
    ) => {
      state.loading = false;
      state.featureConsumption = action.payload;
    },

    getFeatureConsumptionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    getWeeklyGraphRequest: (state) => {
      state.weeklyGraphLoading = true;
    },

    getWeeklyGraphSuccess: (state, action: PayloadAction<WeeklyGraphItem>) => {
      state.weeklyGraphLoading = false;
      state.weeklyGraph = action.payload;
    },

    getWeeklyGraphFailure: (state, action: PayloadAction<string>) => {
      state.weeklyGraphLoading = false;
      state.error = action.payload;
    },

    getStageGraphOverviewRequest: (state) => {
      state.stageGraphOverviewLoading = true;
    },

    getStageGraphOverviewSuccess: (state, action: PayloadAction<ApplicantsStageGraphOverviewResponse>) => {
      state.stageGraphOverviewLoading = false;
      state.stageGraphOverview = action.payload;
    },

    getStageGraphOverviewFailure: (state, action: PayloadAction<string>) => {
      state.stageGraphOverviewLoading = false;
      state.error = action.payload;
    },

  },
});

export const {
  getAnalyticsRequest,
  getAnalyticsSuccess,
  getAnalyticsFailure,
  getStageGraphRequest,
  getStageGraphSuccess,
  getStageGraphFailure,
  getFeatureConsumptionRequest,
  getFeatureConsumptionSuccess,
  getFeatureConsumptionFailure,
  clearAnalytics,
  getWeeklyGraphRequest,
  getWeeklyGraphSuccess,
  getWeeklyGraphFailure,
  getStageGraphOverviewRequest,
  getStageGraphOverviewSuccess,
  getStageGraphOverviewFailure,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
