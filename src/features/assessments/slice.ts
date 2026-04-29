import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sanitizeQuestionTypeForQuestionsListQuery } from "./constants";
import {
  AssessmentListResponse,
  AssessmentBlueprintDetail,
  AssessmentsState,
  AssignedAssessmentListResponse,
  GetAssignedAssessmentsPayload,
  AssignedAssessmentFilters,
  AssessmentDashboardStats,
  BlueprintAssignment,
  BlueprintAssignmentStats,
  BlueprintAssignmentsListResponse,
  BlueprintAssignmentsPagination,
  BlueprintAssignmentsListQuery,
  CreateAssessmentPayload,
  AssessmentResponse,
  CreateAssessmentQuestionPayload,
  AssessmentQuestionResponse,
  AssessmentQuestionsListResponse,
  DeleteAssessmentQuestionPayload,
  UpdateAssessmentQuestionPayload,
  PublishAssessmentTestPayload,
  BulkCreateQuestionsPayload,
  TestBulkUploadResponse,
  TestBulkUploadPayload,
  UpdateAssessmentTestPayload,
  DeleteAssessmentTestPayload,
  DuplicateAssessmentTestPayload,
  DuplicateBlueprintPayload,
  DeleteBlueprintPayload,
  ArchiveBlueprintPayload,
  ArchiveAssessmentTestPayload,
  ShareAssessmentTestPayload,
  ShareBlueprintPayload,
  AssessmentLanguagesListResponse,
  AssessmentCategoriesListResponse,
  AssessmentTestOptionsListResponse,
  SubmitProblemQuestionPayload,
  ReferenceSolutionValidationRow,
  GetAssessmentsListPayload,
  createAssessmentWizardInitialState,
  AssessmentCreateWizardBasicInfo,
  AssessmentCreateWizardSection,
  AssessmentCreateWizardProctoring,
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
  lastAssessmentsListQuery: null,
  counts: {
    all: 0,
    draft: 0,
    published: 0,
    archived: 0,
  },
  assigned: {
    assignedList: [],
    loading: false,
    error: null,
    filters: {
      // Must match the sort UI `sortBy` values in filtersheetcontent
      sortBy: "Assigned At",
      sortDir: "desc",
    },
    pagination: {
      page: 1,
      total: 0,
      next: null,
      previous: null,
    },
    hasMore: true,
  },
  assessmentOverview: {
    blueprintId: null,
    blueprint: null,
    dashboardStats: null,
    assignments: [],
    blueprintAssignmentStats: null,
    loading: false,
    error: null,
    assignmentsListLoading: false,
    assignmentsListError: null,
    assignmentsPagination: null,
    assignmentsListQuery: null,
    assignmentsListSearchText: "",
    assignmentTableSelectedIds: [],
    assignmentExportLoading: false,
    assignmentExportError: null,
    assignCandidatesLoading: false,
    assignCandidatesError: null,
    publishBlueprintLoading: false,
    publishBlueprintError: null,
  },
  testDetail: {
    id: null,
    loading: false,
    error: null,
    data: null,
  },
  questionsList: {
    testId: null,
    questionType: null,
    page: 1,
    loading: false,
    error: null,
    data: null,
  },
  postAssessmentLoading: false,
  postAssessmentError: null,
  createdAssessment: null,
  updateAssessmentTestLoading: false,
  updateAssessmentTestError: null,
  deleteAssessmentTestLoading: false,
  deleteAssessmentTestError: null,
  deleteAssessmentTestTargetId: null,
  duplicateAssessmentTestLoading: false,
  duplicateAssessmentTestError: null,
  duplicateAssessmentTestTargetId: null,
  duplicateBlueprintLoading: false,
  duplicateBlueprintError: null,
  duplicateBlueprintTargetId: null,
  deleteBlueprintLoading: false,
  deleteBlueprintError: null,
  deleteBlueprintTargetId: null,
  archiveBlueprintLoading: false,
  archiveBlueprintError: null,
  archiveBlueprintTargetId: null,
  archiveAssessmentTestLoading: false,
  archiveAssessmentTestError: null,
  archiveAssessmentTestTargetId: null,
  shareAssessmentTestLoading: false,
  shareAssessmentTestError: null,
  shareAssessmentTestTargetId: null,
  shareBlueprintLoading: false,
  shareBlueprintError: null,
  shareBlueprintTargetId: null,
  postAssessmentQuestionLoading: false,
  postAssessmentQuestionError: null,
  postAssessmentQuestionReferenceSolutionErrors: null,
  createdAssessmentQuestion: null,
  deleteAssessmentQuestionLoading: false,
  deleteAssessmentQuestionError: null,
  updateAssessmentQuestionLoading: false,
  updateAssessmentQuestionError: null,
  publishAssessmentTestLoading: false,
  publishAssessmentTestError: null,
  bulkCreateQuestionsLoading: false,
  bulkCreateQuestionsError: null,
  downloadTestTemplateLoading: false,
  downloadTestTemplateError: null,
  testBulkUploadLoading: false,
  testBulkUploadError: null,
  testBulkUploadResult: null,
  languagesList: {
    items: [],
    loading: false,
    error: null,
    page: 1,
    pageSize: 100,
    count: 0,
    totalPages: 0,
    hasMore: false,
  },
  categoriesList: {
    items: [],
    loading: false,
    error: null,
    page: 1,
    count: 0,
    hasMore: false,
  },
  testOptionsList: {
    items: [],
    loading: false,
    error: null,
    page: 1,
    pageSize: 20,
    count: 0,
    hasMore: false,
  },
  assessmentCreateWizard: { ...createAssessmentWizardInitialState },
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

      state.hasMore = Boolean(data.next);
      state.counts = {
        all: data.counts?.all ?? 0,
        draft: data.counts?.draft ?? 0,
        published: data.counts?.published ?? 0,
        archived: data.counts?.archived ?? 0,
      };
    },

    getAssessmentsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    saveLastAssessmentsListQuery: (
      state,
      action: PayloadAction<GetAssessmentsListPayload | undefined>
    ) => {
      state.lastAssessmentsListQuery = action.payload ?? null;
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

    setAssignedAssessmentSort: (
      state,
      action: PayloadAction<{ sortBy: string; sortDir: "asc" | "desc" }>
    ) => {
      const { sortBy, sortDir } = action.payload;
      state.assigned.filters.sortBy = sortBy;
      state.assigned.filters.sortDir = sortDir;
    },

    clearAssignedAssessmentFilters: (state) => {
      state.assigned.filters = {
        sortBy: "Assigned At",
        sortDir: "desc",
      };
    },

    assessmentOverviewRequest: (
      state,
      action: PayloadAction<{ blueprintId?: string | null }>
    ) => {
      const prevId = state.assessmentOverview.blueprintId;
      const id = action.payload?.blueprintId ?? null;
      if (id !== prevId) {
        state.assessmentOverview.assignmentsListQuery = null;
        state.assessmentOverview.assignmentsListSearchText = "";
        state.assessmentOverview.assignmentTableSelectedIds = [];
      }
      state.assessmentOverview.error = null;
      state.assessmentOverview.blueprintId = id;
      state.assessmentOverview.loading = Boolean(id);
      state.assessmentOverview.assignmentsListError = null;
      if (!id) {
        state.assessmentOverview.blueprint = null;
        state.assessmentOverview.assignments = [];
        state.assessmentOverview.blueprintAssignmentStats = null;
        state.assessmentOverview.assignmentsPagination = null;
        state.assessmentOverview.assignmentsListLoading = false;
        state.assessmentOverview.assignmentsListSearchText = "";
        state.assessmentOverview.assignmentTableSelectedIds = [];
      }
    },

    assessmentOverviewSuccess: (
      state,
      action: PayloadAction<{
        blueprintId: string | null;
        blueprint: AssessmentBlueprintDetail | null;
        dashboardStats: AssessmentDashboardStats | null;
        assignments: BlueprintAssignment[];
        blueprintAssignmentStats: BlueprintAssignmentStats | null;
        assignmentsPagination?: BlueprintAssignmentsPagination | null;
      }>
    ) => {
      const o = state.assessmentOverview;
      o.loading = false;
      o.error = null;
      o.assignmentsListLoading = false;
      o.assignmentsListError = null;
      o.blueprintId = action.payload.blueprintId;
      o.blueprint = action.payload.blueprint;
      o.dashboardStats = action.payload.dashboardStats;
      o.assignments = action.payload.assignments;
      o.blueprintAssignmentStats = action.payload.blueprintAssignmentStats;
      if (action.payload.assignmentsPagination !== undefined) {
        o.assignmentsPagination = action.payload.assignmentsPagination;
      }
      if (action.payload.blueprintId) {
        o.assignmentsListQuery = null;
      }
      const known = new Set((action.payload.assignments ?? []).map((r) => r.id));
      o.assignmentTableSelectedIds = o.assignmentTableSelectedIds.filter((id) =>
        known.has(id)
      );
    },

    assessmentOverviewFailure: (state, action: PayloadAction<string>) => {
      state.assessmentOverview.loading = false;
      state.assessmentOverview.assignmentsListLoading = false;
      state.assessmentOverview.error = action.payload;
      if (state.assessmentOverview.blueprintId) {
        state.assessmentOverview.blueprint = null;
        state.assessmentOverview.assignments = [];
        state.assessmentOverview.blueprintAssignmentStats = null;
        state.assessmentOverview.assignmentsPagination = null;
        state.assessmentOverview.assignmentsListSearchText = "";
        state.assessmentOverview.assignmentTableSelectedIds = [];
      }
    },

    setAssignmentsListSearchText: (state, action: PayloadAction<string>) => {
      state.assessmentOverview.assignmentsListSearchText = action.payload;
    },

    blueprintAssignmentsListRequest: (
      state,
      action: PayloadAction<{
        blueprintId: string;
        page: number;
        append?: boolean;
        candidate_name?: string;
        candidate_email?: string;
        status?: string;
        o?: string;
      }>
    ) => {
      const {
        blueprintId,
        page,
        append,
        candidate_name,
        candidate_email,
        status,
        o = "-created_at",
      } = action.payload;
      const overview = state.assessmentOverview;
      overview.assignmentsListLoading = true;
      overview.assignmentsListError = null;
      const query: BlueprintAssignmentsListQuery = {
        blueprintId,
        page,
        o,
        ...(candidate_name?.trim() ? { candidate_name: candidate_name.trim() } : {}),
        ...(candidate_email?.trim() ? { candidate_email: candidate_email.trim() } : {}),
        ...(status && status !== "all" ? { status } : {}),
      };
      overview.assignmentsListQuery = query;
      if (!append && blueprintId !== overview.blueprintId) {
        overview.assignments = [];
      }
    },

    blueprintAssignmentsListSuccess: (
      state,
      action: PayloadAction<{
        blueprintId: string;
        page: number;
        append?: boolean;
        data: BlueprintAssignmentsListResponse;
      }>
    ) => {
      const o = state.assessmentOverview;
      o.assignmentsListLoading = false;
      o.assignmentsListError = null;
      const { data, append, page } = action.payload;
      const results = data.results ?? [];
      o.assignments = append ? [...o.assignments, ...results] : results;
      o.assignmentsPagination = {
        count: data.count ?? 0,
        next: data.next ?? null,
        previous: data.previous ?? null,
        page,
      };
      const known = new Set(o.assignments.map((r) => r.id));
      o.assignmentTableSelectedIds = o.assignmentTableSelectedIds.filter((id) =>
        known.has(id)
      );
    },

    blueprintAssignmentsListFailure: (state, action: PayloadAction<string>) => {
      state.assessmentOverview.assignmentsListLoading = false;
      state.assessmentOverview.assignmentsListError = action.payload;
    },

    toggleAssignmentTableSelectedId: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const arr = state.assessmentOverview.assignmentTableSelectedIds;
      const idx = arr.indexOf(id);
      if (idx >= 0) {
        arr.splice(idx, 1);
      } else {
        arr.push(id);
      }
    },

    setAssignmentTableSelectedForIds: (
      state,
      action: PayloadAction<{ ids: string[]; selected: boolean }>
    ) => {
      const { ids, selected } = action.payload;
      const next = new Set(state.assessmentOverview.assignmentTableSelectedIds);
      if (selected) {
        ids.forEach((id) => next.add(id));
      } else {
        ids.forEach((id) => next.delete(id));
      }
      state.assessmentOverview.assignmentTableSelectedIds = [...next];
    },

    clearAssignmentTableSelectedIds: (state) => {
      state.assessmentOverview.assignmentTableSelectedIds = [];
    },

    assignmentExportReportRequest: (state) => {
      state.assessmentOverview.assignmentExportLoading = true;
      state.assessmentOverview.assignmentExportError = null;
    },

    assignmentExportReportSuccess: (state) => {
      state.assessmentOverview.assignmentExportLoading = false;
      state.assessmentOverview.assignmentExportError = null;
    },

    assignmentExportReportFailure: (state, action: PayloadAction<string>) => {
      state.assessmentOverview.assignmentExportLoading = false;
      state.assessmentOverview.assignmentExportError = action.payload;
    },

    assignCandidatesRequest: (state) => {
      state.assessmentOverview.assignCandidatesLoading = true;
      state.assessmentOverview.assignCandidatesError = null;
    },

    assignCandidatesSuccess: (state) => {
      state.assessmentOverview.assignCandidatesLoading = false;
      state.assessmentOverview.assignCandidatesError = null;
    },

    assignCandidatesFailure: (state, action: PayloadAction<string>) => {
      state.assessmentOverview.assignCandidatesLoading = false;
      state.assessmentOverview.assignCandidatesError = action.payload;
    },

    publishBlueprintRequest: (state) => {
      state.assessmentOverview.publishBlueprintLoading = true;
      state.assessmentOverview.publishBlueprintError = null;
    },

    publishBlueprintSuccess: (state) => {
      state.assessmentOverview.publishBlueprintLoading = false;
      state.assessmentOverview.publishBlueprintError = null;
    },

    publishBlueprintFailure: (state, action: PayloadAction<string>) => {
      state.assessmentOverview.publishBlueprintLoading = false;
      state.assessmentOverview.publishBlueprintError = action.payload;
    },

    fetchAssessmentTestDetailRequest: (
      state,
      action: PayloadAction<{ id: string }>
    ) => {
      const id = action.payload.id;
      state.testDetail.id = id;
      state.testDetail.loading = true;
      state.testDetail.error = null;
      state.testDetail.data = null;
    },

    fetchAssessmentTestDetailSuccess: (
      state,
      action: PayloadAction<{ id: string; data: AssessmentResponse }>
    ) => {
      state.testDetail.id = action.payload.id;
      state.testDetail.loading = false;
      state.testDetail.error = null;
      state.testDetail.data = action.payload.data;
    },

    fetchAssessmentTestDetailFailure: (state, action: PayloadAction<string>) => {
      state.testDetail.loading = false;
      state.testDetail.error = action.payload;
      state.testDetail.data = null;
    },

    /** Call when opening "Create Test" so the wizard is not filled with a previously loaded test. */
    clearAssessmentTestDetail: (state) => {
      state.testDetail.id = null;
      state.testDetail.loading = false;
      state.testDetail.error = null;
      state.testDetail.data = null;
    },

    fetchAssessmentQuestionsListRequest: (
      state,
      action: PayloadAction<{ testId: string; page?: number; questionType?: string | null }>
    ) => {
      const testId = action.payload.testId;
      const page = action.payload.page ?? 1;
      if (state.questionsList.testId !== testId) {
        state.questionsList.questionType = null;
      }
      state.questionsList.testId = testId;
      state.questionsList.page = page;
      if (Object.prototype.hasOwnProperty.call(action.payload, "questionType")) {
        const raw = action.payload.questionType ?? null;
        state.questionsList.questionType =
          sanitizeQuestionTypeForQuestionsListQuery(raw ?? undefined) ?? null;
      }
      state.questionsList.loading = true;
      state.questionsList.error = null;
      state.questionsList.data = null;
    },

    fetchAssessmentQuestionsListSuccess: (
      state,
      action: PayloadAction<{
        testId: string;
        page: number;
        data: AssessmentQuestionsListResponse;
      }>
    ) => {
      state.questionsList.testId = action.payload.testId;
      state.questionsList.page = action.payload.page;
      state.questionsList.loading = false;
      state.questionsList.error = null;
      state.questionsList.data = action.payload.data;
    },

    fetchAssessmentQuestionsListFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.questionsList.loading = false;
      state.questionsList.error = action.payload;
      state.questionsList.data = null;
    },

    postAssessmentTestRequest: (
      state,
      _action: PayloadAction<CreateAssessmentPayload>
    ) => {
      state.postAssessmentLoading = true;
      state.postAssessmentError = null;
      state.createdAssessment = null;
    },
    
    postAssessmentTestSuccess: (
      state,
      action: PayloadAction<AssessmentResponse>
    ) => {
      state.postAssessmentLoading = false;
      state.createdAssessment = action.payload;
    },
    
    postAssessmentTestFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.postAssessmentLoading = false;
      state.postAssessmentError = action.payload;
    },

    updateAssessmentTestRequest: (
      state,
      _action: PayloadAction<UpdateAssessmentTestPayload>
    ) => {
      state.updateAssessmentTestLoading = true;
      state.updateAssessmentTestError = null;
    },

    updateAssessmentTestSuccess: (
      state,
      action: PayloadAction<{ testId: string; data: AssessmentResponse }>
    ) => {
      state.updateAssessmentTestLoading = false;
      state.updateAssessmentTestError = null;
      const id = action.payload.testId;
      if (state.testDetail.data?.id === id) {
        state.testDetail.data = action.payload.data;
      }
    },

    updateAssessmentTestFailure: (state, action: PayloadAction<string>) => {
      state.updateAssessmentTestLoading = false;
      state.updateAssessmentTestError = action.payload;
    },

    deleteAssessmentTestRequest: (
      state,
      action: PayloadAction<DeleteAssessmentTestPayload>
    ) => {
      state.deleteAssessmentTestLoading = true;
      state.deleteAssessmentTestError = null;
      state.deleteAssessmentTestTargetId = action.payload.testId?.trim() ?? null;
    },

    deleteAssessmentTestSuccess: (
      state,
      action: PayloadAction<{ testId: string }>
    ) => {
      state.deleteAssessmentTestLoading = false;
      state.deleteAssessmentTestError = null;
      state.deleteAssessmentTestTargetId = null;
      const id = action.payload.testId;
      if (state.testDetail.id === id || state.testDetail.data?.id === id) {
        state.testDetail = {
          id: null,
          loading: false,
          error: null,
          data: null,
        };
      }
    },

    deleteAssessmentTestFailure: (state, action: PayloadAction<string>) => {
      state.deleteAssessmentTestLoading = false;
      state.deleteAssessmentTestError = action.payload;
      state.deleteAssessmentTestTargetId = null;
    },

    duplicateAssessmentTestRequest: (
      state,
      action: PayloadAction<DuplicateAssessmentTestPayload>
    ) => {
      state.duplicateAssessmentTestLoading = true;
      state.duplicateAssessmentTestError = null;
      state.duplicateAssessmentTestTargetId = action.payload.testId?.trim() ?? null;
    },

    duplicateAssessmentTestSuccess: (state) => {
      state.duplicateAssessmentTestLoading = false;
      state.duplicateAssessmentTestError = null;
      state.duplicateAssessmentTestTargetId = null;
    },

    duplicateAssessmentTestFailure: (state, action: PayloadAction<string>) => {
      state.duplicateAssessmentTestLoading = false;
      state.duplicateAssessmentTestError = action.payload;
      state.duplicateAssessmentTestTargetId = null;
    },

    duplicateBlueprintRequest: (
      state,
      action: PayloadAction<DuplicateBlueprintPayload>
    ) => {
      state.duplicateBlueprintLoading = true;
      state.duplicateBlueprintError = null;
      state.duplicateBlueprintTargetId =
        action.payload.blueprintId?.trim() ?? null;
    },

    duplicateBlueprintSuccess: (state) => {
      state.duplicateBlueprintLoading = false;
      state.duplicateBlueprintError = null;
      state.duplicateBlueprintTargetId = null;
    },

    duplicateBlueprintFailure: (state, action: PayloadAction<string>) => {
      state.duplicateBlueprintLoading = false;
      state.duplicateBlueprintError = action.payload;
      state.duplicateBlueprintTargetId = null;
    },

    deleteBlueprintRequest: (
      state,
      action: PayloadAction<DeleteBlueprintPayload>
    ) => {
      state.deleteBlueprintLoading = true;
      state.deleteBlueprintError = null;
      state.deleteBlueprintTargetId =
        action.payload.blueprintId?.trim() ?? null;
    },

    deleteBlueprintSuccess: (
      state,
      action: PayloadAction<{ blueprintId: string }>
    ) => {
      state.deleteBlueprintLoading = false;
      state.deleteBlueprintError = null;
      state.deleteBlueprintTargetId = null;
      const id = action.payload.blueprintId;
      if (state.assessmentOverview.blueprintId === id) {
        state.assessmentOverview.blueprint = null;
        state.assessmentOverview.assignments = [];
        state.assessmentOverview.blueprintAssignmentStats = null;
        state.assessmentOverview.assignmentsPagination = null;
      }
      if (state.assessmentCreateWizard.blueprintId === id) {
        state.assessmentCreateWizard = { ...createAssessmentWizardInitialState };
      }
    },

    deleteBlueprintFailure: (state, action: PayloadAction<string>) => {
      state.deleteBlueprintLoading = false;
      state.deleteBlueprintError = action.payload;
      state.deleteBlueprintTargetId = null;
    },

    archiveBlueprintRequest: (
      state,
      action: PayloadAction<ArchiveBlueprintPayload>
    ) => {
      state.archiveBlueprintLoading = true;
      state.archiveBlueprintError = null;
      state.archiveBlueprintTargetId =
        action.payload.blueprintId?.trim() ?? null;
    },

    archiveBlueprintSuccess: (
      state,
      action: PayloadAction<{ blueprintId: string }>
    ) => {
      state.archiveBlueprintLoading = false;
      state.archiveBlueprintError = null;
      state.archiveBlueprintTargetId = null;
      const id = action.payload.blueprintId;
      if (
        state.assessmentOverview.blueprintId === id &&
        state.assessmentOverview.blueprint
      ) {
        state.assessmentOverview.blueprint = {
          ...state.assessmentOverview.blueprint,
          is_archived: true,
        };
      }
    },

    archiveBlueprintFailure: (state, action: PayloadAction<string>) => {
      state.archiveBlueprintLoading = false;
      state.archiveBlueprintError = action.payload;
      state.archiveBlueprintTargetId = null;
    },

    archiveAssessmentTestRequest: (
      state,
      action: PayloadAction<ArchiveAssessmentTestPayload>
    ) => {
      state.archiveAssessmentTestLoading = true;
      state.archiveAssessmentTestError = null;
      state.archiveAssessmentTestTargetId = action.payload.testId?.trim() ?? null;
    },

    archiveAssessmentTestSuccess: (
      state,
      action: PayloadAction<{ testId: string }>
    ) => {
      state.archiveAssessmentTestLoading = false;
      state.archiveAssessmentTestError = null;
      state.archiveAssessmentTestTargetId = null;
      const id = action.payload.testId;
      if (state.testDetail.data?.id === id) {
        state.testDetail.data = {
          ...state.testDetail.data,
          is_archived: true,
        };
      }
    },

    archiveAssessmentTestFailure: (state, action: PayloadAction<string>) => {
      state.archiveAssessmentTestLoading = false;
      state.archiveAssessmentTestError = action.payload;
      state.archiveAssessmentTestTargetId = null;
    },

    shareAssessmentTestRequest: (
      state,
      action: PayloadAction<ShareAssessmentTestPayload>
    ) => {
      state.shareAssessmentTestLoading = true;
      state.shareAssessmentTestError = null;
      state.shareAssessmentTestTargetId = action.payload.testId?.trim() ?? null;
    },

    shareAssessmentTestSuccess: (state) => {
      state.shareAssessmentTestLoading = false;
      state.shareAssessmentTestError = null;
      state.shareAssessmentTestTargetId = null;
    },

    shareAssessmentTestFailure: (state, action: PayloadAction<string>) => {
      state.shareAssessmentTestLoading = false;
      state.shareAssessmentTestError = action.payload;
      state.shareAssessmentTestTargetId = null;
    },

    shareBlueprintRequest: (
      state,
      action: PayloadAction<ShareBlueprintPayload>
    ) => {
      state.shareBlueprintLoading = true;
      state.shareBlueprintError = null;
      state.shareBlueprintTargetId =
        action.payload.blueprintId?.trim() ?? null;
    },

    shareBlueprintSuccess: (state) => {
      state.shareBlueprintLoading = false;
      state.shareBlueprintError = null;
      state.shareBlueprintTargetId = null;
    },

    shareBlueprintFailure: (state, action: PayloadAction<string>) => {
      state.shareBlueprintLoading = false;
      state.shareBlueprintError = action.payload;
      state.shareBlueprintTargetId = null;
    },

    postAssessmentQuestionRequest: (
      state,
      _action: PayloadAction<CreateAssessmentQuestionPayload>
    ) => {
      state.postAssessmentQuestionLoading = true;
      state.postAssessmentQuestionError = null;
      state.postAssessmentQuestionReferenceSolutionErrors = null;
      state.createdAssessmentQuestion = null;
    },

    postAssessmentQuestionSuccess: (
      state,
      action: PayloadAction<AssessmentQuestionResponse>
    ) => {
      state.postAssessmentQuestionLoading = false;
      state.postAssessmentQuestionError = null;
      state.postAssessmentQuestionReferenceSolutionErrors = null;
      state.createdAssessmentQuestion = action.payload;
    },

    postAssessmentQuestionFailure: (state, action: PayloadAction<string>) => {
      state.postAssessmentQuestionLoading = false;
      state.postAssessmentQuestionError = action.payload;
      state.postAssessmentQuestionReferenceSolutionErrors = null;
    },

    /** Coding: POST/PUT `/assessments/v2/problem-questions/` — shares loading with post question. */
    submitProblemQuestionRequest: (
      state,
      _action: PayloadAction<SubmitProblemQuestionPayload>
    ) => {
      state.postAssessmentQuestionLoading = true;
      state.postAssessmentQuestionError = null;
      state.postAssessmentQuestionReferenceSolutionErrors = null;
      state.createdAssessmentQuestion = null;
    },

    submitProblemQuestionSuccess: (
      state,
      action: PayloadAction<AssessmentQuestionResponse>
    ) => {
      state.postAssessmentQuestionLoading = false;
      state.postAssessmentQuestionError = null;
      state.postAssessmentQuestionReferenceSolutionErrors = null;
      state.createdAssessmentQuestion = action.payload;
    },

    submitProblemQuestionFailure: (
      state,
      action: PayloadAction<{
        message: string;
        referenceSolutionRows?: ReferenceSolutionValidationRow[] | null;
      }>
    ) => {
      state.postAssessmentQuestionLoading = false;
      const rows = action.payload.referenceSolutionRows;
      if (rows && rows.length > 0) {
        state.postAssessmentQuestionError = null;
        state.postAssessmentQuestionReferenceSolutionErrors = rows;
      } else {
        state.postAssessmentQuestionError = action.payload.message;
        state.postAssessmentQuestionReferenceSolutionErrors = null;
      }
    },

    deleteAssessmentQuestionRequest: (
      state,
      _action: PayloadAction<DeleteAssessmentQuestionPayload>
    ) => {
      state.deleteAssessmentQuestionLoading = true;
      state.deleteAssessmentQuestionError = null;
    },

    deleteAssessmentQuestionSuccess: (state) => {
      state.deleteAssessmentQuestionLoading = false;
      state.deleteAssessmentQuestionError = null;
    },

    deleteAssessmentQuestionFailure: (state, action: PayloadAction<string>) => {
      state.deleteAssessmentQuestionLoading = false;
      state.deleteAssessmentQuestionError = action.payload;
    },

    updateAssessmentQuestionRequest: (
      state,
      _action: PayloadAction<UpdateAssessmentQuestionPayload>
    ) => {
      state.updateAssessmentQuestionLoading = true;
      state.updateAssessmentQuestionError = null;
    },

    updateAssessmentQuestionSuccess: (
      state,
      action: PayloadAction<AssessmentQuestionResponse>
    ) => {
      state.updateAssessmentQuestionLoading = false;
      state.updateAssessmentQuestionError = null;
      state.createdAssessmentQuestion = action.payload;
    },

    updateAssessmentQuestionFailure: (state, action: PayloadAction<string>) => {
      state.updateAssessmentQuestionLoading = false;
      state.updateAssessmentQuestionError = action.payload;
    },

    publishAssessmentTestRequest: (
      state,
      _action: PayloadAction<PublishAssessmentTestPayload>
    ) => {
      state.publishAssessmentTestLoading = true;
      state.publishAssessmentTestError = null;
    },

    publishAssessmentTestSuccess: (state, action: PayloadAction<{ testId: string }>) => {
      state.publishAssessmentTestLoading = false;
      state.publishAssessmentTestError = null;
      if (state.testDetail?.data?.id === action.payload.testId && state.testDetail.data) {
        state.testDetail.data = { ...state.testDetail.data, is_published: true };
      }
    },

    publishAssessmentTestFailure: (state, action: PayloadAction<string>) => {
      state.publishAssessmentTestLoading = false;
      state.publishAssessmentTestError = action.payload;
    },

    bulkCreateQuestionsRequest: (
      state,
      _action: PayloadAction<BulkCreateQuestionsPayload>
    ) => {
      state.bulkCreateQuestionsLoading = true;
      state.bulkCreateQuestionsError = null;
    },

    bulkCreateQuestionsSuccess: (state) => {
      state.bulkCreateQuestionsLoading = false;
      state.bulkCreateQuestionsError = null;
    },

    bulkCreateQuestionsFailure: (state, action: PayloadAction<string>) => {
      state.bulkCreateQuestionsLoading = false;
      state.bulkCreateQuestionsError = action.payload;
    },

    downloadTestTemplateRequest: (state, _action: PayloadAction<{ testId: string }>) => {
      state.downloadTestTemplateLoading = true;
      state.downloadTestTemplateError = null;
    },

    downloadTestTemplateSuccess: (state) => {
      state.downloadTestTemplateLoading = false;
      state.downloadTestTemplateError = null;
    },

    downloadTestTemplateFailure: (state, action: PayloadAction<string>) => {
      state.downloadTestTemplateLoading = false;
      state.downloadTestTemplateError = action.payload;
    },

    testBulkUploadRequest: (state, _action: PayloadAction<TestBulkUploadPayload>) => {
      state.testBulkUploadLoading = true;
      state.testBulkUploadError = null;
      state.testBulkUploadResult = null;
    },

    testBulkUploadSuccess: (state, action: PayloadAction<TestBulkUploadResponse>) => {
      state.testBulkUploadLoading = false;
      state.testBulkUploadError = null;
      state.testBulkUploadResult = action.payload;
    },

    testBulkUploadFailure: (state, action: PayloadAction<string>) => {
      state.testBulkUploadLoading = false;
      state.testBulkUploadError = action.payload;
      state.testBulkUploadResult = null;
    },

    fetchAssessmentLanguagesRequest: (
      state,
      action: PayloadAction<{
        page?: number;
        pageSize?: number;
        append?: boolean;
      }>
    ) => {
      const append = action.payload?.append ?? false;
      state.languagesList.loading = true;
      state.languagesList.error = null;
      if (!append) {
        state.languagesList.items = [];
        state.languagesList.page = action.payload?.page ?? 1;
        state.languagesList.pageSize = action.payload?.pageSize ?? 100;
      }
    },

    fetchAssessmentLanguagesSuccess: (
      state,
      action: PayloadAction<{
        response: AssessmentLanguagesListResponse;
        append: boolean;
      }>
    ) => {
      const { response, append } = action.payload;
      const results = response.results ?? [];
      state.languagesList.loading = false;
      state.languagesList.error = null;
      state.languagesList.count = response.count ?? 0;
      state.languagesList.pageSize = response.page_size ?? state.languagesList.pageSize;
      state.languagesList.totalPages = response.total_pages ?? 0;
      state.languagesList.page = response.page ?? 1;
      if (append) {
        state.languagesList.items = [...state.languagesList.items, ...results];
      } else {
        state.languagesList.items = results;
      }
      state.languagesList.hasMore =
        (response.page ?? 1) < (response.total_pages ?? 0);
    },

    fetchAssessmentLanguagesFailure: (state, action: PayloadAction<string>) => {
      state.languagesList.loading = false;
      state.languagesList.error = action.payload;
    },

    fetchAssessmentCategoriesRequest: (
      state,
      action: PayloadAction<{
        page?: number;
        append?: boolean;
        o?: string;
      }>
    ) => {
      const append = action.payload?.append ?? false;
      state.categoriesList.loading = true;
      state.categoriesList.error = null;
      if (!append) {
        state.categoriesList.items = [];
        state.categoriesList.page = action.payload?.page ?? 1;
      }
    },

    fetchAssessmentCategoriesSuccess: (
      state,
      action: PayloadAction<{
        response: AssessmentCategoriesListResponse;
        append: boolean;
        page: number;
      }>
    ) => {
      const { response, append, page } = action.payload;
      const results = response.results ?? [];
      state.categoriesList.loading = false;
      state.categoriesList.error = null;
      state.categoriesList.count = response.count ?? 0;
      state.categoriesList.page = page;
      state.categoriesList.hasMore = Boolean(response.next);
      if (append) {
        state.categoriesList.items = [...state.categoriesList.items, ...results];
      } else {
        state.categoriesList.items = results;
      }
    },

    fetchAssessmentCategoriesFailure: (state, action: PayloadAction<string>) => {
      state.categoriesList.loading = false;
      state.categoriesList.error = action.payload;
    },

    fetchAssessmentTestOptionsRequest: (
      state,
      action: PayloadAction<{
        page?: number;
        page_size?: number;
        is_published?: boolean;
        append?: boolean;
      }>
    ) => {
      const append = action.payload?.append ?? false;
      state.testOptionsList.loading = true;
      state.testOptionsList.error = null;
      if (!append) {
        state.testOptionsList.items = [];
        state.testOptionsList.page = action.payload?.page ?? 1;
        if (action.payload?.page_size != null) {
          state.testOptionsList.pageSize = action.payload.page_size;
        }
      }
    },

    fetchAssessmentTestOptionsSuccess: (
      state,
      action: PayloadAction<{
        response: AssessmentTestOptionsListResponse;
        append: boolean;
        page: number;
        pageSize: number;
      }>
    ) => {
      const { response, append, page, pageSize } = action.payload;
      const results = response.results ?? [];
      state.testOptionsList.loading = false;
      state.testOptionsList.error = null;
      state.testOptionsList.count = response.count ?? 0;
      state.testOptionsList.page = page;
      state.testOptionsList.pageSize = pageSize;
      state.testOptionsList.hasMore = Boolean(response.next);
      if (append) {
        state.testOptionsList.items = [...state.testOptionsList.items, ...results];
      } else {
        state.testOptionsList.items = results;
      }
    },

    fetchAssessmentTestOptionsFailure: (state, action: PayloadAction<string>) => {
      state.testOptionsList.loading = false;
      state.testOptionsList.error = action.payload;
    },

    setAssessmentCreateWizardBlueprintId: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.assessmentCreateWizard.blueprintId = action.payload;
    },

    setAssessmentCreateWizardBasicInfo: (
      state,
      action: PayloadAction<Partial<AssessmentCreateWizardBasicInfo>>
    ) => {
      const prev = state.assessmentCreateWizard.basicInfo;
      state.assessmentCreateWizard.basicInfo = {
        ...(prev ?? {}),
        ...action.payload,
      } as AssessmentCreateWizardBasicInfo;
    },

    setAssessmentCreateWizardSections: (
      state,
      action: PayloadAction<AssessmentCreateWizardSection[]>
    ) => {
      state.assessmentCreateWizard.sections = action.payload;
    },

    setAssessmentCreateWizardInstructionsHtml: (
      state,
      action: PayloadAction<string>
    ) => {
      state.assessmentCreateWizard.instructionsHtml = action.payload;
    },

    resetAssessmentCreateWizard: (state) => {
      state.assessmentCreateWizard = { ...createAssessmentWizardInitialState };
    },

    loadBlueprintForEditRequest: (
      state,
      action: PayloadAction<{ blueprintId: string }>
    ) => {
      const id = action.payload.blueprintId?.trim() ?? "";
      state.assessmentCreateWizard.loadBlueprintForEditLoading = true;
      state.assessmentCreateWizard.loadBlueprintForEditError = null;
      if (id) {
        state.assessmentCreateWizard.blueprintId = id;
        state.assessmentCreateWizard.basicInfo = null;
        state.assessmentCreateWizard.sections = [];
        state.assessmentCreateWizard.instructionsHtml = "";
        state.assessmentCreateWizard.proctoringDraft = null;
        state.assessmentCreateWizard.loadBlueprintForEditDetail = null;
      }
    },

    loadBlueprintForEditSuccess: (
      state,
      action: PayloadAction<{
        basicInfo: AssessmentCreateWizardBasicInfo;
        sections: AssessmentCreateWizardSection[];
        instructionsHtml: string;
        proctoringDraft: AssessmentCreateWizardProctoring;
        detail: AssessmentBlueprintDetail;
      }>
    ) => {
      state.assessmentCreateWizard.loadBlueprintForEditLoading = false;
      state.assessmentCreateWizard.loadBlueprintForEditError = null;
      state.assessmentCreateWizard.basicInfo = action.payload.basicInfo;
      state.assessmentCreateWizard.sections = action.payload.sections;
      state.assessmentCreateWizard.instructionsHtml =
        action.payload.instructionsHtml;
      state.assessmentCreateWizard.proctoringDraft =
        action.payload.proctoringDraft;
      state.assessmentCreateWizard.loadBlueprintForEditDetail =
        action.payload.detail;
    },

    loadBlueprintForEditFailure: (state, action: PayloadAction<string>) => {
      state.assessmentCreateWizard.loadBlueprintForEditLoading = false;
      state.assessmentCreateWizard.loadBlueprintForEditError = action.payload;
    },

    submitBlueprintRequest: (
      state,
      _action: PayloadAction<{
        proctoring: AssessmentCreateWizardProctoring;
        /** When set, saga PATCHes this blueprint; otherwise uses wizard.blueprintId or create. */
        blueprintId?: string | null;
      }>
    ) => {
      state.assessmentCreateWizard.submitBlueprintLoading = true;
      state.assessmentCreateWizard.submitBlueprintError = null;
    },

    submitBlueprintSuccess: (
      state,
      action: PayloadAction<{ blueprint: AssessmentBlueprintDetail }>
    ) => {
      state.assessmentCreateWizard.submitBlueprintLoading = false;
      state.assessmentCreateWizard.submitBlueprintError = null;
      state.assessmentCreateWizard.lastSubmitBlueprint = action.payload.blueprint;
    },

    submitBlueprintFailure: (state, action: PayloadAction<string>) => {
      state.assessmentCreateWizard.submitBlueprintLoading = false;
      state.assessmentCreateWizard.submitBlueprintError = action.payload;
    },
  },
});

