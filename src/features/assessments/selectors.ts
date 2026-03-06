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

// ---------------------------------------------------------------------------
// Assigned assessments
// ---------------------------------------------------------------------------
export const selectAssignedAssessmentsState = createSelector(
  [selectAssessmentsState],
  (state) => state.assigned
);

export const selectAssignedAssessments = createSelector(
  [selectAssignedAssessmentsState],
  (state) => state.assignedList
);

export const selectAssignedAssessmentsLoading = createSelector(
  [selectAssignedAssessmentsState],
  (state) => state.loading
);

export const selectAssignedAssessmentsError = createSelector(
  [selectAssignedAssessmentsState],
  (state) => state.error
);

export const selectAssignedAssessmentsPagination = createSelector(
  [selectAssignedAssessmentsState],
  (state) => state.pagination
);

export const selectAssignedAssessmentsHasMore = createSelector(
  [selectAssignedAssessmentsState],
  (state) => state.hasMore
);

export const selectAssignedAssessmentFilters = createSelector(
  [selectAssignedAssessmentsState],
  (state) => state.filters
);
