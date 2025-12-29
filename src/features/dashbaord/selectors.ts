import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

// Base selector
const selectAnalyticsState = (state: RootState) => state.dashboard;

export const selectAnalyticsData = createSelector(
  [selectAnalyticsState],
  (state) => state.data
);

export const selectAnalyticsLoading = createSelector(
  [selectAnalyticsState],
  (state) => state.loading
);

export const selectAnalyticsLoaded = createSelector(
  [selectAnalyticsState],
  (state) => state.isLoaded
);

export const selectAnalyticsError = createSelector(
  [selectAnalyticsState],
  (state) => state.error
);

export const selectApplicantStageGraph = createSelector(
  [selectAnalyticsState],
  (state) => state.applicantStageGraph
);
export const selectApplicantStageGraphResults = createSelector(
  [selectApplicantStageGraph],
  (graph) => graph?.results || null
);

export const selectApplicantStageGraphLoading = createSelector(
  [selectAnalyticsState],
  (state) => state.stageGraphLoading
);

export const selectFeatureConsumption = createSelector(
  [(state: RootState) => state.dashboard],
  (dashboard) => dashboard.featureConsumption?.results ?? null
);

export const selectFeatureConsumptionLoading = createSelector(
  [(state: RootState) => state.dashboard],
  (dashboard) => dashboard.loading
);

export const selectStageGraphOverview = createSelector(
  [(state: RootState) => state.dashboard],
  (dashboard) => dashboard.stageGraphOverview
);

export const selectStageGraphOverviewLoading = createSelector(
  [(state: RootState) => state.dashboard],
  (dashboard) => dashboard.stageGraphOverviewLoading
);


