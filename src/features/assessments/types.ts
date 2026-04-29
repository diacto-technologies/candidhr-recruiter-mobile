export interface AssessmentUser {
  id: string;
  name: string;
  email: string;
  profile_pic: string | null;
}
export interface Assessment {
  default_passing_score: String;
  total_sections: number;
  profile_pic: any;
  id: string;
  users_shared_with: AssessmentSharedUser[];
  created_by: AssessmentCreatedBy | null;
  time_duration_in_minutes: number;
  title: string;
  created_at: string;
  description: string;
  total_question: number;
  time_duration: number;
  type: string;
  is_deleted: boolean;
  is_published: boolean;
  instructions: string | null;
  instructions_html: string | null;
  updated_by: string | null;
  difficulty: number;
  published_by: string | null;
  deleted_by: string | null;
  problem: string[];
  domain: string[];
  tags: string[];
  // v2 tests list compatibility
  total_questions?: number;
  test_type?: string;
  is_archived?: boolean;
}
export interface AssessmentCounts {
  all: number;
  draft: number;
  published: number;
  archived: number;
}
export interface AssessmentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Assessment[];
  counts?: AssessmentCounts;
}

export type AssessmentsListSource = "blueprints" | "tests";

export interface AssessmentDashboardStats {
  total_assessments: number;
  active: number;
  drafts: number;
  library_tests: number;
  candidates_assessed: number;
  completion_rate: number;
  pass_rate: number;
  sent_this_month: number;
}

/** Keep name `assessment_stats` as requested by API/UI. */
export interface AssessmentDashboardStatsResponse {
  assessment_stats: AssessmentDashboardStats;
}

export interface GetAssessmentsListPayload {
  page?: number;
  append?: boolean;
  reset?: boolean;
  title?: string;
  o?: string;
  is_published?: boolean;
  is_archived?: boolean;
  /** Which list endpoint to call (blueprints vs tests library). */
  listSource?: AssessmentsListSource;
}

export interface AssessmentSharedUser {
  id: string;
  name: string;
  profile_pic: string | null;
  /** Present when the assessments list/detail API embeds org directory fields on `users_shared_with`. */
  email?: string | null;
  role?: { id: number; name: string } | null;
}
export interface AssessmentCreatedBy {
  id: string;
  name: string;
  email: string;
  profile_pic: string | null;
}

