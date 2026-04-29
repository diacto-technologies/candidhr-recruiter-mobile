import { call, put, select, takeLatest } from "redux-saga/effects";
import { Platform } from "react-native";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import ReactNativeBlobUtil from "react-native-blob-util";
import { config } from "../../config";
import { API_ENDPOINTS } from "../../api/endpoints";
import {
  ApiError,
  extractReferenceSolutionRowsFromApiErrorDetails,
} from "../../api/client";
import type { ReferenceSolutionValidationRow } from "./types";
import {
  getAssessmentsRequest,
  getAssessmentsSuccess,
  getAssessmentsFailure,
  saveLastAssessmentsListQuery,
  getAssignedAssessmentsRequest,
  getAssignedAssessmentsSuccess,
  getAssignedAssessmentsFailure,
  assessmentOverviewRequest,
  assessmentOverviewSuccess,
  assessmentOverviewFailure,
  blueprintAssignmentsListRequest,
  blueprintAssignmentsListSuccess,
  blueprintAssignmentsListFailure,
  assignmentExportReportRequest,
  assignmentExportReportSuccess,
  assignmentExportReportFailure,
  assignCandidatesRequest,
  assignCandidatesSuccess,
  assignCandidatesFailure,
  publishBlueprintRequest,
  publishBlueprintSuccess,
  publishBlueprintFailure,
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
  fetchAssessmentTestDetailRequest,
  fetchAssessmentTestDetailSuccess,
  fetchAssessmentTestDetailFailure,
  fetchAssessmentQuestionsListRequest,
  fetchAssessmentQuestionsListSuccess,
  fetchAssessmentQuestionsListFailure,
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
  submitBlueprintRequest,
  submitBlueprintSuccess,
  submitBlueprintFailure,
  loadBlueprintForEditRequest,
  loadBlueprintForEditSuccess,
  loadBlueprintForEditFailure,
} from "./slice";
import { assessmentsApi } from "./api";
import {
  buildBlueprintPatchPayloadOmittingLockedDuration,
  buildUpdateBlueprintPayload,
} from "./buildBlueprintPayload";

function blueprintPatchErrorIndicatesLockedFields(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err ?? "");
  return /default_duration|default_passing_score|min_sections_required|is_proctoring_enabled|proctoring_config|proctoring_configuration|passing_score|cannot modify|published|in use/i.test(
    msg
  );
}
import { hydrateAssessmentCreateWizardFromDetail } from "./hydrateAssessmentCreateWizardFromDetail";
import type { RootState } from "../../store";
import { sanitizeQuestionTypeForQuestionsListQuery } from "./constants";
import { ASSESSMENTS_ACTION_TYPES } from "./constants";
import { takeGenerateQuestionsCallbacks } from "./generateQuestionsCallbacks";
import { takeGenerateCodingMetadataCallbacks } from "./generateCodingMetadataCallbacks";
import { takeGenerateCodingTestcasesCallbacks } from "./generateCodingTestcasesCallbacks";
import { takeGenerateCodingReferenceSolutionCallbacks } from "./generateCodingReferenceSolutionCallbacks";
import { fetchAssessmentOverviewRequestAction } from "./actions";
import {
  GetAssignedAssessmentsPayload,
  GetAssessmentsListPayload,
  BlueprintAssignmentsListResponse,
  AssessmentBlueprintDetail,
  AssessmentDashboardStatsResponse,
  BlueprintAssignmentStats,
  ExportBlueprintAssignmentsReportPayload,
  AssessmentResponse,
  CreateAssessmentPayload,
  CreateAssessmentQuestionPayload,
  SubmitProblemQuestionPayload,
  AssessmentQuestionResponse,
  AssessmentQuestionsListResponse,
  AssessmentQuestionsListState,
  DeleteAssessmentQuestionPayload,
  UpdateAssessmentQuestionPayload,
  PublishAssessmentTestPayload,
  GenerateQuestionsResponse,
  GenerateCodingProblemMetadataResponse,
  BulkCreateQuestionsPayload,
  TestBulkUploadPayload,
  TestBulkUploadResponse,
  UpdateAssessmentTestPayload,
  DeleteAssessmentTestPayload,
  DuplicateAssessmentTestPayload,
  ArchiveAssessmentTestPayload,
  ShareAssessmentTestPayload,
  ShareBlueprintPayload,
  AssessmentLanguagesListResponse,
  AssessmentCategoriesListResponse,
  AssessmentTestOptionsListResponse,
  AssessmentJudgeLanguage,
  GenerateCodingProblemMetadataPayload,
  GenerateCodingTestcasesSnippetsPayload,
  GenerateCodingTestcasesSnippetsResponse,
  GenerateCodingReferenceSolutionPayload,
  GenerateCodingReferenceSolutionResponse,
  AssignCandidatesPayload,
  PublishBlueprintPayload,
  PublishBlueprintResponse,
  AssessmentCreateWizardProctoring,
} from "./types";
import { organizationalOrigin, selectToken, tenant } from "../auth/selectors";
import { selectAssessmentQuestionsListState, selectLastAssessmentsListQuery } from "./selectors";
import { showToastMessage } from "../../utils/toast";

function fileExtFromContentType(contentType: string | undefined): "xlsx" | "xls" {
  const ct = (contentType ?? "").toLowerCase();
  if (ct.includes("spreadsheetml")) return "xlsx";
  if (ct.includes("ms-excel")) return "xls";
  return "xlsx";
}

