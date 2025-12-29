export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/core/token/', // Login endpoint: POST /token/
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    FORGOT_PASSWORD: "/core/send-reset-password-email/",
    RESET_PASSWORD: "/core/user/reset-password/",
  },
  // Profile endpoints
  PROFILE: {
    GET: '/core/user/',
    UPDATE: '/profile',
    AVATAR: '/profile/avatar',
  },
  // Jobs endpoints
  JOBS: {
    LIST: '/job/v1/filter',
    DETAIL: (id: string) => `/job/v1/job-detail/${id}/`,
    CREATE: '/jobs',
    UPDATE: (id: string) => `/jobs/${id}`,
    DELETE: (id: string) => `/jobs/${id}`,
    APPLY: (id: string) => `/jobs/${id}/apply`,
  },
  // Applications endpoints
  APPLICATIONS: {
    LIST: '/applications/v1/filter/',
    DETAIL: (id: string) => `/applications/v1/${id}/profile/`,
    CREATE: '/applications',
    UPDATE: (id: string) => `/applications/${id}`,
    STATUS: (id: string) => `/applications/${id}/status`,
    RESPONSES: '/applications/v1/application-responses/',
    ScreeningQus: (id: string) => `/applications/v1/${id}/response/resume-screening/`,
    ASSESSMENT_LOGS: (applicationId: string) => `/assessments/v1/assessment-log/options/?application_id=${applicationId}`,
    ASSESSMENT_REPORT: (assessmentLogId: string) => `/assessments/v1/assessment-log/${assessmentLogId}/report-details/`,
    ASSESSMENT_DETAILED_REPORT: (assessmentLogId: string, assessmentId: string) =>
      `/assessments/v1/assessment-log/assessment/detailed-report/?assessment_log_id=${assessmentLogId}&assessment_id=${assessmentId}`,
    PERSONALITY_SCREENING_LIST: (application_id: string, job_id: string) =>
      `/personality-screening/list/?application_id=${application_id}&job_id=${job_id}`,
    PERSONALITY_SCREENING_RESPONSES: (screening_id: string) =>
      `/personality-screening/${screening_id}/responses/`,
  },
  DASHBOARD: {
    ANALYTICS: "/analytics/details/",
    APPLICANT_STAGE_GRAPH: "/analytics/applicants-stage-graph/",
    FEATURE_CONSUMPTION: "/analytics/feature/usages/graph/",
    WEEKLY_GRAPH: "/analytics/weekly-graph/",
    APPLICANT_STAGE_GRAPH_OVERVIEW: "/analytics/applicants-stage-graph-overview/"
  },
} as const;

