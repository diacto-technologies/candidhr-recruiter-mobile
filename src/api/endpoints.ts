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
    // Used for dropdowns / selectors and users management screens
    // Backed by: GET /core/users/options/?page=1
    LIST: '/core/users/options/',
    CREATE: '/core/tenant/users/',
    ASSIGN_ROLE: '/core/assign-role/',
    DELETE: (id: string) => `/core/tenant/users/${id}/`,
  },
  ROLES: {
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
    EXPORT: '/applications/v2/export/',
    DETAIL: (id: string) => `/applications/v1/${id}/profile/`,
    /** GET application profile as PDF (server-generated) */
    PROFILE_PDF: (id: string) => `/applications/v1/${id}/profile/pdf/`,
    CREATE: '/applications',
    UPDATE: (id: string) => `/applications/${id}`,
    stages: (id: string) => `/applications/v1/stages/?application_id=${id}`,
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
    PERFORMANCE_REPORT: (assessmentLogId: string) => `/assessments/v2/${assessmentLogId}/performance-report/`,
    Assessment_Reports:(application_id:string)=>`assessments/v2/assignment-options/?application_id=${application_id}`,
    ASSESSMENT_REPORT_EXPORT: '/assessments/v2/assignments/export/',
    ASSESSMENT_DETAILED_REPORT: (assessmentLogId: string, assessmentId: string) =>
      `/assessments/v1/assessment-log/assessment/detailed-report/?assessment_log_id=${assessmentLogId}&assessment_id=${assessmentId}`,
    PERSONALITY_SCREENING_LIST: (application_id: string, job_id: string) =>
      `/personality-screening/list/?application_id=${application_id}&job_id=${job_id}`,
    PERSONALITY_SCREENING_RESPONSES: (screening_id: string) =>
      `/personality-screening/${screening_id}/responses/`,
    /** POST send status update email to candidate */
    SEND_EMAIL: '/applications/send-email/',
    /** PATCH share users with an application: /applications/v1/{id}/share/ */
    SHARE: (id: string) => `/applications/v1/${id}/share/`,
    /** GET /applications/v1/options/?page=&jobId= — applicant picker (assign, etc.); omit jobId for all */
    APPLICANT_OPTIONS: '/applications/v1/options/',
  },
  ASSESSMENTS: {
    LIST: "/assessments/v1/list/",
    /** Candidate / assignment rows (filters like applicant_name__icontains, o=valid_to) */
    ASSIGNED_FILTER: "/assessments/v1/filter",
    // Tests library list
    ASSIGNEDLIST: "/assessments/v2/tests/list/",
    /** Assessment blueprints (company assessments library) */
    BLUEPRINTS_LIST: "/assessments/v2/blueprints/list/",
    /** POST create blueprint (wizard) — no id in path */
    BLUEPRINTS_ROOT: "/assessments/v2/blueprints/",
    BLUEPRINT_DETAIL: (id: string) => `/assessments/v2/blueprints/${id}/`,
    BLUEPRINT_DUPLICATE: (id: string) =>
      `/assessments/v2/blueprints/${id}/duplicate/`,
    BLUEPRINT_ARCHIVE: (id: string) =>
      `/assessments/v2/blueprints/${id}/archive/`,
    /** POST body: { is_published: true } */
    BLUEPRINT_PUBLISH: (id: string) =>
      `/assessments/v2/blueprints/${id}/publish/`,
    /** POST body: { users_shared_with: string[] } */
    BLUEPRINT_SHARE: (id: string) => `/assessments/v2/blueprints/${id}/share/`,
    /** GET ?blueprint_id=&o=-created_at */
    ASSIGNMENTS_LIST: "/assessments/v2/assignments/list/",
    /** POST assign blueprint to applications + invite emails */
    ASSIGNMENTS_POST: "/assessments/v2/assignments/",
    /** GET ?blueprint_id= */
    ASSIGNMENTS_STATS: "/assessments/v2/assignments/stats/",
    /** POST body: select_all, assignment_ids, blueprint_id */
    ASSIGNMENTS_EXPORT: "/assessments/v2/assignments/export/",
    /** V2 assessments dashboard top stats */
    ASSESSMENT_STATS: "/assessments/v2/dashboard-stats/",
    ASSESSMENT_TEST:"/assessments/v2/tests/",
    /** GET /assessments/v2/tests/{id}/ */
    TEST_DETAIL: (id: string) => `/assessments/v2/tests/${id}/`,
    /** POST /assessments/v2/tests/{id}/publish/ */
    TEST_PUBLISH: (id: string) => `/assessments/v2/tests/${id}/publish/`,
    /** POST /assessments/v2/tests/{id}/duplicate/ */
    TEST_DUPLICATE: (id: string) => `/assessments/v2/tests/${id}/duplicate/`,
    /** POST /assessments/v2/tests/{id}/archive/ */
    TEST_ARCHIVE: (id: string) => `/assessments/v2/tests/${id}/archive/`,
    /** POST /assessments/v2/tests/{id}/share/ body: { users_shared_with: string[] } */
    TEST_SHARE: (id: string) => `/assessments/v2/tests/${id}/share/`,
    /** POST create question (test id goes in body) */
    QUESTIONS: "/assessments/v2/questions/",
    /** POST/PUT coding problem-question (nested problem payload) */
    PROBLEM_QUESTIONS: "/assessments/v2/problem-questions/",
    PROBLEM_QUESTION_DETAIL: (questionId: string) =>
      `/assessments/v2/problem-questions/${questionId}/`,
    /** POST create question for a specific test id */
    QUESTIONS_CREATE: (testId: string) => `/assessments/v2/questions/${testId}/`,
    /** DELETE /assessments/v2/questions/{id}/ */
    QUESTION_DETAIL: (questionId: string) => `/assessments/v2/questions/${questionId}/`,
    /** POST /assessments/v2/tests/{id}/generate-questions/ */
    TEST_GENERATE_QUESTIONS: (testId: string) =>
      `/assessments/v2/tests/${testId}/generate-questions/`,
    /** GET /assessments/v2/tests/{id}/download-template/ */
    TEST_DOWNLOAD_TEMPLATE: (testId: string) =>
      `/assessments/v2/tests/${testId}/download-template/`,
    /** POST /assessments/v2/tests/{id}/bulk-upload/ (multipart file) */
    TEST_BULK_UPLOAD: (testId: string) => `/assessments/v2/tests/${testId}/bulk-upload/`,
    /** POST `{ questions: [...] }` — bulk create questions on a test */
    TEST_QUESTIONS_BULK_CREATE: (testId: string) =>
      `/assessments/v2/tests/${testId}/questions/bulk-create/`,
    /** GET /assessments/v2/tests/options/?page=&page_size=&is_published= */
    TEST_OPTIONS: "/assessments/v2/tests/options/",
    /** GET /assessments/v2/languages/?page=&page_size= — judge / IDE language runtimes */
    LANGUAGES: "/assessments/v2/languages/",
    /** GET /assessments/v2/categories/?page=&o=name — test skill categories */
    CATEGORIES: "/assessments/v2/categories/",
    /** POST — AI metadata for coding problems (statement, constraints, examples) */
    GENERATE_CODING_PROBLEM_METADATA: "/assessments/v2/generate-coding-problem/metadata/",
    /** POST — AI hidden test cases + per-language starter snippets */
    GENERATE_CODING_PROBLEM_TESTCASES_SNIPPETS:
      "/assessments/v2/generate-coding-problem/testcases-snippets/",
    /** POST — AI reference solution(s) per language */
    GENERATE_CODING_PROBLEM_REFERENCE_SOLUTION:
      "/assessments/v2/generate-coding-problem/reference-solution/",
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
    /** PATCH application reasons update (delete uses message="Deleted"): /notifications/v1/reasons/application-reasons/{id}/update/ */
    APPLICATION_REASONS_UPDATE: (id: string) => `/notifications/v1/reasons/application-reasons/${id}/update/`,
  },
  COMMENTS: {
    /** GET list: /comments/v1/comments/?application_id=...&job_id=... */
    LIST: '/comments/v1/comments/',
    /** POST create: /comments/v1/comments/ */
    CREATE: '/comments/v1/comments/',
    /** PATCH update: /comments/v1/{commentId}/update/ */
    UPDATE: (commentId: string) => `/comments/v1/${commentId}/update/`,
    /** DELETE: /comments/v1/comments/{commentId}/ */
    DELETE: (commentId: string) => `/comments/v1/comments/${commentId}/`,
  },
} as const;