function fileNameFromDisposition(disposition: string | undefined): string | null {
  const d = disposition ?? "";
  // filename*=UTF-8''foo.xlsx
  const utf8Match = d.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1].trim().replace(/^["']|["']$/g, ""));
    } catch {
      return utf8Match[1].trim().replace(/^["']|["']$/g, "");
    }
  }
  const match = d.match(/filename\s*=\s*([^;]+)/i);
  if (!match?.[1]) return null;
  return match[1].trim().replace(/^["']|["']$/g, "");
}

async function safeMoveFile(fromPath: string, toPath: string) {
  if (fromPath === toPath) return;
  const exists = await RNFS.exists(toPath);
  if (exists) {
    await RNFS.unlink(toPath);
  }
  await RNFS.moveFile(fromPath, toPath);
}

function* downloadTestTemplateWorker(action: {
  type: string;
  payload: { testId: string };
}): Generator<any, void, any> {
  try {
    const testId = action.payload?.testId?.trim();
    if (!testId) throw new Error("Missing test id.");

    yield put(downloadTestTemplateRequest({ testId }));

    const tokenValue: string | null = yield select(selectToken);
    const tenantValue: string | null = yield select(tenant);
    const originValue: string | null = yield select(organizationalOrigin);

    const endpoint = API_ENDPOINTS.ASSESSMENTS.TEST_DOWNLOAD_TEMPLATE(testId);
    const url = `${config.api.baseURL}${endpoint}`;

    const requestHeaders: Record<string, string> = {
      Accept: "*/*",
    };
    if (originValue) requestHeaders.Origin = originValue;
    if (tokenValue) requestHeaders.Authorization = `Bearer ${tokenValue}`;
    if (tenantValue) requestHeaders["X-Organization-Id"] = tenantValue;

    const tempPath = `${RNFS.CachesDirectoryPath}/test_template_${testId}_${Date.now()}.tmp`;
    const res = yield call(() =>
      ReactNativeBlobUtil.config({
        path: tempPath,
        fileCache: true,
        overwrite: true,
      }).fetch("GET", url, requestHeaders)
    );

    const status = res?.info?.()?.status ?? 0;
    if (status < 200 || status >= 300) {
      throw new Error(`Failed to download template (HTTP ${status})`);
    }

    const headers = (res?.info?.()?.headers ?? {}) as Record<string, string>;
    const contentType =
      headers["content-type"] ?? headers["Content-Type"] ?? headers["CONTENT-TYPE"];
    const disposition =
      headers["content-disposition"] ??
      headers["Content-Disposition"] ??
      headers["CONTENT-DISPOSITION"];

    const ext = fileExtFromContentType(contentType);
    const suggestedName = fileNameFromDisposition(disposition);
    const fileName = suggestedName?.trim()
      ? suggestedName.trim()
      : `assessment_template_${testId}.${ext}`;

    const mimeType =
      ext === "xls"
        ? "application/vnd.ms-excel"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    const finalPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
    yield call(safeMoveFile, tempPath, finalPath);

    if (Platform.OS === "android") {
      yield call(
        ReactNativeBlobUtil.MediaCollection.copyToMediaStore,
        {
          name: fileName,
          parentFolder: "CandidHR",
          mimeType,
        },
        "Download",
        finalPath
      );
      showToastMessage("Template downloaded to Downloads", "success");
    } else {
      // Prefer the share sheet (save to Files). If the share module errors on a device/simulator,
      // fall back to previewing the document so the user can still save/export it.
      try {
        yield call(Share.open, {
          urls: [`file://${finalPath}`],
          type: mimeType,
          saveToFiles: true,
          failOnCancel: false,
        });
      } catch (shareErr: any) {
        try {
          // This opens Quick Look preview on iOS.
          yield call(() => (ReactNativeBlobUtil as any).ios?.previewDocument?.(finalPath));
        } catch {
          // If both fail, surface the original share error.
          throw shareErr;
        }
      }
    }

    yield put(downloadTestTemplateSuccess());
  } catch (err: any) {
    // Some native modules reject with non-Error objects; normalize for UI.
    const message =
      err?.message ??
      (typeof err === "string" ? err : null) ??
      err?.error ??
      "Failed to download template";
    // Log full error for debugging in dev builds.
    if (__DEV__) {
      console.error("downloadTestTemplateWorker error:", err);
    }
    yield put(downloadTestTemplateFailure(message));
    showToastMessage(message, "error");
  }
}

function normalizeFilePathForBlobUtil(uri: string): string {
  // `@react-native-documents/picker` + keepLocalCopy: `file://` on iOS; Android may use content URIs before copy.
  // RNBlobUtil.wrap expects a local file path.
  if (!uri) return uri;
  if (uri.startsWith("file://")) {
    // Decode to handle spaces and other URL-encoded characters.
    try {
      return decodeURI(uri.replace("file://", ""));
    } catch {
      return uri.replace("file://", "");
    }
  }
  return uri;
}

function* testBulkUploadWorker(action: {
  type: string;
  payload: TestBulkUploadPayload;
}): Generator<any, void, any> {
  try {
    const testId = action.payload?.testId?.trim();
    const file = action.payload?.file;
    const uri = file?.uri?.trim?.() ?? "";
    const name = file?.name?.trim?.() ?? "";
    const type = file?.type ?? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    if (!testId) throw new Error("Missing test id.");
    if (!uri || !name) throw new Error("Missing file.");

    yield put(testBulkUploadRequest(action.payload));

    const tokenValue: string | null = yield select(selectToken);
    const tenantValue: string | null = yield select(tenant);
    const originValue: string | null = yield select(organizationalOrigin);

    const endpoint = API_ENDPOINTS.ASSESSMENTS.TEST_BULK_UPLOAD(testId);
    const url = `${config.api.baseURL}${endpoint}`;

    // IMPORTANT: do NOT set Content-Type manually here.
    // RNBlobUtil will set the correct multipart boundary; setting it ourselves can break body creation.
    const requestHeaders: Record<string, string> = { Accept: "*/*" };
    if (originValue) requestHeaders.Origin = originValue;
    if (tokenValue) requestHeaders.Authorization = `Bearer ${tokenValue}`;
    if (tenantValue) requestHeaders["X-Organization-Id"] = tenantValue;

    const localPath = normalizeFilePathForBlobUtil(uri);
    const exists = yield call(RNFS.exists, localPath);
    if (!exists) {
      throw new Error("Selected file is not accessible on device.");
    }
    const body = [
      {
        name: "file",
        filename: name,
        type,
        data: ReactNativeBlobUtil.wrap(localPath),
      },
    ];

    const res = yield call(() =>
      ReactNativeBlobUtil.fetch("POST", url, requestHeaders as any, body as any)
    );

    const status = res?.info?.()?.status ?? 0;
    const rawText = typeof res?.text === "function" ? res.text() : null;
    const json = typeof res?.json === "function" ? res.json() : null;

    if (status < 200 || status >= 300) {
      const serverMsg =
        (json && (json as any)?.message) ||
        (json && (json as any)?.detail) ||
        rawText ||
        `Bulk upload failed (HTTP ${status})`;
      throw new Error(serverMsg);
    }

    const data = (json ?? {}) as TestBulkUploadResponse;
    yield put(testBulkUploadSuccess(data));
    showToastMessage(data?.message ?? "Upload completed", "success");
  } catch (err: any) {
    const message =
      err?.message ??
      (typeof err === "string" ? err : null) ??
      err?.error ??
      "Bulk upload failed";
    if (__DEV__) {
      console.error("testBulkUploadWorker error:", err);
    }
    yield put(testBulkUploadFailure(message));
    showToastMessage(message, "error");
  }
}

function* getAssessmentsWorker(
  action: {
    type: string;
    payload?: GetAssessmentsListPayload;
  }
): Generator<any, void, any> {
  try {
    yield put(saveLastAssessmentsListQuery(action.payload));
    const { append = false, ...params } = action.payload || {};
    const page = params.page ?? 1;
    yield put(getAssessmentsRequest({ page, append }));

    const response = yield call(assessmentsApi.getAssessments, { ...params, page });

    yield put(
      getAssessmentsSuccess({
        page,
        append,
        data: response,
      })
    );
  } catch (error: any) {
    yield put(
      getAssessmentsFailure(
        error.message || "Failed to fetch assessments"
      )
    );
  }
}

function* getAssignedAssessmentsWorker(
  action: {
    type: string;
    payload?: GetAssignedAssessmentsPayload;
  }
): Generator<any, void, any> {
  try {
    const { append = false, ...filters } = action.payload || {};
    const page = filters.page ?? 1;

    // Update slice state (loading, pagination) before API call
    yield put(
      getAssignedAssessmentsRequest({
        ...(filters || {}),
        page,
        append,
      })
    );

    const response = yield call(
      assessmentsApi.getAssignedAssessments,
      filters || {}
    );

    yield put(
      getAssignedAssessmentsSuccess({
        page,
        append,
        data: response,
      })
    );
  } catch (error: any) {
    yield put(
      getAssignedAssessmentsFailure(
        error.message || "Failed to fetch assigned assessments"
      )
    );
  }
}

function loadBlueprintOverviewParallel(blueprintId: string) {
  const emptyAssignments: BlueprintAssignmentsListResponse = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };
  return Promise.all([
    assessmentsApi.getBlueprintById(blueprintId),
    assessmentsApi.getDashboardStats().catch(() => null),
    assessmentsApi
      .getAssignmentsByBlueprintId(blueprintId)
      .catch((): BlueprintAssignmentsListResponse => emptyAssignments),
    assessmentsApi.getAssignmentStatsByBlueprintId(blueprintId).catch(() => null),
  ]).then(([detail, statsRes, assignRes, assignStats]) => ({
    detail,
    statsRes,
    assignRes,
    assignStats,
  }));
}

function* fetchAssessmentOverviewWorker(action: {
  type: string;
  payload?: { blueprintId?: string | null };
}): Generator<any, void, any> {
  const blueprintId = action.payload?.blueprintId ?? null;

  yield put(assessmentOverviewRequest({ blueprintId }));

  if (!blueprintId) {
    let dashboardStats = null;
    try {
      const statsRes = yield call(assessmentsApi.getDashboardStats);
      dashboardStats = statsRes?.assessment_stats ?? null;
    } catch {
      /* optional global stats */
    }
    yield put(
      assessmentOverviewSuccess({
        blueprintId: null,
        blueprint: null,
        dashboardStats,
        assignments: [],
        blueprintAssignmentStats: null,
        assignmentsPagination: null,
      })
    );
    return;
  }

  try {
    const bundle = yield call(loadBlueprintOverviewParallel, blueprintId);
    const { detail, statsRes, assignRes, assignStats } = bundle as {
      detail: AssessmentBlueprintDetail;
      statsRes: AssessmentDashboardStatsResponse | null;
      assignRes: BlueprintAssignmentsListResponse;
      assignStats: BlueprintAssignmentStats | null;
    };

    yield put(
      assessmentOverviewSuccess({
        blueprintId,
        blueprint: detail,
        dashboardStats: statsRes?.assessment_stats ?? null,
        assignments: assignRes?.results ?? [],
        blueprintAssignmentStats: assignStats,
        assignmentsPagination: {
          count: assignRes?.count ?? 0,
          next: assignRes?.next ?? null,
          previous: assignRes?.previous ?? null,
          page: 1,
        },
      })
    );
  } catch (error: any) {
    yield put(
      assessmentOverviewFailure(
        error?.message || "Failed to load blueprint"
      )
    );
  }
}

function* fetchBlueprintAssignmentsListWorker(action: {
  type: string;
  payload?: {
    blueprintId: string;
    page?: number;
    append?: boolean;
    o?: string;
    candidate_name?: string;
    candidate_email?: string;
    status?: string;
  };
}): Generator<any, void, any> {
  const blueprintId = action.payload?.blueprintId;
  if (!blueprintId) return;

  const page = action.payload?.page ?? 1;
  const append = action.payload?.append ?? false;
  const o = action.payload?.o ?? "-created_at";
  const candidate_name = action.payload?.candidate_name;
  const candidate_email = action.payload?.candidate_email;
  const status = action.payload?.status;

  yield put(
    blueprintAssignmentsListRequest({
      blueprintId,
      page,
      append,
      o,
      candidate_name,
      candidate_email,
      status,
    })
  );

  try {
    const response = yield call(assessmentsApi.getAssignmentsByBlueprintId, blueprintId, {
      page,
      o,
      candidate_name,
      candidate_email,
      status,
    });
    yield put(
      blueprintAssignmentsListSuccess({
        blueprintId,
        page,
        append,
        data: response as BlueprintAssignmentsListResponse,
      })
    );
  } catch (error: any) {
    yield put(
      blueprintAssignmentsListFailure(
        error?.message || "Failed to load candidate assignments"
      )
    );
  }
}

function* assignCandidatesWorker(action: {
  type: string;
  payload: AssignCandidatesPayload;
}): Generator<any, void, any> {
  const payload = action.payload;
  const blueprintId = payload?.blueprint_id?.trim();
  if (!blueprintId) {
    const msg = "Missing blueprint.";
    yield put(assignCandidatesFailure(msg));
    showToastMessage(msg, "error");
    return;
  }

  yield put(assignCandidatesRequest());

  try {
    yield call(assessmentsApi.assignCandidates, payload);
    yield put(assignCandidatesSuccess());
    showToastMessage("Candidates assigned successfully.", "success");
    yield put(fetchAssessmentOverviewRequestAction(blueprintId));
  } catch (error: any) {
    const msg =
      error instanceof ApiError
        ? error.message
        : error?.message || "Failed to assign candidates";
    yield put(assignCandidatesFailure(msg));
    showToastMessage(msg, "error");
  }
}

function* publishBlueprintWorker(action: {
  type: string;
  payload: PublishBlueprintPayload;
}): Generator<any, void, any> {
  const blueprintId = action.payload?.blueprint_id?.trim();
  if (!blueprintId) {
    const msg = "Missing blueprint.";
    yield put(publishBlueprintFailure(msg));
    showToastMessage(msg, "error");
    return;
  }

  yield put(publishBlueprintRequest());

  try {
    const data = (yield call(
      assessmentsApi.publishBlueprint,
      blueprintId
    )) as PublishBlueprintResponse;
    yield put(publishBlueprintSuccess());
    const toast =
      typeof data?.message === "string" && data.message.trim()
        ? data.message.trim()
        : "Assessment published successfully.";
    showToastMessage(toast, "success");
    yield put(fetchAssessmentOverviewRequestAction(blueprintId));
  } catch (error: any) {
    const msg =
      error instanceof ApiError
        ? error.message
        : error?.message || "Failed to publish assessment";
    yield put(publishBlueprintFailure(msg));
    showToastMessage(msg, "error");
  }
}

function* exportBlueprintAssignmentsReportWorker(action: {
  type: string;
  payload: ExportBlueprintAssignmentsReportPayload;
}): Generator<any, void, any> {
  try {
    const blueprintId = action.payload?.blueprint_id?.trim();
    const selectAll = Boolean(action.payload?.select_all);
    const assignmentIds = action.payload?.assignment_ids ?? [];

    if (!blueprintId) {
      throw new Error("Missing blueprint for export.");
    }
    if (!selectAll && (!Array.isArray(assignmentIds) || assignmentIds.length === 0)) {
      throw new Error("Please select at least one assignment to export.");
    }

    yield put(assignmentExportReportRequest());

    const tokenValue: string | null = yield select(selectToken);
    const tenantValue: string | null = yield select(tenant);
    const originValue: string | null = yield select(organizationalOrigin);

    const endpoint = API_ENDPOINTS.ASSESSMENTS.ASSIGNMENTS_EXPORT;
    const url = `${config.api.baseURL}${endpoint}`;
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "*/*",
    };
    if (originValue) requestHeaders.Origin = originValue;
    if (tokenValue) requestHeaders.Authorization = `Bearer ${tokenValue}`;
    if (tenantValue) requestHeaders["X-Organization-Id"] = tenantValue;

    const body = JSON.stringify({
      select_all: selectAll,
      assignment_ids: assignmentIds,
      blueprint_id: blueprintId,
    });

    const tempPath = `${RNFS.CachesDirectoryPath}/blueprint_assignments_export_${Date.now()}.tmp`;
    const res = yield call(() =>
      ReactNativeBlobUtil.config({
        path: tempPath,
        fileCache: true,
        overwrite: true,
      }).fetch("POST", url, requestHeaders, body)
    );

    const status = res?.info?.()?.status ?? 0;
    if (status < 200 || status >= 300) {
      throw new Error(`Failed to export assignments report (HTTP ${status})`);
    }

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const fileName = `assessment_assignments_${yyyy}-${mm}-${dd}.xlsx`;

    const exportMimeType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    const finalPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
    yield call(safeMoveFile, tempPath, finalPath);

    if (Platform.OS === "android") {
      yield call(
        ReactNativeBlobUtil.MediaCollection.copyToMediaStore,
        {
          name: fileName,
          parentFolder: "CandidHR",
          mimeType: exportMimeType,
        },
        "Download",
        finalPath
      );
      showToastMessage("Assignments report exported to Downloads", "success");
    } else {
      yield call(Share.open, {
        urls: [`file://${finalPath}`],
        type: exportMimeType,
        saveToFiles: true,
        failOnCancel: false,
      });
    }

    yield put(assignmentExportReportSuccess());
  } catch (err: any) {
    const message = err?.message ?? "Failed to export assignments report";
    yield put(assignmentExportReportFailure(message));
    showToastMessage(message, "error");
  }
}

function* postAssessmentTestWorker(
  action: {
    type: string;
    payload: CreateAssessmentPayload;
  }
): Generator<any, void, AssessmentResponse> {
  try {
    // Ensure loading/error state is set when this worker is triggered
    // via the legacy ASSESSMENTS_ACTION_TYPES action (not the slice action).
    if (action.type !== postAssessmentTestRequest.type) {
      yield put(postAssessmentTestRequest(action.payload));
    }

    const response = yield call(assessmentsApi.createAssessment, action.payload);
    yield put(postAssessmentTestSuccess(response));

    yield put({
      type: ASSESSMENTS_ACTION_TYPES.GET_ASSESSMENTS_REQUEST,
      payload: { page: 1 },
    });

    showToastMessage("Assessment created successfully", "success");

  } catch (error: any) {
    yield put(
      postAssessmentTestFailure(
        error?.message || "Failed to create assessment"
      )
    );

    showToastMessage(
      error?.message || "Failed to create assessment",
      "error"
    );
  }
}

function* updateAssessmentTestWorker(action: {
  type: string;
  payload: UpdateAssessmentTestPayload;
}): Generator<any, void, AssessmentResponse> {
  try {
    if (action.type !== updateAssessmentTestRequest.type) {
      yield put(updateAssessmentTestRequest(action.payload));
    }

    const testId = action.payload.testId?.trim();
    if (!testId) {
      throw new Error("Missing test id.");
    }

    const response = yield call(
      assessmentsApi.updateAssessmentTest,
      testId,
      action.payload.body
    );
    yield put(updateAssessmentTestSuccess({ testId, data: response }));
    showToastMessage("Test saved successfully", "success");
  } catch (error: any) {
    const message = error?.message || "Failed to update test";
    yield put(updateAssessmentTestFailure(message));
    showToastMessage(message, "error");
  }
}

function* deleteAssessmentTestWorker(action: {
  type: string;
  payload: DeleteAssessmentTestPayload;
}): Generator<any, void, any> {
  try {
    if (action.type !== deleteAssessmentTestRequest.type) {
      yield put(deleteAssessmentTestRequest(action.payload));
    }

    const testId = action.payload?.testId?.trim();
    if (!testId) {
      throw new Error("Missing test id.");
    }

    yield call(assessmentsApi.deleteAssessmentTest, testId);
    yield put(deleteAssessmentTestSuccess({ testId }));

    const lastListQuery: GetAssessmentsListPayload | null = yield select(
      selectLastAssessmentsListQuery
    );
    yield put({
      type: ASSESSMENTS_ACTION_TYPES.GET_ASSESSMENTS_REQUEST,
      payload: {
        ...(lastListQuery ?? {}),
        page: 1,
        append: false,
      },
    });

    showToastMessage("Test deleted successfully", "success");
  } catch (error: any) {
    const message = error?.message || "Failed to delete test";
    yield put(deleteAssessmentTestFailure(message));
    showToastMessage(message, "error");
  }
}

function* duplicateAssessmentTestWorker(action: {
  type: string;
  payload: DuplicateAssessmentTestPayload;
}): Generator<any, void, any> {
  try {
    if (action.type !== duplicateAssessmentTestRequest.type) {
      yield put(duplicateAssessmentTestRequest(action.payload));
    }

    const testId = action.payload?.testId?.trim();
    if (!testId) {
      throw new Error("Missing test id.");
    }

    const response: { message: string } = yield call(
      assessmentsApi.duplicateAssessmentTest,
      testId
    );
    yield put(duplicateAssessmentTestSuccess());

    const lastListQuery: GetAssessmentsListPayload | null = yield select(
      selectLastAssessmentsListQuery
    );
    yield put({
      type: ASSESSMENTS_ACTION_TYPES.GET_ASSESSMENTS_REQUEST,
      payload: {
        ...(lastListQuery ?? {}),
        page: 1,
        append: false,
      },
    });

    showToastMessage(
      response?.message ?? "Test duplicated successfully.",
      "success"
    );
  } catch (error: any) {
    const message = error?.message || "Failed to duplicate test";
    yield put(duplicateAssessmentTestFailure(message));
    showToastMessage(message, "error");
  }
}

function* duplicateBlueprintWorker(
  action: ReturnType<typeof duplicateBlueprintRequest>
): Generator<any, void, any> {
  try {
    const blueprintId = action.payload?.blueprintId?.trim();
    if (!blueprintId) {
      throw new Error("Missing blueprint id.");
    }

    const response: { message: string } = yield call(
      assessmentsApi.duplicateBlueprint,
      blueprintId
    );
    yield put(duplicateBlueprintSuccess());

    const lastListQuery: GetAssessmentsListPayload | null = yield select(
      selectLastAssessmentsListQuery
    );
    yield put({
      type: ASSESSMENTS_ACTION_TYPES.GET_ASSESSMENTS_REQUEST,
      payload: {
        ...(lastListQuery ?? {}),
        page: 1,
        append: false,
      },
    });

    showToastMessage(
      response?.message ?? "Assessment copied successfully.",
      "success"
    );
  } catch (error: any) {
    const message =
      error?.message || "Failed to duplicate assessment";
    yield put(duplicateBlueprintFailure(message));
    showToastMessage(message, "error");
  }
}

function* deleteBlueprintWorker(
  action: ReturnType<typeof deleteBlueprintRequest>
): Generator<any, void, any> {
  try {
    const blueprintId = action.payload?.blueprintId?.trim();
    if (!blueprintId) {
      throw new Error("Missing blueprint id.");
    }

    yield call(assessmentsApi.deleteBlueprint, blueprintId);
    yield put(deleteBlueprintSuccess({ blueprintId }));

    const lastListQuery: GetAssessmentsListPayload | null = yield select(
      selectLastAssessmentsListQuery
    );
    yield put({
      type: ASSESSMENTS_ACTION_TYPES.GET_ASSESSMENTS_REQUEST,
      payload: {
        ...(lastListQuery ?? {}),
        page: 1,
        append: false,
      },
    });

    showToastMessage("Assessment deleted successfully", "success");
  } catch (error: any) {
    const message = error?.message || "Failed to delete assessment";
    yield put(deleteBlueprintFailure(message));
    showToastMessage(message, "error");
  }
}

function* archiveBlueprintWorker(
  action: ReturnType<typeof archiveBlueprintRequest>
): Generator<any, void, any> {
  try {
    const blueprintId = action.payload?.blueprintId?.trim();
    if (!blueprintId) {
      throw new Error("Missing blueprint id.");
    }

    const response: { message: string } = yield call(
      assessmentsApi.archiveBlueprint,
      blueprintId
    );
    yield put(archiveBlueprintSuccess({ blueprintId }));

    const lastListQuery: GetAssessmentsListPayload | null = yield select(
      selectLastAssessmentsListQuery
    );
    yield put({
      type: ASSESSMENTS_ACTION_TYPES.GET_ASSESSMENTS_REQUEST,
      payload: {
        ...(lastListQuery ?? {}),
        page: 1,
        append: false,
      },
    });

    showToastMessage(
      response?.message ?? "Assessment archived successfully.",
      "success"
    );
  } catch (error: any) {
    const message = error?.message || "Failed to archive assessment";
    yield put(archiveBlueprintFailure(message));
    showToastMessage(message, "error");
  }
}

function* archiveAssessmentTestWorker(action: {
  type: string;
  payload: ArchiveAssessmentTestPayload;
}): Generator<any, void, any> {
  try {
    if (action.type !== archiveAssessmentTestRequest.type) {
      yield put(archiveAssessmentTestRequest(action.payload));
    }

    const testId = action.payload?.testId?.trim();
    if (!testId) {
      throw new Error("Missing test id.");
    }

    const response: { message: string } = yield call(
      assessmentsApi.archiveAssessmentTest,
      testId
    );
    yield put(archiveAssessmentTestSuccess({ testId }));

    const lastListQuery: GetAssessmentsListPayload | null = yield select(
      selectLastAssessmentsListQuery
    );
    yield put({
      type: ASSESSMENTS_ACTION_TYPES.GET_ASSESSMENTS_REQUEST,
      payload: {
        ...(lastListQuery ?? {}),
        page: 1,
        append: false,
      },
    });

    showToastMessage(
      response?.message ?? "Test archived successfully.",
      "success"
    );
  } catch (error: any) {
    const message = error?.message || "Failed to archive test";
    yield put(archiveAssessmentTestFailure(message));
    showToastMessage(message, "error");
  }
}

function* shareAssessmentTestWorker(action: {
  type: string;
  payload: ShareAssessmentTestPayload;
}): Generator<any, void, any> {
  try {
    if (action.type !== shareAssessmentTestRequest.type) {
      yield put(shareAssessmentTestRequest(action.payload));
    }

    const testId = action.payload?.testId?.trim();
    if (!testId) {
      throw new Error("Missing test id.");
    }

    const users = Array.isArray(action.payload?.users_shared_with)
      ? action.payload.users_shared_with.map((x) => String(x).trim()).filter(Boolean)
      : [];

    const response: { message: string } = yield call(
      assessmentsApi.shareAssessmentTest,
      testId,
      { users_shared_with: users }
    );
    yield put(shareAssessmentTestSuccess());

    const lastListQuery: GetAssessmentsListPayload | null = yield select(
      selectLastAssessmentsListQuery
    );
    yield put({
      type: ASSESSMENTS_ACTION_TYPES.GET_ASSESSMENTS_REQUEST,
      payload: {
        ...(lastListQuery ?? {}),
        page: 1,
        append: false,
      },
    });

    showToastMessage(
      response?.message ?? "Test shared successfully.",
      "success"
    );
  } catch (error: any) {
    const message = error?.message || "Failed to share test";
    yield put(shareAssessmentTestFailure(message));
    showToastMessage(message, "error");
  }
}

function* shareBlueprintWorker(
  action: { type: string; payload: ShareBlueprintPayload }
): Generator<any, void, any> {
  try {
    if (action.type !== shareBlueprintRequest.type) {
      yield put(shareBlueprintRequest(action.payload));
    }

    const blueprintId = action.payload?.blueprintId?.trim();
    if (!blueprintId) {
      throw new Error("Missing blueprint id.");
    }

    const users = Array.isArray(action.payload?.users_shared_with)
      ? action.payload.users_shared_with.map((x) => String(x).trim()).filter(Boolean)
      : [];

    const response: { message: string } = yield call(
      assessmentsApi.shareBlueprint,
      blueprintId,
      { users_shared_with: users }
    );
    yield put(shareBlueprintSuccess());

    const lastListQuery: GetAssessmentsListPayload | null = yield select(
      selectLastAssessmentsListQuery
    );
    yield put({
      type: ASSESSMENTS_ACTION_TYPES.GET_ASSESSMENTS_REQUEST,
      payload: {
        ...(lastListQuery ?? {}),
        page: 1,
        append: false,
      },
    });

    showToastMessage(
      response?.message ?? "Assessment shared successfully.",
      "success"
    );
  } catch (error: any) {
    const message = error?.message || "Failed to share assessment";
    yield put(shareBlueprintFailure(message));
    showToastMessage(message, "error");
  }
}

function* postAssessmentQuestionWorker(action: {
  type: string;
  payload: CreateAssessmentQuestionPayload;
}): Generator<any, void, any> {
  try {
    // Ensure loading/error state is set when this worker is triggered
    // via the legacy ASSESSMENTS_ACTION_TYPES action (not the slice action).
    if (action.type !== postAssessmentQuestionRequest.type) {
      yield put(postAssessmentQuestionRequest(action.payload));
    }

    const response = yield call(
      assessmentsApi.createAssessmentQuestion,
      action.payload
    );
    console.log("createAssessmentQuestion response:", response);
    yield put(postAssessmentQuestionSuccess(response));
    showToastMessage("Question created successfully", "success");
    const testIdAfterCreate = (response as AssessmentQuestionResponse)?.test?.trim?.();
    if (testIdAfterCreate) {
      const ql: { questionType?: string | null } = yield select(
        selectAssessmentQuestionsListState
      );
      const qtMerged = sanitizeQuestionTypeForQuestionsListQuery(
        (response as AssessmentQuestionResponse)?.question_type ?? ql?.questionType ?? undefined
      );
      yield put(
        fetchAssessmentQuestionsListRequest({
          testId: testIdAfterCreate,
          page: 1,
          ...(qtMerged ? { questionType: qtMerged } : {}),
        })
      );
    }
  } catch (error: any) {
    const message = error?.message || "Failed to create question";
    yield put(postAssessmentQuestionFailure(message));
    showToastMessage(message, "error");
  }
}

function* submitProblemQuestionWorker(action: {
  type: string;
  payload: SubmitProblemQuestionPayload;
}): Generator<any, void, any> {
  try {
    const { questionId, body } = action.payload;
    const qid = questionId?.trim() ?? "";

    const response = qid
      ? yield call(assessmentsApi.updateProblemQuestion, qid, body)
      : yield call(assessmentsApi.createProblemQuestion, body);

    yield put(submitProblemQuestionSuccess(response));
    showToastMessage(qid ? "Question updated successfully" : "Question created successfully", "success");

    const testIdAfter = (response as AssessmentQuestionResponse)?.test?.trim?.() ?? body.test_id?.trim?.();
    if (testIdAfter) {
      const ql = (yield select(
        selectAssessmentQuestionsListState
      )) as AssessmentQuestionsListState;
      const qtMerged = sanitizeQuestionTypeForQuestionsListQuery(
        (response as AssessmentQuestionResponse)?.question_type ?? ql?.questionType ?? undefined
      );
      yield put(
        fetchAssessmentQuestionsListRequest({
          testId: testIdAfter,
          page: 1,
          ...(qtMerged ? { questionType: qtMerged } : {}),
        })
      );
    }
  } catch (error: any) {
    const apiBody =
      error instanceof ApiError ? error.apiDetails : error?.details ?? error;
    const refRows = extractReferenceSolutionRowsFromApiErrorDetails(
      (apiBody as any)?.details
    );

    const message =
      (typeof (apiBody as any)?.message === "string" &&
        (apiBody as any).message.trim()) ||
      error?.message ||
      "Failed to save question";

    if (refRows?.length) {
      const normalized: ReferenceSolutionValidationRow[] = refRows.map(
        (e: any) => ({
          language: typeof e.language === "string" ? e.language : undefined,
          input:
            typeof e.input === "string"
              ? e.input
              : String(e.input ?? ""),
          output:
            typeof e.output === "string"
              ? e.output
              : String(e.output ?? ""),
          actual_output:
            typeof e.actual_output === "string"
              ? e.actual_output
              : String(e.actual_output ?? ""),
          error:
            typeof e.error === "string" ? e.error : String(e.error ?? ""),
          message:
            typeof e.message === "string" ? e.message : String(e.message ?? ""),
        })
      );
      yield put(
        submitProblemQuestionFailure({
          message,
          referenceSolutionRows: normalized,
        })
      );
    } else {
      yield put(submitProblemQuestionFailure({ message }));
    }
  }
}

function* deleteAssessmentQuestionWorker(action: {
  type: string;
  payload: DeleteAssessmentQuestionPayload;
}): Generator<any, void, any> {
  try {
    if (action.type !== deleteAssessmentQuestionRequest.type) {
      yield put(deleteAssessmentQuestionRequest(action.payload));
    }

    const questionId = action.payload?.questionId?.trim();
    if (!questionId) {
      throw new Error("Missing question id.");
    }

    yield call(assessmentsApi.deleteAssessmentQuestion, questionId, {
      isProblemQuestion: Boolean(action.payload?.isProblemQuestion),
    });
    yield put(deleteAssessmentQuestionSuccess());
    showToastMessage("Question deleted successfully", "success");

    const testId = action.payload?.testId?.trim();
    if (testId) {
      const ql: { questionType?: string | null } = yield select(
        selectAssessmentQuestionsListState
      );
      const qtMerged = sanitizeQuestionTypeForQuestionsListQuery(ql?.questionType ?? undefined);
      yield put(
        fetchAssessmentQuestionsListRequest({
          testId,
          page: 1,
          ...(qtMerged ? { questionType: qtMerged } : {}),
        })
      );
    }
  } catch (error: any) {
    const message = error?.message || "Failed to delete question";
    yield put(deleteAssessmentQuestionFailure(message));
    showToastMessage(message, "error");
  }
}

function* updateAssessmentQuestionWorker(action: {
  type: string;
  payload: UpdateAssessmentQuestionPayload;
}): Generator<any, void, any> {
  try {
    if (action.type !== updateAssessmentQuestionRequest.type) {
      yield put(updateAssessmentQuestionRequest(action.payload));
    }

    const questionId = action.payload?.questionId?.trim();
    if (!questionId) {
      throw new Error("Missing question id.");
    }

    const response = yield call(
      assessmentsApi.updateAssessmentQuestion,
      questionId,
      action.payload?.data
    );
    yield put(updateAssessmentQuestionSuccess(response));
    showToastMessage("Question updated successfully", "success");

    const testId = action.payload?.data?.test?.trim?.();
    if (testId) {
      const ql: { questionType?: string | null } = yield select(
        selectAssessmentQuestionsListState
      );
      const qtMerged = sanitizeQuestionTypeForQuestionsListQuery(ql?.questionType ?? undefined);
      yield put(
        fetchAssessmentQuestionsListRequest({
          testId,
          page: 1,
          ...(qtMerged ? { questionType: qtMerged } : {}),
        })
      );
    }
  } catch (error: any) {
    const message = error?.message || "Failed to update question";
    yield put(updateAssessmentQuestionFailure(message));
    showToastMessage(message, "error");
  }
}

function* publishAssessmentTestWorker(action: {
  type: string;
  payload: PublishAssessmentTestPayload;
}): Generator<any, void, any> {
  try {
    if (action.type !== publishAssessmentTestRequest.type) {
      yield put(publishAssessmentTestRequest(action.payload));
    }

    const testId = action.payload?.testId?.trim();
    if (!testId) {
      throw new Error("Missing test id.");
    }

    const res = yield call(assessmentsApi.publishAssessmentTest, testId);
    yield put(publishAssessmentTestSuccess({ testId }));
    showToastMessage(res?.message ?? "Test published successfully", "success");

    // Refresh test detail to sync server flags & totals
    yield put(fetchAssessmentTestDetailRequest({ id: testId }));
  } catch (error: any) {
    const message = error?.message || "Failed to publish test";
    yield put(publishAssessmentTestFailure(message));
    showToastMessage(message, "error");
  }
}

function* fetchAssessmentTestDetailWorker(action: {
  type: string;
  payload: { id: string };
}): Generator<any, void, AssessmentResponse> {
  const id = action.payload?.id?.trim();
  if (!id) {
    yield put(fetchAssessmentTestDetailFailure("Missing test id."));
    return;
  }

  try {
    // Ensure loading/error state is set when this worker is triggered
    // via a non-slice action (future-proof).
    if (action.type !== fetchAssessmentTestDetailRequest.type) {
      yield put(fetchAssessmentTestDetailRequest({ id }));
    }

    const response = yield call(assessmentsApi.getAssessmentTestById, id);
    console.log("getAssessmentTestById response:", response);
    yield put(fetchAssessmentTestDetailSuccess({ id, data: response }));
  } catch (error: any) {
    const message = error?.message || "Failed to fetch test details";
    yield put(fetchAssessmentTestDetailFailure(message));
  }
}

function* fetchAssessmentQuestionsListWorker(action: {
  type: string;
  payload: { testId: string; page?: number; questionType?: string | null };
}): Generator<any, void, AssessmentQuestionsListResponse> {
  const testId = action.payload?.testId?.trim();
  const page = action.payload?.page ?? 1;
  const questionType = sanitizeQuestionTypeForQuestionsListQuery(
    action.payload?.questionType ?? undefined
  );
  if (!testId) {
    yield put(fetchAssessmentQuestionsListFailure("Missing test id."));
    return;
  }

  try {
    if (action.type !== fetchAssessmentQuestionsListRequest.type) {
      yield put(
        fetchAssessmentQuestionsListRequest({
          testId,
          page,
          ...(Object.prototype.hasOwnProperty.call(action.payload, "questionType")
            ? { questionType: action.payload.questionType ?? null }
            : {}),
        })
      );
    }
    const QUESTIONS_PAGE_SIZE = 100;
    let pageNum = page;
    const aggregated: AssessmentQuestionsListResponse["results"] = [];
    let lastResponse: AssessmentQuestionsListResponse | null = null;
    let totalCount: number | undefined;

    for (;;) {
      const response: AssessmentQuestionsListResponse = yield call(
        assessmentsApi.getAssessmentQuestionsByTestId,
        testId,
        pageNum,
        questionType,
        QUESTIONS_PAGE_SIZE
      );
      lastResponse = response;
      if (totalCount == null && response?.count != null) {
        totalCount = response.count;
      }
      const chunk = Array.isArray(response?.results) ? response.results : [];
      aggregated.push(...chunk);
      const hasNext = Boolean(response?.next);
      if (!hasNext || chunk.length === 0) {
        break;
      }
      pageNum += 1;
      if (pageNum > 500) {
        break;
      }
    }

    const merged: AssessmentQuestionsListResponse = {
      count: totalCount ?? lastResponse?.count ?? aggregated.length,
      next: null,
      previous: null,
      results: aggregated,
    };
    yield put(fetchAssessmentQuestionsListSuccess({ testId, page, data: merged }));
  } catch (error: any) {
    const message = error?.message || "Failed to fetch questions";
    yield put(fetchAssessmentQuestionsListFailure(message));
  }
}

function* generateAssessmentQuestionsWorker(action: {
  type: string;
  payload: {
    params: any;
    requestId: string;
  };
}): Generator<any, void, GenerateQuestionsResponse> {
  try {
    const params = action.payload?.params;
    const testId = params?.testId?.trim?.();
    if (!testId) {
      throw new Error("Missing test id.");
    }

    const response = yield call(assessmentsApi.generateQuestions, params);
    const cb = takeGenerateQuestionsCallbacks(action.payload.requestId);
    if (typeof cb.onSuccess === "function") cb.onSuccess(response);
  } catch (error: any) {
    const message = error?.message || "Failed to generate questions";
    const cb = takeGenerateQuestionsCallbacks(action.payload.requestId);
    if (typeof cb.onError === "function") cb.onError(message);
    showToastMessage(message, "error");
  }
}

function* generateCodingProblemMetadataWorker(action: {
  type: string;
  payload: {
    payload: GenerateCodingProblemMetadataPayload;
    requestId: string;
  };
}): Generator<any, void, GenerateCodingProblemMetadataResponse> {
  try {
    const body = action.payload?.payload;
    if (!body?.ai_prompt?.trim()) {
      throw new Error("Enter a prompt for AI.");
    }

    const response = yield call(assessmentsApi.generateCodingProblemMetadata, body);
    const cb = takeGenerateCodingMetadataCallbacks(action.payload.requestId);
    if (typeof cb.onSuccess === "function") cb.onSuccess(response);
  } catch (error: any) {
    const message = error?.message || "Failed to generate coding problem";
    const cb = takeGenerateCodingMetadataCallbacks(action.payload.requestId);
    if (typeof cb.onError === "function") cb.onError(message);
    showToastMessage(message, "error");
  }
}

function* generateCodingTestcasesSnippetsWorker(action: {
  type: string;
  payload: {
    payload: GenerateCodingTestcasesSnippetsPayload;
    requestId: string;
  };
}): Generator<any, void, GenerateCodingTestcasesSnippetsResponse> {
  try {
    const body = action.payload?.payload;
    if (!body?.ai_prompt?.trim()) {
      throw new Error("Enter a prompt for AI.");
    }
    if (!Array.isArray(body.supported_languages) || body.supported_languages.length === 0) {
      throw new Error("Select at least one supported language.");
    }
    if (!String(body.description ?? "").trim()) {
      throw new Error("Add a problem description before generating test cases.");
    }

    const response = yield call(assessmentsApi.generateCodingTestcasesSnippets, body);
    const cb = takeGenerateCodingTestcasesCallbacks(action.payload.requestId);
    if (typeof cb.onSuccess === "function") cb.onSuccess(response);
  } catch (error: any) {
    const message = error?.message || "Failed to generate test cases";
    const cb = takeGenerateCodingTestcasesCallbacks(action.payload.requestId);
    if (typeof cb.onError === "function") cb.onError(message);
    showToastMessage(message, "error");
  }
}

function* generateCodingReferenceSolutionWorker(action: {
  type: string;
  payload: {
    payload: GenerateCodingReferenceSolutionPayload;
    requestId: string;
  };
}): Generator<any, void, GenerateCodingReferenceSolutionResponse> {
  try {
    const body = action.payload?.payload;
    if (!body?.ai_prompt?.trim()) {
      throw new Error("Enter a prompt for AI.");
    }
    if (!String(body.description ?? "").trim()) {
      throw new Error("Add a problem description before generating a reference solution.");
    }
    if (!Array.isArray(body.languages) || body.languages.length === 0) {
      throw new Error("Select a language for the reference solution.");
    }
    if (!Array.isArray(body.test_cases) || body.test_cases.length === 0) {
      throw new Error("Add at least one test case with input and expected output.");
    }

    const response = yield call(assessmentsApi.generateCodingReferenceSolution, body);
    const cb = takeGenerateCodingReferenceSolutionCallbacks(action.payload.requestId);
    if (typeof cb.onSuccess === "function") cb.onSuccess(response);
  } catch (error: any) {
    const message = error?.message || "Failed to generate reference solution";
    const cb = takeGenerateCodingReferenceSolutionCallbacks(action.payload.requestId);
    if (typeof cb.onError === "function") cb.onError(message);
    showToastMessage(message, "error");
  }
}

function* bulkCreateQuestionsWorker(action: {
  type: string;
  payload: BulkCreateQuestionsPayload;
}): Generator<any, void, any> {
  try {
    const testId = action.payload?.testId?.trim();
    const questions = action.payload?.questions ?? [];
    if (!testId) throw new Error("Missing test id.");
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Please select at least one question.");
    }

    yield put(bulkCreateQuestionsRequest(action.payload));

    const response = yield call(assessmentsApi.bulkCreateQuestions, testId, questions);
    yield put(bulkCreateQuestionsSuccess());

    showToastMessage(response?.detail ?? "Questions added to test", "success");
    const ql: { questionType?: string | null } = yield select(
      selectAssessmentQuestionsListState
    );
    const qtMerged = sanitizeQuestionTypeForQuestionsListQuery(ql?.questionType ?? undefined);
    yield put(
      fetchAssessmentQuestionsListRequest({
        testId,
        page: 1,
        ...(qtMerged ? { questionType: qtMerged } : {}),
      })
    );
  } catch (error: any) {
    const message = error?.message ?? "Failed to add questions";
    yield put(bulkCreateQuestionsFailure(message));
    showToastMessage(message, "error");
  }
}

