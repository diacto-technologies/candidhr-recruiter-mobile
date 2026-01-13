import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const selectJobsState = (state: RootState) => state.jobs;

export const selectJobs = createSelector(
  [selectJobsState],
  (jobs) => jobs.jobs
);

export const selectSelectedJob = createSelector(
  [selectJobsState],
  (jobs) => jobs.selectedJob
);

export const selectJobsLoading = createSelector(
  [selectJobsState],
  (jobs) => jobs.loading
);

export const selectJobsError = createSelector(
  [selectJobsState],
  (jobs) => jobs.error
);

export const selectJobsPagination = createSelector(
  [selectJobsState],
  (jobs) => jobs.pagination
);

export const selectJobsHasMore = createSelector(
  [selectJobsState],
  (jobs) => jobs.hasMore
);

export const selectPublishedCount = createSelector(
  [selectJobsState],
  (jobs) => jobs.publishedCount
);

export const selectUnpublishedCount = createSelector(
  [selectJobsState],
  (jobs) => jobs.unpublishedCount
);

export const selectJobFilters = createSelector(
  [selectJobsState],
  (jobs) => jobs.filters
);


export const selectPublishedJobs = createSelector(
  [selectJobsState],
  (jobs) =>jobs.publishedJobs
);

export const selectUnpublishedJobs = createSelector(
  [selectJobsState],
  (jobs) => jobs.unpublishedJobs
);

export const selectJobsActiveTab = createSelector(
  [selectJobsState],
  (jobs) => jobs.activeTab
);

export const selectIsTabLoading = createSelector(
  [selectJobsState],
  (jobs) => jobs.isTabLoading
);


