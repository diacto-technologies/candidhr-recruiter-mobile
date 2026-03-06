import { call, put, select, takeLatest } from "redux-saga/effects";
import { APPLICATIONS_ACTION_TYPES } from "./constants";
import {
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
  updateStageStatusRequest,
  updateStageStatusSuccess,
  updateStageStatusFailure,
} from "./slice";
import { applicationsApi } from "./api";
import { AssessmentDetailedReportApiResponse, AssessmentLogApiResponse, AssessmentReportApiResponse, GetApplicationResponsesParams, GetApplicationsSagaAction, PersonalityScreeningResponse, ResumeScreeningApiResponse, ScreeningAssessment, SessionReviewedResponse } from "./types";
import { getAssessmentDetailedReportRequestAction, getAssessmentReportRequestAction, getApplicationDetailRequestAction, getApplicationStagesRequestAction } from "./actions";
import { showToastMessage } from "../../utils/toast";
import { selectProfile } from "../profile/selectors";
import type { UpdateStageStatusRequest } from "./types";
import { selectSelectedApplication } from "./selectors";

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

function* getAssessmentReportWorker(
  action: { type: string; payload: string }
): Generator<any, void, any> {
  try {
    yield put(getAssessmentReportRequest());

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

function* getApplicationReasonsListWorker(): Generator<any, void, any> {
  try {
    const application: { id?: string; job?: { id?: string } } | null =
      yield select(selectSelectedApplication);
    const applicationId = application?.id;
    const jobId = application?.job?.id;
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
  const { stageId, status, applicationId, jobId, reasonIds, contentType } = action.payload;
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
            job: resolvedJobId,
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

    // POST /applications/send-email/ – send status update email to candidate
    try {
      const selectedApplication: { candidate?: { email?: string }; status?: string } | null =
        yield select(selectSelectedApplication);
      const toEmail = selectedApplication?.candidate?.email;
      if (applicationId && toEmail) {
        yield call(applicationsApi.sendEmail, {
          application_id: applicationId,
          status: selectedApplication?.status ?? "shortlisted",
          stage_status: status,
          sent: 1,
          to: toEmail,
          detail: "Email sent.",
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

export function* applicationsSaga() {
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_APPLICATIONS_REQUEST, getApplicationsWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_APPLICATION_DETAIL_REQUEST, getApplicationDetailWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.CREATE_APPLICATION_REQUEST, createApplicationWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.UPDATE_APPLICATION_STATUS_REQUEST, updateApplicationStatusWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_APPLICATION_RESPONSES_REQUEST, getApplicationResponsesWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_RESUME_SCREENING_REQUEST, getResumeScreeningResponsesWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_ASSESSMENT_LOGS_REQUEST, getAssessmentLogsWorker)
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_ASSESSMENT_REPORT_REQUEST, getAssessmentReportWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_ASSESSMENT_DETAILED_REPORT_REQUEST, getAssessmentDetailedReportWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_PERSONALITY_LIST_REQUEST, getPersonalityScreeningListWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_PERSONALITY_RESPONSES_REQUEST, getPersonalityScreeningResponsesWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_APPLICATION_STAGES_REQUEST, getApplicationStagesWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.MARK_SESSION_REVIEWED_REQUEST, markSessionAsReviewedWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.PARSE_RESUME_REQUEST, parseResumeWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_REASON_CATEGORY_LIST_REQUEST, getReasonCategoryListWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_REASON_LIST_REQUEST, getReasonListWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_APPLICATION_REASONS_LIST_REQUEST, getApplicationReasonsListWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.UPDATE_STAGE_STATUS_REQUEST, updateStageStatusWorker);
}