function* fetchQuestionsAfterTestDetailSuccess(action: {
  type: string;
  payload: { id: string; data: AssessmentResponse };
}): Generator<any, void, any> {
  // Use the id returned by the API response (source of truth).
  const testId = action.payload?.data?.id?.trim() ?? action.payload?.id?.trim();
  if (!testId) return;
  // Coding/technical tests: GET /questions does not support `question_type=coding`.
  // Omit the filter and load all questions; coding UI keeps `question_type === 'coding'`.
  yield put(
    fetchAssessmentQuestionsListRequest({
      testId,
      page: 1,
    })
  );
}

function* fetchAssessmentLanguagesWorker(action: {
  type: string;
  payload: { page?: number; pageSize?: number; append?: boolean };
}): Generator<any, void, AssessmentLanguagesListResponse> {
  const pageSize = action.payload?.pageSize ?? 100;
  const append = action.payload?.append ?? false;

  try {
    if (append) {
      const page = action.payload?.page ?? 1;
      const res = yield call(assessmentsApi.getAssessmentLanguages, {
        page,
        page_size: pageSize,
      });
      yield put(fetchAssessmentLanguagesSuccess({ response: res, append: true }));
      return;
    }

    const all: AssessmentJudgeLanguage[] = [];
    let lastMeta: AssessmentLanguagesListResponse | null = null;
    let page = 1;
    for (; ;) {
      const res = yield call(assessmentsApi.getAssessmentLanguages, {
        page,
        page_size: pageSize,
      });
      lastMeta = res;
      const chunk = res.results ?? [];
      all.push(...chunk);
      const totalPages = res.total_pages ?? 1;
      if (page >= totalPages || chunk.length === 0) {
        break;
      }
      page += 1;
    }

    yield put(
      fetchAssessmentLanguagesSuccess({
        response: lastMeta
          ? {
            ...lastMeta,
            results: all,
            page: lastMeta.total_pages ?? 1,
          }
          : {
            count: 0,
            page: 1,
            page_size: pageSize,
            total_pages: 0,
            results: [],
          },
        append: false,
      })
    );
  } catch (error: any) {
    const message = error?.message || "Failed to fetch languages";
    yield put(fetchAssessmentLanguagesFailure(message));
  }
}

