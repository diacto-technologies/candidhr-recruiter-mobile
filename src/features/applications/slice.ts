import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApplicationsState, Application, ApplicationsListResponse, ApplicationResponseItem, ResumeScreeningResponseItem, AssessmentLog, AssessmentReport, AssessmentDetailedReport, ScreeningAssessment, PersonalityScreeningResponse, ApplicationStage, ReasonCategory, ReasonListItem } from "./types";

const initialState: ApplicationsState = {
  applications: [],
  applicationResponses: [],
  resumeScreeningResponses: [],
  assessmentLogs: [],
  personalityScreeningList: [],
  personalityScreeningResponses: [],
  reasonCategoryList: [],
  loadingReasonCategoryList: false,
  reasonCategoryListError: null,
  reasonList: [],
  loadingReasonList: false,
  reasonListError: null,
  applicationReasonsList: [],
  loadingApplicationReasonsList: false,
  applicationReasonsListError: null,
  assessmentReport: null,
  assessmentDetailedReport: null,
  selectedApplication: null,
  loading: false,
  loadingApplications: false,
  loadingApplicationDetail: false,
  loadingAssessment: false,
  loadingPersonality: false,
  loadingResumeScreeningResponses: false,
  loadingMarkSessionReviewed: false,
  loadingParseResume: false,
  loadingUpdateStageStatus: false,
  applicationStages: [],
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  hasMore: true,
  filters: {
    name: '',
    email: '',
    appliedFor: '',
    contact: '',
    sortBy: 'Applied',
    sortDir: 'desc',
    sort: "-applied_at",
    latestStageStatus: '',
    source: '',
    status: '',
    latestStageName: '',
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
      state.loadingApplicationDetail = true;
      state.error = null;
    },
    getApplicationDetailSuccess: (state, action: PayloadAction<Application>) => {
      state.loadingApplicationDetail = false;
      state.selectedApplication = action.payload;
      state.error = null;
    },
    getApplicationDetailFailure: (state, action: PayloadAction<string>) => {
      state.loadingApplicationDetail = false;
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
      state.loadingResumeScreeningResponses = true;
      state.error = null;
    },

    getResumeScreeningResponsesSuccess: (
      state,
      action: PayloadAction<ResumeScreeningResponseItem[]>
    ) => {
      state.loadingResumeScreeningResponses = false;
      state.resumeScreeningResponses = action.payload;
    },

    getResumeScreeningResponsesFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.loadingResumeScreeningResponses = false;
      state.error = action.payload;
    },

    getAssessmentLogsRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.assessmentLogs = [];
      state.assessmentReport = null;
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
      state.assessmentLogs = [];
      state.assessmentReport = null;
    },

    markSessionAsReviewedRequest: (state, _action: PayloadAction<string>) => {
      state.loadingMarkSessionReviewed = true;
      state.error = null;
    },

    markSessionAsReviewedSuccess: (
      state,
      action: PayloadAction<{ sessionId: string; data: { session_status: string; action_taken_by: any; action_taken_at: string } }>
    ) => {
      state.loadingMarkSessionReviewed = false;
      const { sessionId, data } = action.payload;
      const log = state.assessmentLogs.find((l) => l.id === sessionId);
      if (log) {
        log.session_status = data.session_status;
        log.action_taken_by = data.action_taken_by;
        log.action_taken_at = data.action_taken_at;
      }
    },

    markSessionAsReviewedFailure: (state, action: PayloadAction<string>) => {
      state.loadingMarkSessionReviewed = false;
      state.error = action.payload;
    },

    parseResumeRequest: (state, _action: PayloadAction<string>) => {
      state.loadingParseResume = true;
      state.error = null;
    },

    parseResumeSuccess: (state) => {
      state.loadingParseResume = false;
      state.error = null;
    },

    parseResumeFailure: (state, action: PayloadAction<string>) => {
      state.loadingParseResume = false;
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
      state.error = null;
      state.personalityScreeningList = action.payload;

      if (action.payload.length === 0) {
        state.personalityScreeningResponses = [];
      }
    },


    getPersonalityScreeningListFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.loading = false;
      state.error = action.payload;
      state.personalityScreeningList = [];
      state.personalityScreeningResponses = [];
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
      state.personalityScreeningResponses = [];
    },

    setApplicationsFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    setSort: (
      state,
      action: PayloadAction<{
        sortBy: string;
        sortDir: 'asc' | 'desc';
      }>
    ) => {
      const { sortBy, sortDir } = action.payload;

      state.filters.sortBy = sortBy;
      state.filters.sortDir = sortDir;

      // 🔥 UI → API FIELD MAP
      const fieldMap: Record<string, string> = {
        'Applied': 'applied_at',
        'Resume Score': 'resume_score',
        'Last Update': 'last_updated',
        'Applicant name': 'applicant_name',
      };

      const backendField = fieldMap[sortBy];

      if (!backendField) {
        state.filters.sort = '';
        return;
      }

      state.filters.sort =
        sortDir === 'desc'
          ? `-${backendField}`
          : backendField;
    },

    resetPersonalityScreeningState: (state) => {
      state.personalityScreeningList = [];
      state.personalityScreeningResponses = [];
      state.assessmentReport = null;
      state.assessmentDetailedReport = null;
      state.loading = false;
      state.error = null;
    },

    getApplicationStagesRequest: (state) => {
      state.loading = true;
    },

    getApplicationStagesSuccess: (
      state,
      action: PayloadAction<ApplicationStage[]>
    ) => {
      state.loading = false;
      state.applicationStages = action.payload;
    },

    getApplicationStagesFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.loading = false;
      state.error = action.payload;
    },

    getReasonCategoryListRequest: (state) => {
      state.loadingReasonCategoryList = true;
      state.reasonCategoryListError = null;
    },

    getReasonCategoryListSuccess: (
      state,
      action: PayloadAction<ReasonCategory[]>
    ) => {
      state.loadingReasonCategoryList = false;
      state.reasonCategoryList = action.payload;
      state.reasonCategoryListError = null;
    },

    getReasonCategoryListFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.loadingReasonCategoryList = false;
      state.reasonCategoryList = [];
      state.reasonCategoryListError = action.payload;
    },

    getReasonListRequest: (state) => {
      state.loadingReasonList = true;
      state.reasonListError = null;
    },

    getReasonListSuccess: (
      state,
      action: PayloadAction<ReasonListItem[]>
    ) => {
      state.loadingReasonList = false;
      state.reasonList = action.payload;
      state.reasonListError = null;
    },

    getReasonListFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.loadingReasonList = false;
      state.reasonList = [];
      state.reasonListError = action.payload;
    },

    getApplicationReasonsListRequest: (state) => {
      state.loadingApplicationReasonsList = true;
      state.applicationReasonsListError = null;
    },
    getApplicationReasonsListSuccess: (
      state,
      action: PayloadAction<unknown[]>
    ) => {
      state.loadingApplicationReasonsList = false;
      state.applicationReasonsList = action.payload ?? [];
      state.applicationReasonsListError = null;
    },
    getApplicationReasonsListFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.loadingApplicationReasonsList = false;
      state.applicationReasonsList = [];
      state.applicationReasonsListError = action.payload;
    },

    updateStageStatusRequest: (state) => {
      state.loadingUpdateStageStatus = true;
      state.error = null;
    },

    updateStageStatusSuccess: (state) => {
      state.loadingUpdateStageStatus = false;
      state.error = null;
    },

    updateStageStatusFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.loadingUpdateStageStatus = false;
      state.error = action.payload;
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
  resetPersonalityScreeningState,
  getApplicationStagesRequest,
  getApplicationStagesSuccess,
  getApplicationStagesFailure,
  getReasonCategoryListRequest,
  getReasonCategoryListSuccess,
  getReasonCategoryListFailure,
  getReasonListRequest,
  getReasonListSuccess,
  getReasonListFailure,
  getApplicationReasonsListRequest,
  getApplicationReasonsListSuccess,
  getApplicationReasonsListFailure,
  updateStageStatusRequest,
  updateStageStatusSuccess,
  updateStageStatusFailure,
  markSessionAsReviewedRequest,
  markSessionAsReviewedSuccess,
  markSessionAsReviewedFailure,
  parseResumeRequest,
  parseResumeSuccess,
  parseResumeFailure,
  setSort
} = applicationsSlice.actions;

export default applicationsSlice.reducer;

