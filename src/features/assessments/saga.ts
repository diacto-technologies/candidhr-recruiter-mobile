import { call, put, select, takeLatest } from "redux-saga/effects";
import { Platform } from "react-native";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import ReactNativeBlobUtil from "react-native-blob-util";
import { config } from "../../config";
import { API_ENDPOINTS } from "../../api/endpoints";
import { ASSESSMENTS_ACTION_TYPES } from "./constants";
import {
  getAssessmentsRequest,
  getAssessmentsSuccess,
  getAssessmentsFailure,
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
} from "./slice";
import { assessmentsApi } from "./api";
import {
  GetAssignedAssessmentsPayload,
  GetAssessmentsListPayload,
  BlueprintAssignmentsListResponse,
  AssessmentBlueprintDetail,
  AssessmentDashboardStatsResponse,
  BlueprintAssignmentStats,
  ExportBlueprintAssignmentsReportPayload,
} from "./types";
import { organizationalOrigin, selectToken, tenant } from "../auth/selectors";
import { showToastMessage } from "../../utils/toast";

function* getAssessmentsWorker(
  action: {
    type: string;
    payload?: GetAssessmentsListPayload;
  }
): Generator<any, void, any> {
  try {
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
    if (finalPath !== tempPath) {
      yield call(RNFS.moveFile, tempPath, finalPath);
    }

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

export function* assessmentsSaga() {
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
    ASSESSMENTS_ACTION_TYPES.EXPORT_BLUEPRINT_ASSIGNMENTS_REPORT_REQUEST,
    exportBlueprintAssignmentsReportWorker
  );
}