function* fetchAssessmentCategoriesWorker(action: {
  type: string;
  payload: { page?: number; append?: boolean; o?: string };
}): Generator<any, void, AssessmentCategoriesListResponse> {
  const append = action.payload?.append ?? false;
  const page = action.payload?.page ?? 1;
  const o = action.payload?.o ?? "name";
  try {
    const res = yield call(assessmentsApi.getAssessmentCategories, { page, o });
    yield put(
      fetchAssessmentCategoriesSuccess({
        response: res,
        append,
        page,
      })
    );
  } catch (error: any) {
    const message = error?.message || "Failed to fetch categories";
    yield put(fetchAssessmentCategoriesFailure(message));
  }
}

function* fetchAssessmentTestOptionsWorker(action: {
  type: string;
  payload: {
    page?: number;
    page_size?: number;
    is_published?: boolean;
    append?: boolean;
  };
}): Generator<any, void, AssessmentTestOptionsListResponse> {
  const append = action.payload?.append ?? false;
  const page = action.payload?.page ?? 1;
  const page_size = action.payload?.page_size ?? 20;
  const is_published = action.payload?.is_published ?? true;
  try {
    const res = yield call(assessmentsApi.getAssessmentTestOptions, {
      page,
      page_size,
      is_published,
    });
    yield put(
      fetchAssessmentTestOptionsSuccess({
        response: res,
        append,
        page,
        pageSize: page_size,
      })
    );
  } catch (error: any) {
    const message = error?.message || "Failed to load tests";
    yield put(fetchAssessmentTestOptionsFailure(message));
  }
}

