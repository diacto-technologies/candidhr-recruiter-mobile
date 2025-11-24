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

