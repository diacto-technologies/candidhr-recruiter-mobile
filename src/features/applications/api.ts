import { apiClient } from "../../api/client";
import { API_ENDPOINTS } from "../../api/endpoints";
import { CreateApplicationRequest, UpdateApplicationStatusRequest, Application, GetApplicationsParams, ApplicationsListResponse, ApplicationDetailResponse, GetApplicationResponsesParams, ApplicationResponsesApiResponse, ResumeScreeningApiResponse, AssessmentLogApiResponse, AssessmentReportApiResponse, AssessmentDetailedReportApiResponse, ScreeningAssessment, PersonalityScreeningResponse } from "./types";

export const applicationsApi = {
  getApplications: async (params?: GetApplicationsParams): Promise<ApplicationsListResponse> => {
    const query = new URLSearchParams();

    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    // SEARCH
    if (params?.applicantName) query.append("applicant_name__icontains", params.applicantName);
    if (params?.email) query.append("candidate_email__icontains", params.email);
    if (params?.contact) query.append("candidate__contact__icontains", params.contact);
    if (params?.jobTitle) query.append("job__title__icontains", params.jobTitle);
    if (params?.jobId)
      query.append("job__id", params.jobId);

    // SORTING
    if (params?.sort) query.append("o", params.sort);

    const qs = query.toString();
    const url = qs ? `${API_ENDPOINTS.APPLICATIONS.LIST}?${qs}` : API_ENDPOINTS.APPLICATIONS.LIST;

    const res = await apiClient.get(url);
    console.log(res,"resresresres")
    return res?.data ?? res;
  },


  getApplicationDetail: async (id: string): Promise<{ application: ApplicationDetailResponse }> => {
    return apiClient.get(API_ENDPOINTS.APPLICATIONS.DETAIL(id));
  },

  createApplication: async (data: CreateApplicationRequest): Promise<{ application: Application }> => {
    return apiClient.post(API_ENDPOINTS.APPLICATIONS.CREATE, data);
  },

  updateApplicationStatus: async (data: UpdateApplicationStatusRequest): Promise<{ application: Application }> => {
    return apiClient.put(API_ENDPOINTS.APPLICATIONS.STATUS(data.id), { status: data.status });
  },

  getApplicationResponses: async (
    params: GetApplicationResponsesParams
  ): Promise<ApplicationResponsesApiResponse> => {
    const query = new URLSearchParams({
      application_id: params.application_id,
      job_id: params.job_id,
    }).toString();

    const url = `${API_ENDPOINTS.APPLICATIONS.RESPONSES}?${query}`;
    const res = await apiClient.get(url);
    return res?.data ?? res;
  },
  getResumeScreeningResponses: async (
    applicationId: string
  ): Promise<ResumeScreeningApiResponse> => {
    const url = API_ENDPOINTS.APPLICATIONS.ScreeningQus(applicationId);
    const res = await apiClient.get(url);
    return res?.data ?? res;
  },

  getAssessmentLogs: async (
    applicationId: string
  ): Promise<AssessmentLogApiResponse> => {
    const url = API_ENDPOINTS.APPLICATIONS.ASSESSMENT_LOGS(applicationId);
    const res = await apiClient.get(url);
    return res?.data ?? res;
  },

  getAssessmentReport: async (
    assessmentLogId: string
  ): Promise<AssessmentReportApiResponse> => {
    const url = API_ENDPOINTS.APPLICATIONS.ASSESSMENT_REPORT(assessmentLogId);
    const res = await apiClient.get(url);
    return res?.data ?? res;
  },

  getAssessmentDetailedReport: async (
    assessmentLogId: string,
    assessmentId: string
  ): Promise<AssessmentDetailedReportApiResponse> => {
    const url = API_ENDPOINTS.APPLICATIONS.ASSESSMENT_DETAILED_REPORT(
      assessmentLogId,
      assessmentId
    );
    const res = await apiClient.get(url);
    return res?.data ?? res;
  },

  getPersonalityScreeningList: async (application_id: string,
    job_id: string,): Promise<ScreeningAssessment[]> => {
    const url = API_ENDPOINTS.APPLICATIONS.PERSONALITY_SCREENING_LIST(application_id, job_id);
    const res = await apiClient.get(url);
    return res?.data ?? res;
  },

  getPersonalityScreeningResponses: async (
    screeningId: string
  ): Promise<PersonalityScreeningResponse[]> => {
    const url =
      API_ENDPOINTS.APPLICATIONS.PERSONALITY_SCREENING_RESPONSES(
        screeningId
      );

    const res = await apiClient.get(url);
    return res?.data ?? res;
  },

};