export interface AssignedFilterParams {
  page?: number;
  applicant_name__icontains?: string;
  candidate_email__icontains?: string;
  job__title__icontains?: string;
  average_percentage__in?: string;
  assigned_by__name__icontains?: string;
  status_text?: string;
  o?: string;
  /** UI sort; converted to `o` in API client */
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export type AssignedAssessmentFilters = Omit<AssignedFilterParams, "page" | "o">;
export interface AssignedApplication {
  id: string;
  name: string | null;
  email: string;
}

export interface AssignedUser {
  id: string;
  name: string;
  email: string;
  profile_pic: string | null;
}

export interface AssignedJob {
  id: string;
  title: string;
}

export interface AssignedProctoring {
  id: string;
  mouse_leave_count: number;
  fullscreen_exit_count: number;
  tab_switch_count: number;
  assessment_submit: boolean;
  message: string | null;
  video_file: string | null;
  video_thumbnail: string | null;
  tenant: string | null;
}

export interface AssignedAssessment {
  id: string;
  application: AssignedApplication;
  assigned_by: AssignedUser;
  job: AssignedJob | null;
  approved_by: AssignedUser | null;
  updated_by: AssignedUser | null;
  proctoring: AssignedProctoring;
  assessment_type: string;
  key: string;
  assigned_at: string;
  completed: boolean;
  completed_at: string | null;
  valid_from: string;
  valid_to: string;
  started: boolean;
  started_at: string | null;
  link_opened: boolean;
  link_opened_at: string | null;
  is_approved: boolean;
  approved_at: string | null;
  status_text: string;
  updated_at: string | null;
  average_percentage: number;
  email: string;
  final_result: string | null;
  score: number;
  total: number;
  submitted: boolean;
  executed_by_workflow: boolean;
  workflow_last_status: string | null;
  has_been_updated_by_workflow: boolean;
  workflow_status_updated_at: string | null;
  is_status_overridden_by_user: boolean;
  tenant: string;
  preference: string;
  assessment: string[];
  prebuilt_assessment: string[];
  users_shared_with: any[];
  problem: string[];
}
export interface AssignedAssessmentState {
  assignedList: AssignedAssessment[];
  loading: boolean;
  error: string | null;
  filters: AssignedAssessmentFilters;
  pagination: {
    page: number;
    total: number;
    next: string | null;
    previous: string | null;
  };
  hasMore: boolean;
}
export interface AssignedAssessmentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AssignedAssessment[];
}
export interface GetAssignedAssessmentsPayload extends AssignedFilterParams {
  append?: boolean;
}
/** GET /assessments/v2/blueprints/{id}/ */
export interface ProctoringConfiguration {
  full_screen_mode?: boolean;
  disable_copy_paste?: boolean;
  disable_right_click?: boolean;
  disable_printing?: boolean;
  track_tab_switches?: boolean;
  track_mouse_leave?: boolean;
  webcam_monitoring?: boolean;
  device_restriction?: boolean;
  enforce_single_screen?: boolean;
  eye_gaze_monitoring?: boolean;
  record_video?: boolean;
  record_audio?: boolean;
  record_screen?: boolean;
  max_tab_switches?: number;
  max_tab_closes?: number;
  max_fullscreen_exits?: number;
  max_mouse_leaves?: number;
  auto_submit_on_violation?: boolean;
  show_warnings?: boolean;
  verify_id_card?: boolean;
  room_scan_required?: boolean;
}

export interface BlueprintSectionTest {
  id?: string;
  title?: string;
  description?: string;
  total_questions?: number;
  total_marks?: number;
  time_duration?: number;
}

export interface BlueprintSection {
  total_marks: any;
  id: string;
  order?: number;
  required_questions?: number;
  select_random?: number;
  total_questions?: number;
  shuffle?: boolean;
  test?: BlueprintSectionTest | null;
  questions?: unknown[];
}

export interface AssessmentBlueprintDetail {
  id: string;
  title?: string;
  description?: string;
  total_duration_in_minutes?: number;
  /** Seconds; used when `total_duration_in_minutes` is absent. */
  default_duration?: number;
  total_questions?: number;
  total_marks?: number;
  default_passing_score?: number;
  min_sections_required?: number;
  default_shuffle_questions?: boolean;
  instructions?: string | null;
  instructions_html?: string | null;
  is_published?: boolean;
  is_archived?: boolean;
  is_proctoring_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
  published_at?: string | null;
  created_by?: AssessmentCreatedBy | null;
  sections?: BlueprintSection[];
  proctoring_configuration?: ProctoringConfiguration | null;
  questions?: unknown[];
  skills?: string[] | { name?: string }[];
  users_shared_with?: AssessmentSharedUser[];
}

/** GET /assessments/v2/assignments/list/?blueprint_id= */
export interface BlueprintAssignmentProctoringEvent {
  id?: string;
  event_type?: string;
  details?: Record<string, unknown>;
  evidence_file?: string | null;
  created_at?: string;
  session?: string;
  tenant?: string;
}

/** GET /assessments/v2/assignments/list/?blueprint_id= */
export interface BlueprintAssignmentProctoringSession {
  id?: string;
  tab_switch_count?: number;
  tab_close_count?: number;
  fullscreen_exit_count?: number;
  mouse_leave_count?: number;
  page_reload_count?: number;
  multiple_screen_count?: number;
  video_off_count?: number;
  audio_off_count?: number;
  multiple_faces_count?: number;
  no_face_count?: number;
  mobile_detected_count?: number;
  voice_detected_count?: number;
  eye_gaze_violation_count?: number;
  device_violation_count?: number;
  ip_violation_count?: number;
  right_click_count?: number;
  copy_paste_count?: number;
  print_count?: number;
  room_scan_failure_count?: number;
  id_verification_failure_count?: number;
  is_terminated?: boolean;
  termination_reason?: string | null;
  video_file?: string | null;
  video_thumbnail?: string | null;
  gaze_snapshots?: unknown[];
  gaze_summary?: Record<string, unknown>;
  events?: BlueprintAssignmentProctoringEvent[];
  created_at?: string;
  updated_at?: string;
  assignment?: string;
  tenant?: string | null;
}

