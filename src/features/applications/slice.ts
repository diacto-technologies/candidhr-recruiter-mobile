import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApplicationsState, Application, ApplicationsListResponse, ApplicationResponseItem, ResumeScreeningResponseItem, AssessmentLog, AssessmentReport, AssessmentDetailedReport, ScreeningAssessment, PersonalityScreeningResponse, ApplicationStage, ReasonCategory, ReasonListItem, PerformanceReportResponse, AssessmentOptionsReportResponse, AssessmentOption } from "./types";

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
  loadingAddApplicationReasons: false,
  addApplicationReasonsError: null,
  loadingUpdateApplicationReason: false,
  updateApplicationReasonError: null,
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
  loadingExportApplications: false,
  exportApplicationsError: null,
  loadingExportApplicantPdf: false,
  exportApplicantPdfError: null,
  applicationStages: [],
  error: null,
  performanceReport: null,
  loadingPerformanceReport: false,
  performanceReportError: null,
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
  assessmentOptions: [],
  assessmentOptionsApplicationId: null,
  assessmentOptionsPage: 1,
  assessmentOptionsHasMore: true,
  loadingAssessmentOptions: false,
  assessmentOptionsError: null as string | null,
  loadingExportAssessmentReport: false,
  exportAssessmentReportError: null,
};

const applicationsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    exportApplicationsRequest: (state) => {
      state.loadingExportApplications = true;
      state.exportApplicationsError = null;
    },
    exportApplicationsSuccess: (state) => {
      state.loadingExportApplications = false;
      state.exportApplicationsError = null;
    },
    exportApplicationsFailure: (state, action: PayloadAction<string>) => {
      state.loadingExportApplications = false;
      state.exportApplicationsError = action.payload;
    },

    // exportApplicantPdfRequest: (state) => {
    //   state.loadingExportApplicantPdf = true;
    //   state.exportApplicantPdfError = null;
    // },
    // exportApplicantPdfSuccess: (state) => {
    //   state.loadingExportApplicantPdf = false;
    //   state.exportApplicantPdfError = null;
    // },
    // exportApplicantPdfFailure: (state, action: PayloadAction<string>) => {
    //   state.loadingExportApplicantPdf = false;
    //   state.exportApplicantPdfError = action.payload;
    // },

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

    getPerformanceReportRequest: (state) => {
      state.loadingPerformanceReport = true;
      state.performanceReportError = null;
    },

    getPerformanceReportSuccess: (
      state,
      action: PayloadAction<PerformanceReportResponse>
    ) => {
      state.loadingPerformanceReport = false;
      state.performanceReport = action.payload;
    },

    getPerformanceReportFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.loadingPerformanceReport = false;
      state.performanceReportError = action.payload;
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

    addApplicationReasonsRequest: (state) => {
      state.loadingAddApplicationReasons = true;
      state.addApplicationReasonsError = null;
    },
    addApplicationReasonsSuccess: (state) => {
      state.loadingAddApplicationReasons = false;
      state.addApplicationReasonsError = null;
    },
    addApplicationReasonsFailure: (state, action: PayloadAction<string>) => {
      state.loadingAddApplicationReasons = false;
      state.addApplicationReasonsError = action.payload;
    },

    updateApplicationReasonRequest: (state) => {
      state.loadingUpdateApplicationReason = true;
      state.updateApplicationReasonError = null;
    },
    updateApplicationReasonSuccess: (state) => {
      state.loadingUpdateApplicationReason = false;
      state.updateApplicationReasonError = null;
    },
    updateApplicationReasonFailure: (state, action: PayloadAction<string>) => {
      state.loadingUpdateApplicationReason = false;
      state.updateApplicationReasonError = action.payload;
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

    getAssessmentOptionsReportRequest: (
      state,
      action: PayloadAction<{ application_id: string; page?: number }>
    ) => {
      state.loadingAssessmentOptions = true;
      state.assessmentOptionsError = null;

      const applicationId = action.payload?.application_id;
      const requestedPage = action.payload?.page ?? 1;

      const applicationChanged =
        Boolean(applicationId) &&
        state.assessmentOptionsApplicationId !== applicationId;

      // Reset when first page OR application changes (prevents mixing lists)
      if (requestedPage === 1 || applicationChanged) {
        state.assessmentOptions = [];
        state.assessmentOptionsHasMore = true;
      }

      state.assessmentOptionsApplicationId = applicationId ?? null;
      // Store the page being fetched; on success we advance to next page.
      state.assessmentOptionsPage = requestedPage;
    },

    getAssessmentOptionsReportSuccess: (
      state,
      action: PayloadAction<{
        application_id: string;
        page: number;
        response: AssessmentOptionsReportResponse;
      }>
    ) => {
      state.loadingAssessmentOptions = false;

      const { application_id, page, response } = action.payload;
      const assessmentlogs = response?.assessmentlogs ?? [];

      // Ignore stale responses (e.g. user switched applications mid-flight)
      if (
        state.assessmentOptionsApplicationId &&
        state.assessmentOptionsApplicationId !== application_id
      ) {
        return;
      }

      // Merge with dedupe (stable, prevents duplicate rows on re-fetch)
      if (page === 1) {
        state.assessmentOptions = assessmentlogs;
      } else if (assessmentlogs.length > 0) {
        const byId = new Map<string, AssessmentOption>();
        for (const item of state.assessmentOptions) byId.set(item.id, item);
        for (const item of assessmentlogs) byId.set(item.id, item);
        state.assessmentOptions = Array.from(byId.values());
      }

      // Pagination logic (supports current API + future pagination metadata)
      const totalPages = response?.total_pages;
      const pageSize = response?.page_size;

      if (typeof totalPages === "number" && totalPages > 0) {
        state.assessmentOptionsHasMore = page < totalPages;
      } else if (typeof pageSize === "number" && pageSize > 0) {
        state.assessmentOptionsHasMore = assessmentlogs.length >= pageSize;
      } else {
        // Fallback: if server returns empty list => no more.
        state.assessmentOptionsHasMore = assessmentlogs.length > 0;
      }

      // Keep `assessmentOptionsPage` as the NEXT page to request
      state.assessmentOptionsPage = state.assessmentOptionsHasMore
        ? page + 1
        : page;
    },

    getAssessmentOptionsReportFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.loadingAssessmentOptions = false;
      state.assessmentOptionsError = action.payload;
    },
    exportAssessmentReportRequest: (state) => {
      state.loadingExportAssessmentReport = true;
      state.exportAssessmentReportError = null;
    },
    exportAssessmentReportSuccess: (state) => {
      state.loadingExportAssessmentReport = false;
      state.exportAssessmentReportError = null;
    },
    exportAssessmentReportFailure: (state, action: PayloadAction<string>) => {
      state.loadingExportAssessmentReport = false;
      state.exportAssessmentReportError = action.payload;
    },
  },
});

export const {
  exportApplicationsRequest,
  exportApplicationsSuccess,
  exportApplicationsFailure,
  // exportApplicantPdfRequest,
  // exportApplicantPdfSuccess,
  // exportApplicantPdfFailure,
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
  addApplicationReasonsRequest,
  addApplicationReasonsSuccess,
  addApplicationReasonsFailure,
  updateApplicationReasonRequest,
  updateApplicationReasonSuccess,
  updateApplicationReasonFailure,
  updateStageStatusRequest,
  updateStageStatusSuccess,
  updateStageStatusFailure,
  markSessionAsReviewedRequest,
  markSessionAsReviewedSuccess,
  markSessionAsReviewedFailure,
  parseResumeRequest,
  parseResumeSuccess,
  parseResumeFailure,
  setSort,
  getPerformanceReportRequest,
  getPerformanceReportSuccess,
  getPerformanceReportFailure,
  getAssessmentOptionsReportRequest,
  getAssessmentOptionsReportSuccess,
  getAssessmentOptionsReportFailure,
  exportAssessmentReportRequest,
  exportAssessmentReportSuccess,
  exportAssessmentReportFailure,
} = applicationsSlice.actions;

export default applicationsSlice.reducer;

