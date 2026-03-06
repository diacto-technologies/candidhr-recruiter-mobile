export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/core/token/', // Login endpoint: POST /token/
    LOGOUT: '/auth/logout',
    REFRESH: '/core/token/refresh/',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    FORGOT_PASSWORD: "/core/send-reset-password-email/",
    RESET_PASSWORD: "/core/user/reset-password/",
  },
  // Profile endpoints
  PROFILE: {
    GET: '/core/user/',
    UPDATE: '/core/users/details/update/',
    AVATAR: '/profile/avatar',
  },
  USERS: {
    LIST: '/core/users/list/',
    CREATE: '/core/tenant/users/',
    ASSIGN_ROLE: '/core/assign-role/',
    DELETE: (id: string) => `/core/tenant/users/${id}/`,
  },
  ROLES:{
    LIST: '/core/roles/',
  },
  // Jobs endpoints
  JOBS: {
    LIST: '/job/v1/filter',
    DETAIL: (id: string) => `/job/v1/job-detail/${id}/`,
    CREATE: '/jobs',
    UPDATE: (id: string) => `/jobs/${id}`,
    DELETE: (id: string) => `/jobs/${id}`,
    APPLY: (id: string) => `/jobs/${id}/apply`,
    JOB_NAME_LIST: "/job/v1/job-names-list/",
  },
  // Applications endpoints
  APPLICATIONS: {
    LIST: '/applications/v2/filter/',
    DETAIL: (id: string) => `/applications/v1/${id}/profile/`,
    CREATE: '/applications',
    UPDATE: (id: string) => `/applications/${id}`,
    stages:(id:string)=>`/applications/v1/stages/?application_id=${id}`,
    STATUS: (id: string) => `/applications/${id}/status`,
    /** PATCH application status: /applications/v1/status-update/{id}/?status=... */
    STATUS_UPDATE: (id: string, status: string) =>
      `/applications/v1/status-update/${id}/?status=${encodeURIComponent(status)}`,
    RESPONSES: '/applications/v1/application-responses/',
    ScreeningQus: (id: string) => `/applications/v1/${id}/response/resume-screening/`,
    ASSESSMENT_LOGS: (applicationId: string) => `/applications/v1/sessions/?stage_id=${applicationId}`,
    SESSION_MARK_REVIEWED: (sessionId: string) => `/applications/v1/sessions/${sessionId}/reviewed/`,
    /** PATCH stage status: /applications/v1/stages/{stageId}/{status}/ */
    STAGE_STATUS: (stageId: string, status: string) => `/applications/v1/stages/${stageId}/${status}/`,
    PARSE_RESUME: (applicationId: string) => `/applications/v1/${applicationId}/parse-resume/`,
    ASSESSMENT_REPORT: (assessmentLogId: string) => `/assessments/v1/assessment-log/${assessmentLogId}/report-details/`,
    ASSESSMENT_DETAILED_REPORT: (assessmentLogId: string, assessmentId: string) =>
      `/assessments/v1/assessment-log/assessment/detailed-report/?assessment_log_id=${assessmentLogId}&assessment_id=${assessmentId}`,
    PERSONALITY_SCREENING_LIST: (application_id: string, job_id: string) =>
      `/personality-screening/list/?application_id=${application_id}&job_id=${job_id}`,
    PERSONALITY_SCREENING_RESPONSES: (screening_id: string) =>
      `/personality-screening/${screening_id}/responses/`,
    /** POST send status update email to candidate */
    SEND_EMAIL: '/applications/send-email/',
  },
  ASSESSMENTS:{
    LIST: "/assessments/v1/list/",
    // Assigned assessments (filter endpoint)
    ASSIGNEDLIST: "/assessments/v1/filter",
  },
  PERSONALITY_SCREENING: {
    FILTER: "/personality-screening/filter/",
  },
  DASHBOARD: {
    ANALYTICS: "/analytics/details/",
    APPLICANT_STAGE_GRAPH: "/analytics/applicants-stage-graph/",
    FEATURE_CONSUMPTION: "/analytics/feature/usages/graph/",
    WEEKLY_GRAPH: "/analytics/weekly-graph/",
    APPLICANT_STAGE_GRAPH_OVERVIEW: "/analytics/applicants-stage-graph-overview/"
  },
  NOTIFICATIONS: {
    CATEGORY_LIST: '/notifications/v1/category-list/',
    FILTER: '/notifications/v1/filter',
    /** GET application reasons list: /notifications/v1/reasons/application-reasons/list/?job_id=...&application_id=... */
    APPLICATION_REASONS_LIST: '/notifications/v1/reasons/application-reasons/list/',
    /** POST application reasons: /notifications/v1/reasons/application-reasons/add/ */
    APPLICATION_REASONS_ADD: '/notifications/v1/reasons/application-reasons/add/',
  },
} as const;

