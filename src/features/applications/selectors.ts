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







