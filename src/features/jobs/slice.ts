import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  JobsState,
  Job,
  CreateJobRequest,
  UpdateJobRequest,
  JobsListApiResponse,
  GetJobsParams,
  JobDetail,
  JobNamesListApiResponse,
  GenerateJobDescriptionResponse,
  SubmitJobApplicationFormStepPayload,
  PatchJobUsersSharedPayload,
  PatchJobDetailsRequest,
  PatchJobPublishedPayload,
  SoftDeleteJobPayload,
  ApplicationFormDraftData,
  AssignWorkflowToJobPayload,
} from "./types";

export const jobsInitialState: JobsState = {
  publishedJobs: [],
  unpublishedJobs: [],
  favouriteJobs: [],
  favouriteJobIds: [],
  selectedJob: null,
  publishedCount: 0,
  unpublishedCount: 0,
  favouritesCount: 0,
  loading: false,
  error: null,
  activeTab: "Published",
  publishedListLoading: false,
  unpublishedListLoading: false,
  favouritesListLoading: false,
  publishedIsTabLoading: false,
  unpublishedIsTabLoading: false,
  favouritesIsTabLoading: false,
  latestPublishedRequestId: 0,
  latestUnpublishedRequestId: 0,
  latestFavouritesRequestId: 0,
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
  favouritesPagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  publishedHasMore: true,
  unpublishedHasMore: true,
  favouritesHasMore: true,
  filters: {
    title: "",
    experience: "",
    employmentType: "",
    location: "",
    owner_name: "",
    closeDate: "",
    closeDateTo: "",
    sortBy: "",
    sortDir: "desc" as "asc" | "desc",
    orderBy: "",
  },
  jobNameList: [],
  jobNameListLoading: false,
  jobNameListPage: 1,
  jobNameListNext: null,
  jobNameListSearch: "",
  generateDescriptionLoading: false,
  generatedJobDescription: null,
  createdJobForWizard: null,
  applicationFormSubmitLoading: false,
  applicationFormSubmitError: null,
  jobUsersSharedSubmitLoading: false,
  jobUsersSharedSubmitError: null,
  jobUsersSharedSubmitSucceeded: false,
  jobDetailLoading: false,
  jobDetailRequestJobId: null,
  jobDetailsSaveLoading: false,
  applicationFormDraft: null,
  applicationFormDraftLoading: false,
  applicationFormDraftError: null,
  latestApplicationFormDraftJobId: null,
  patchJobPublishedLoadingJobId: null,
  softDeleteJobLoadingJobId: null,
  assignWorkflowLoadingJobId: null,
  assignWorkflowSubmitError: null,
  assignWorkflowSubmitSucceeded: false,
};


