export interface AssessmentUser {
    id: string;
    name: string;
    email: string;
    profile_pic: string | null;
  }
  export interface Assessment {
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
  }
  export interface AssessmentListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Assessment[];
  }
  
  export interface GetAssessmentsListPayload {
    page?: number;
    append?: boolean;
    reset?: boolean;
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
  export interface AssessmentsState {
    assessments: Assessment[];
    loading: boolean;
    error: string | null;
  
    pagination: {
      page: number;
      total: number;
    };
  
    hasMore: boolean;

    assigned: AssignedAssessmentState;
  }