import { APPLICATIONS_ACTION_TYPES } from "./constants";
import { CreateApplicationRequest, UpdateApplicationStatusRequest, Application, GetApplicationsParams, GetApplicationResponsesParams, ResumeScreeningResponseItem, AssessmentLog, AssessmentReport, AssessmentDetailedReport, ScreeningAssessment, PersonalityScreeningResponse, SessionReviewedResponse, UpdateStageStatusRequest } from "./types";

export const getApplicationsRequestAction = (params?: GetApplicationsParams) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_APPLICATIONS_REQUEST,
  payload: params,
});

export const getApplicationDetailRequestAction = (id: string) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_APPLICATION_DETAIL_REQUEST,
  payload: id,
});

export const createApplicationRequestAction = (payload: CreateApplicationRequest) => ({
  type: APPLICATIONS_ACTION_TYPES.CREATE_APPLICATION_REQUEST,
  payload,
});

export const updateApplicationStatusRequestAction = (payload: UpdateApplicationStatusRequest) => ({
  type: APPLICATIONS_ACTION_TYPES.UPDATE_APPLICATION_STATUS_REQUEST,
  payload,
});

export const setSelectedApplicationAction = (application: Application | null) => ({
  type: APPLICATIONS_ACTION_TYPES.SET_SELECTED_APPLICATION,
  payload: application,
});

export const clearErrorAction = () => ({
  type: APPLICATIONS_ACTION_TYPES.CLEAR_ERROR,
});

export const getApplicationResponsesRequestAction = (
  payload: GetApplicationResponsesParams
) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_APPLICATION_RESPONSES_REQUEST,
  payload,
});

export const getResumeScreeningResponsesRequestAction = (applicationId: string) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_RESUME_SCREENING_REQUEST,
  payload: applicationId,
});

export const getResumeScreeningResponsesSuccess = (payload: ResumeScreeningResponseItem[]) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_RESUME_SCREENING_SUCCESS,
  payload,
});

export const getResumeScreeningResponsesFailure = (payload: string) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_RESUME_SCREENING_FAILURE,
  payload,
});


export const getAssessmentLogsRequestAction = (applicationId: string) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_ASSESSMENT_LOGS_REQUEST,
  payload: applicationId,
});

export const getAssessmentLogsSuccess = (payload: AssessmentLog[]) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_ASSESSMENT_LOGS_SUCCESS,
  payload,
});

export const getAssessmentLogsFailure = (payload: string) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_ASSESSMENT_LOGS_FAILURE,
  payload,
});

export const getAssessmentReportRequestAction = (assessmentLogId: string) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_ASSESSMENT_REPORT_REQUEST,
  payload: assessmentLogId,
});

export const getAssessmentReportSuccess = (payload: AssessmentReport) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_ASSESSMENT_REPORT_SUCCESS,
  payload,
});

export const getAssessmentReportFailure = (payload: string) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_ASSESSMENT_REPORT_FAILURE,
  payload,
});

export const getAssessmentDetailedReportRequestAction = (payload: {
  assessmentLogId: string;
  assessmentId: string;
}) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_ASSESSMENT_DETAILED_REPORT_REQUEST,
  payload,
});

export const getAssessmentDetailedReportSuccess = (
  payload: AssessmentDetailedReport
) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_ASSESSMENT_DETAILED_REPORT_SUCCESS,
  payload,
});

export const getAssessmentDetailedReportFailure = (payload: string) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_ASSESSMENT_DETAILED_REPORT_FAILURE,
  payload,
});

export const getPersonalityScreeningListRequestAction = (payload: {
  application_id: string,
  job_id: string,
}) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_PERSONALITY_LIST_REQUEST,
  payload,
});

export const getPersonalityScreeningListSuccess = (payload: ScreeningAssessment[]) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_PERSONALITY_LIST_SUCCESS,
  payload,
});

export const getPersonalityScreeningListFailure = (payload: string) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_PERSONALITY_LIST_FAILURE,
  payload,
});


export const getPersonalityScreeningResponsesRequestAction = (
  screeningId: string
) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_PERSONALITY_RESPONSES_REQUEST,
  payload: screeningId,
});

export const getPersonalityScreeningResponsesSuccess = (
  payload: PersonalityScreeningResponse[]
) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_PERSONALITY_RESPONSES_SUCCESS,
  payload,
});

export const getPersonalityScreeningResponsesFailure = (
  payload: string
) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_PERSONALITY_RESPONSES_FAILURE,
  payload,
});

export const getApplicationStagesRequestAction = (applicationId: string) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_APPLICATION_STAGES_REQUEST,
  payload: applicationId,
});

export const markSessionAsReviewedRequestAction = (sessionId: string) => ({
  type: APPLICATIONS_ACTION_TYPES.MARK_SESSION_REVIEWED_REQUEST,
  payload: sessionId,
});

export const markSessionAsReviewedSuccess = (payload: {
  sessionId: string;
  data: SessionReviewedResponse;
}) => ({
  type: APPLICATIONS_ACTION_TYPES.MARK_SESSION_REVIEWED_SUCCESS,
  payload,
});

export const markSessionAsReviewedFailure = (payload: string) => ({
  type: APPLICATIONS_ACTION_TYPES.MARK_SESSION_REVIEWED_FAILURE,
  payload,
});

export const parseResumeRequestAction = (applicationId: string) => ({
  type: APPLICATIONS_ACTION_TYPES.PARSE_RESUME_REQUEST,
  payload: applicationId,
});

export const parseResumeSuccess = () => ({
  type: APPLICATIONS_ACTION_TYPES.PARSE_RESUME_SUCCESS,
});

export const parseResumeFailure = (payload: string) => ({
  type: APPLICATIONS_ACTION_TYPES.PARSE_RESUME_FAILURE,
  payload,
});

/** Fetches reason categories from /notifications/v1/category-list/ for change-status modal */
export const getReasonCategoryListRequestAction = () => ({
  type: APPLICATIONS_ACTION_TYPES.GET_REASON_CATEGORY_LIST_REQUEST,
});

/** Fetches reason list from /notifications/v1/filter for change-status dropdown */
export const getReasonListRequestAction = (page: number = 1) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_REASON_LIST_REQUEST,
  payload: { page },
});

/** PATCH stage status (approved/not_approved etc.); refetches application + stages on success */
export const updateStageStatusRequestAction = (payload: UpdateStageStatusRequest) => ({
  type: APPLICATIONS_ACTION_TYPES.UPDATE_STAGE_STATUS_REQUEST,
  payload,
});

/** GET application reasons list; uses selectSelectedApplication for application.id and job.id */
export const getApplicationReasonsListRequestAction = () => ({
  type: APPLICATIONS_ACTION_TYPES.GET_APPLICATION_REASONS_LIST_REQUEST,
});
