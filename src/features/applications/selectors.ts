import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const selectApplicationsState = (state: RootState) => state.applications;

export const selectApplications = createSelector(
  [selectApplicationsState],
  (applications) => applications.applications
);

export const selectSelectedApplication = createSelector(
  [selectApplicationsState],
  (applications) => applications.selectedApplication
);

export const selectApplicationsLoading = createSelector(
  [selectApplicationsState],
  (applications) => applications.loading
);

export const selectApplicationsDetailLoading = createSelector(
  [selectApplicationsState],
  (applications) => applications.loadingApplicationDetail
);

export const selectResumeScreeningResponsesLoading = createSelector(
  [selectApplicationsState],
  (applications) => applications.loadingResumeScreeningResponses
);

export const selectApplicationsError = createSelector(
  [selectApplicationsState],
  (applications) => applications.error
);

export const selectApplicationsPagination = createSelector(
  [selectApplicationsState],
  (applications) => applications.pagination
);

export const selectApplicationsHasMore = createSelector(
  [selectApplicationsState],
  (state) => state.hasMore
);

export const selectApplicationResponses = createSelector(
  [selectApplicationsState],
  (state) => state.applicationResponses
);

export const selectResumeScreeningResponses = createSelector(
  [selectApplicationsState],
  (state) => state.resumeScreeningResponses
);

export const selectAssessmentLogs = createSelector(
  [(state: RootState) => state.applications],
  (state) => state.assessmentLogs
);

export const selectAssessmentReport = createSelector(
  [(state: RootState) => state.applications],
  (state) => state.assessmentReport
);

export const selectAssessmentDetailedReport = createSelector(
  [(state: RootState) => state.applications],
  (state) => state.assessmentDetailedReport
);

export const selectPersonalityScreeningList = createSelector(
  [(state: RootState) => state.applications],
  (state) => state.personalityScreeningList
);

export const selectPersonalityScreeningLoading = createSelector(
  [(state: RootState) => state.applications],
  (state) => state.loading
);

export const selectPersonalityScreeningResponses = createSelector(
  [(state: RootState) => state.applications],
  state => state.personalityScreeningResponses
);


export const selectApplicationsFilters = createSelector(
  [(state: RootState) => state.applications],
  (applications) => applications.filters
);

export const selectApplicationStages = createSelector(
  [(state: RootState) => state.applications],
  state => state.applicationStages
);

export const selectMarkSessionReviewedLoading = createSelector(
  [(state: RootState) => state.applications],
  state => state.loadingMarkSessionReviewed ?? false
);

export const selectParseResumeLoading = createSelector(
  [(state: RootState) => state.applications],
  state => state.loadingParseResume ?? false
);

export const selectUpdateStageStatusLoading = createSelector(
  [(state: RootState) => state.applications],
  state => state.loadingUpdateStageStatus ?? false
);

export const selectReasonCategoryList = createSelector(
  [selectApplicationsState],
  (state) => state.reasonCategoryList ?? []
);

export const selectReasonCategoryListLoading = createSelector(
  [selectApplicationsState],
  (state) => state.loadingReasonCategoryList ?? false
);

export const selectReasonCategoryListError = createSelector(
  [selectApplicationsState],
  (state) => state.reasonCategoryListError ?? null
);

export const selectReasonList = createSelector(
  [selectApplicationsState],
  (state) => state.reasonList ?? []
);

export const selectReasonListLoading = createSelector(
  [selectApplicationsState],
  (state) => state.loadingReasonList ?? false
);

export const selectReasonListError = createSelector(
  [selectApplicationsState],
  (state) => state.reasonListError ?? null
);


