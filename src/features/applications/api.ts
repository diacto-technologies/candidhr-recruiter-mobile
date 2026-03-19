import { apiClient } from "../../api/client";
import { API_ENDPOINTS } from "../../api/endpoints";
import { CreateApplicationRequest, UpdateApplicationStatusRequest, Application, GetApplicationsParams, ApplicationsListResponse, ApplicationDetailResponse, GetApplicationResponsesParams, ApplicationResponsesApiResponse, ResumeScreeningApiResponse, AssessmentLogApiResponse, AssessmentReportApiResponse, AssessmentDetailedReportApiResponse, ScreeningAssessment, PersonalityScreeningResponse, ApplicationStagesResponse, SessionReviewedResponse, ReasonCategory, ReasonListItem, UpdateStageStatusPayload, PerformanceReportResponse, AssessmentOptionsReportResponse } from "./types";

export const applicationsApi = {
  // getApplications: async (params?: GetApplicationsParams): Promise<ApplicationsListResponse> => {
  //   const query = new URLSearchParams();

  //   if (params?.page) query.append("page", String(params.page));
  //   if (params?.limit) query.append("limit", String(params.limit));

  //   // SEARCH
  //   if (params?.applicantName) query.append("applicant_name__icontains", params.applicantName);
  //   if (params?.email) query.append("candidate_email__icontains", params.email);
  //   if (params?.contact) query.append("candidate__contact__icontains", params.contact);
  //   if (params?.jobTitle) query.append("job__title__icontains", params.jobTitle);
  //   if (params?.jobId)
  //     query.append("job__id", params.jobId);

  //   // SORTING
  //   if (params?.sort) query.append("o", params.sort);

  //   const qs = query.toString();
  //   const url = qs ? `${API_ENDPOINTS.APPLICATIONS.LIST}?${qs}` : API_ENDPOINTS.APPLICATIONS.LIST;

  //   const res = await apiClient.get(url);
  //   //console.log(res,"resresresres")
  //   return res?.data ?? res;
  // },
getApplications: async (
  params?: GetApplicationsParams
): Promise<ApplicationsListResponse> => {
  const query = new URLSearchParams();

  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));

  // SEARCH
  if (params?.applicantName)
    query.append("applicant_name__icontains", params.applicantName);

  if (params?.email)
    query.append("candidate_email__icontains", params.email);

  if (params?.contact)
    query.append("candidate__contact__icontains", params.contact);

  if (params?.jobTitle)
    query.append("job__title__icontains", params.jobTitle);

  if (params?.jobId)
    query.append("job__id", params.jobId);

  // ✅ NEW FILTERS
  if (params?.latestStageStatus)
    query.append("latest_stage_status", params.latestStageStatus);

  if (params?.source)
    query.append("source__icontains", params.source);

  if (params?.status)
    query.append("status__icontains", params.status);

  if (params?.latestStageName)
    query.append("latest_stage_name", params.latestStageName);

  // SORTING
  if (params?.sort)
    query.append("o", params.sort);

  const qs = query.toString();
  const url = qs
    ? `${API_ENDPOINTS.APPLICATIONS.LIST}?${qs}`
    : API_ENDPOINTS.APPLICATIONS.LIST;

  const res = await apiClient.get(url);
  return res?.data ?? res;
},

  exportApplicationsCsv: async (
    params?: GetApplicationsParams
  ): Promise<{ csv: string; filename: string }> => {
    const query = new URLSearchParams();

    // Server supports paging for export; keep page for consistency
    if (params?.page) query.append("page", String(params.page));

    // SEARCH / FILTERS (match web request keys)
    if (params?.applicantName)
      query.append("applicant_name__icontains", params.applicantName);
    if (params?.email)
      query.append("candidate_email__icontains", params.email);
    if (params?.contact)
      query.append("candidate__contact__icontains", params.contact);
    if (params?.jobTitle)
      query.append("job__title__icontains", params.jobTitle);

    if (params?.source)
      query.append("source__icontains", params.source);
    if (params?.status)
      query.append("status__icontains", params.status);
    if (params?.latestStageName)
      query.append("latest_stage_name", params.latestStageName);
    if (params?.latestStageStatus)
      query.append("latest_stage_status", params.latestStageStatus);

    // SORTING (same as filter list)
    if (params?.sort) query.append("o", params.sort);

    const qs = query.toString();
    const url = qs
      ? `${API_ENDPOINTS.APPLICATIONS.EXPORT}?${qs}`
      : API_ENDPOINTS.APPLICATIONS.EXPORT;

    const response = await apiClient.getResponse(url);
    const csv = await response.text();

    const contentDisposition = response.headers.get('content-disposition') ?? '';
    const match = contentDisposition.match(/filename="?([^"]+)"?/i);
    const filename = (match?.[1] ?? 'applications_export.csv').trim();

    return { csv, filename };
  },

  /**
   * GET /applications/v1/{id}/profile/pdf/
   * Returns a PDF file (binary). Callers should use `apiClient.getResponse`.
   */
  getApplicantProfilePdfResponse: async (applicationId: string): Promise<Response> => {
    const response = await apiClient.getResponse(
      API_ENDPOINTS.APPLICATIONS.PROFILE_PDF(applicationId),
      {
        headers: {
          Accept: 'application/pdf',
        },
      }
    );
    return response;
  },

  getApplicationDetail: async (id: string): Promise<{ application: ApplicationDetailResponse }> => {
    return apiClient.get(API_ENDPOINTS.APPLICATIONS.DETAIL(id));
  },

  /**
   * PATCH /applications/v1/{id}/share/
   * Updates `users_shared_with` for a given application.
   */
  updateApplicationShare: async (
    applicationId: string,
    usersSharedWith: unknown[]
  ): Promise<unknown> => {
    const url = API_ENDPOINTS.APPLICATIONS.SHARE(applicationId);
    const payload = { users_shared_with: usersSharedWith };
    // console.log('[applicationsApi.updateApplicationShare] PATCH', url, payload);
    const res = await apiClient.patch(url, payload);
    console.log('[applicationsApi.updateApplicationShare] success', res?.data ?? res);
    return res?.data ?? res;
  },

  createApplication: async (data: CreateApplicationRequest): Promise<{ application: Application }> => {
    return apiClient.post(API_ENDPOINTS.APPLICATIONS.CREATE, data);
  },

  updateApplicationStatus: async (
    data: UpdateApplicationStatusRequest
  ): Promise<{ message: string; data: { id: string; status: string; status_updated_by?: unknown; status_updated_at?: string; is_status_overridden_by_user?: boolean } }> => {
    const url = API_ENDPOINTS.APPLICATIONS.STATUS_UPDATE(data.id, data.status);
    return apiClient.patch(url);
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

  markSessionAsReviewed: async (
    sessionId: string
  ): Promise<SessionReviewedResponse> => {
    const url = API_ENDPOINTS.APPLICATIONS.SESSION_MARK_REVIEWED(sessionId);
    const res = await apiClient.patch(url, {});
    return res?.data ?? res;
  },

  parseResume: async (
    applicationId: string
  ): Promise<{ message: string }> => {
    const url = API_ENDPOINTS.APPLICATIONS.PARSE_RESUME(applicationId);
    const res = await apiClient.post(url, {});
    return res?.data ?? res;
  },

  getAssessmentReport: async (
    assessmentLogId: string
  ): Promise<AssessmentReportApiResponse> => {
    const url = API_ENDPOINTS.APPLICATIONS.ASSESSMENT_REPORT(assessmentLogId);
    const res = await apiClient.get(url);
    return res?.data ?? res;
  },

  getPerformanceReport: async (
    assessmentLogId: string
  ): Promise<PerformanceReportResponse> => {
    const url = API_ENDPOINTS.APPLICATIONS.PERFORMANCE_REPORT(assessmentLogId);
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

  getAssessmentOptionsReport: async (
    application_id: string,
    page: number = 1
  ): Promise<AssessmentOptionsReportResponse> => {
    const url = `/assessments/v2/assignment-options/?application_id=${application_id}&page=${page}`;
  
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

  getApplicationStages: async (
    applicationId: string
  ): Promise<ApplicationStagesResponse> => {
    const url = API_ENDPOINTS.APPLICATIONS.stages(applicationId);
    const res = await apiClient.get(url);
    return res?.data ?? res;
  },

  /**
   * PATCH /applications/v1/stages/{stageId}/{status}/
   * Updates stage status with reviewer info and marks as user-overridden.
   */
  updateStageStatus: async (
    stageId: string,
    status: string,
    payload: UpdateStageStatusPayload
  ): Promise<unknown> => {
    const url = API_ENDPOINTS.APPLICATIONS.STAGE_STATUS(stageId, status);
    const res = await apiClient.patch(url, payload);
    return res?.data ?? res;
  },

  /** GET /notifications/v1/category-list/ - reason categories for change-status modal */
  getReasonCategoryList: async (): Promise<ReasonCategory[]> => {
    const res = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.CATEGORY_LIST) as {
      results?: Array<{ category: string }>;
    };
    const results = res?.results ?? [];
    return (Array.isArray(results) ? results : []).map((item) => {
      const name = item.category?.trim() || '';
      const id = name.toLowerCase().replace(/\s+/g, '_') || 'unknown';
      return { id, name };
    });
  },

  /** GET /notifications/v1/filter - reason list for change-status dropdown */
  getReasonList: async (page: number = 1): Promise<ReasonListItem[]> => {
    const url = `${API_ENDPOINTS.NOTIFICATIONS.FILTER}?page=${page}`;
    const res = await apiClient.get(url) as { results?: ReasonListItem[] };
    const results = res?.results ?? [];
    return Array.isArray(results) ? results : [];
  },

  /**
   * GET /notifications/v1/reasons/application-reasons/list/?job_id=...&application_id=...
   * Fetches application reasons list for a given job and application.
   */
  getApplicationReasonsList: async (
    jobId: string,
    applicationId: string
  ): Promise<unknown[]> => {
    const params = new URLSearchParams({ job_id: jobId, application_id: applicationId });
    const url = `${API_ENDPOINTS.NOTIFICATIONS.APPLICATION_REASONS_LIST}?${params.toString()}`;
    const res = await apiClient.get(url);
    const raw = res?.data ?? res?.results ?? res;
    return Array.isArray(raw) ? raw : [];
  },

  /**
   * POST /notifications/v1/reasons/application-reasons/add/
   * Attaches selected reasons to an application + stage object.
   */
  addApplicationReasons: async (payload: {
    application: string;
    job_id: string;
    content_type: string;
    object_id: string;
    reason: string[];
  }): Promise<unknown> => {
    const res = await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.APPLICATION_REASONS_ADD, payload);
    return res?.data ?? res;
  },

  /**
   * PATCH /notifications/v1/reasons/application-reasons/{id}/update/
   * Backend uses this to mark a reason as deleted (message="Deleted").
   */
  updateApplicationReason: async (
    id: string,
    payload: { message: string }
  ): Promise<unknown> => {
    const url = API_ENDPOINTS.NOTIFICATIONS.APPLICATION_REASONS_UPDATE(id);
    const res = await apiClient.patch(url, payload);
    return res?.data ?? res;
  },

  /**
   * POST /applications/send-email/
   * Sends status update email to candidate.
   */
  sendEmail: async (payload: {
    application_id: string;
    status: string;
    stage_status: string;
    sent: number;
    to: string;
    detail: string;
    subject?: string;
    message?: string;
  }): Promise<unknown> => {
    const res = await apiClient.post(API_ENDPOINTS.APPLICATIONS.SEND_EMAIL, payload);
    return res?.data ?? res;
  },

};

