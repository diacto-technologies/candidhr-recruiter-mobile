import { call, put, takeLatest } from "redux-saga/effects";
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
} from "./slice";
import { applicationsApi } from "./api";
import { AssessmentDetailedReportApiResponse, AssessmentLogApiResponse, AssessmentReportApiResponse, GetApplicationResponsesParams, GetApplicationsSagaAction, PersonalityScreeningResponse, ResumeScreeningApiResponse, ScreeningAssessment } from "./types";
import { getAssessmentDetailedReportRequestAction, getAssessmentReportRequestAction } from "./actions";
import { StatusBar } from "../../components";

function* getApplicationsWorker(
  action: GetApplicationsSagaAction
): Generator<any, void, any> {
  try {
    const { append = false, ...params } = action.payload || {};
    const page = params.page ?? 1;

    // sets loading=true
    yield put(getApplicationsRequest(params));

    const response = yield call(applicationsApi.getApplications, params);
    console.log(response, 'applicantListapplicantListapplicantList123',applicationsApi.getApplications)

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

function* updateApplicationStatusWorker(action: { type: string; payload: any }): Generator<any, void, any> {
  try {
    yield put(updateApplicationStatusRequest(action.payload));
    const response = yield call(applicationsApi.updateApplicationStatus, action.payload);
    yield put(updateApplicationStatusSuccess(response.application));
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

    yield put(getAssessmentLogsSuccess(res.assessmentlogs));
    const assessmentlog = res.assessmentlogs[0]?.id;

    if (assessmentlog) {
      yield put(getAssessmentReportRequestAction(assessmentlog));
    }

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
    else{
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
): Generator<any, void, PersonalityScreeningResponse[]> {
  try {
    const res: PersonalityScreeningResponse[] = yield call(
      applicationsApi.getPersonalityScreeningResponses,
      action.payload
    );
    console.log(res, "getPersonalityScreeningResponsesWorker")
    yield put(getPersonalityScreeningResponsesSuccess(res));
  } catch (err: any) {
    yield put(
      getPersonalityScreeningResponsesFailure(
        err.message || "Failed to fetch personality screening responses"
      )
    );
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
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_PERSONALITY_RESPONSES_REQUEST, getPersonalityScreeningResponsesWorker
  );
}