export interface BlueprintAssignmentScore {
  percentage?: number | null;
  passed?: boolean | null;
  passing_threshold?: number | null;
  status?: string;
  score?: number;
  total_marks?: number;
  rank?: number;
  percentile?: number;
}

export interface BlueprintAssignment {
  id: string;
  application?: {
    id?: string;
    name?: string;
    job?: { id?: string; title?: string } | null;
    candidate?: {
      id?: string;
      name?: string;
      email?: string;
      profile_pic?: string | null;
    };
  };
  blueprint_title?: string;
  candidate_name?: string | null;
  candidate_email?: string;
  valid_from?: string;
  valid_to?: string;
  status?: string;
  status_display?: string;
  time_duration_in_minutes?: number;
  total_questions?: number;
  passing_score_override?: number | null;
  total_duration_override?: number | null;
  candidate_percentage?: number | null;
  proctoring_session?: BlueprintAssignmentProctoringSession | null;
  blueprint_score?: BlueprintAssignmentScore | null;
  expiry_notification_sent?: boolean;
  reminders_enabled?: boolean;
  reminder_intervals?: number[];
  created_at?: string;
  created_by?: {
    id?: string;
    name?: string;
    email?: string;
    profile_pic?: string | null;
  };
  reminder_logs?: unknown[] | null;
  is_auto_submitted?: boolean;
}

export interface BlueprintAssignmentsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BlueprintAssignment[];
}

/** GET /assessments/v2/assignments/stats/?blueprint_id= */
export interface BlueprintAssignmentStats {
  invited: number;
  in_progress: number;
  completed: number;
  completion_rate: number;
}

export interface BlueprintAssignmentsPagination {
  count: number;
  next: string | null;
  previous: string | null;
  page: number;
}

export interface FetchBlueprintAssignmentsListPayload {
  blueprintId: string;
  page?: number;
  append?: boolean;
  o?: string;
  candidate_name?: string;
  candidate_email?: string;
  /** Omit or `"all"` — no `status` query param. */
  status?: string;
}

/** Last assignments/list request params for the overview / details table. */
export interface BlueprintAssignmentsListQuery {
  blueprintId: string;
  page: number;
  candidate_name?: string;
  candidate_email?: string;
  status?: string;
  o: string;
}

/** POST /assessments/v2/assignments/export/ */
export interface ExportBlueprintAssignmentsReportPayload {
  blueprint_id: string;
  select_all: boolean;
  assignment_ids: string[];
}

/** POST /assessments/v2/assignments/ */
export interface AssignCandidatesPayload {
  blueprint_id: string;
  application_ids: string[];
  candidate_emails: string[];
  reminders_enabled: boolean;
  reminder_intervals: number[];
  valid_from: string;
  valid_to: string;
}

export interface AssessmentOverviewState {
  blueprintId: string | null;
  blueprint: AssessmentBlueprintDetail | null;
  dashboardStats: AssessmentDashboardStats | null;
  assignments: BlueprintAssignment[];
  blueprintAssignmentStats: BlueprintAssignmentStats | null;
  loading: boolean;
  error: string | null;
  /** True while GET assignments/list for a blueprint is in flight (standalone fetch). */
  assignmentsListLoading: boolean;
  assignmentsListError: string | null;
  assignmentsPagination: BlueprintAssignmentsPagination | null;
  /** Params used for the last blueprint assignments list fetch (filters + sort). */
  assignmentsListQuery: BlueprintAssignmentsListQuery | null;
  /** Search field value for assignments list (candidate name / email); debounced for API in UI. */
  assignmentsListSearchText: string;
  /** Assignment row ids selected for export (blueprint assignments list). */
  assignmentTableSelectedIds: string[];
  assignmentExportLoading: boolean;
  assignmentExportError: string | null;
  assignCandidatesLoading: boolean;
  assignCandidatesError: string | null;
  publishBlueprintLoading: boolean;
  publishBlueprintError: string | null;
}