export const {
  getAssessmentsRequest,
  getAssessmentsSuccess,
  getAssessmentsFailure,
  saveLastAssessmentsListQuery,
  getAssignedAssessmentsRequest,
  getAssignedAssessmentsSuccess,
  getAssignedAssessmentsFailure,
  setAssignedAssessmentFilters,
  setAssignedAssessmentSort,
  clearAssignedAssessmentFilters,
  assessmentOverviewRequest,
  assessmentOverviewSuccess,
  assessmentOverviewFailure,
  blueprintAssignmentsListRequest,
  blueprintAssignmentsListSuccess,
  blueprintAssignmentsListFailure,
  setAssignmentsListSearchText,
  toggleAssignmentTableSelectedId,
  setAssignmentTableSelectedForIds,
  clearAssignmentTableSelectedIds,
  assignmentExportReportRequest,
  assignmentExportReportSuccess,
  assignmentExportReportFailure,
  assignCandidatesRequest,
  assignCandidatesSuccess,
  assignCandidatesFailure,
  publishBlueprintRequest,
  publishBlueprintSuccess,
  publishBlueprintFailure,
  fetchAssessmentTestDetailRequest,
  fetchAssessmentTestDetailSuccess,
  fetchAssessmentTestDetailFailure,
  clearAssessmentTestDetail,
  fetchAssessmentQuestionsListRequest,
  fetchAssessmentQuestionsListSuccess,
  fetchAssessmentQuestionsListFailure,
  postAssessmentTestRequest,
  postAssessmentTestSuccess,
  postAssessmentTestFailure,
  updateAssessmentTestRequest,
  updateAssessmentTestSuccess,
  updateAssessmentTestFailure,
  deleteAssessmentTestRequest,
  deleteAssessmentTestSuccess,
  deleteAssessmentTestFailure,
  duplicateAssessmentTestRequest,
  duplicateAssessmentTestSuccess,
  duplicateAssessmentTestFailure,
  duplicateBlueprintRequest,
  duplicateBlueprintSuccess,
  duplicateBlueprintFailure,
  deleteBlueprintRequest,
  deleteBlueprintSuccess,
  deleteBlueprintFailure,
  archiveBlueprintRequest,
  archiveBlueprintSuccess,
  archiveBlueprintFailure,
  archiveAssessmentTestRequest,
  archiveAssessmentTestSuccess,
  archiveAssessmentTestFailure,
  shareAssessmentTestRequest,
  shareAssessmentTestSuccess,
  shareAssessmentTestFailure,
  shareBlueprintRequest,
  shareBlueprintSuccess,
  shareBlueprintFailure,
  postAssessmentQuestionRequest,
  postAssessmentQuestionSuccess,
  postAssessmentQuestionFailure,
  submitProblemQuestionRequest,
  submitProblemQuestionSuccess,
  submitProblemQuestionFailure,
  deleteAssessmentQuestionRequest,
  deleteAssessmentQuestionSuccess,
  deleteAssessmentQuestionFailure,
  updateAssessmentQuestionRequest,
  updateAssessmentQuestionSuccess,
  updateAssessmentQuestionFailure,
  publishAssessmentTestRequest,
  publishAssessmentTestSuccess,
  publishAssessmentTestFailure,
  bulkCreateQuestionsRequest,
  bulkCreateQuestionsSuccess,
  bulkCreateQuestionsFailure,
  downloadTestTemplateRequest,
  downloadTestTemplateSuccess,
  downloadTestTemplateFailure,
  testBulkUploadRequest,
  testBulkUploadSuccess,
  testBulkUploadFailure,
  fetchAssessmentLanguagesRequest,
  fetchAssessmentLanguagesSuccess,
  fetchAssessmentLanguagesFailure,
  fetchAssessmentCategoriesRequest,
  fetchAssessmentCategoriesSuccess,
  fetchAssessmentCategoriesFailure,
  fetchAssessmentTestOptionsRequest,
  fetchAssessmentTestOptionsSuccess,
  fetchAssessmentTestOptionsFailure,
  setAssessmentCreateWizardBlueprintId,
  setAssessmentCreateWizardBasicInfo,
  setAssessmentCreateWizardSections,
  setAssessmentCreateWizardInstructionsHtml,
  resetAssessmentCreateWizard,
  loadBlueprintForEditRequest,
  loadBlueprintForEditSuccess,
  loadBlueprintForEditFailure,
  submitBlueprintRequest,
  submitBlueprintSuccess,
  submitBlueprintFailure,
} = assessmentsSlice.actions;

export default assessmentsSlice.reducer;
