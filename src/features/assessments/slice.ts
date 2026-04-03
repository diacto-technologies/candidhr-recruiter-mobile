import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AssessmentListResponse,
  AssessmentsState,
  AssignedAssessmentListResponse,
  GetAssignedAssessmentsPayload,
  AssignedAssessmentFilters,
  AssessmentBlueprintDetail,
  AssessmentDashboardStats,
  BlueprintAssignment,
  BlueprintAssignmentStats,
  BlueprintAssignmentsListResponse,
  BlueprintAssignmentsPagination,
  BlueprintAssignmentsListQuery,
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
  },
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
  },
});

export const {
  getAssessmentsRequest,
  getAssessmentsSuccess,
  getAssessmentsFailure,
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
} = assessmentsSlice.actions;

export default assessmentsSlice.reducer;
