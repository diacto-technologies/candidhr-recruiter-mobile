import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApplicationsState, Application } from "./types";

const initialState: ApplicationsState = {
  applications: [],
  selectedApplication: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const applicationsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    getApplicationsRequest: (state, _action: PayloadAction<{ page?: number; limit?: number; jobId?: string }>) => {
      state.loading = true;
      state.error = null;
    },
    getApplicationsSuccess: (state, action: PayloadAction<{ applications: Application[]; total: number }>) => {
      state.loading = false;
      state.applications = action.payload.applications;
      state.pagination.total = action.payload.total;
      state.error = null;
    },
    getApplicationsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    getApplicationDetailRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    getApplicationDetailSuccess: (state, action: PayloadAction<Application>) => {
      state.loading = false;
      state.selectedApplication = action.payload;
      state.error = null;
    },
    getApplicationDetailFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    createApplicationRequest: (state, _action: PayloadAction<any>) => {
      state.loading = true;
      state.error = null;
    },
    createApplicationSuccess: (state, action: PayloadAction<Application>) => {
      state.loading = false;
      state.applications.unshift(action.payload);
      state.pagination.total += 1;
      state.error = null;
    },
    createApplicationFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateApplicationStatusRequest: (state, _action: PayloadAction<any>) => {
      state.loading = true;
      state.error = null;
    },
    updateApplicationStatusSuccess: (state, action: PayloadAction<Application>) => {
      state.loading = false;
      const index = state.applications.findIndex((app) => app.id === action.payload.id);
      if (index !== -1) {
        state.applications[index] = action.payload;
      }
      if (state.selectedApplication?.id === action.payload.id) {
        state.selectedApplication = action.payload;
      }
      state.error = null;
    },
    updateApplicationStatusFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedApplication: (state, action: PayloadAction<Application | null>) => {
      state.selectedApplication = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getApplicationsRequest,
  getApplicationsSuccess,
  getApplicationsFailure,
  getApplicationDetailRequest,
  getApplicationDetailSuccess,
  getApplicationDetailFailure,
  createApplicationRequest,
  createApplicationSuccess,
  createApplicationFailure,
  updateApplicationStatusRequest,
  updateApplicationStatusSuccess,
  updateApplicationStatusFailure,
  setSelectedApplication,
  clearError,
} = applicationsSlice.actions;

export default applicationsSlice.reducer;

