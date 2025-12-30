import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApplicationsState, Application, ApplicationsListResponse, ApplicationResponseItem, ResumeScreeningResponseItem, AssessmentLog, AssessmentReport, AssessmentDetailedReport, ScreeningAssessment, PersonalityScreeningResponse} from "./types";

const initialState: ApplicationsState = {
  applications: [],
  applicationResponses: [],
  resumeScreeningResponses: [],
  assessmentLogs: [],
  personalityScreeningList: [],
  personalityScreeningResponses: [],
  assessmentReport: null,
  assessmentDetailedReport: null,
  selectedApplication: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  hasMore: true,
  filters: {
    name:'',
    email:'',
    appliedFor: '',
    contact:'',
    sort:""
  },
};

const applicationsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    getApplicationsRequest: (state, _action: PayloadAction<any>) => {
      state.loading = true;
      state.error = null;

      if (_action.payload?.reset) {
        state.applications = [];
        state.pagination.page = 1;
      }
    },

    getApplicationsSuccess: (
      state,
      action: PayloadAction<{
        page: number;
        append: boolean;
        data: ApplicationsListResponse;
      }>
    ) => {
      const { page, append, data } = action.payload;
      state.loading = false;
      state.pagination.page = page ?? 1;
      state.pagination.total = data?.count ?? 0;

      const results = data?.results ?? [];

      state.applications = append ? [...state.applications, ...results] : results;

      // If server returns next/previous, you can also use: state.hasMore = Boolean(data.next)
      state.hasMore = state.applications.length < (data?.count ?? 0);
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
    getApplicationResponsesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    getApplicationResponsesSuccess: (
      state,
      action: PayloadAction<ApplicationResponseItem[]>
    ) => {
      state.loading = false;
      state.applicationResponses = action.payload;
    },

    getApplicationResponsesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    getResumeScreeningResponsesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    getResumeScreeningResponsesSuccess: (
      state,
      action: PayloadAction<ResumeScreeningResponseItem[]>
    ) => {
      state.loading = false;
      state.resumeScreeningResponses = action.payload;
    },

    getResumeScreeningResponsesFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.loading = false;
      state.error = action.payload;
    },

    getAssessmentLogsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    getAssessmentLogsSuccess: (
      state,
      action: PayloadAction<AssessmentLog[]>
    ) => {
      state.loading = false;
      state.assessmentLogs = action.payload;
    },

    getAssessmentLogsFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.loading = false;
      state.error = action.payload;
    },

    getAssessmentReportRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    getAssessmentReportSuccess: (
      state,
      action: PayloadAction<AssessmentReport>
    ) => {
      state.loading = false;
      state.assessmentReport = action.payload;
    },

    getAssessmentReportFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.loading = false;
      state.error = action.payload;
    },

    getAssessmentDetailedReportRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    getAssessmentDetailedReportSuccess: (
      state,
      action: PayloadAction<AssessmentDetailedReport>
    ) => {
      state.loading = false;
      state.assessmentDetailedReport = action.payload;
    },

    getAssessmentDetailedReportFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.loading = false;
      state.error = action.payload;
    },
    // applications/slice.ts
    getPersonalityScreeningListRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    getPersonalityScreeningListSuccess: (
      state,
      action: PayloadAction<ScreeningAssessment[]>
    ) => {
      state.loading = false;
      state.personalityScreeningList = action.payload;
    },

    getPersonalityScreeningListFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.loading = false;
      state.error = action.payload;
    },

    getPersonalityScreeningResponsesRequest: state => {
      state.loading = true;
      state.error = null;
    },
    
    getPersonalityScreeningResponsesSuccess: (
      state,
      action: PayloadAction<PersonalityScreeningResponse[]>
    ) => {
      state.loading = false;
      state.personalityScreeningResponses = action.payload;
    },
    
    getPersonalityScreeningResponsesFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.loading = false;
      state.error = action.payload;
    },

    setApplicationsFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
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
  getResumeScreeningResponsesRequest,
  getResumeScreeningResponsesSuccess,
  getResumeScreeningResponsesFailure,
  getApplicationResponsesRequest,
  getApplicationResponsesSuccess,
  getApplicationResponsesFailure,
  getAssessmentLogsRequest,
  getAssessmentLogsSuccess,
  getAssessmentLogsFailure,
  getAssessmentReportRequest,
  getAssessmentReportSuccess,
  getAssessmentReportFailure,
  getAssessmentDetailedReportRequest,
  getAssessmentDetailedReportSuccess,
  getAssessmentDetailedReportFailure,
  getPersonalityScreeningListRequest,
  getPersonalityScreeningListSuccess,
  getPersonalityScreeningListFailure,
  getPersonalityScreeningResponsesRequest,
  getPersonalityScreeningResponsesSuccess,
  getPersonalityScreeningResponsesFailure,
  setApplicationsFilters,
} = applicationsSlice.actions;

export default applicationsSlice.reducer;

