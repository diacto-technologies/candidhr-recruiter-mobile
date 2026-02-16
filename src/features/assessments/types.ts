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
  export interface AssessmentsState {
    assessments: Assessment[];
    loading: boolean;
    error: string | null;
  
    pagination: {
      page: number;
      total: number;
    };
  
    hasMore: boolean;
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