/** POST /assessments/v2/blueprints/{id}/publish/ */
export interface PublishBlueprintPayload {
  blueprint_id: string;
}

export interface PublishBlueprintResponse {
  message?: string;
}

export interface AssessmentTestDetailState {
  id: string | null;
  loading: boolean;
  error: string | null;
  data: AssessmentResponse | null;
}

export interface AssessmentQuestionsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AssessmentQuestionResponse[];
}

export interface AssessmentQuestionsListState {
  testId: string | null;
  /** When set, GET /questions `question_type` filter — only `multiple_choice` | `single_choice` | `text` (not `coding`). */
  questionType: string | null;
  page: number;
  loading: boolean;
  error: string | null;
  data: AssessmentQuestionsListResponse | null;
}

export type GenerateQuestionsDifficulty = "easy" | "medium" | "hard" | "mixed" | string;
export type GenerateQuestionsLanguage = "English" | string;

export interface GenerateQuestionsPayload {
  testId: string;
  prompt: string;
  count: number;
  difficulty: GenerateQuestionsDifficulty;
  question_types: AssessmentQuestionType[];
  context?: string;
  save?: boolean;
  avoid_duplicates?: boolean;
  temperature?: number;
  include_explanations?: boolean;
  default_points?: number;
  default_time_duration?: number;
  max_existing_questions?: number;
  language?: GenerateQuestionsLanguage;
}

export interface GenerateQuestionsResponse {
  test_id: string;
  requested_count: number;
  generated_count: number;
  model?: string;
  method?: string;
  warnings?: string[];
  questions: AssessmentQuestionResponse[];
}

/** POST /assessments/v2/generate-coding-problem/metadata/ */
export interface GenerateCodingProblemMetadataPayload {
  title: string;
  difficulty_level: string;
  duration: number;
  ai_prompt: string;
  examples_count: number;
}

export interface CodingProblemMetadataExample {
  input: string | string[];
  output: string;
  explanation?: string;
}

export interface GenerateCodingProblemMetadataResponse {
  /** Optional; some API versions include a generated title. */
  title?: string;
  problem_description: string;
  constraints: string;
  examples: CodingProblemMetadataExample[];
  duration: number;
  difficulty_level: string;
}

/** POST /assessments/v2/generate-coding-problem/testcases-snippets/ */
export interface GenerateCodingTestcasesSnippetsPayload {
  title: string;
  ai_prompt: string;
  constraints: string;
  description: string;
  supported_languages: string[];
  test_cases_count: number;
}

export interface CodingGeneratedTestCase {
  input: string;
  expected_output: string;
}

export interface CodingGeneratedCodeSnippet {
  language: string;
  code: string;
}

export interface GenerateCodingTestcasesSnippetsResponse {
  test_cases: CodingGeneratedTestCase[];
  code_snippets: CodingGeneratedCodeSnippet[];
}

/** POST /assessments/v2/generate-coding-problem/reference-solution/ */
export interface ReferenceSolutionTestCasePayload {
  input: string;
  expected_output: string;
}

export interface GenerateCodingReferenceSolutionPayload {
  title: string;
  ai_prompt: string;
  constraints: string;
  description: string;
  languages: string[];
  test_cases: ReferenceSolutionTestCasePayload[];
}

export interface GenerateCodingReferenceSolutionRow {
  language: string;
  code: string;
  validated?: boolean;
}

export type GenerateCodingReferenceSolutionResponse = GenerateCodingReferenceSolutionRow[];

export interface BulkCreateQuestionsResponse {
  detail?: string;
  questions: AssessmentQuestionResponse[];
}

