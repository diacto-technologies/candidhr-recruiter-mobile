import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { Platform } from "react-native";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import ReactNativeBlobUtil from "react-native-blob-util";
import { config } from "../../config";
import { API_ENDPOINTS } from "../../api/endpoints";
import { APPLICATIONS_ACTION_TYPES } from "./constants";
import {
  getApplicationsRequest,
  getApplicationsSuccess,
  getApplicationsFailure,
  exportApplicationsRequest,
  exportApplicationsSuccess,
  exportApplicationsFailure,
  // exportApplicantPdfRequest,
  // exportApplicantPdfSuccess,
  // exportApplicantPdfFailure,
  getApplicationDetailRequest,
  getApplicationDetailSuccess,
  getApplicationDetailFailure,
  createApplicationRequest,
  createApplicationSuccess,
  createApplicationFailure,
  updateApplicationStatusRequest,
  updateApplicationStatusSuccess,
  updateApplicationStatusFailure,
  getApplicationResponsesRequest,
  getApplicationResponsesSuccess,
  getApplicationResponsesFailure,
  getResumeScreeningResponsesRequest,
  getResumeScreeningResponsesSuccess,
  getResumeScreeningResponsesFailure,
  getAssessmentLogsRequest,
  getAssessmentLogsSuccess,
  getAssessmentLogsFailure,
  getAssessmentReportRequest,
  getAssessmentReportSuccess,
  getAssessmentReportFailure,
  getAssessmentDetailedReportRequest,
  getAssessmentDetailedReportSuccess,
  getAssessmentDetailedReportFailure,
  getPersonalityScreeningListSuccess,
  getPersonalityScreeningListFailure,
  getPersonalityScreeningResponsesSuccess,
  getPersonalityScreeningResponsesFailure,
  getApplicationStagesRequest,
  getApplicationStagesSuccess,
  getApplicationStagesFailure,
  markSessionAsReviewedRequest,
  markSessionAsReviewedSuccess,
  markSessionAsReviewedFailure,
  parseResumeRequest,
  parseResumeSuccess,
  parseResumeFailure,
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
  getPerformanceReportRequest,
  getPerformanceReportSuccess,
  getPerformanceReportFailure,
  getAssessmentOptionsReportSuccess,
  getAssessmentOptionsReportFailure,
  getAssessmentOptionsReportRequest,
  exportAssessmentReportRequest,
  exportAssessmentReportSuccess,
  exportAssessmentReportFailure,
  getApplicantOptionsRequest,
  getApplicantOptionsSuccess,
  getApplicantOptionsFailure,
} from "./slice";
import { applicationsApi } from "./api";
import type { GetApplicantOptionsPayload } from "./actions";
import {
  ApplicantOptionsListResponse,
  AssessmentDetailedReportApiResponse,
  AssessmentLog,
  AssessmentLogApiResponse,
  AssessmentReportApiResponse,
  ExportAssessmentReportRequest,
  GetApplicationResponsesParams,
  GetApplicationsParams,
  GetApplicationsSagaAction,
  PersonalityScreeningResponse,
  ResumeScreeningApiResponse,
  ScreeningAssessment,
  SessionReviewedResponse,
  UpdateApplicationShareRequest,
} from "./types";
import { getAssessmentDetailedReportRequestAction, getAssessmentReportRequestAction, getApplicationDetailRequestAction, getApplicationStagesRequestAction, getApplicationReasonsListRequestAction } from "./actions";
import { showToastMessage } from "../../utils/toast";
import { selectProfile } from "../profile/selectors";
import type { AssessmentOptionsReportResponse, PerformanceReportResponse, UpdateStageStatusRequest } from "./types";
import { selectSelectedApplication } from "./selectors";
import { organizationalOrigin, selectToken, tenant } from "../auth/selectors";

