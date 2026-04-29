import { ASSESSMENTS_ACTION_TYPES } from "./constants";
import {
  GetAssessmentsListPayload,
  GetAssignedAssessmentsPayload,
  FetchBlueprintAssignmentsListPayload,
  ExportBlueprintAssignmentsReportPayload,
  CreateAssessmentPayload,
  CreateAssessmentQuestionPayload,
  GenerateQuestionsPayload,
  GenerateCodingProblemMetadataPayload,
  GenerateCodingTestcasesSnippetsPayload,
  GenerateCodingReferenceSolutionPayload,
  BulkCreateQuestionsPayload,
  TestBulkUploadPayload,
  AssignCandidatesPayload,
  PublishBlueprintPayload,
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

export const assignCandidatesRequestAction = (payload: AssignCandidatesPayload) => ({
  type: ASSESSMENTS_ACTION_TYPES.ASSIGN_CANDIDATES_REQUEST,
  payload,
});

export const publishBlueprintRequestAction = (payload: PublishBlueprintPayload) => ({
  type: ASSESSMENTS_ACTION_TYPES.PUBLISH_BLUEPRINT_REQUEST,
  payload,
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

export const postAssessmentTestRequestAction = (payload: CreateAssessmentPayload) => ({
  type: ASSESSMENTS_ACTION_TYPES.POST_ASSESSMENTS_Test_REQUEST,
  payload,
});

export const postAssessmentQuestionRequestAction = (
  payload: CreateAssessmentQuestionPayload
) => ({
  type: ASSESSMENTS_ACTION_TYPES.POST_ASSESSMENT_QUESTION_REQUEST,
  payload,
});

export const generateAssessmentQuestionsRequestAction = (payload: {
  params: GenerateQuestionsPayload;
  requestId: string;
}) => ({
  type: ASSESSMENTS_ACTION_TYPES.GENERATE_ASSESSMENT_QUESTIONS_REQUEST,
  payload,
});

export const generateCodingProblemMetadataRequestAction = (payload: {
  payload: GenerateCodingProblemMetadataPayload;
  requestId: string;
}) => ({
  type: ASSESSMENTS_ACTION_TYPES.GENERATE_CODING_PROBLEM_METADATA_REQUEST,
  payload,
});

export const generateCodingTestcasesSnippetsRequestAction = (payload: {
  payload: GenerateCodingTestcasesSnippetsPayload;
  requestId: string;
}) => ({
  type: ASSESSMENTS_ACTION_TYPES.GENERATE_CODING_TESTCASES_SNIPPETS_REQUEST,
  payload,
});

export const generateCodingReferenceSolutionRequestAction = (payload: {
  payload: GenerateCodingReferenceSolutionPayload;
  requestId: string;
}) => ({
  type: ASSESSMENTS_ACTION_TYPES.GENERATE_CODING_REFERENCE_SOLUTION_REQUEST,
  payload,
});

export const bulkCreateAssessmentQuestionsRequestAction = (
  payload: BulkCreateQuestionsPayload
) => ({
  type: ASSESSMENTS_ACTION_TYPES.BULK_CREATE_QUESTIONS_REQUEST,
  payload,
});

export const downloadTestTemplateRequestAction = (payload: { testId: string }) => ({
  type: ASSESSMENTS_ACTION_TYPES.DOWNLOAD_TEST_TEMPLATE_REQUEST,
  payload,
});

export const testBulkUploadRequestAction = (payload: TestBulkUploadPayload) => ({
  type: ASSESSMENTS_ACTION_TYPES.TEST_BULK_UPLOAD_REQUEST,
  payload,
});


