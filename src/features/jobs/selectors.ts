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

export const selectJobNameList = createSelector(
  [selectJobsState],
  (jobs) => jobs.jobNameList
);

export const selectJobNameListLoading = createSelector(
  [selectJobsState],
  (jobs) => jobs.jobNameListLoading
);

export const selectJobNameListNext = createSelector(
  [selectJobsState],
  (jobs) => jobs.jobNameListNext
);

export const selectJobNameListPage = createSelector(
  [selectJobsState],
  (jobs) => jobs.jobNameListPage
);

export const selectJobNameListSearch = createSelector(
  [selectJobsState],
  (jobs) => jobs.jobNameListSearch
);


