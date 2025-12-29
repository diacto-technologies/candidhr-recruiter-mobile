import { APPLICATIONS_ACTION_TYPES } from "./constants";
import { CreateApplicationRequest, UpdateApplicationStatusRequest, Application, GetApplicationsParams, GetApplicationResponsesParams, ResumeScreeningResponseItem, AssessmentLog, AssessmentReport, AssessmentDetailedReport, ScreeningAssessment, PersonalityScreeningResponse} from "./types";

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
