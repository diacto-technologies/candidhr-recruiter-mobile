import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

const selectWorkflowsState = (state: RootState) => state.workflows;

export const selectWorkflowsListItems = createSelector(
  [selectWorkflowsState],
  (workflows) => workflows.list.items
);

export const selectWorkflowsListLoading = createSelector(
  [selectWorkflowsState],
  (workflows) => workflows.list.loading
);

export const selectWorkflowsListNext = createSelector(
  [selectWorkflowsState],
  (workflows) => workflows.list.next
);

export const selectWorkflowsListPage = createSelector(
  [selectWorkflowsState],
  (workflows) => workflows.list.page
);

export const selectWorkflowsListPageSize = createSelector(
  [selectWorkflowsState],
  (workflows) => workflows.list.pageSize
);

export const selectWorkflowsListError = createSelector(
  [selectWorkflowsState],
  (workflows) => workflows.list.error
);
