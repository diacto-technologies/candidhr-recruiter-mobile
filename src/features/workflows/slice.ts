import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { PaginatedWorkflowsResponse, WorkflowsListSlice, WorkflowsState } from "./types";

const emptyList = (): WorkflowsListSlice => ({
  items: [],
  count: 0,
  next: null,
  previous: null,
  page: 1,
  pageSize: 10,
  loading: false,
  error: null,
});

const initialState: WorkflowsState = {
  list: emptyList(),
};

const workflowsSlice = createSlice({
  name: "workflows",
  initialState,
  reducers: {
    workflowsListReset: (state) => {
      state.list = emptyList();
    },
    getWorkflowsRequest: (
      state,
      action: PayloadAction<{ page: number; pageSize: number; nameIcontains: string }>
    ) => {
      state.list.loading = true;
      state.list.error = null;
      state.list.page = action.payload.page;
      state.list.pageSize = action.payload.pageSize;
      if (action.payload.page <= 1) {
        state.list.items = [];
      }
    },
    getWorkflowsSuccess: (
      state,
      action: PayloadAction<{ page: number; response: PaginatedWorkflowsResponse }>
    ) => {
      const { page, response } = action.payload;
      state.list.loading = false;
      state.list.count = response.count;
      state.list.next = response.next;
      state.list.previous = response.previous;
      state.list.page = page;
      state.list.error = null;
      state.list.items =
        page <= 1 ? response.results : [...state.list.items, ...response.results];
    },
    getWorkflowsFailure: (state, action: PayloadAction<string>) => {
      state.list.loading = false;
      state.list.error = action.payload;
    },
  },
});

export const { workflowsListReset, getWorkflowsRequest, getWorkflowsSuccess, getWorkflowsFailure } =
  workflowsSlice.actions;

export default workflowsSlice.reducer;
