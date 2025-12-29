import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JobsState, Job,CreateJobRequest,UpdateJobRequest, JobsListApiResponse, GetJobsParams, JobDetail } from "./types";

const initialState: JobsState = {
  jobs:[],
  selectedJob: null,
  publishedCount: 0,
  unpublishedCount: 0,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  hasMore: true,
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    getJobsRequest: (
      state,
      _action: PayloadAction<GetJobsParams | undefined>
    ) => {
      state.loading = true;
      state.error = null;
    },
    getJobsSuccess: (
      state,
      action: PayloadAction<{
        page: number;
        append: boolean;
        published: boolean;   // add this in action
        data: JobsListApiResponse;
      }>
    ) => {
      const { page, append, data, published } = action.payload;
    
      state.loading = false;
      state.pagination.page = page;
      state.pagination.total = data.count;
    
      // update job list
      state.jobs = append ? [...state.jobs, ...data.results] : data.results;
    
      // pagination flag
      state.hasMore = state.jobs.length < data.count;
    
      if (published) {
        state.publishedCount = data.count;
      } else {
        state.unpublishedCount = data.count;
      }
    
      state.error = null;
    },
    
    getJobsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    getJobDetailRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    getJobDetailSuccess: (state, action: PayloadAction<JobDetail>) => {
      state.loading = false;
      state.selectedJob = action.payload;
      state.error = null;
    },
    getJobDetailFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    createJobRequest: (state, _action: PayloadAction<any>) => {
      state.loading = true;
      state.error = null;
    },
    createJobSuccess: (state, action: PayloadAction<Job>) => {
      state.loading = false;
      state.jobs.unshift(action.payload);
      state.pagination.total += 1;
      state.error = null;
    },
    createJobFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateJobRequest: (state, _action: PayloadAction<any>) => {
      state.loading = true;
      state.error = null;
    },
    updateJobSuccess: (state, action: PayloadAction<JobDetail>) => {
      state.loading = false;
      const index = state.jobs.findIndex((job) => job.id === action.payload.id);
      if (index !== -1) {
        state.jobs[index] = action.payload;
      }
      if (state.selectedJob?.id === action.payload.id) {
        state.selectedJob = action.payload;
      }
      state.error = null;
    },
    updateJobFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteJobRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    deleteJobSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      if (state.selectedJob?.id === action.payload) {
        state.selectedJob = null;
      }
      state.pagination.total -= 1;
      state.error = null;
    },
    deleteJobFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedJob: (state, action: PayloadAction<JobDetail | null>) => {
      state.selectedJob = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getJobsRequest,
  getJobsSuccess,
  getJobsFailure,
  getJobDetailRequest,
  getJobDetailSuccess,
  getJobDetailFailure,
  createJobRequest,
  createJobSuccess,
  createJobFailure,
  updateJobRequest,
  updateJobSuccess,
  updateJobFailure,
  deleteJobRequest,
  deleteJobSuccess,
  deleteJobFailure,
  setSelectedJob,
  clearError,
} = jobsSlice.actions;

export default jobsSlice.reducer;