export type BulkCreateQuestionItem = Omit<CreateAssessmentQuestionPayload, "test">;

export interface BulkCreateQuestionsPayload {
  testId: string;
  questions: BulkCreateQuestionItem[];
}

export interface TestBulkUploadPayload {
  testId: string;
  file: {
    uri: string;
    name: string;
    type?: string | null;
    size?: number;
  };
}

export interface TestBulkUploadResponse {
  message: string;
  created_count: number;
  skipped_count: number;
  error_count: number;
  errors: any[];
  warnings: string[];
  questions: any[];
}

/** GET /assessments/v2/languages/ — single row */
export interface AssessmentJudgeLanguage {
  id: number;
  /** Canonical slug sent with `allowed_languages` (e.g. `python (3.14.0)`). */
  name: string;
  display_name: string;
  version: string | null;
}

export interface AssessmentLanguagesListResponse {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: AssessmentJudgeLanguage[];
}

/** Fetch languages: initial load pulls every page in the saga until `total_pages` is exhausted. */
export interface FetchAssessmentLanguagesPayload {
  page?: number;
  pageSize?: number;
  /** When true, fetch a single page and append to `items` (manual pagination). */
  append?: boolean;
}

export interface AssessmentLanguagesListState {
  items: AssessmentJudgeLanguage[];
  loading: boolean;
  error: string | null;
  /** Last fetched page (when using append). After full initial load, 1. */
  page: number;
  pageSize: number;
  count: number;
  totalPages: number;
  hasMore: boolean;
}

/** GET /assessments/v2/categories/?page=&o=name */
export interface AssessmentCategory {
  id: string;
  name: string;
  description?: string;
  domains?: string[];
  created_at?: string;
}

export interface AssessmentCategoriesListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AssessmentCategory[];
}

export interface AssessmentCategoriesListState {
  items: AssessmentCategory[];
  loading: boolean;
  error: string | null;
  /** Last fetched page index (1-based). */
  page: number;
  count: number;
  /** True when `next` is present in the last response. */
  hasMore: boolean;
}

/** GET /assessments/v2/tests/options/ */
export interface AssessmentTestOption {
  id: string;
  title: string;
  test_type: string;
  is_prebuilt: boolean;
  time_duration: number;
  is_published: boolean;
  difficulty_label: string | null;
  total_questions: number;
  total_marks: number;
}

export interface AssessmentTestOptionsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AssessmentTestOption[];
}

