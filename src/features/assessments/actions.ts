import { ASSESSMENTS_ACTION_TYPES } from "./constants";
import {
  AssignedFilterParams,
  GetAssessmentsListPayload,
  GetAssignedAssessmentsPayload,
  FetchBlueprintAssignmentsListPayload,
  ExportBlueprintAssignmentsReportPayload,
} from "./types";

export const getAssessmentsRequestAction = (payload?: GetAssessmentsListPayload) => ({
  type: ASSESSMENTS_ACTION_TYPES.GET_ASSESSMENTS_REQUEST,
  payload: {
    page: payload?.page ?? 1,
    append: payload?.append ?? false,
    title: payload?.title,
    o: payload?.o ?? '-created_at',
    is_published: payload?.is_published,
    is_archived: payload?.is_archived,
    listSource: payload?.listSource ?? "tests",
  },
});

export const getAssessmentsAssignedRequestAction = (
  payload?: GetAssignedAssessmentsPayload
) => ({
  type: ASSESSMENTS_ACTION_TYPES.GET_ASSIGNED_ASSESSMENTS_REQUEST,
  payload,
});

export const fetchAssessmentOverviewRequestAction = (blueprintId?: string | null) => ({
  type: ASSESSMENTS_ACTION_TYPES.FETCH_ASSESSMENT_OVERVIEW_REQUEST,
  payload: { blueprintId: blueprintId ?? null },
});

export const fetchBlueprintAssignmentsListRequestAction = (
  payload: FetchBlueprintAssignmentsListPayload
) => ({
  type: ASSESSMENTS_ACTION_TYPES.FETCH_BLUEPRINT_ASSIGNMENTS_LIST_REQUEST,
  payload: {
    blueprintId: payload.blueprintId,
    page: payload.page ?? 1,
    append: payload.append ?? false,
    o: payload.o ?? "-created_at",
    candidate_name: payload.candidate_name,
    candidate_email: payload.candidate_email,
    status: payload.status,
  },
});

export const exportBlueprintAssignmentsReportRequestAction = (
  payload: ExportBlueprintAssignmentsReportPayload
) => ({
  type: ASSESSMENTS_ACTION_TYPES.EXPORT_BLUEPRINT_ASSIGNMENTS_REPORT_REQUEST,
  payload: {
    blueprint_id: payload.blueprint_id,
    select_all: Boolean(payload.select_all),
    assignment_ids: payload.assignment_ids ?? [],
  },
});
