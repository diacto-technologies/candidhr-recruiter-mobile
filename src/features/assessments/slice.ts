import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Assessment,
  AssessmentListResponse,
  AssessmentsState,
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

      state.hasMore =
        state.assessments.length < (data.count ?? 0);
    },

    getAssessmentsFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getAssessmentsRequest,
  getAssessmentsSuccess,
  getAssessmentsFailure,
} = assessmentsSlice.actions;

export default assessmentsSlice.reducer;
