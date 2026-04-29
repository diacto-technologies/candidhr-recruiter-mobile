import { apiClient } from "../../api/client";
import { API_ENDPOINTS } from "../../api/endpoints";
import {
  DEFAULT_ASSIGNED_ASSESSMENTS_ORDER,
  sanitizeQuestionTypeForQuestionsListQuery,
} from "./constants";
import {
  AssessmentListResponse,
  AssessmentDashboardStatsResponse,
  AssignedAssessmentListResponse,
  AssignedFilterParams,
  GetAssessmentsListPayload,
  AssessmentBlueprintDetail,
  BlueprintAssignmentsListResponse,
  BlueprintAssignmentStats,
  AssignCandidatesPayload,
  PublishBlueprintResponse,
  CreateAssessmentPayload,
  AssessmentResponse,
  CreateAssessmentQuestionPayload,
  CreateProblemQuestionPayload,
  AssessmentQuestionResponse,
  AssessmentQuestionsListResponse,
  GenerateQuestionsPayload,
  GenerateQuestionsResponse,
  GenerateCodingProblemMetadataPayload,
  GenerateCodingProblemMetadataResponse,
  GenerateCodingTestcasesSnippetsPayload,
  GenerateCodingTestcasesSnippetsResponse,
  GenerateCodingReferenceSolutionPayload,
  GenerateCodingReferenceSolutionResponse,
  BulkCreateQuestionsResponse,
  AssessmentLanguagesListResponse,
  AssessmentCategoriesListResponse,
  AssessmentTestOptionsListResponse,
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

  /** POST /assessments/v2/blueprints/ — create assessment blueprint (no id) */
  createBlueprint: async (
    body: Record<string, unknown>
  ): Promise<AssessmentBlueprintDetail> => {
    if (__DEV__) {
      console.log("[assessmentsApi.createBlueprint]", {
        method: "POST",
        path: API_ENDPOINTS.ASSESSMENTS.BLUEPRINTS_ROOT,
      });
    }
    const res = await apiClient.post(
      API_ENDPOINTS.ASSESSMENTS.BLUEPRINTS_ROOT,
      body
    );
    const data = res?.data ?? res;
    return data as AssessmentBlueprintDetail;
  },

  /** PATCH /assessments/v2/blueprints/{id}/ — update existing blueprint (when id known) */
  postUpdateBlueprint: async (
    id: string,
    body: Record<string, unknown>
  ): Promise<AssessmentBlueprintDetail> => {
    const cleanId = id?.trim();
    if (!cleanId) {
      throw new Error("Missing blueprint id.");
    }
    const url = API_ENDPOINTS.ASSESSMENTS.BLUEPRINT_DETAIL(cleanId);
    if (__DEV__) {
      console.log("[assessmentsApi.postUpdateBlueprint]", {
        method: "PATCH",
        path: url,
      });
    }
    const res = await apiClient.patch(url, body);
    const data = (res as { data?: AssessmentBlueprintDetail })?.data ?? res;
    return data as AssessmentBlueprintDetail;
  },

  /** POST /assessments/v2/blueprints/{id}/duplicate/ */
  duplicateBlueprint: async (id: string): Promise<{ message: string }> => {
    const cleanId = id?.trim();
    if (!cleanId) {
      throw new Error("Missing blueprint id.");
    }
    const res = await apiClient.post(
      API_ENDPOINTS.ASSESSMENTS.BLUEPRINT_DUPLICATE(cleanId),
      {}
    );
    const data = (res?.data ?? res) as { message?: string };
    return { message: data?.message ?? "Assessment copied successfully." };
  },

  /** DELETE /assessments/v2/blueprints/{id}/ */
  deleteBlueprint: async (id: string): Promise<void> => {
    const cleanId = id?.trim();
    if (!cleanId) {
      throw new Error("Missing blueprint id.");
    }
    await apiClient.delete(API_ENDPOINTS.ASSESSMENTS.BLUEPRINT_DETAIL(cleanId));
  },

  /** POST /assessments/v2/blueprints/{id}/archive/ */
  archiveBlueprint: async (id: string): Promise<{ message: string }> => {
    const cleanId = id?.trim();
    if (!cleanId) {
      throw new Error("Missing blueprint id.");
    }
    const res = await apiClient.post(
      API_ENDPOINTS.ASSESSMENTS.BLUEPRINT_ARCHIVE(cleanId),
      {}
    );
    const data = (res?.data ?? res) as { message?: string };
    return {
      message: data?.message ?? "Assessment archived successfully.",
    };
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
      (params as any).set("page", String(options.page));
    }
    const name = options?.candidate_name?.trim();
    const email = options?.candidate_email?.trim();
    if (name) (params as any).set("candidate_name", name);
    if (email) (params as any).set("candidate_email", email);
    if (options?.status && options.status !== "all") {
      (params as any).set("status", options.status);
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

  /** POST /assessments/v2/assignments/ */
  assignCandidates: async (body: AssignCandidatesPayload): Promise<unknown> => {
    const res = await apiClient.post(API_ENDPOINTS.ASSESSMENTS.ASSIGNMENTS_POST, body);
    return res?.data ?? res;
  },

  /** POST /assessments/v2/blueprints/{id}/publish/ */
  publishBlueprint: async (blueprintId: string): Promise<PublishBlueprintResponse> => {
    const id = blueprintId?.trim();
    if (!id) {
      throw new Error("Missing blueprint id.");
    }
    const res = await apiClient.post(API_ENDPOINTS.ASSESSMENTS.BLUEPRINT_PUBLISH(id), {
      is_published: true,
    });
    const data = (res?.data ?? res) as PublishBlueprintResponse;
    return data;
  },

  createAssessment: async (
    payload: CreateAssessmentPayload
  ): Promise<AssessmentResponse> => {
    const res = await apiClient.post(
      API_ENDPOINTS.ASSESSMENTS.ASSESSMENT_TEST,
      payload
    );
    return res?.data ?? res;
  },

  createAssessmentQuestion: async (
    payload: CreateAssessmentQuestionPayload
  ): Promise<AssessmentQuestionResponse> => {
    const testId = payload?.test?.trim();
    if (!testId) {
      throw new Error("Missing test id for question creation.");
    }
    // Backend supports POST on the collection endpoint; test id is sent in body.
    const res = await apiClient.post(API_ENDPOINTS.ASSESSMENTS.QUESTIONS, payload);
    return res?.data ?? res;
  },

  createProblemQuestion: async (
    payload: CreateProblemQuestionPayload
  ): Promise<AssessmentQuestionResponse> => {
    const tid = payload?.test_id?.trim();
    if (!tid) {
      throw new Error("Missing test id for problem question.");
    }
    const res = await apiClient.post(API_ENDPOINTS.ASSESSMENTS.PROBLEM_QUESTIONS, payload);
    return res?.data ?? res;
  },

  updateProblemQuestion: async (
    questionId: string,
    payload: CreateProblemQuestionPayload
  ): Promise<AssessmentQuestionResponse> => {
    const id = questionId?.trim();
    if (!id) {
      throw new Error("Missing question id.");
    }
    const res = await apiClient.put(
      API_ENDPOINTS.ASSESSMENTS.PROBLEM_QUESTION_DETAIL(id),
      payload
    );
    return res?.data ?? res;
  },

  getAssessmentTestById: async (id: string): Promise<AssessmentResponse> => {
    const testId = id?.trim();
    if (!testId) {
      throw new Error("Missing test id.");
    }
    const res = await apiClient.get(API_ENDPOINTS.ASSESSMENTS.TEST_DETAIL(testId));
    return res?.data ?? res;
  },

  updateAssessmentTest: async (
    testId: string,
    body: AssessmentResponse
  ): Promise<AssessmentResponse> => {
    const id = testId?.trim();
    if (!id) {
      throw new Error("Missing test id.");
    }
    const res = await apiClient.put(API_ENDPOINTS.ASSESSMENTS.TEST_DETAIL(id), body);
    return res?.data ?? res;
  },

  /** DELETE /assessments/v2/tests/{id}/ */
  deleteAssessmentTest: async (testId: string): Promise<void> => {
    const id = testId?.trim();
    if (!id) {
      throw new Error("Missing test id.");
    }
    await apiClient.delete(API_ENDPOINTS.ASSESSMENTS.TEST_DETAIL(id));
  },

  /** POST /assessments/v2/tests/{id}/duplicate/ */
  duplicateAssessmentTest: async (
    testId: string
  ): Promise<{ message: string }> => {
    const id = testId?.trim();
    if (!id) {
      throw new Error("Missing test id.");
    }
    const res = (await apiClient.post(
      API_ENDPOINTS.ASSESSMENTS.TEST_DUPLICATE(id),
      {}
    )) as { message?: string } | null;
    const msg = res && typeof res.message === "string" ? res.message : "";
    return { message: msg || "Test duplicated successfully." };
  },

  /** POST /assessments/v2/tests/{id}/archive/ */
  archiveAssessmentTest: async (
    testId: string
  ): Promise<{ message: string }> => {
    const id = testId?.trim();
    if (!id) {
      throw new Error("Missing test id.");
    }
    const res = (await apiClient.post(
      API_ENDPOINTS.ASSESSMENTS.TEST_ARCHIVE(id),
      {}
    )) as { message?: string } | null;
    const msg = res && typeof res.message === "string" ? res.message : "";
    return { message: msg || "Test archived successfully." };
  },

  /** POST /assessments/v2/tests/{id}/share/ */
  shareAssessmentTest: async (
    testId: string,
    body: { users_shared_with: string[] }
  ): Promise<{ message: string }> => {
    const id = testId?.trim();
    if (!id) {
      throw new Error("Missing test id.");
    }
    const res = (await apiClient.post(
      API_ENDPOINTS.ASSESSMENTS.TEST_SHARE(id),
      body
    )) as { message?: string } | null;
    const msg = res && typeof res.message === "string" ? res.message : "";
    return { message: msg || "Test shared successfully." };
  },

  /** POST /assessments/v2/blueprints/{id}/share/ */
  shareBlueprint: async (
    blueprintId: string,
    body: { users_shared_with: string[] }
  ): Promise<{ message: string }> => {
    const id = blueprintId?.trim();
    if (!id) {
      throw new Error("Missing blueprint id.");
    }
    const res = (await apiClient.post(
      API_ENDPOINTS.ASSESSMENTS.BLUEPRINT_SHARE(id),
      body
    )) as { message?: string } | null;
    const msg = res && typeof res.message === "string" ? res.message : "";
    return { message: msg || "Assessment shared successfully." };
  },

  getAssessmentQuestionsByTestId: async (
    testId: string,
    page: number = 1,
    questionType?: string | null,
    /** Backend default is often 30; pass a higher value or fetch multiple pages in the saga. */
    pageSize: number = 100
  ): Promise<AssessmentQuestionsListResponse> => {
    const cleanTestId = testId?.trim();
    if (!cleanTestId) {
      throw new Error("Missing test id.");
    }
    const params = new URLSearchParams({
      test: cleanTestId,
      page: String(page ?? 1),
      page_size: String(pageSize),
    });
    const qt = sanitizeQuestionTypeForQuestionsListQuery(questionType);
    if (qt) {
      params.append("question_type", qt);
    }
    const url = `${API_ENDPOINTS.ASSESSMENTS.QUESTIONS}?${params.toString()}`;
    const res = await apiClient.get(url);
    return res?.data ?? res;
  },

  getAssessmentLanguages: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<AssessmentLanguagesListResponse> => {
    const page = params?.page ?? 1;
    const page_size = params?.page_size ?? 100;
    const qs = new URLSearchParams({
      page: String(page),
      page_size: String(page_size),
    });
    const url = `${API_ENDPOINTS.ASSESSMENTS.LANGUAGES}?${qs.toString()}`;
    const res = await apiClient.get(url);
    return res?.data ?? res;
  },

  getAssessmentTestOptions: async (params?: {
    page?: number;
    page_size?: number;
    is_published?: boolean;
  }): Promise<AssessmentTestOptionsListResponse> => {
    const page = params?.page ?? 1;
    const page_size = params?.page_size ?? 20;
    const is_published = params?.is_published ?? true;
    const qs = new URLSearchParams({
      page: String(page),
      page_size: String(page_size),
      is_published: String(is_published),
    });
    const url = `${API_ENDPOINTS.ASSESSMENTS.TEST_OPTIONS}?${qs.toString()}`;
    const res = await apiClient.get(url);
    return res?.data ?? res;
  },

  getAssessmentCategories: async (params?: {
    page?: number;
    /** Sort field, default `name` */
    o?: string;
  }): Promise<AssessmentCategoriesListResponse> => {
    const page = params?.page ?? 1;
    const o = params?.o ?? "name";
    const qs = new URLSearchParams({
      page: String(page),
      o,
    });
    const url = `${API_ENDPOINTS.ASSESSMENTS.CATEGORIES}?${qs.toString()}`;
    const res = await apiClient.get(url);
    return res?.data ?? res;
  },

  deleteAssessmentQuestion: async (
    questionId: string,
    options?: { isProblemQuestion?: boolean }
  ): Promise<void> => {
    const id = questionId?.trim();
    if (!id) {
      throw new Error("Missing question id.");
    }
    const path = options?.isProblemQuestion
      ? API_ENDPOINTS.ASSESSMENTS.PROBLEM_QUESTION_DETAIL(id)
      : API_ENDPOINTS.ASSESSMENTS.QUESTION_DETAIL(id);
    await apiClient.delete(path);
  },

  updateAssessmentQuestion: async (
    questionId: string,
    payload: any
  ): Promise<AssessmentQuestionResponse> => {
    const id = questionId?.trim();
    if (!id) {
      throw new Error("Missing question id.");
    }
    const res = await apiClient.put(API_ENDPOINTS.ASSESSMENTS.QUESTION_DETAIL(id), payload);
    return res?.data ?? res;
  },

  publishAssessmentTest: async (testId: string): Promise<{ message: string }> => {
    const id = testId?.trim();
    if (!id) {
      throw new Error("Missing test id.");
    }
    const res = await apiClient.post(API_ENDPOINTS.ASSESSMENTS.TEST_PUBLISH(id), {});
    return res?.data ?? res;
  },

  generateQuestions: async (
    payload: GenerateQuestionsPayload
  ): Promise<GenerateQuestionsResponse> => {
    const testId = payload?.testId?.trim();
    if (!testId) {
      throw new Error("Missing test id.");
    }
    const body: Record<string, unknown> = {
      ...(payload as unknown as Record<string, unknown>),
    };
    delete body.testId;
    const res = await apiClient.post(
      API_ENDPOINTS.ASSESSMENTS.TEST_GENERATE_QUESTIONS(testId),
      body
    );
    return res?.data ?? res;
  },

  generateCodingProblemMetadata: async (
    payload: GenerateCodingProblemMetadataPayload
  ): Promise<GenerateCodingProblemMetadataResponse> => {
    const res = await apiClient.post(
      API_ENDPOINTS.ASSESSMENTS.GENERATE_CODING_PROBLEM_METADATA,
      payload
    );
    return res?.data ?? res;
  },

  generateCodingTestcasesSnippets: async (
    payload: GenerateCodingTestcasesSnippetsPayload
  ): Promise<GenerateCodingTestcasesSnippetsResponse> => {
    const res = await apiClient.post(
      API_ENDPOINTS.ASSESSMENTS.GENERATE_CODING_PROBLEM_TESTCASES_SNIPPETS,
      payload
    );
    return res?.data ?? res;
  },

  generateCodingReferenceSolution: async (
    payload: GenerateCodingReferenceSolutionPayload
  ): Promise<GenerateCodingReferenceSolutionResponse> => {
    const res = await apiClient.post(
      API_ENDPOINTS.ASSESSMENTS.GENERATE_CODING_PROBLEM_REFERENCE_SOLUTION,
      payload
    );
    return res?.data ?? res;
  },

  bulkCreateQuestions: async (
    testId: string,
    questions: any[]
  ): Promise<BulkCreateQuestionsResponse> => {
    const id = testId?.trim();
    if (!id) {
      throw new Error("Missing test id.");
    }
    const body = { questions: Array.isArray(questions) ? questions : [] };
    const res = await apiClient.post(
      API_ENDPOINTS.ASSESSMENTS.TEST_QUESTIONS_BULK_CREATE(id),
      body
    );
    return res?.data ?? res;
  },
};

