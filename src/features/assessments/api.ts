import { apiClient } from "../../api/client";
import { API_ENDPOINTS } from "../../api/endpoints";
import { DEFAULT_ASSIGNED_ASSESSMENTS_ORDER } from "./constants";
import {
  AssessmentListResponse,
  AssessmentDashboardStatsResponse,
  AssignedAssessmentListResponse,
  AssignedFilterParams,
  GetAssessmentsListPayload,
  AssessmentBlueprintDetail,
  BlueprintAssignmentsListResponse,
  BlueprintAssignmentStats,
} from "./types";

const ASSIGNED_ASSESSMENT_SORT_FIELD_MAP: Record<string, string> = {
  Applicant: "applicant_name",
  Email: "candidate_email",
  "Job Title": "job__title",
  "Avg %": "average_percentage",
  "Assigned At": "assigned_at",
  "Valid Till": "valid_to",
  "Assigned By": "assigned_by__name",
};

function orderParamFromAssignedSort(
  sortBy?: string,
  sortDir?: "asc" | "desc"
): string {
  if (!sortBy || !sortDir) return DEFAULT_ASSIGNED_ASSESSMENTS_ORDER;
  const field = ASSIGNED_ASSESSMENT_SORT_FIELD_MAP[sortBy];
  if (!field) return DEFAULT_ASSIGNED_ASSESSMENTS_ORDER;
  return sortDir === "desc" ? `-${field}` : field;
}

export const assessmentsApi = {
  getAssessments: async (
    params: GetAssessmentsListPayload = {}
  ): Promise<AssessmentListResponse> => {
    const {
      page = 1,
      title,
      o = "-created_at",
      is_published,
      is_archived,
      listSource = "tests",
    } = params;
    const cleanParams = Object.fromEntries(
      Object.entries({
        page,
        title,
        o,
        is_published,
        is_archived,
      }).filter(([_, value]) => value !== undefined && value !== "")
    );
    const query = new URLSearchParams(cleanParams as any).toString();
    const baseUrl =
      listSource === "blueprints"
        ? API_ENDPOINTS.ASSESSMENTS.BLUEPRINTS_LIST
        : API_ENDPOINTS.ASSESSMENTS.ASSIGNEDLIST;
    const url = query ? `${baseUrl}?${query}` : baseUrl;

    const res = await apiClient.get(url);
    const data = res?.data ?? res;

    // Normalize v2 keys for existing UI consumers.
    const normalizedResults = Array.isArray(data?.results)
      ? data.results.map((item: any) => ({
          ...item,
          total_question: item?.total_question ?? item?.total_questions ?? 0,
          type: item?.type ?? item?.test_type ?? "",
        }))
      : [];

    return {
      ...data,
      results: normalizedResults,
    };
  },

  getAssignedAssessments: async (
    params: AssignedFilterParams = {}
  ): Promise<AssignedAssessmentListResponse> => {
    const { sortBy, sortDir, o: oFromPayload, ...rest } = params;
    const o =
      sortBy && sortDir
        ? orderParamFromAssignedSort(sortBy, sortDir)
        : oFromPayload != null && String(oFromPayload).trim() !== ""
          ? oFromPayload
          : DEFAULT_ASSIGNED_ASSESSMENTS_ORDER;
    const cleanParams = Object.fromEntries(
      Object.entries({ ...rest, o }).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );

    const query = new URLSearchParams(cleanParams as any).toString();
    const baseUrl = API_ENDPOINTS.ASSESSMENTS.ASSIGNED_FILTER;
    const url = query ? `${baseUrl}?${query}` : baseUrl;

    const res = await apiClient.get(url);
    return res?.data ?? res;
  },

  getDashboardStats: async (): Promise<AssessmentDashboardStatsResponse> => {
    const res = await apiClient.get(API_ENDPOINTS.ASSESSMENTS.ASSESSMENT_STATS);
    const data = res?.data ?? res;
    return { assessment_stats: data };
  },

  getBlueprintById: async (id: string): Promise<AssessmentBlueprintDetail> => {
    const url = API_ENDPOINTS.ASSESSMENTS.BLUEPRINT_DETAIL(id);
    const res = await apiClient.get(url);
    const data = res?.data ?? res;
    return data as AssessmentBlueprintDetail;
  },

  getAssignmentsByBlueprintId: async (
    blueprintId: string,
    options?: {
      page?: number;
      o?: string;
      candidate_name?: string;
      candidate_email?: string;
      status?: string;
    }
  ): Promise<BlueprintAssignmentsListResponse> => {
    const params = new URLSearchParams({
      blueprint_id: blueprintId,
      o: options?.o ?? "-created_at",
    });
    if (options?.page != null) {
      params.set("page", String(options.page));
    }
    const name = options?.candidate_name?.trim();
    const email = options?.candidate_email?.trim();
    if (name) params.set("candidate_name", name);
    if (email) params.set("candidate_email", email);
    if (options?.status && options.status !== "all") {
      params.set("status", options.status);
    }
    const url = `${API_ENDPOINTS.ASSESSMENTS.ASSIGNMENTS_LIST}?${params.toString()}`;
    const res = await apiClient.get(url);
    const data = res?.data ?? res;
    return data as BlueprintAssignmentsListResponse;
  },

  getAssignmentStatsByBlueprintId: async (
    blueprintId: string
  ): Promise<BlueprintAssignmentStats> => {
    const params = new URLSearchParams({ blueprint_id: blueprintId });
    const url = `${API_ENDPOINTS.ASSESSMENTS.ASSIGNMENTS_STATS}?${params.toString()}`;
    const res = await apiClient.get(url);
    const data = res?.data ?? res;
    return data as BlueprintAssignmentStats;
  },
};

