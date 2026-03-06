import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AssessmentListResponse,
  AssessmentsState,
  AssignedAssessmentListResponse,
  GetAssignedAssessmentsPayload,
  AssignedAssessmentFilters,
} from "./types";

const initialState: AssessmentsState = {
  assessments: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    total: 0,
  },
  hasMore: true,
  assigned: {
    assignedList: [],
    loading: false,
    error: null,
    filters: {},
    pagination: {
      page: 1,
      total: 0,
      next: null,
      previous: null,
    },
    hasMore: true,
  },
};

const assessmentsSlice = createSlice({
  name: "assessments",
  initialState,
  reducers: {
    getAssessmentsRequest: (
      state,
      action: PayloadAction<{ page: number; append?: boolean }>
    ) => {
      state.loading = true;
      state.error = null;
      state.pagination.page = action.payload.page;

      if (!action.payload.append) {
        state.assessments = [];
      }
    },

    getAssessmentsSuccess: (
      state,
      action: PayloadAction<{
        page: number;
        append?: boolean;
        data: AssessmentListResponse;
      }>
    ) => {
      const { page, append, data } = action.payload;
      const results = data.results ?? [];

      state.loading = false;
      state.pagination.page = page;
      state.pagination.total = data.count ?? 0;

      state.assessments = append
        ? [...state.assessments, ...results]
        : results;

      state.hasMore = state.assessments.length < (data.count ?? 0);
    },

    getAssessmentsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    getAssignedAssessmentsRequest: (
      state,
      action: PayloadAction<GetAssignedAssessmentsPayload & { page: number }>
    ) => {
      const { page, append } = action.payload;
      state.assigned.loading = true;
      state.assigned.error = null;
      state.assigned.pagination.page = page;

      if (!append) {
        state.assigned.assignedList = [];
      }
    },

    getAssignedAssessmentsSuccess: (
      state,
      action: PayloadAction<{
        page: number;
        append?: boolean;
        data: AssignedAssessmentListResponse;
      }>
    ) => {
      const { page, append, data } = action.payload;
      const results = data.results ?? [];

      state.assigned.loading = false;
      state.assigned.pagination = {
        page,
        total: data.count ?? 0,
        next: data.next ?? null,
        previous: data.previous ?? null,
      };

      state.assigned.assignedList = append
        ? [...state.assigned.assignedList, ...results]
        : results;

      state.assigned.hasMore =
        state.assigned.assignedList.length < (data.count ?? 0);
    },

    getAssignedAssessmentsFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.assigned.loading = false;
      state.assigned.error = action.payload;
    },

    setAssignedAssessmentFilters: (
      state,
      action: PayloadAction<Partial<AssignedAssessmentFilters>>
    ) => {
      state.assigned.filters = {
        ...state.assigned.filters,
        ...action.payload,
      };
    },

    clearAssignedAssessmentFilters: (state) => {
      state.assigned.filters = {};
    },
  },
});

export const {
  getAssessmentsRequest,
  getAssessmentsSuccess,
  getAssessmentsFailure,
  getAssignedAssessmentsRequest,
  getAssignedAssessmentsSuccess,
  getAssignedAssessmentsFailure,
  setAssignedAssessmentFilters,
  clearAssignedAssessmentFilters,
} = assessmentsSlice.actions;

export default assessmentsSlice.reducer;