export interface AssessmentTestOptionsListState {
  items: AssessmentTestOption[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  count: number;
  hasMore: boolean;
}

/** Rows from API error `details.details.reference_solutions` when reference solution validation fails. */
export interface ReferenceSolutionValidationRow {
  language?: string;
  input?: string;
  output?: string;
  actual_output?: string;
  error?: string;
  message?: string;
}

/** Create-assessment wizard (Basic info → Sections → Instructions → Proctoring) */
export interface AssessmentCreateWizardBasicInfo {
  title: string;
  description: string;
  durationMins: number;
  passingScore: number;
  skills: string[];
  /** Blueprint id when editing an existing template. */
  id?: string;
  is_published?: boolean;
  is_archived?: boolean;
}

export interface AssessmentCreateWizardSection {
  id: string;
  testId: string;
  toShow: number;
  required: number;
  shuffle: boolean;
  /** Hydrated from GET blueprint for Section UI when test list has not loaded yet. */
  testTitle?: string;
  labelQuestions?: number;
  labelMarks?: number;
  /** Often minutes, aligned with `AssessmentTestOption.time_duration` usage. */
  labelDuration?: number;
}

export interface AssessmentCreateWizardProctoring {
  fullscreen: boolean;
  tabSwitch: boolean;
  copyPaste: boolean;
  rightClick: boolean;
  singleScreen: boolean;
  webcam: boolean;
  eyeGaze: boolean;
  autoSubmit: boolean;
  maxTabSwitch: number;
  maxFullscreenExit: number;
}

export interface UpdateBlueprintRequestPayload {
  title: string;
  description: string;
  default_duration: number;
  default_passing_score: number;
  instructions: string;
  instructions_html: string;
  is_proctoring_enabled: boolean;
  min_sections_required: number;
  proctoring_configuration: Record<string, unknown>;
  skills: string[];
  sections: Array<{
    _uid: string;
    test_id: string;
    select_random: number;
    required_questions: number;
    shuffle: boolean;
    order: number;
  }>;
}

export interface AssessmentCreateWizardState {
  blueprintId: string | null;
  basicInfo: AssessmentCreateWizardBasicInfo | null;
  sections: AssessmentCreateWizardSection[];
  instructionsHtml: string;
  /** Filled when GET blueprint is loaded for edit; Proctoring step reads this for defaults. */
  proctoringDraft: AssessmentCreateWizardProctoring | null;
  loadBlueprintForEditLoading: boolean;
  loadBlueprintForEditError: string | null;
  /** Full GET /blueprints/{id}/ payload for edit; use for `created_by`, `sections`, etc. */
  loadBlueprintForEditDetail: AssessmentBlueprintDetail | null;
  submitBlueprintLoading: boolean;
  submitBlueprintError: string | null;
  lastSubmitBlueprint: AssessmentBlueprintDetail | null;
}

export const createAssessmentWizardInitialState: AssessmentCreateWizardState = {
  blueprintId: null,
  basicInfo: null,
  sections: [],
  instructionsHtml: '',
  proctoringDraft: null,
  loadBlueprintForEditLoading: false,
  loadBlueprintForEditError: null,
  loadBlueprintForEditDetail: null,
  submitBlueprintLoading: false,
  submitBlueprintError: null,
  lastSubmitBlueprint: null,
};

export interface AssessmentsState {
  assessments: Assessment[];
  loading: boolean;
  error: string | null;

  pagination: {
    page: number;
    total: number;
  };

  hasMore: boolean;
  counts: AssessmentCounts;

  /** Last GET assessments list params (for refetch after mutations, e.g. delete). */
  lastAssessmentsListQuery: GetAssessmentsListPayload | null;

  assigned: AssignedAssessmentState;

  assessmentOverview: AssessmentOverviewState;

  /** GET /assessments/v2/tests/{id}/ */
  testDetail: AssessmentTestDetailState;

  /** GET /assessments/v2/questions/?test={id}&page=&question_type= */
  questionsList: AssessmentQuestionsListState;
  postAssessmentLoading: boolean;
  postAssessmentError: string | null;
  createdAssessment: AssessmentResponse | null;

  /** PUT /assessments/v2/tests/{id}/ */
  updateAssessmentTestLoading: boolean;
  updateAssessmentTestError: string | null;

  /** DELETE /assessments/v2/tests/{id}/ */
  deleteAssessmentTestLoading: boolean;
  deleteAssessmentTestError: string | null;
  /** Which test id the in-flight DELETE targets (for per-card loading UI). */
  deleteAssessmentTestTargetId: string | null;

  /** POST /assessments/v2/tests/{id}/duplicate/ */
  duplicateAssessmentTestLoading: boolean;
  duplicateAssessmentTestError: string | null;
  duplicateAssessmentTestTargetId: string | null;

  /** POST /assessments/v2/blueprints/{id}/duplicate/ */
  duplicateBlueprintLoading: boolean;
  duplicateBlueprintError: string | null;
  duplicateBlueprintTargetId: string | null;

  /** DELETE /assessments/v2/blueprints/{id}/ */
  deleteBlueprintLoading: boolean;
  deleteBlueprintError: string | null;
  deleteBlueprintTargetId: string | null;

  /** POST /assessments/v2/blueprints/{id}/archive/ */
  archiveBlueprintLoading: boolean;
  archiveBlueprintError: string | null;
  archiveBlueprintTargetId: string | null;

  /** POST /assessments/v2/tests/{id}/archive/ */
  archiveAssessmentTestLoading: boolean;
  archiveAssessmentTestError: string | null;
  archiveAssessmentTestTargetId: string | null;

