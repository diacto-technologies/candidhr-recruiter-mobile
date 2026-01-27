import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JobsState, Job, CreateJobRequest, UpdateJobRequest, JobsListApiResponse, GetJobsParams, JobDetail, JobNamesListApiResponse } from "./types";

const initialState: JobsState = {
  jobs: [],
  publishedJobs: [],
  unpublishedJobs: [],
  selectedJob: null,
  publishedCount: 0,
  unpublishedCount: 0,
  loading: false,
  error: null,
  activeTab: "Published",
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  hasMore: true,
  filters: {
    title: "",
    experience: "",
    employmentType: "",
    location: "",
    owner_name: "",
    closeDate: "",
    closeDateTo: "",
  },
  jobNameList: [],
  jobNameListLoading: false,
  jobNameListPage: 1,
  jobNameListNext: null,
  jobNameListSearch: "",
  isTabLoading: false
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
      state.isTabLoading = _action.payload?.append === false;
    },
    getJobsSuccess: (
      state,
      action: PayloadAction<{
        page: number;
        append: boolean;
        published: boolean;
        data: JobsListApiResponse;
        onlyCount?: boolean;
      }>
    ) => {
      const { page, append, data, published, onlyCount } = action.payload;

      state.loading = false;
      state.isTabLoading = false;

      // ✅ COUNT ONLY MODE
      if (onlyCount) {
        if (published) {
          state.publishedCount = data.count;
        } else {
          state.unpublishedCount = data.count;
        }
        return; // ⛔ DO NOT TOUCH JOB LIST
      }

      // ✅ LIST MODE
      state.pagination.page = page;
      state.pagination.total = data.count;

      state.jobs = append ? [...state.jobs, ...data.results] : data.results;
      state.hasMore = state.jobs.length < data.count;

      if (published) {
        state.publishedCount = data.count;
      } else {
        state.unpublishedCount = data.count;
      }
    },

    getJobsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isTabLoading = false;
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
    setJobFilters: (state, action: PayloadAction<any>) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    clearJobFilters: (state) => {
      state.filters = {
        title: "",
        experience: "",
        employmentType: "",
        location: "",
        owner_name: "",
        closeDate: "",
        closeDateTo: "",
      };
    },
    setActiveTab: (state, action: PayloadAction<"Published" | "Unpublished">) => {
      state.activeTab = action.payload;
    },
    getJobNameListRequest: (
      state,
      action: PayloadAction<{ page: number; search: string; append: boolean }>
    ) => {
      state.jobNameListLoading = true;
      state.error = null;

      state.jobNameListPage = action.payload.page;
      state.jobNameListSearch = action.payload.search;
    },

    getJobNameListSuccess: (
      state,
      action: PayloadAction<{
        append: boolean;
        page: number;
        data: JobNamesListApiResponse;
      }>
    ) => {
      state.jobNameListLoading = false;

      const { append, data } = action.payload;

      state.jobNameListNext = data.next;

      state.jobNameList = append
        ? [...state.jobNameList, ...(data.results ?? [])]
        : data.results ?? [];
    },

    getJobNameListFailure: (state, action: PayloadAction<string>) => {
      state.jobNameListLoading = false;
      state.error = action.payload;
    },

    clearJobNameList: (state) => {
      state.jobNameList = [];
      state.jobNameListNext = null;
      state.jobNameListPage = 1;
      state.jobNameListSearch = "";
      state.jobNameListLoading = false;
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
  setJobFilters,
  clearJobFilters,
  setActiveTab,
  getJobNameListRequest,
  getJobNameListSuccess,
  getJobNameListFailure,
  clearJobNameList,
} = jobsSlice.actions;

export default jobsSlice.reducer;

