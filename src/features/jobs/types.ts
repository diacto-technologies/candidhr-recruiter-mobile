// features/jobs/types.ts

// Single job object from your API
export interface Job {
  id: string;
  title: string;
  description: string;
  jd_html: string;
  location: string;
  employment_type: string;
  experience?: number | null;
  min_experience?: number | null;
  max_experience?: number | null;
  applicants_count?: number;
  applicants_today_count?: number;
  views_count?: number;
  published: boolean;
  close_date?: string | null;
  created_at: string;
  last_viewed?: string | null;
  encrypted?: string;
  tenant?: string;
  invite_via_application_form?: boolean;
  invite_via_email?: boolean;
  emails?: string[];
  application_ids?: string[] | null;

  // Nested objects
  owner: {
    id: string;
    name: string;
    email: string;
    contact?: number | null;
    country?: string | null;
    state?: string | null;
    profile_pic?: string | null;
    role?: {
      id: number;
      name: string;
      tenant: string;
      is_default: boolean;
      created_at?: string;
      updated_at?: string;
    };
  };

  workflow?: {
    id: string;
    name: string;
  };

  must_have_skills?: Array<{
    label: string;
    value: string;
  }>;

  users_shared_with?: Array<{
    id: string;
    name: string;
    email: string;
    role?: any;
    contact?: number | null;
    state?: string | null;
    country?: string | null;
    profile_pic?: string | null;
  }>;

  [key: string]: any; // for any extra fields
}

// API response for list endpoint
export interface JobsListApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Job[];
}

// For single job detail (some endpoints return { job: Job })
export interface JobDetailApiResponse {
  job: Job;
}

// Request payloads
export interface CreateJobRequest {
  title: string;
  description: string;
  jd_html?: string;
  location: string;
  employment_type: string;
  min_experience?: number | null;
  max_experience?: number | null;
  experience?: number | null;
  must_have_skills?: Array<{ label: string; value: string }>;
  workflow_id?: string;
  close_date?: string;
  published?: boolean;
  invite_via_application_form?: boolean;
  invite_via_email?: boolean;
  emails?: string[];
}

export interface UpdateJobRequest extends Partial<CreateJobRequest> {
  id: string;
}

export interface GetJobsParams {
  page?: number;
  limit?: number;
  published?: boolean;
  title?: string;
  experience?: string;
  employmentType?: string;
  location?: string;
  createdBy?: string;
  closeDate?: string;
  orderBy?: string;
  append?: boolean;
}
// Redux state
export interface JobsPagination {
  page: number;
  limit: number;
  total: number;
}



export interface JobDetail {
  id: string;
  title: string;
  description: string;      // HTML string
  jd_html: string;          // HTML string

  experience?: number | null;
  min_experience?: number | null;
  max_experience?: number | null;

  applicants_count?: number;
  applicants_today_count?: number;

  users_shared_with: SharedUser[];
  must_have_skills: Skill[];

  encrypted: string;

  owner: Owner;

  tenant: string;

  employment_type: string;
  location: string;

  published: boolean;
  close_date: string | null;   // ISO date string
  created_at: string;          // ISO date string
  last_viewed?: string | null; // ISO date string

  views_count?: number;

  workflow?: Workflow;

  invite_via_application_form: boolean;
  invite_via_email: boolean;

  emails: string[];

  application_ids: string[] | null;
}

export interface JobsState {
  jobs: Job[];
  publishedJobs: Job[];
  unpublishedJobs: Job[];
  publishedCount: number;
  unpublishedCount: number;
  activeTab: string;
  selectedJob: JobDetail | null;
  loading: boolean;
  error: string | null;
  pagination: JobsPagination;
  hasMore: boolean;
  isTabLoading: boolean;
  filters: {
    title: string,
    experience: string,
    employmentType: string,
    location: string,
    owner_name: string,
    closeDate: string,
    closeDateTo: string,

  }
  jobNameList: JobNameItem[];
  jobNameListLoading: boolean;
  jobNameListPage: number;
  jobNameListNext: string | null;
  jobNameListSearch: string;
}
export interface SharedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;

  contact?: number | null;
  state?: string | null;
  country?: string | null;
  user_type?: string | null;
  profile_pic?: string | null;
}
export interface UserRole {
  id: number;
  name: string;
  tenant: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}
export interface Owner {
  id: string;
  name: string;
  email: string;
  role: UserRole;

  contact?: number | null;
  state?: string | null;
  country?: string | null;
  user_type?: string | null;
  profile_pic?: string | null;
}

export interface Skill {
  label: string;
  value: string;
}

export interface Workflow {
  id: string;
  name: string;
}

export type JobNameItem = {
  id: string;
  title: string;
};

export type JobNamesListApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: JobNameItem[];
};