const jobsSlice = createSlice({
  name: "jobs",
  initialState: jobsInitialState,
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

      // ⭐ FAVOURITES TAB
      if (_action.payload?.favourites) {
        state.latestFavouritesRequestId = requestId;
        state.favouritesListLoading = true;
        state.favouritesIsTabLoading = _action.payload?.append === false;
        return;
      }

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
        favourites?: boolean;
      }>
    ) => {
      const { page, append, data, published, onlyCount, requestId, favourites } =
        action.payload;

      // ⭐ FAVOURITES LIST MODE (no count-only support for now)
      if (favourites) {
        if (
          typeof requestId === "number" &&
          requestId !== state.latestFavouritesRequestId
        ) {
          return;
        }

        state.favouritesListLoading = false;
        state.favouritesIsTabLoading = false;

        state.favouritesPagination.page = page;
        state.favouritesPagination.total = data.count;
        state.favouritesCount = data.count;

        state.favouriteJobs = append
          ? [...state.favouriteJobs, ...data.results]
          : data.results;
        state.favouritesHasMore = state.favouriteJobs.length < data.count;
        return;
      }

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
      state.favouritesListLoading = false;
      state.favouritesIsTabLoading = false;
    },
    getJobDetailRequest: (state, action: PayloadAction<string>) => {
      state.jobDetailLoading = true;
      state.jobDetailRequestJobId = action.payload;
      state.error = null;
    },
    getJobDetailSuccess: (state, action: PayloadAction<JobDetail>) => {
      state.jobDetailLoading = false;
      state.jobDetailRequestJobId = null;
      state.selectedJob = action.payload;
      state.error = null;
    },
    getJobDetailFailure: (state, action: PayloadAction<string>) => {
      state.jobDetailLoading = false;
      state.jobDetailRequestJobId = null;
      state.error = action.payload;
    },
    createJobRequest: (state, _action: PayloadAction<any>) => {
      state.loading = true;
      state.error = null;
      state.createdJobForWizard = null;
    },
    createJobSuccess: (state, action: PayloadAction<Job>) => {
      state.loading = false;
      state.createdJobForWizard = action.payload;

      if (action.payload.published) {
        state.publishedJobs.unshift(action.payload);
      } else {
        state.unpublishedJobs.unshift(action.payload);
      }
    },
    createJobFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCreatedJobForWizard: (state) => {
      state.createdJobForWizard = null;
    },
    submitApplicationFormStepRequest: (
      state,
      _action: PayloadAction<SubmitJobApplicationFormStepPayload>
    ) => {
      state.applicationFormSubmitLoading = true;
      state.applicationFormSubmitError = null;
    },
    submitApplicationFormStepSuccess: (state) => {
      state.applicationFormSubmitLoading = false;
      state.applicationFormSubmitError = null;
    },
    submitApplicationFormStepFailure: (state, action: PayloadAction<string>) => {
      state.applicationFormSubmitLoading = false;
      state.applicationFormSubmitError = action.payload;
    },
    clearApplicationFormSubmitError: (state) => {
      state.applicationFormSubmitError = null;
    },
    fetchApplicationFormDraftRequest: (state, action: PayloadAction<{ jobId: string }>) => {
      state.applicationFormDraftLoading = true;
      state.applicationFormDraftError = null;
      state.latestApplicationFormDraftJobId = action.payload.jobId;
    },
    fetchApplicationFormDraftSuccess: (
      state,
      action: PayloadAction<ApplicationFormDraftData>
    ) => {
      state.applicationFormDraftLoading = false;
      if (state.latestApplicationFormDraftJobId !== action.payload.jobId) {
        return;
      }
      state.applicationFormDraft = action.payload;
      state.applicationFormDraftError = null;
    },
    fetchApplicationFormDraftFailure: (state, action: PayloadAction<string>) => {
      state.applicationFormDraftLoading = false;
      state.applicationFormDraftError = action.payload;
    },
    clearApplicationFormDraft: (state) => {
      state.applicationFormDraft = null;
      state.applicationFormDraftLoading = false;
      state.applicationFormDraftError = null;
      state.latestApplicationFormDraftJobId = null;
    },
    clearApplicationFormDraftError: (state) => {
      state.applicationFormDraftError = null;
    },
    patchJobUsersSharedRequest: (state, _action: PayloadAction<PatchJobUsersSharedPayload>) => {
      state.jobUsersSharedSubmitLoading = true;
      state.jobUsersSharedSubmitError = null;
      state.jobUsersSharedSubmitSucceeded = false;
    },
    patchJobUsersSharedSuccess: (state) => {
      state.jobUsersSharedSubmitLoading = false;
      state.jobUsersSharedSubmitError = null;
      state.jobUsersSharedSubmitSucceeded = true;
    },
    patchJobUsersSharedFailure: (state, action: PayloadAction<string>) => {
      state.jobUsersSharedSubmitLoading = false;
      state.jobUsersSharedSubmitError = action.payload;
      state.jobUsersSharedSubmitSucceeded = false;
    },
    clearJobUsersSharedSubmitSuccess: (state) => {
      state.jobUsersSharedSubmitSucceeded = false;
    },
    patchJobDetailsRequest: (state, _action: PayloadAction<PatchJobDetailsRequest>) => {
      state.jobDetailsSaveLoading = true;
      state.error = null;
    },
    patchJobDetailsSuccess: (state, action: PayloadAction<JobDetail>) => {
      state.jobDetailsSaveLoading = false;
      const job = action.payload;

      const inPublishedIdx = state.publishedJobs.findIndex((j) => j.id === job.id);
      const inUnpublishedIdx = state.unpublishedJobs.findIndex((j) => j.id === job.id);

      if (job.published) {
        if (inUnpublishedIdx !== -1) {
          state.unpublishedJobs.splice(inUnpublishedIdx, 1);
          state.publishedJobs.unshift(job as any);
        } else if (inPublishedIdx !== -1) {
          state.publishedJobs[inPublishedIdx] = job as any;
        }
      } else {
        if (inPublishedIdx !== -1) {
          state.publishedJobs.splice(inPublishedIdx, 1);
          state.unpublishedJobs.unshift(job as any);
        } else if (inUnpublishedIdx !== -1) {
          state.unpublishedJobs[inUnpublishedIdx] = job as any;
        }
      }

      if (state.selectedJob?.id === job.id) {
        state.selectedJob = job;
      }
      state.error = null;
    },
    patchJobDetailsFailure: (state, action: PayloadAction<string>) => {
      state.jobDetailsSaveLoading = false;
      state.error = action.payload;
    },
    patchJobPublishedRequest: (state, action: PayloadAction<PatchJobPublishedPayload>) => {
      state.patchJobPublishedLoadingJobId = action.payload.jobId;
      state.error = null;
    },
    patchJobPublishedSuccess: (state, action: PayloadAction<JobDetail>) => {
      state.patchJobPublishedLoadingJobId = null;
      const job = action.payload;

      const inPublishedIdx = state.publishedJobs.findIndex((j) => j.id === job.id);
      const inUnpublishedIdx = state.unpublishedJobs.findIndex((j) => j.id === job.id);

      if (job.published) {
        if (inUnpublishedIdx !== -1) {
          state.unpublishedJobs.splice(inUnpublishedIdx, 1);
          state.publishedJobs.unshift(job as any);
        } else if (inPublishedIdx !== -1) {
          state.publishedJobs[inPublishedIdx] = job as any;
        }
      } else {
        if (inPublishedIdx !== -1) {
          state.publishedJobs.splice(inPublishedIdx, 1);
          state.unpublishedJobs.unshift(job as any);
        } else if (inUnpublishedIdx !== -1) {
          state.unpublishedJobs[inUnpublishedIdx] = job as any;
        }
      }

      const favIdx = state.favouriteJobs.findIndex((j) => j.id === job.id);
      if (favIdx !== -1) {
        state.favouriteJobs[favIdx] = { ...state.favouriteJobs[favIdx], ...job } as Job;
      }

      if (state.selectedJob?.id === job.id) {
        state.selectedJob = job;
      }
      state.error = null;
    },
    patchJobPublishedFailure: (state, action: PayloadAction<string>) => {
      state.patchJobPublishedLoadingJobId = null;
      state.error = action.payload;
    },
    assignWorkflowToJobRequest: (state, action: PayloadAction<AssignWorkflowToJobPayload>) => {
      state.assignWorkflowLoadingJobId = action.payload.jobId;
      state.assignWorkflowSubmitError = null;
      state.assignWorkflowSubmitSucceeded = false;
    },
    assignWorkflowToJobFailure: (state, action: PayloadAction<string>) => {
      state.assignWorkflowLoadingJobId = null;
      state.assignWorkflowSubmitError = action.payload;
      state.assignWorkflowSubmitSucceeded = false;
    },
    clearAssignWorkflowSubmitSuccess: (state) => {
      state.assignWorkflowSubmitSucceeded = false;
      state.assignWorkflowSubmitError = null;
    },
    /** Jobs list: workflow assigned — merge detail into lists (saga after POST /workflow/assign/). */
    patchJobWorkflowSuccess: (state, action: PayloadAction<JobDetail>) => {
      const job = action.payload;
      if (state.assignWorkflowLoadingJobId === job.id) {
        state.assignWorkflowLoadingJobId = null;
        state.assignWorkflowSubmitError = null;
        state.assignWorkflowSubmitSucceeded = true;
      }

      const inPublishedIdx = state.publishedJobs.findIndex((j) => j.id === job.id);
      const inUnpublishedIdx = state.unpublishedJobs.findIndex((j) => j.id === job.id);

      if (job.published) {
        if (inUnpublishedIdx !== -1) {
          state.unpublishedJobs.splice(inUnpublishedIdx, 1);
          state.publishedJobs.unshift(job as any);
        } else if (inPublishedIdx !== -1) {
          state.publishedJobs[inPublishedIdx] = job as any;
        }
      } else {
        if (inPublishedIdx !== -1) {
          state.publishedJobs.splice(inPublishedIdx, 1);
          state.unpublishedJobs.unshift(job as any);
        } else if (inUnpublishedIdx !== -1) {
          state.unpublishedJobs[inUnpublishedIdx] = job as any;
        }
      }

      const favIdx = state.favouriteJobs.findIndex((j) => j.id === job.id);
      if (favIdx !== -1) {
        state.favouriteJobs[favIdx] = { ...state.favouriteJobs[favIdx], ...job } as Job;
      }

      if (state.selectedJob?.id === job.id) {
        state.selectedJob = job;
      }
      state.error = null;
    },
    softDeleteJobRequest: (state, action: PayloadAction<SoftDeleteJobPayload>) => {
      state.softDeleteJobLoadingJobId = action.payload.jobId;
      state.error = null;
    },
    softDeleteJobSuccess: (state, action: PayloadAction<string>) => {
      state.softDeleteJobLoadingJobId = null;
      const jobId = action.payload;
      const beforePub = state.publishedJobs.length;
      const beforeUnpub = state.unpublishedJobs.length;

      state.publishedJobs = state.publishedJobs.filter((job) => job.id !== jobId);
      state.unpublishedJobs = state.unpublishedJobs.filter((job) => job.id !== jobId);

      if (state.publishedJobs.length !== beforePub) {
        state.publishedCount = Math.max(0, state.publishedCount - 1);
        state.publishedPagination.total = Math.max(0, state.publishedPagination.total - 1);
      }
      if (state.unpublishedJobs.length !== beforeUnpub) {
        state.unpublishedCount = Math.max(0, state.unpublishedCount - 1);
        state.unpublishedPagination.total = Math.max(0, state.unpublishedPagination.total - 1);
      }

      if (state.favouriteJobIds.includes(jobId)) {
        state.favouriteJobIds = state.favouriteJobIds.filter((id: string) => id !== jobId);
        state.favouriteJobs = state.favouriteJobs.filter((job: Job) => job.id !== jobId);
        state.favouritesCount = state.favouriteJobIds.length;
      }

      if (state.selectedJob?.id === jobId) {
        state.selectedJob = null;
      }
      state.error = null;
    },
    softDeleteJobFailure: (state, action: PayloadAction<string>) => {
      state.softDeleteJobLoadingJobId = null;
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
    setJobSort: (
      state,
      action: PayloadAction<{
        sortBy: string;
        sortDir: "asc" | "desc";
      }>
    ) => {
      const { sortBy, sortDir } = action.payload;
      state.filters.sortBy = sortBy;
      state.filters.sortDir = sortDir;

      const fieldMap: Record<string, string> = {
        "Job Title": "title",
        "Location": "location",
        "Close Date": "close_date",
      };
      const backendField = fieldMap[sortBy];
      state.filters.orderBy = backendField
        ? sortDir === "desc"
          ? `-${backendField}`
          : backendField
        : "";

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
        sortBy: "",
        sortDir: "desc",
        orderBy: "",
      };

      // UX: reset pagination + hasMore after clearing filters.
      state.publishedPagination.page = 1;
      state.unpublishedPagination.page = 1;
      state.publishedHasMore = true;
      state.unpublishedHasMore = true;
    },
    setActiveTab: (state, action: PayloadAction<"Published" | "Draft" | "Favourites">) => {
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

    generateJobDescriptionRequest: (state) => {
      state.generateDescriptionLoading = true;
      state.error = null;
      state.generatedJobDescription = null;
    },
    generateJobDescriptionSuccess: (
      state,
      action: PayloadAction<GenerateJobDescriptionResponse>
    ) => {
      state.generateDescriptionLoading = false;
      state.error = null;
      state.generatedJobDescription = action.payload;
    },
    generateJobDescriptionFailure: (state, action: PayloadAction<string>) => {
      state.generateDescriptionLoading = false;
      state.error = action.payload;
    },
    clearGeneratedJobDescription: (state) => {
      state.generatedJobDescription = null;
    },

    // ⭐ Hydrate favourites from persistent storage
    setFavouriteJobIds: (state, action: PayloadAction<string[]>) => {
      state.favouriteJobIds = action.payload;
    },

    // ⭐ Toggle a job ID in favourite list
    toggleFavouriteJob: (state, action: PayloadAction<string>) => {
      const jobId = action.payload;
      const exists = state.favouriteJobIds.includes(jobId);
      if (exists) {
        state.favouriteJobIds = state.favouriteJobIds.filter((id: string) => id !== jobId);
        state.favouriteJobs = state.favouriteJobs.filter((job: Job) => job.id !== jobId);
      } else {
        state.favouriteJobIds.push(jobId);
      }
      state.favouritesCount = state.favouriteJobIds.length;
    },

    // ⭐ Clear favourites list (used when no IDs)
    clearFavouriteJobs: (state) => {
      state.favouriteJobs = [];
      state.favouritesPagination = {
        page: 1,
        limit: state.favouritesPagination.limit,
        total: 0,
      };
      state.favouritesHasMore = false;
      state.favouritesCount = 0;
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
  setJobSort,
  clearJobFilters,
  setActiveTab,
  getJobNameListRequest,
  getJobNameListSuccess,
  getJobNameListFailure,
  clearJobNameList,
  generateJobDescriptionRequest,
  generateJobDescriptionSuccess,
  generateJobDescriptionFailure,
  clearGeneratedJobDescription,
  clearCreatedJobForWizard,
  submitApplicationFormStepRequest,
  submitApplicationFormStepSuccess,
  submitApplicationFormStepFailure,
  clearApplicationFormSubmitError,
  fetchApplicationFormDraftRequest,
  fetchApplicationFormDraftSuccess,
  fetchApplicationFormDraftFailure,
  clearApplicationFormDraft,
  clearApplicationFormDraftError,
  patchJobUsersSharedRequest,
  patchJobUsersSharedSuccess,
  patchJobUsersSharedFailure,
  clearJobUsersSharedSubmitSuccess,
  patchJobDetailsRequest,
  patchJobDetailsSuccess,
  patchJobDetailsFailure,
  patchJobPublishedRequest,
  patchJobPublishedSuccess,
  patchJobPublishedFailure,
  assignWorkflowToJobRequest,
  assignWorkflowToJobFailure,
  clearAssignWorkflowSubmitSuccess,
  patchJobWorkflowSuccess,
  softDeleteJobRequest,
  softDeleteJobSuccess,
  softDeleteJobFailure,
  setFavouriteJobIds,
  toggleFavouriteJob,
  clearFavouriteJobs,
} = jobsSlice.actions;

export default jobsSlice.reducer;