  /** POST /assessments/v2/tests/{id}/share/ */
  shareAssessmentTestLoading: boolean;
  shareAssessmentTestError: string | null;
  shareAssessmentTestTargetId: string | null;

  /** POST /assessments/v2/blueprints/{id}/share/ */
  shareBlueprintLoading: boolean;
  shareBlueprintError: string | null;
  shareBlueprintTargetId: string | null;

  postAssessmentQuestionLoading: boolean;
  postAssessmentQuestionError: string | null;
  /** When saving a coding problem fails with reference-solution validation, API returns these rows. */
  postAssessmentQuestionReferenceSolutionErrors: ReferenceSolutionValidationRow[] | null;
  createdAssessmentQuestion: AssessmentQuestionResponse | null;

  deleteAssessmentQuestionLoading: boolean;
  deleteAssessmentQuestionError: string | null;

  updateAssessmentQuestionLoading: boolean;
  updateAssessmentQuestionError: string | null;

  publishAssessmentTestLoading: boolean;
  publishAssessmentTestError: string | null;

  bulkCreateQuestionsLoading: boolean;
  bulkCreateQuestionsError: string | null;

  /** GET /assessments/v2/tests/{id}/download-template/ */
  downloadTestTemplateLoading: boolean;
  downloadTestTemplateError: string | null;

  /** POST /assessments/v2/tests/{id}/bulk-upload/ */
  testBulkUploadLoading: boolean;
  testBulkUploadError: string | null;
  testBulkUploadResult: TestBulkUploadResponse | null;

  /** GET /assessments/v2/languages/?page=&page_size= */
  languagesList: AssessmentLanguagesListState;

  /** GET /assessments/v2/categories/?page=&o= */
  categoriesList: AssessmentCategoriesListState;

  /** GET /assessments/v2/tests/options/ */
  testOptionsList: AssessmentTestOptionsListState;

  /** Create assessment blueprint wizard draft + submit (POST /blueprints/{id}/) */
  assessmentCreateWizard: AssessmentCreateWizardState;
}

/** DELETE question — refetch list with testId after success */
export interface DeleteAssessmentQuestionPayload {
  questionId: string;
  testId: string;
  /** When true, DELETE `/assessments/v2/problem-questions/{id}/` (coding); otherwise `/assessments/v2/questions/{id}/`. */
  isProblemQuestion?: boolean;
}

/** PUT /assessments/v2/questions/{id}/ */
export interface UpdateAssessmentQuestionPayload {
  questionId: string;
  data: Omit<CreateAssessmentQuestionPayload, "test"> & {
    /** API expects test to remain on the object for PUT */
    test: string;
    /** API expects id field on the body as well */
    id: string;
  };
}

export interface PublishAssessmentTestPayload {
  testId: string;
}

/** DELETE /assessments/v2/tests/{id}/ */
export interface DeleteAssessmentTestPayload {
  testId: string;
}

/** POST /assessments/v2/tests/{id}/duplicate/ */
export interface DuplicateAssessmentTestPayload {
  testId: string;
}

/** POST /assessments/v2/blueprints/{id}/duplicate/ */
export interface DuplicateBlueprintPayload {
  blueprintId: string;
}

/** DELETE /assessments/v2/blueprints/{id}/ */
export interface DeleteBlueprintPayload {
  blueprintId: string;
}

/** POST /assessments/v2/blueprints/{id}/archive/ */
export interface ArchiveBlueprintPayload {
  blueprintId: string;
}

/** Typical API JSON body for duplicate success. */
export interface DuplicateAssessmentTestResponse {
  message: string;
}

export interface DuplicateBlueprintResponse {
  message: string;
}

/** POST /assessments/v2/tests/{id}/archive/ */
export interface ArchiveAssessmentTestPayload {
  testId: string;
}

export interface ArchiveAssessmentTestResponse {
  message: string;
}

/** POST /assessments/v2/tests/{id}/share/ */
export interface ShareAssessmentTestPayload {
  testId: string;
  users_shared_with: string[];
}

/** POST /assessments/v2/blueprints/{id}/share/ */
export interface ShareBlueprintPayload {
  blueprintId: string;
  users_shared_with: string[];
}

export interface CreateAssessmentPayload {
  title: string;
  description?: string;
  instructions?: string;
  instructions_html?: string;
  test_type: "aptitude" | "technical" | string;

