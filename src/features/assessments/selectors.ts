import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { AssessmentResponse } from "./types";

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

export const selectLastAssessmentsListQuery = createSelector(
  [selectAssessmentsState],
  (state) => state.lastAssessmentsListQuery
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

export const selectAssignCandidatesLoading = createSelector(
  [selectAssessmentOverviewState],
  (o) => o.assignCandidatesLoading
);

export const selectAssignCandidatesError = createSelector(
  [selectAssessmentOverviewState],
  (o) => o.assignCandidatesError
);

export const selectPublishBlueprintLoading = createSelector(
  [selectAssessmentOverviewState],
  (o) => o.publishBlueprintLoading
);

export const selectPublishBlueprintError = createSelector(
  [selectAssessmentOverviewState],
  (o) => o.publishBlueprintError
);

export const selectPostAssessmentLoading = createSelector(
  [selectAssessmentsState],
  (state): boolean => state.postAssessmentLoading
);

export const selectPostAssessmentError = createSelector(
  [selectAssessmentsState],
  (state): string | null => state.postAssessmentError
);

export const selectCreatedAssessment = createSelector(
  [selectAssessmentsState],
  (state): AssessmentResponse | null => state.createdAssessment
);

export const selectUpdateAssessmentTestLoading = createSelector(
  [selectAssessmentsState],
  (state): boolean => state.updateAssessmentTestLoading
);

export const selectUpdateAssessmentTestError = createSelector(
  [selectAssessmentsState],
  (state): string | null => state.updateAssessmentTestError
);

export const selectDeleteAssessmentTestLoading = createSelector(
  [selectAssessmentsState],
  (state): boolean => state.deleteAssessmentTestLoading
);

export const selectDeleteAssessmentTestError = createSelector(
  [selectAssessmentsState],
  (state): string | null => state.deleteAssessmentTestError
);

export const selectDeleteAssessmentTestTargetId = createSelector(
  [selectAssessmentsState],
  (state): string | null => state.deleteAssessmentTestTargetId
);

export const selectDuplicateAssessmentTestLoading = createSelector(
  [selectAssessmentsState],
  (state): boolean => state.duplicateAssessmentTestLoading
);

export const selectDuplicateAssessmentTestError = createSelector(
  [selectAssessmentsState],
  (state): string | null => state.duplicateAssessmentTestError
);

export const selectDuplicateAssessmentTestTargetId = createSelector(
  [selectAssessmentsState],
  (state): string | null => state.duplicateAssessmentTestTargetId
);

export const selectDuplicateBlueprintLoading = createSelector(
  [selectAssessmentsState],
  (state): boolean => state.duplicateBlueprintLoading
);

export const selectDuplicateBlueprintError = createSelector(
  [selectAssessmentsState],
  (state): string | null => state.duplicateBlueprintError
);

export const selectDuplicateBlueprintTargetId = createSelector(
  [selectAssessmentsState],
  (state): string | null => state.duplicateBlueprintTargetId
);

export const selectDeleteBlueprintLoading = createSelector(
  [selectAssessmentsState],
  (state): boolean => state.deleteBlueprintLoading
);

export const selectDeleteBlueprintError = createSelector(
  [selectAssessmentsState],
  (state): string | null => state.deleteBlueprintError
);

export const selectDeleteBlueprintTargetId = createSelector(
  [selectAssessmentsState],
  (state): string | null => state.deleteBlueprintTargetId
);

export const selectArchiveBlueprintLoading = createSelector(
  [selectAssessmentsState],
  (state): boolean => state.archiveBlueprintLoading
);

export const selectArchiveBlueprintError = createSelector(
  [selectAssessmentsState],
  (state): string | null => state.archiveBlueprintError
);

export const selectArchiveBlueprintTargetId = createSelector(
  [selectAssessmentsState],
  (state): string | null => state.archiveBlueprintTargetId
);

export const selectArchiveAssessmentTestLoading = createSelector(
  [selectAssessmentsState],
  (state): boolean => state.archiveAssessmentTestLoading
);

export const selectArchiveAssessmentTestError = createSelector(
  [selectAssessmentsState],
  (state): string | null => state.archiveAssessmentTestError
);

export const selectArchiveAssessmentTestTargetId = createSelector(
  [selectAssessmentsState],
  (state): string | null => state.archiveAssessmentTestTargetId
);

export const selectShareAssessmentTestLoading = createSelector(
  [selectAssessmentsState],
  (state): boolean => state.shareAssessmentTestLoading
);

export const selectShareAssessmentTestError = createSelector(
  [selectAssessmentsState],
  (state): string | null => state.shareAssessmentTestError
);

export const selectShareAssessmentTestTargetId = createSelector(
  [selectAssessmentsState],
  (state): string | null => state.shareAssessmentTestTargetId
);

export const selectShareBlueprintLoading = createSelector(
  [selectAssessmentsState],
  (state): boolean => state.shareBlueprintLoading
);

export const selectShareBlueprintError = createSelector(
  [selectAssessmentsState],
  (state): string | null => state.shareBlueprintError
);

export const selectShareBlueprintTargetId = createSelector(
  [selectAssessmentsState],
  (state): string | null => state.shareBlueprintTargetId
);

export const selectPostAssessmentQuestionLoading = createSelector(
  [selectAssessmentsState],
  (state): boolean => state.postAssessmentQuestionLoading
);

export const selectPostAssessmentQuestionError = createSelector(
  [selectAssessmentsState],
  (state): string | null => state.postAssessmentQuestionError
);

export const selectPostAssessmentQuestionReferenceSolutionErrors = createSelector(
  [selectAssessmentsState],
  (state) => state.postAssessmentQuestionReferenceSolutionErrors
);

export const selectCreatedAssessmentQuestion = createSelector(
  [selectAssessmentsState],
  (state) => state.createdAssessmentQuestion
);

// ---------------------------------------------------------------------------
// Test detail (v2 tests/{id})
// ---------------------------------------------------------------------------

export const selectAssessmentTestDetailState = createSelector(
  [selectAssessmentsState],
  (state) => state.testDetail
);

export const selectAssessmentTestDetailLoading = createSelector(
  [selectAssessmentTestDetailState],
  (s) => s.loading
);

export const selectAssessmentTestDetailError = createSelector(
  [selectAssessmentTestDetailState],
  (s) => s.error
);

export const selectAssessmentTestDetail = createSelector(
  [selectAssessmentTestDetailState],
  (s) => s.data
);

// ---------------------------------------------------------------------------
// Questions list (v2 questions?test=)
// ---------------------------------------------------------------------------

export const selectAssessmentQuestionsListState = createSelector(
  [selectAssessmentsState],
  (state) => state.questionsList
);

export const selectAssessmentQuestionsListLoading = createSelector(
  [selectAssessmentQuestionsListState],
  (s) => s.loading
);

export const selectAssessmentQuestionsListError = createSelector(
  [selectAssessmentQuestionsListState],
  (s) => s.error
);

export const selectAssessmentQuestionsList = createSelector(
  [selectAssessmentQuestionsListState],
  (s) => s.data
);

export const selectDeleteAssessmentQuestionLoading = createSelector(
  [selectAssessmentsState],
  (s) => s.deleteAssessmentQuestionLoading
);

export const selectDeleteAssessmentQuestionError = createSelector(
  [selectAssessmentsState],
  (s) => s.deleteAssessmentQuestionError
);

export const selectUpdateAssessmentQuestionLoading = createSelector(
  [selectAssessmentsState],
  (s) => s.updateAssessmentQuestionLoading
);

export const selectUpdateAssessmentQuestionError = createSelector(
  [selectAssessmentsState],
  (s) => s.updateAssessmentQuestionError
);

export const selectPublishAssessmentTestLoading = createSelector(
  [selectAssessmentsState],
  (s) => s.publishAssessmentTestLoading
);

export const selectPublishAssessmentTestError = createSelector(
  [selectAssessmentsState],
  (s) => s.publishAssessmentTestError
);

// ---------------------------------------------------------------------------
// Judge languages (GET /assessments/v2/languages/)
// ---------------------------------------------------------------------------

export const selectAssessmentLanguagesListState = createSelector(
  [selectAssessmentsState],
  (state) => state.languagesList
);

export const selectAssessmentLanguagesItems = createSelector(
  [selectAssessmentLanguagesListState],
  (s) => s.items
);

export const selectAssessmentLanguagesListLoading = createSelector(
  [selectAssessmentLanguagesListState],
  (s) => s.loading
);

export const selectAssessmentLanguagesListError = createSelector(
  [selectAssessmentLanguagesListState],
  (s) => s.error
);

export const selectAssessmentLanguagesListHasMore = createSelector(
  [selectAssessmentLanguagesListState],
  (s) => s.hasMore
);

export const selectAssessmentLanguagesListPage = createSelector(
  [selectAssessmentLanguagesListState],
  (s) => s.page
);

// ---------------------------------------------------------------------------
// Test categories (GET /assessments/v2/categories/)
// ---------------------------------------------------------------------------

export const selectAssessmentCategoriesListState = createSelector(
  [selectAssessmentsState],
  (state) => state.categoriesList
);

export const selectAssessmentCategoriesItems = createSelector(
  [selectAssessmentCategoriesListState],
  (s) => s.items
);

export const selectAssessmentCategoriesListLoading = createSelector(
  [selectAssessmentCategoriesListState],
  (s) => s.loading
);

export const selectAssessmentCategoriesListError = createSelector(
  [selectAssessmentCategoriesListState],
  (s) => s.error
);

export const selectAssessmentCategoriesListHasMore = createSelector(
  [selectAssessmentCategoriesListState],
  (s) => s.hasMore
);

export const selectAssessmentCategoriesListPage = createSelector(
  [selectAssessmentCategoriesListState],
  (s) => s.page
);

// ---------------------------------------------------------------------------
// GET /assessments/v2/tests/options/
// ---------------------------------------------------------------------------

export const selectAssessmentTestOptionsListState = createSelector(
  [selectAssessmentsState],
  (state) => state.testOptionsList
);

export const selectAssessmentTestOptionsItems = createSelector(
  [selectAssessmentTestOptionsListState],
  (s) => s.items
);

export const selectAssessmentTestOptionsListLoading = createSelector(
  [selectAssessmentTestOptionsListState],
  (s) => s.loading
);

export const selectAssessmentTestOptionsListError = createSelector(
  [selectAssessmentTestOptionsListState],
  (s) => s.error
);

export const selectAssessmentTestOptionsListHasMore = createSelector(
  [selectAssessmentTestOptionsListState],
  (s) => s.hasMore
);

export const selectAssessmentTestOptionsListPage = createSelector(
  [selectAssessmentTestOptionsListState],
  (s) => s.page
);

// ---------------------------------------------------------------------------
// Create assessment wizard (blueprint POST)
// ---------------------------------------------------------------------------

export const selectAssessmentCreateWizard = createSelector(
  [selectAssessmentsState],
  (s) => s.assessmentCreateWizard
);

export const selectAssessmentCreateWizardBlueprintId = createSelector(
  [selectAssessmentCreateWizard],
  (w) => w.blueprintId
);

export const selectSubmitBlueprintLoading = createSelector(
  [selectAssessmentCreateWizard],
  (w) => w.submitBlueprintLoading
);

export const selectSubmitBlueprintError = createSelector(
  [selectAssessmentCreateWizard],
  (w) => w.submitBlueprintError
);

export const selectLastSubmitBlueprint = createSelector(
  [selectAssessmentCreateWizard],
  (w) => w.lastSubmitBlueprint
);

export const selectLoadBlueprintForEditLoading = createSelector(
  [selectAssessmentCreateWizard],
  (w) => w.loadBlueprintForEditLoading
);

export const selectLoadBlueprintForEditError = createSelector(
  [selectAssessmentCreateWizard],
  (w) => w.loadBlueprintForEditError
);

/** Full blueprint from GET when editing (created_by, sections, proctoring_configuration, etc.). */
export const selectAssessmentCreateWizardLoadBlueprintDetail = createSelector(
  [selectAssessmentCreateWizard],
  (w) => w.loadBlueprintForEditDetail
);

export const selectAssessmentCreateWizardBasicInfo = createSelector(
  [selectAssessmentCreateWizard],
  (w) => w.basicInfo
);

export const selectAssessmentCreateWizardSections = createSelector(
  [selectAssessmentCreateWizard],
  (w) => w.sections
);

export const selectAssessmentCreateWizardInstructionsHtml = createSelector(
  [selectAssessmentCreateWizard],
  (w) => w.instructionsHtml
);

export const selectAssessmentCreateWizardProctoringDraft = createSelector(
  [selectAssessmentCreateWizard],
  (w) => w.proctoringDraft
);