function* loadBlueprintForEditWorker(
  action: ReturnType<typeof loadBlueprintForEditRequest>
): Generator<any, void, any> {
  const blueprintId = action.payload?.blueprintId?.trim();
  if (!blueprintId) {
    yield put(loadBlueprintForEditFailure("Missing blueprint id."));
    return;
  }
  try {
    const detail: AssessmentBlueprintDetail = yield call(
      assessmentsApi.getBlueprintById,
      blueprintId
    );
    const mapped = hydrateAssessmentCreateWizardFromDetail(detail);
    yield put(loadBlueprintForEditSuccess({ ...mapped, detail }));
  } catch (error: any) {
    const message =
      error?.message ||
      error?.response?.data?.detail ||
      "Failed to load assessment template";
    yield put(loadBlueprintForEditFailure(String(message)));
  }
}

function* submitBlueprintWorker(
  action: ReturnType<typeof submitBlueprintRequest>
): Generator<any, void, any> {
  const proctoring = action.payload
    ?.proctoring as AssessmentCreateWizardProctoring | undefined;
  if (!proctoring) {
    yield put(submitBlueprintFailure("Missing proctoring settings."));
    return;
  }

  const wizard = (yield select(
    (s: RootState) => s.assessments.assessmentCreateWizard
  )) as RootState["assessments"]["assessmentCreateWizard"];

  if (!wizard.basicInfo) {
    yield put(submitBlueprintFailure("Missing basic info. Complete step 1."));
    return;
  }

  if (!wizard.sections.length) {
    yield put(submitBlueprintFailure("Add at least one section with a test."));
    return;
  }

  const body = buildUpdateBlueprintPayload({
    basicInfo: wizard.basicInfo,
    sections: wizard.sections,
    instructionsHtml: wizard.instructionsHtml,
    proctoring,
  });

  const fullBodyRecord = body as unknown as Record<string, unknown>;
  const existingId = (
    action.payload?.blueprintId?.trim() ||
    wizard.blueprintId?.trim() ||
    ""
  );

  const publishedOrLockedInWizard =
    Boolean(wizard.basicInfo?.is_published) ||
    Boolean(wizard.loadBlueprintForEditDetail?.is_published);

  try {
    if (!existingId) {
      if (__DEV__) {
        console.log("[submitBlueprint]", {
          httpMethod: "POST",
          api: "createBlueprint",
          blueprintId: null,
        });
      }
      const blueprint: AssessmentBlueprintDetail = yield call(
        assessmentsApi.createBlueprint,
        fullBodyRecord
      );
      yield put(submitBlueprintSuccess({ blueprint }));
      return;
    }

    if (publishedOrLockedInWizard) {
      const webAlignedBody = buildBlueprintPatchPayloadOmittingLockedDuration({
        basicInfo: wizard.basicInfo,
        sections: wizard.sections,
        instructionsHtml: wizard.instructionsHtml,
        proctoring,
      });
      if (__DEV__) {
        console.log("[submitBlueprint]", {
          httpMethod: "PATCH",
          api: "postUpdateBlueprint",
          blueprintId: existingId,
          body: "omits locked template fields inc. is_proctoring_enabled (published)",
        });
      }
      const blueprint: AssessmentBlueprintDetail = yield call(
        assessmentsApi.postUpdateBlueprint,
        existingId,
        webAlignedBody
      );
      yield put(submitBlueprintSuccess({ blueprint }));
      return;
    }

    try {
      if (__DEV__) {
        console.log("[submitBlueprint]", {
          httpMethod: "PATCH",
          api: "postUpdateBlueprint",
          blueprintId: existingId,
          body: "full",
        });
      }
      const blueprint: AssessmentBlueprintDetail = yield call(
        assessmentsApi.postUpdateBlueprint,
        existingId,
        fullBodyRecord
      );
      yield put(submitBlueprintSuccess({ blueprint }));
    } catch (firstError: unknown) {
      if (!blueprintPatchErrorIndicatesLockedFields(firstError)) {
        throw firstError;
      }
      const withoutDuration = buildBlueprintPatchPayloadOmittingLockedDuration({
        basicInfo: wizard.basicInfo,
        sections: wizard.sections,
        instructionsHtml: wizard.instructionsHtml,
        proctoring,
      });
      if (__DEV__) {
        console.log("[submitBlueprint]", {
          httpMethod: "PATCH",
          api: "postUpdateBlueprint",
          blueprintId: existingId,
          body: "omits locked template fields inc. is_proctoring_enabled (retry)",
        });
      }
      const blueprint: AssessmentBlueprintDetail = yield call(
        assessmentsApi.postUpdateBlueprint,
        existingId,
        withoutDuration
      );
      yield put(submitBlueprintSuccess({ blueprint }));
    }
  } catch (error: any) {
    const message =
      error?.message ||
      error?.response?.data?.detail ||
      "Failed to save assessment blueprint";
    yield put(submitBlueprintFailure(String(message)));
  }
}

