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
  time_duration?: number;
}

export interface BlueprintSection {
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
  total_questions?: number;
  total_marks?: number;
  default_passing_score?: number;
  min_sections_required?: number;
  default_shuffle_questions?: boolean;
  instructions?: string | null;
  instructions_html?: string | null;
  is_published?: boolean;
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
}

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

    assigned: AssignedAssessmentState;

    assessmentOverview: AssessmentOverviewState;
  }