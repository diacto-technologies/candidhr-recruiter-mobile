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

export const selectAssessmentsCounts = createSelector(
  [selectAssessmentsState],
  (state) => state.counts
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

// ---------------------------------------------------------------------------
// Assessment overview (blueprint + dashboard stats + assignments)
// ---------------------------------------------------------------------------

export const selectAssessmentOverviewState = createSelector(
  [selectAssessmentsState],
  (state) => state.assessmentOverview
);

export const selectAssessmentOverviewBlueprint = createSelector(
  [selectAssessmentOverviewState],
  (o) => o.blueprint
);

export const selectAssessmentOverviewDashboardStats = createSelector(
  [selectAssessmentOverviewState],
  (o) => o.dashboardStats
);

export const selectAssessmentOverviewAssignments = createSelector(
  [selectAssessmentOverviewState],
  (o) => o.assignments
);

export const selectAssessmentOverviewBlueprintAssignmentStats = createSelector(
  [selectAssessmentOverviewState],
  (o) => o.blueprintAssignmentStats
);

export const selectAssessmentOverviewLoading = createSelector(
  [selectAssessmentOverviewState],
  (o) => o.loading
);

export const selectAssessmentOverviewError = createSelector(
  [selectAssessmentOverviewState],
  (o) => o.error
);

export const selectAssessmentOverviewBlueprintId = createSelector(
  [selectAssessmentOverviewState],
  (o) => o.blueprintId
);

export const selectBlueprintAssignmentsListLoading = createSelector(
  [selectAssessmentOverviewState],
  (o) => o.assignmentsListLoading
);

export const selectBlueprintAssignmentsListError = createSelector(
  [selectAssessmentOverviewState],
  (o) => o.assignmentsListError
);

export const selectBlueprintAssignmentsPagination = createSelector(
  [selectAssessmentOverviewState],
  (o) => o.assignmentsPagination
);

export const selectBlueprintAssignmentsListQuery = createSelector(
  [selectAssessmentOverviewState],
  (o) => o.assignmentsListQuery
);

export const selectAssignmentsListSearchText = createSelector(
  [selectAssessmentOverviewState],
  (o) => o.assignmentsListSearchText
);

export const selectAssignmentTableSelectedIds = createSelector(
  [selectAssessmentOverviewState],
  (o) => o.assignmentTableSelectedIds
);

export const selectAssignmentExportLoading = createSelector(
  [selectAssessmentOverviewState],
  (o) => o.assignmentExportLoading
);

export const selectAssignmentExportError = createSelector(
  [selectAssessmentOverviewState],
  (o) => o.assignmentExportError
);