const sanitizeFilename = (name: string) =>
  name
    .replace(/[\\/:*?"<>|]+/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);

function* getApplicationsWorker(
  action: GetApplicationsSagaAction
): Generator<any, void, any> {
  try {
    const { append = false, ...params } = action.payload || {};
    const page = params.page ?? 1;

    // sets loading=true
    yield put(getApplicationsRequest(params));

    const response = yield call(applicationsApi.getApplications, params);
    console.log(response, 'applicantListapplicantListapplicantList123', applicationsApi.getApplications)

    yield put(
      getApplicationsSuccess({
        page,
        append,
        data: response,
      })
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    yield put(getApplicationsFailure(message));
  }
}

function* exportApplicationsWorker(
  action: { type: string; payload?: { params?: GetApplicationsParams; mode?: 'download' } }
): Generator<any, void, any> {
  try {
    yield put(exportApplicationsRequest());

    const { csv, filename } = yield call(
      applicationsApi.exportApplicationsCsv,
      action.payload?.params
    );

    const safeName =
      (filename && filename.toLowerCase().endsWith(".csv"))
        ? filename
        : `${filename || "applications_export"}.csv`;

    // Cache is safe for temp staging on both platforms (we copy to Downloads on Android).
    const directory = RNFS.CachesDirectoryPath;

    const filePath = `${directory}/${safeName}`;
    yield call(RNFS.writeFile, filePath, csv, "utf8");

    const mode = action.payload?.mode ?? 'download';

    if (Platform.OS === 'android') {
      // ✅ Save into public Downloads via MediaStore (scoped-storage safe)
      yield call(
        ReactNativeBlobUtil.MediaCollection.copyToMediaStore,
        {
          name: safeName,
          parentFolder: "CandidHR",
          mimeType: "text/csv",
        },
        "Download",
        filePath
      );
      showToastMessage("Saved to Downloads", "success");
    } else {
      // ✅ iOS "Download" = Save to Files flow
      const shareUrl = `file://${filePath}`;
      yield call(Share.open, {
        urls: [shareUrl],
        type: "text/csv",
        saveToFiles: true,
        failOnCancel: false,
      });
    }

    yield put(exportApplicationsSuccess());
  } catch (err: any) {
    const message = err?.message ?? "Failed to export applications";
    yield put(exportApplicationsFailure(message));
    showToastMessage(message, "error");
  }
}

// function* exportApplicantPdfWorker(
//   action: { type: string; payload: { applicationId: string; mode?: 'download' } }
// ): Generator<any, void, any> {
//   const applicationId = action.payload?.applicationId;
//   try {
//     if (!applicationId) {
//       yield put(exportApplicantPdfFailure("Missing application id"));
//       return;
//     }

//     yield put(exportApplicantPdfRequest());

//     const tokenValue: string | null = yield select(selectToken);
//     const tenantValue: string | null = yield select(tenant);
//     const originValue: string | null = yield select(organizationalOrigin);

//     const application: any = yield select(selectSelectedApplication);
//     const candidateName =
//       application?.candidate?.name || application?.name || "Applicant";

//     const safeName = `${sanitizeFilename(candidateName)}_${String(applicationId).slice(-6)}.pdf`;

//     const directory = RNFS.CachesDirectoryPath;
//     const filePath = `${directory}/${safeName}`;

//     const headers: Record<string, string> = {
//       Accept: "*/*",
//     };
//     if (originValue) headers["Origin"] = originValue;
//     if (tokenValue) headers["Authorization"] = `Bearer ${tokenValue}`;
//     if (tenantValue) headers["X-Organization-Id"] = tenantValue;

//     const relativeCandidates = [
//       API_ENDPOINTS.APPLICATIONS.PROFILE_PDF(applicationId),
//       `${API_ENDPOINTS.APPLICATIONS.DETAIL(applicationId)}?format=pdf`,
//       `${API_ENDPOINTS.APPLICATIONS.DETAIL(applicationId)}?export=pdf`,
//       `${API_ENDPOINTS.APPLICATIONS.DETAIL(applicationId)}?download=1`,
//     ];

//     let lastStatus: number | null = null;
//     let lastTriedUrl: string | null = null;
//     let lastHeaders: Record<string, any> | null = null;
//     let didDownload = false;

//     for (const rel of relativeCandidates) {
//       const url = `${config.api.baseURL}${rel}`;
//       lastTriedUrl = url;

//       const res = yield call(() =>
//         ReactNativeBlobUtil.config({
//           path: filePath,
//           fileCache: true,
//           overwrite: true,
//         }).fetch("GET", url, headers)
//       );

//       const info = res?.info?.();
//       const status = info?.status ?? 0;
//       lastStatus = status;
//       lastHeaders = (info?.headers ?? null) as any;

//       if (status >= 200 && status < 300) {
//         const contentType = String(
//           info?.headers?.["content-type"] || info?.headers?.["Content-Type"] || ""
//         ).toLowerCase();
//         const contentDisposition = String(
//           info?.headers?.["content-disposition"] ||
//             info?.headers?.["Content-Disposition"] ||
//             ""
//         ).toLowerCase();

//         const looksLikePdf =
//           contentType.includes("application/pdf") ||
//           contentType.includes("application/octet-stream") ||
//           contentDisposition.includes(".pdf");

//         if (!looksLikePdf) {
//           // Some backends return JSON/HTML with 200 here; skip and try next candidate.
//           continue;
//         }
//         didDownload = true;
//         break;
//       }
//     }

//     if (!didDownload) {
//       const baseMsg = `Failed to export PDF (HTTP ${lastStatus ?? "?"})`;
//       if (__DEV__) {
//         console.warn("[exportApplicantPdf] failed", {
//           applicationId,
//           tried: relativeCandidates,
//           lastStatus,
//           lastTriedUrl,
//           lastHeaders,
//         });
//       }
//       throw new Error(lastTriedUrl ? `${baseMsg}` : baseMsg);
//     }

//     if (Platform.OS === "android") {
//       yield call(
//         ReactNativeBlobUtil.MediaCollection.copyToMediaStore,
//         {
//           name: safeName,
//           parentFolder: "CandidHR",
//           mimeType: "application/pdf",
//         },
//         "Download",
//         filePath
//       );
//       showToastMessage("Saved to Downloads", "success");
//     } else {
//       const shareUrl = `file://${filePath}`;
//       yield call(Share.open, {
//         urls: [shareUrl],
//         type: "application/pdf",
//         saveToFiles: true,
//         failOnCancel: false,
//       });
//     }

//     yield put(exportApplicantPdfSuccess());
//   } catch (err: any) {
//     const message = err?.message ?? "Failed to export applicant PDF";
//     yield put(exportApplicantPdfFailure(message));
//     showToastMessage(message, "error");
//   }
// }


function* getApplicationDetailWorker(action: { type: string; payload: string }): Generator<any, void, any> {
  try {
    yield put(getApplicationDetailRequest(action.payload));
    const response = yield call(applicationsApi.getApplicationDetail, action.payload);
    console.log(response, "getApplicationDetailWorkergetApplicationDetailWorker")
    yield put(getApplicationDetailSuccess(response));
  } catch (error: any) {
    yield put(getApplicationDetailFailure(error.message || "Failed to fetch application details"));
  }
}

function* createApplicationWorker(action: { type: string; payload: any }): Generator<any, void, any> {
  try {
    yield put(createApplicationRequest(action.payload));
    const response = yield call(applicationsApi.createApplication, action.payload);
    yield put(createApplicationSuccess(response.application));
  } catch (error: any) {
    yield put(createApplicationFailure(error.message || "Failed to create application"));
  }
}

function* updateApplicationStatusWorker(action: { type: string; payload: { id: string; status: string } }): Generator<any, void, any> {
  try {
    yield put(updateApplicationStatusRequest(action.payload));
    const response = yield call(applicationsApi.updateApplicationStatus, action.payload);
    const detailResponse = yield call(applicationsApi.getApplicationDetail, action.payload.id);
    const application = detailResponse?.application ?? detailResponse;
    yield put(updateApplicationStatusSuccess(application));
    showToastMessage(response?.message ?? "Application status updated successfully", "success");
  } catch (error: any) {
    yield put(updateApplicationStatusFailure(error.message || "Failed to update application status"));
  }
}

function* getApplicationResponsesWorker(
  action: {
    type: string;
    payload: GetApplicationResponsesParams;
  }
): Generator<any, void, any> {
  try {
    yield put(getApplicationResponsesRequest());
    const response = yield call(
      applicationsApi.getApplicationResponses,
      action.payload
    );
    console.log(response, "getApplicationResponsesWorker")

    yield put(
      getApplicationResponsesSuccess(response.results)
    );
  } catch (error: any) {
    yield put(
      getApplicationResponsesFailure(
        error.message || "Failed to fetch application responses"
      )
    );
  }
}

function* getResumeScreeningResponsesWorker(
  action: { type: string; payload: string }
): Generator<any, void, any> {
  try {
    yield put(getResumeScreeningResponsesRequest());

    const res: ResumeScreeningApiResponse = yield call(
      applicationsApi.getResumeScreeningResponses,
      action.payload
    );
    console.log(res, "ResumeScreeningApiResponseResumeScreeningApiResponse")

    yield put(getResumeScreeningResponsesSuccess(res.results));
  } catch (err: any) {
    yield put(getResumeScreeningResponsesFailure(err.message));
  }
}

function* getAssessmentLogsWorker(
  action: { type: string; payload: string }
): Generator<any, void, any> {
  try {
    yield put(getAssessmentLogsRequest());
    const res: AssessmentLogApiResponse = yield call(
      applicationsApi.getAssessmentLogs,
      action.payload
    );
    console.log(res, "resresresresresresres")

    yield put(getAssessmentLogsSuccess(res.results || []));
    // const assessmentlog = res.assessmentlogs[0]?.id;

    // if (assessmentlog) {
    //   yield put(getAssessmentReportRequestAction(assessmentlog));
    // }

  } catch (err: any) {
    yield put(
      getAssessmentLogsFailure(err.message || "Failed to fetch assessment logs")
    );
  }
}

function* getAssessmentLogsBatchWorker(
  action: { type: string; payload: string[] }
): Generator<any, void, any> {
  const stageIds = (action.payload ?? []).filter(Boolean);
  if (!stageIds.length) return;
  try {
    yield put(getAssessmentLogsRequest());
    const merged: AssessmentLog[] = [];
    for (const stageId of stageIds) {
      const res: AssessmentLogApiResponse = yield call(
        applicationsApi.getAssessmentLogs,
        stageId
      );
      merged.push(...(res.results || []));
    }
    const byId = new Map<string, AssessmentLog>();
    for (const log of merged) {
      if (log?.id) byId.set(log.id, log);
    }
    yield put(getAssessmentLogsSuccess(Array.from(byId.values())));
  } catch (err: any) {
    yield put(
      getAssessmentLogsFailure(err.message || "Failed to fetch assessment logs")
    );
  }
}

function* getAssessmentReportWorker(
  action: { type: string; payload: string }
): Generator<any, void, any> {
  try {
    yield put(getAssessmentReportRequest(action.payload));

    const res: AssessmentReportApiResponse = yield call(
      applicationsApi.getAssessmentReport,
      action.payload
    );
    console.log(res, "getAssessmentReportRequest")
    yield put(getAssessmentReportSuccess(res.assessmentlog));
    if (res?.assessmentlog) {
      const assessmentLogId = res.assessmentlog.id;
      const assessmentId = res.assessmentlog.assessments?.[0]?.id;

      if (assessmentId) {
        yield put(
          getAssessmentDetailedReportRequestAction({
            assessmentLogId,
            assessmentId,
          })
        );
      }
    }
  } catch (err: any) {
    yield put(
      getAssessmentReportFailure(
        err.message || "Failed to fetch assessment report"
      )
    );
  }
}

function* getAssessmentDetailedReportWorker(
  action: {
    type: string;
    payload: { assessmentLogId: string; assessmentId: string };
  }
): Generator<any, void, any> {
  try {
    yield put(getAssessmentDetailedReportRequest());

    const res: AssessmentDetailedReportApiResponse = yield call(
      applicationsApi.getAssessmentDetailedReport,
      action.payload.assessmentLogId,
      action.payload.assessmentId
    );
    console.log(res, "getAssessmentDetailedReport")

    yield put(
      getAssessmentDetailedReportSuccess(res.assessment_report)
    );
  } catch (err: any) {
    yield put(
      getAssessmentDetailedReportFailure(
        err.message || "Failed to fetch assessment detailed report"
      )
    );
  }
}

function* getPerformanceReportWorker(
  action: {
    type: string;
    payload: string;
  }
): Generator<any, void, any> {
  try {
    yield put(getPerformanceReportRequest(action.payload));

    const res: PerformanceReportResponse = yield call(
      applicationsApi.getPerformanceReport,
      action.payload
    );

    console.log(res, "getPerformanceReport");

    yield put(getPerformanceReportSuccess(res));
  } catch (err: any) {
    yield put(
      getPerformanceReportFailure(
        err.message || "Failed to fetch performance report"
      )
    );
  }
}

function* getAssessmentOptionsReportWorker(
  action: {
    type: string;
    payload: { application_id: string; page?: number };
  }
): Generator<any, void, any> {
  try {
    const { application_id, page = 1 } = action.payload;

    // sets loading=true and resets when needed (page=1 or application changes)
    yield put(getAssessmentOptionsReportRequest({ application_id, page }));

    const res: AssessmentOptionsReportResponse = yield call(
      applicationsApi.getAssessmentOptionsReport,
      application_id,
      page
    );
    console.log(res,"getAssessmentOptionsReportWorkergetAssessmentOptionsReportWorker")

    yield put(
      getAssessmentOptionsReportSuccess({
        application_id,
        page,
        response: res,
      })
    );
  } catch (err: any) {
    yield put(
      getAssessmentOptionsReportFailure(
        err.message || "Failed to fetch assessment options"
      )
    );
  }
}

function* exportAssessmentReportWorker(
  action: { type: string; payload: ExportAssessmentReportRequest }
): Generator<any, void, any> {
  try {
    const assignmentIds = action.payload?.assignment_ids ?? [];
    if (!Array.isArray(assignmentIds) || assignmentIds.length === 0) {
      throw new Error("Please select an assignment to export.");
    }

    yield put(exportAssessmentReportRequest());

    const tokenValue: string | null = yield select(selectToken);
    const tenantValue: string | null = yield select(tenant);
    const originValue: string | null = yield select(organizationalOrigin);

    const endpoint = API_ENDPOINTS.APPLICATIONS.ASSESSMENT_REPORT_EXPORT;
    const url = `${config.api.baseURL}${endpoint}`;
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "*/*",
    };
    if (originValue) requestHeaders.Origin = originValue;
    if (tokenValue) requestHeaders.Authorization = `Bearer ${tokenValue}`;
    if (tenantValue) requestHeaders["X-Organization-Id"] = tenantValue;

    const tempPath = `${RNFS.CachesDirectoryPath}/assessment_report_${Date.now()}.tmp`;
    const res = yield call(() =>
      ReactNativeBlobUtil.config({
        path: tempPath,
        fileCache: true,
        overwrite: true,
      }).fetch("POST", url, requestHeaders, JSON.stringify({
        select_all: Boolean(action.payload?.select_all),
        assignment_ids: assignmentIds,
      }))
    );

    const status = res?.info?.()?.status ?? 0;
    if (status < 200 || status >= 300) {
      throw new Error(`Failed to export assessment report (HTTP ${status})`);
    }

    const contentType = String(
      res?.info?.()?.headers?.["content-type"] ||
      res?.info?.()?.headers?.["Content-Type"] ||
      "application/octet-stream"
    );
    const contentDisposition = String(
      res?.info?.()?.headers?.["content-disposition"] ||
      res?.info?.()?.headers?.["Content-Disposition"] ||
      ""
    );

    const filenameMatch = contentDisposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
    const headerFileName = filenameMatch?.[1]?.trim();
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const defaultFileName = `assessment_report_${yyyy}-${mm}-${dd}.xlsx`;

    // Keep backend-provided xlsx name when present, otherwise use consistent date format.
    const fileName = headerFileName && headerFileName.toLowerCase().endsWith(".xlsx")
      ? headerFileName
      : defaultFileName;

    const exportMimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

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
      showToastMessage("Assessment report exported to Downloads", "success");
    } else {
      yield call(Share.open, {
        urls: [`file://${finalPath}`],
        type: exportMimeType,
        saveToFiles: true,
        failOnCancel: false,
      });
    }

    yield put(exportAssessmentReportSuccess());
  } catch (err: any) {
    const message = err?.message ?? "Failed to export assessment report";
    yield put(exportAssessmentReportFailure(message));
    showToastMessage(message, "error");
  }
}

function* getPersonalityScreeningListWorker(
  action: {
    type: string;
    payload: {
      application_id: string;
      job_id: string;
    };
  }
): Generator<any, void, any> {
  try {
    const { application_id, job_id } = action.payload;

    const res: ScreeningAssessment[] = yield call(
      applicationsApi.getPersonalityScreeningList,
      application_id,
      job_id
    );

    console.log(res, "getPersonalityScreeningListSuccess");
    yield put(getPersonalityScreeningListSuccess(res));

  } catch (error: any) {
    console.log(error.status, "getPersonalityScreeningListWorker");

    // ✅ CORRECT: 404 = no video interview
    if (error.status === 404) {
      yield put(getPersonalityScreeningListSuccess([]));
    }
    else {
      yield put(
        getPersonalityScreeningListFailure(
          error.message || "Failed to fetch personality screening list"
        )
      );
    }
  }
}

function* getPersonalityScreeningResponsesWorker(
  action: { type: string; payload: string }
): Generator<any, void, any> {
  try {
    const res: any = yield call(
      applicationsApi.getPersonalityScreeningResponses,
      action.payload
    );

    console.log(res, "getPersonalityScreeningResponsesWorker");

    // 🔥 FIX: extract responses array properly
    yield put(
      getPersonalityScreeningResponsesSuccess(
        Array.isArray(res?.responses) ? res.responses : []
      )
    );
  } catch (err: any) {
    yield put(
      getPersonalityScreeningResponsesFailure(
        err.message || "Failed to fetch personality screening responses"
      )
    );
  }
}

function* getApplicationStagesWorker(
  action: { type: string; payload: string }
): Generator<any, void, any> {
  try {
    yield put(getApplicationStagesRequest());

    const res = yield call(
      applicationsApi.getApplicationStages,
      action.payload
    );

    console.log(res, "APPLICATION STAGES");

    yield put(
      getApplicationStagesSuccess(res.results || [])
    );
  } catch (error: any) {
    yield put(
      getApplicationStagesFailure(
        error.message || "Failed to fetch stages"
      )
    );
  }
}

function* markSessionAsReviewedWorker(
  action: { type: string; payload: string }
): Generator<any, void, any> {
  const sessionId = action.payload;
  try {
    yield put(markSessionAsReviewedRequest(sessionId));
    const res: SessionReviewedResponse = yield call(
      applicationsApi.markSessionAsReviewed,
      sessionId
    );
    yield put(
      markSessionAsReviewedSuccess({ sessionId, data: res })
    );
  } catch (err: any) {
    yield put(
      markSessionAsReviewedFailure(
        err?.message || "Failed to mark session as reviewed"
      )
    );
  }
}

function* parseResumeWorker(
  action: { type: string; payload: string }
): Generator<any, void, any> {
  const applicationId = action.payload;
  try {
    yield put(parseResumeRequest(applicationId));
    const res: { message: string } = yield call(
      applicationsApi.parseResume,
      applicationId
    );
    yield put(parseResumeSuccess());
    showToastMessage(res?.message ?? "Resume parsing started", "success");
  } catch (err: any) {
    yield put(
      parseResumeFailure(
        err?.message || "Failed to start resume parsing"
      )
    );
  }
}

function* updateApplicationShareWorker(
  action: { type: string; payload: UpdateApplicationShareRequest }
): Generator<any, void, any> {
  try {
    const { applicationId, users } = action.payload;
    console.log('[updateApplicationShareWorker] called', { applicationId, usersCount: users?.length ?? 0, users });
    if (!applicationId) {
      console.warn('[updateApplicationShareWorker] skipped: missing applicationId');
      return;
    }
    yield call(applicationsApi.updateApplicationShare, applicationId, users);
    console.log('[updateApplicationShareWorker] API call completed successfully');
    showToastMessage(
      action.payload?.isRemoval ? "Removed User" : "Application sharing updated successfully!",
      "success"
    );
    // Refresh detail so `users_shared_with` stays in sync
    yield put(getApplicationDetailRequestAction(applicationId));
  } catch (err: any) {
    const message = err?.message ?? "Failed to update shared users";
    console.warn("[updateApplicationShareWorker] failed:", message, err);
  }
}

function* getReasonCategoryListWorker(): Generator<any, void, any> {
  try {
    yield put(getReasonCategoryListRequest());
    const categories = yield call(applicationsApi.getReasonCategoryList);
    yield put(getReasonCategoryListSuccess(categories));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load categories";
    yield put(getReasonCategoryListFailure(message));
  }
}

function* getReasonListWorker(
  action: { type: string; payload?: { page?: number } }
): Generator<any, void, any> {
  const page = action.payload?.page ?? 1;
  try {
    yield put(getReasonListRequest());
    const list = yield call(applicationsApi.getReasonList, page);
    yield put(getReasonListSuccess(list));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load reasons";
    yield put(getReasonListFailure(message));
  }
}

function* getApplicationReasonsListWorker(action: {
  type: string;
  payload?: { applicationId?: string; jobId?: string };
}): Generator<any, void, any> {
  try {
    const application: { id?: string; job?: { id?: string } } | null =
      yield select(selectSelectedApplication);
    const applicationId = action.payload?.applicationId ?? application?.id;
    const jobId = action.payload?.jobId ?? application?.job?.id;
    if (!applicationId || !jobId) {
      yield put(getApplicationReasonsListFailure("Missing application or job"));
      return;
    }
    yield put(getApplicationReasonsListRequest());
    const list = yield call(
      applicationsApi.getApplicationReasonsList,
      jobId,
      applicationId
    );
    console.log('[getApplicationReasonsList] API response:', list);
    yield put(getApplicationReasonsListSuccess(list));
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load application reasons";
    yield put(getApplicationReasonsListFailure(message));
  }
}

function* updateStageStatusWorker(
  action: { type: string; payload: UpdateStageStatusRequest }
): Generator<any, void, any> {
  const {
    stageId,
    status,
    applicationId,
    jobId,
    reasonIds,
    contentType,
    emailCandidate,
    subject,
    message,
  } = action.payload;
  try {
    yield put(updateStageStatusRequest());

    const profile: { id: string; name: string; email: string; profile_pic?: string | null } | null =
      yield select(selectProfile);

    if (!profile?.id || !profile?.name || !profile?.email) {
      yield put(updateStageStatusFailure("User profile is required to update stage status"));
      showToastMessage("User profile is required", "error");
      return;
    }

    const payload = {
      status,
      reviewed_by: {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        profile_pic: profile.profile_pic ?? null,
      },
      reviewed_at: new Date().toISOString(),
      is_status_overridden_by_user: true,
    };

    yield call(applicationsApi.updateStageStatus, stageId, status, payload);

    let reasonError: string | null = null;
    if (Array.isArray(reasonIds) && reasonIds.length > 0 && contentType) {
      try {
        const selectedApplication: any = yield select(selectSelectedApplication);
        const resolvedApplicationId = selectedApplication?.id ?? applicationId;
        const resolvedJobId = jobId ?? selectedApplication?.job?.id;

        if (!resolvedApplicationId || !resolvedJobId) {
          reasonError = "Missing application/job information for reason";
        } else {
          const reasonsPayload = {
            application: resolvedApplicationId,
            job_id: resolvedJobId,
            content_type: contentType,
            object_id: stageId,
            reason: reasonIds,
          };

          console.log("[addApplicationReasons] payload:", reasonsPayload);
          const reasonsResponse = yield call(applicationsApi.addApplicationReasons, reasonsPayload);
          console.log("[addApplicationReasons] response:", reasonsResponse);
        }
      } catch (err: any) {
        reasonError = err?.message ?? "Failed to add reason";
      }
    }

    yield put(updateStageStatusSuccess());
    showToastMessage(
      reasonError
        ? "Stage status updated, but failed to add reason"
        : "Stage status updated successfully",
      reasonError ? "error" : "success"
    );

    // POST /applications/send-email/ – send status update email to candidate (only when user opted in)
    try {
      const selectedApplication: { candidate?: { email?: string }; status?: string } | null =
        yield select(selectSelectedApplication);
      const toEmail = selectedApplication?.candidate?.email;
      const shouldEmail = Boolean(emailCandidate);
      const hasRequiredFields = Boolean(subject?.trim()) && Boolean(message?.trim());
      if (shouldEmail && applicationId && toEmail && hasRequiredFields) {
        yield call(applicationsApi.sendEmail, {
          application_id: applicationId,
          status: selectedApplication?.status ?? "shortlisted",
          stage_status: status,
          sent: 1,
          to: toEmail,
          detail: "Email sent.",
          subject: subject?.trim(),
          message: message?.trim(),
        });
      }
    } catch (sendEmailErr: any) {
      // Non-blocking: status update already succeeded
      console.warn("[sendEmail] failed:", sendEmailErr?.message ?? sendEmailErr);
    }

    if (applicationId) {
      yield put(getApplicationDetailRequestAction(applicationId));
      yield put(getApplicationStagesRequestAction(applicationId));
    }
  } catch (err: any) {
    const message = err?.message ?? "Failed to update stage status";
    yield put(updateStageStatusFailure(message));
    showToastMessage(message, "error");
  }
}

function* addApplicationReasonsWorker(action: {
  type: string;
  payload: {
    application: string;
    job_id: string;
    content_type: string;
    object_id: string;
    reason: string[];
  };
}): Generator<any, void, any> {
  try {
    yield put(addApplicationReasonsRequest());
    yield call(applicationsApi.addApplicationReasons, action.payload);
    yield put(addApplicationReasonsSuccess());
    yield put(getApplicationReasonsListRequestAction());
    showToastMessage("Reason updated successfully", "success");
  } catch (err: any) {
    const message = err?.message ?? "Failed to update reason";
    yield put(addApplicationReasonsFailure(message));
    showToastMessage(message, "error");
  }
}

function* updateApplicationReasonWorker(action: {
  type: string;
  payload: { id: string; message: string };
}): Generator<any, void, any> {
  try {
    const id = action.payload?.id;
    const message = action.payload?.message ?? "Deleted";
    if (!id) {
      yield put(updateApplicationReasonFailure("Missing reason id"));
      return;
    }
    yield put(updateApplicationReasonRequest());
    yield call(applicationsApi.updateApplicationReason, id, { message });
    yield put(updateApplicationReasonSuccess());
    yield put(getApplicationReasonsListRequestAction());
    showToastMessage("Reason deleted successfully", "success");
  } catch (err: any) {
    const msg = err?.message ?? "Failed to delete reason";
    yield put(updateApplicationReasonFailure(msg));
    showToastMessage(msg, "error");
  }
}

function* getApplicantOptionsWorker(
  action: PayloadAction<GetApplicantOptionsPayload | undefined>
): Generator<any, void, any> {
  try {
    const page = action.payload?.page ?? 1;
    const search = action.payload?.search ?? "";
    const append = action.payload?.append ?? false;
    const raw = action.payload?.jobId;
    const jobId =
      raw === undefined || raw === null || raw === "" ? null : raw;

    yield put(
      getApplicantOptionsRequest({
        page,
        jobId: raw,
        search,
        append,
      })
    );

    const response: ApplicantOptionsListResponse = yield call(
      applicationsApi.getApplicantOptions,
      { page, jobId, search }
    );

    yield put(
      getApplicantOptionsSuccess({
        page,
        append,
        jobId,
        data: response,
      })
    );
  } catch (error: any) {
    yield put(
      getApplicantOptionsFailure(
        error?.message ?? "Failed to load applicants"
      )
    );
  }
}

export function* applicationsSaga() {
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_APPLICATIONS_REQUEST, getApplicationsWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.EXPORT_APPLICATIONS_REQUEST, exportApplicationsWorker);
  // yield takeLatest(APPLICATIONS_ACTION_TYPES.EXPORT_APPLICANT_PDF_REQUEST, exportApplicantPdfWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_APPLICATION_DETAIL_REQUEST, getApplicationDetailWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.CREATE_APPLICATION_REQUEST, createApplicationWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.UPDATE_APPLICATION_STATUS_REQUEST, updateApplicationStatusWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_APPLICATION_RESPONSES_REQUEST, getApplicationResponsesWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_RESUME_SCREENING_REQUEST, getResumeScreeningResponsesWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_ASSESSMENT_LOGS_REQUEST, getAssessmentLogsWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_ASSESSMENT_LOGS_BATCH_REQUEST, getAssessmentLogsBatchWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_ASSESSMENT_REPORT_REQUEST, getAssessmentReportWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_ASSESSMENT_DETAILED_REPORT_REQUEST, getAssessmentDetailedReportWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_PERFORMANCE_REPORT_REQUEST, getPerformanceReportWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_PERSONALITY_LIST_REQUEST, getPersonalityScreeningListWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_PERSONALITY_RESPONSES_REQUEST, getPersonalityScreeningResponsesWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_APPLICATION_STAGES_REQUEST, getApplicationStagesWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.MARK_SESSION_REVIEWED_REQUEST, markSessionAsReviewedWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.PARSE_RESUME_REQUEST, parseResumeWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_REASON_CATEGORY_LIST_REQUEST, getReasonCategoryListWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_REASON_LIST_REQUEST, getReasonListWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_APPLICATION_REASONS_LIST_REQUEST, getApplicationReasonsListWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.ADD_APPLICATION_REASONS_REQUEST, addApplicationReasonsWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.UPDATE_APPLICATION_REASON_REQUEST, updateApplicationReasonWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.UPDATE_STAGE_STATUS_REQUEST, updateStageStatusWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.UPDATE_APPLICATION_SHARE_REQUEST, updateApplicationShareWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_ASSESSMENTOPTIONS_REPORT_REQUEST, getAssessmentOptionsReportWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.EXPORT_ASSESSMENT_REPORT_REQUEST, exportAssessmentReportWorker);
  yield takeLatest(
    APPLICATIONS_ACTION_TYPES.GET_APPLICANT_OPTIONS_REQUEST,
    getApplicantOptionsWorker
  );
}