  categories?: string[];
  tags?: string[];
  skills?: string[];

  time_duration?: number;
  shuffle?: boolean;
  revisit_question?: boolean;
  negative_marking?: boolean;
}

export interface AssessmentResponse {
  id: string;

  title: string;
  description: string;
  instructions: string;
  instructions_html: string;

  test_type: string;

  /** GET returns expanded objects; PUT expects id strings. */
  categories: string[] | AssessmentCategory[];
  tags: string[];
  skills: string[];

  total_marks: number;
  total_questions: number;
  time_duration: number;

  shuffle: boolean;
  revisit_question: boolean;
  negative_marking: boolean;

  is_prebuilt: boolean;
  is_published: boolean;
  is_archived: boolean;
  is_deleted: boolean;

  created_at: string;
  updated_at: string;
  published_at: string | null;
  archived_at: string | null;
  deleted_at: string | null;

  tenant: string;

  created_by: string;
  updated_by: string | null;
  deleted_by: string | null;
  archived_by: string | null;
  published_by: string | null;

  difficulty: string | null;

  users_shared_with: string[];
}

/** Full test resource for PUT — merge server state with edited fields in the UI. */
export interface UpdateAssessmentTestPayload {
  testId: string;
  body: AssessmentResponse;
}

export type AssessmentQuestionType =
  | "single_choice"
  | "multiple_choice"
  | "text"
  | "coding";

export interface AssessmentQuestionChoicePayload {
  id: number;
  value: string;
  correct: boolean;
}

/** POST /assessments/v2/problem-questions/ — coding problems (nested `problem` in response). */
export interface CreateProblemQuestionPayload {
  test_id: string;
  title: string;
  description: string;
  constraints: string;
  difficulty_id: number;
  points: number;
  /** Minutes (matches `time_limit` on problem). */
  time_limit: number;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  test_cases: Array<{ input: string; output: string }>;
  code_snippets: Array<{ language: string; code: string }>;
  reference_solutions: Record<string, string>;
  editorial: null;
  hints: null;
}

export interface SubmitProblemQuestionPayload {
  /** When set, PUT `/problem-questions/{id}/`; otherwise POST create. */
  questionId?: string | null;
  body: CreateProblemQuestionPayload;
}

export interface CreateAssessmentQuestionPayload {
  /** test id from assessments/v2/tests/ */
  test: string;
  question_type: AssessmentQuestionType;
  difficulty: "easy" | "medium" | "hard" | string;
  points: number;
  time_duration: number;
  html_content: string;
  text: string;
  choices?: AssessmentQuestionChoicePayload[];
  /** Coding problems — shape depends on API; passed through when question_type is coding */
  problem_title?: string;
  examples?: Array<{ input: string; output: string; explanation?: string }>;
  hidden_test_cases?: Array<{ input: string; expected_output: string }>;
  allowed_languages?: string[];
  starter_code?: string | Record<string, string>;
  starter_language?: string;
  reference_solution?: string;
  /** Plain-text constraints (e.g. input bounds) for coding problems */
  constraints?: string;
}

export interface AssessmentQuestionChoiceResponse {
  id: number;
  value: string;
  correct: boolean;
}

export interface AssessmentQuestionResponse {
  id: string;
  text: string;
  html_content: string;
  question_type: AssessmentQuestionType;
  choices: AssessmentQuestionChoiceResponse[];
  time_duration: number;
  points: number;
  order: number;
  difficulty: string;
  test: string;
  tenant: string;
  is_published: boolean;
  is_deleted: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  // Keep other fields flexible without breaking callers
  [key: string]: any;
}
