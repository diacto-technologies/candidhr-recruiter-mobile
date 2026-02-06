import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JobsState, Job, CreateJobRequest, UpdateJobRequest, JobsListApiResponse, GetJobsParams, JobDetail, JobNamesListApiResponse } from "./types";

const initialState: JobsState = {
  publishedJobs: [],
  unpublishedJobs: [],
  selectedJob: null,
  publishedCount: 0,
  unpublishedCount: 0,
  loading: false,
  error: null,
  activeTab: "Published",
  publishedListLoading: false,
  unpublishedListLoading: false,
  publishedIsTabLoading: false,
  unpublishedIsTabLoading: false,
  latestPublishedRequestId: 0,
  latestUnpublishedRequestId: 0,
  publishedPagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  unpublishedPagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  publishedHasMore: true,
  unpublishedHasMore: true,
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
};


const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    getJobsRequest: (
      state,
      _action: PayloadAction<GetJobsParams | undefined>
    ) => {
      state.error = null;

      // Count-only requests should not affect list loading UI.
      if (_action.payload?.onlyCount) return;

      const published = _action.payload?.published ?? true;
      const requestId = _action.payload?.requestId ?? Date.now();

      if (published) {
        state.latestPublishedRequestId = requestId;
        state.publishedListLoading = true;
        state.publishedIsTabLoading = _action.payload?.append === false;
      } else {
        state.latestUnpublishedRequestId = requestId;
        state.unpublishedListLoading = true;
        state.unpublishedIsTabLoading = _action.payload?.append === false;
      }
    },
    getJobsSuccess: (
      state,
      action: PayloadAction<{
        page: number;
        append: boolean;
        published: boolean;
        data: JobsListApiResponse;
        onlyCount?: boolean;
        requestId?: number;
      }>
    ) => {
      const { page, append, data, published, onlyCount, requestId } =
        action.payload;

      // ✅ COUNT ONLY MODE
      if (onlyCount) {
        if (published) {
          state.publishedCount = data.count;
        } else {
          state.unpublishedCount = data.count;
        }
        return; // ⛔ DO NOT TOUCH JOB LIST
      }

      // ✅ LIST MODE (guard against stale responses)
      if (published) {
        if (
          typeof requestId === "number" &&
          requestId !== state.latestPublishedRequestId
        ) {
          return;
        }

        state.publishedListLoading = false;
        state.publishedIsTabLoading = false;

        state.publishedPagination.page = page;
        state.publishedPagination.total = data.count;

        state.publishedJobs = append
          ? [...state.publishedJobs, ...data.results]
          : data.results;
        state.publishedHasMore = state.publishedJobs.length < data.count;
      } else {
        if (
          typeof requestId === "number" &&
          requestId !== state.latestUnpublishedRequestId
        ) {
          return;
        }

        state.unpublishedListLoading = false;
        state.unpublishedIsTabLoading = false;

        state.unpublishedPagination.page = page;
        state.unpublishedPagination.total = data.count;

        state.unpublishedJobs = append
          ? [...state.unpublishedJobs, ...data.results]
          : data.results;
        state.unpublishedHasMore = state.unpublishedJobs.length < data.count;
      }

      if (published) {
        state.publishedCount = data.count;
      } else {
        state.unpublishedCount = data.count;
      }
    },

    getJobsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.publishedListLoading = false;
      state.unpublishedListLoading = false;
      state.publishedIsTabLoading = false;
      state.unpublishedIsTabLoading = false;
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
      if (action.payload.published) {
        state.publishedJobs.unshift(action.payload);
        state.publishedCount += 1;
        state.publishedPagination.total += 1;
      } else {
        state.unpublishedJobs.unshift(action.payload);
        state.unpublishedCount += 1;
        state.unpublishedPagination.total += 1;
      }
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

      // Update in whichever list it exists, and move lists if published status changed.
      const inPublishedIdx = state.publishedJobs.findIndex(
        (job) => job.id === action.payload.id
      );
      const inUnpublishedIdx = state.unpublishedJobs.findIndex(
        (job) => job.id === action.payload.id
      );

      if (action.payload.published) {
        if (inUnpublishedIdx !== -1) {
          state.unpublishedJobs.splice(inUnpublishedIdx, 1);
          state.publishedJobs.unshift(action.payload as any);
        } else if (inPublishedIdx !== -1) {
          state.publishedJobs[inPublishedIdx] = action.payload as any;
        }
      } else {
        if (inPublishedIdx !== -1) {
          state.publishedJobs.splice(inPublishedIdx, 1);
          state.unpublishedJobs.unshift(action.payload as any);
        } else if (inUnpublishedIdx !== -1) {
          state.unpublishedJobs[inUnpublishedIdx] = action.payload as any;
        }
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
      const beforePub = state.publishedJobs.length;
      const beforeUnpub = state.unpublishedJobs.length;

      state.publishedJobs = state.publishedJobs.filter(
        (job) => job.id !== action.payload
      );
      state.unpublishedJobs = state.unpublishedJobs.filter(
        (job) => job.id !== action.payload
      );

      if (state.publishedJobs.length !== beforePub) {
        state.publishedCount = Math.max(0, state.publishedCount - 1);
        state.publishedPagination.total = Math.max(
          0,
          state.publishedPagination.total - 1
        );
      }
      if (state.unpublishedJobs.length !== beforeUnpub) {
        state.unpublishedCount = Math.max(0, state.unpublishedCount - 1);
        state.unpublishedPagination.total = Math.max(
          0,
          state.unpublishedPagination.total - 1
        );
      }

      if (state.selectedJob?.id === action.payload) {
        state.selectedJob = null;
      }
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

      // UX: when filters change, reset pagination + hasMore so load-more never gets stuck.
      state.publishedPagination.page = 1;
      state.unpublishedPagination.page = 1;
      state.publishedHasMore = true;
      state.unpublishedHasMore = true;
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

      // UX: reset pagination + hasMore after clearing filters.
      state.publishedPagination.page = 1;
      state.unpublishedPagination.page = 1;
      state.publishedHasMore = true;
      state.unpublishedHasMore = true;
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