export function* assessmentsSaga() {
  yield takeLatest(submitBlueprintRequest.type, submitBlueprintWorker);

  yield takeLatest(
    loadBlueprintForEditRequest.type,
    loadBlueprintForEditWorker
  );

  yield takeLatest(
    ASSESSMENTS_ACTION_TYPES.GET_ASSESSMENTS_REQUEST,
    getAssessmentsWorker
  );
  yield takeLatest(
    ASSESSMENTS_ACTION_TYPES.GET_ASSIGNED_ASSESSMENTS_REQUEST,
    getAssignedAssessmentsWorker
  );
  yield takeLatest(
    ASSESSMENTS_ACTION_TYPES.FETCH_ASSESSMENT_OVERVIEW_REQUEST,
    fetchAssessmentOverviewWorker
  );
  yield takeLatest(
    ASSESSMENTS_ACTION_TYPES.FETCH_BLUEPRINT_ASSIGNMENTS_LIST_REQUEST,
    fetchBlueprintAssignmentsListWorker
  );
  yield takeLatest(
    ASSESSMENTS_ACTION_TYPES.ASSIGN_CANDIDATES_REQUEST,
    assignCandidatesWorker
  );
  yield takeLatest(
    ASSESSMENTS_ACTION_TYPES.PUBLISH_BLUEPRINT_REQUEST,
    publishBlueprintWorker
  );
  yield takeLatest(
    ASSESSMENTS_ACTION_TYPES.EXPORT_BLUEPRINT_ASSIGNMENTS_REPORT_REQUEST,
    exportBlueprintAssignmentsReportWorker
  );
  yield takeLatest(
    ASSESSMENTS_ACTION_TYPES.POST_ASSESSMENTS_Test_REQUEST,
    postAssessmentTestWorker
  );
  // Also listen to the slice action, since screens dispatch it directly.
  yield takeLatest(postAssessmentTestRequest.type, postAssessmentTestWorker);

  yield takeLatest(updateAssessmentTestRequest.type, updateAssessmentTestWorker);

  yield takeLatest(deleteAssessmentTestRequest.type, deleteAssessmentTestWorker);

  yield takeLatest(duplicateAssessmentTestRequest.type, duplicateAssessmentTestWorker);

  yield takeLatest(duplicateBlueprintRequest.type, duplicateBlueprintWorker);

  yield takeLatest(deleteBlueprintRequest.type, deleteBlueprintWorker);

  yield takeLatest(archiveBlueprintRequest.type, archiveBlueprintWorker);

  yield takeLatest(archiveAssessmentTestRequest.type, archiveAssessmentTestWorker);

  yield takeLatest(shareAssessmentTestRequest.type, shareAssessmentTestWorker);

  yield takeLatest(shareBlueprintRequest.type, shareBlueprintWorker);

  yield takeLatest(
    ASSESSMENTS_ACTION_TYPES.POST_ASSESSMENT_QUESTION_REQUEST,
    postAssessmentQuestionWorker
  );
  // Also listen to the slice action, since screens dispatch it directly.
  yield takeLatest(
    postAssessmentQuestionRequest.type,
    postAssessmentQuestionWorker
  );

  yield takeLatest(submitProblemQuestionRequest.type, submitProblemQuestionWorker);

  yield takeLatest(
    deleteAssessmentQuestionRequest.type,
    deleteAssessmentQuestionWorker
  );

  yield takeLatest(
    updateAssessmentQuestionRequest.type,
    updateAssessmentQuestionWorker
  );

  yield takeLatest(
    publishAssessmentTestRequest.type,
    publishAssessmentTestWorker
  );

  yield takeLatest(fetchAssessmentTestDetailRequest.type, fetchAssessmentTestDetailWorker);

  yield takeLatest(fetchAssessmentQuestionsListRequest.type, fetchAssessmentQuestionsListWorker);
  yield takeLatest(fetchAssessmentTestDetailSuccess.type, fetchQuestionsAfterTestDetailSuccess);

  yield takeLatest(fetchAssessmentLanguagesRequest.type, fetchAssessmentLanguagesWorker);

  yield takeLatest(fetchAssessmentCategoriesRequest.type, fetchAssessmentCategoriesWorker);

  yield takeLatest(
    fetchAssessmentTestOptionsRequest.type,
    fetchAssessmentTestOptionsWorker
  );

  yield takeLatest(
    ASSESSMENTS_ACTION_TYPES.GENERATE_ASSESSMENT_QUESTIONS_REQUEST,
    generateAssessmentQuestionsWorker
  );

  yield takeLatest(
    ASSESSMENTS_ACTION_TYPES.GENERATE_CODING_PROBLEM_METADATA_REQUEST,
    generateCodingProblemMetadataWorker
  );

  yield takeLatest(
    ASSESSMENTS_ACTION_TYPES.GENERATE_CODING_TESTCASES_SNIPPETS_REQUEST,
    generateCodingTestcasesSnippetsWorker
  );

  yield takeLatest(
    ASSESSMENTS_ACTION_TYPES.GENERATE_CODING_REFERENCE_SOLUTION_REQUEST,
    generateCodingReferenceSolutionWorker
  );

  yield takeLatest(
    ASSESSMENTS_ACTION_TYPES.BULK_CREATE_QUESTIONS_REQUEST,
    bulkCreateQuestionsWorker
  );

  yield takeLatest(
    ASSESSMENTS_ACTION_TYPES.DOWNLOAD_TEST_TEMPLATE_REQUEST,
    downloadTestTemplateWorker
  );

  yield takeLatest(
    ASSESSMENTS_ACTION_TYPES.TEST_BULK_UPLOAD_REQUEST,
    testBulkUploadWorker
  );
}
