import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const selectAssessmentsState = (state: RootState) =>
  state.assessments;

export const selectAssessments = createSelector(
  [selectAssessmentsState],
  (state) => state.assessments
);

export const selectAssessmentsLoading = createSelector(
  [selectAssessmentsState],
  (state) => state.loading
);

export const selectAssessmentsError = createSelector(
  [selectAssessmentsState],
  (state) => state.error
);

export const selectAssessmentsPagination = createSelector(
  [selectAssessmentsState],
  (state) => state.pagination
);

export const selectAssessmentsHasMore = createSelector(
  [selectAssessmentsState],
  (state) => state.hasMore
);
