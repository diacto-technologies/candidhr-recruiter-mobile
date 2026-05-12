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
  /** If true, send a status-update email to the candidate when application status changes. */
  email_candidate?: boolean;
  /** API field on GET job detail (maps to email_candidate in normalize). */
  new_applicant_notify?: boolean;
  workflow_enabled?: boolean;
  workflow_version?: string;
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

/** GET /job/v1/jobs/:id/ returns the job object; some legacy endpoints wrap `{ job }`. */
export type JobDetailApiResponse = Job | { job: Job };

/** Resume score weights sent with job create (API uses work_experience / certifications). */
export interface JobScoreWeightPayload {
  skills: number;
  work_experience: number;
  projects: number;
  education: number;
  certifications: number;
}

// Request payloads
/** POST /job/v1/:id/duplicate/ */
export interface DuplicateJobRequest {
  title: string;
  location: string;
  location_id: string;
  copy_shared_users: boolean;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  jd_html?: string;
  location: string;
  location_id?: string;
  employment_type: string;
  min_experience?: number | null;
  max_experience?: number | null;
  experience?: number | null;
  must_have_skills?: Array<{ label: string; value: string }>;
  workflow_id?: string;
  close_date?: string;
  published?: boolean;
  resume_screening_enabled?: boolean;
  salary_currency?: string;
  min_salary?: number;
  max_salary?: number;
  score_weight?: JobScoreWeightPayload;
  invite_via_application_form?: boolean;
  invite_via_email?: boolean;
  emails?: string[];
}

export interface UpdateJobRequest extends Partial<CreateJobRequest> {
  id: string;
}

/** PATCH /job/v1/jobs/:id/ — job create wizard “Save & Continue” when editing an existing job. */
export type PatchJobDetailsRequest = CreateJobRequest & { jobId: string };

/** PATCH /job/v1/jobs/:id/ — toggle listing visibility (publish / unpublish). */
export interface PatchJobPublishedPayload {
  jobId: string;
  published: boolean;
}

/** PATCH /job/v1/jobs/:id/ — soft-delete (`is_deleted`, `deleted_by` from profile). */
export interface SoftDeleteJobPayload {
  jobId: string;
}

export interface GetJobsParams {
  page?: number;
  limit?: number;
  published?: boolean;
  favourites?: boolean;
  idIn?: string;
  title?: string;
  experience?: string;
  employmentType?: string;
  location?: string;
  createdBy?: string;
  closeDate?: string;
  orderBy?: string;
  append?: boolean;
  /**
   * Client-only: used to ignore stale responses per tab.
   */
  requestId?: number;
  /**
   * Client-only flag: when true, reducer should update counts only
   * and must NOT overwrite the tab job list.
   */
  onlyCount?: boolean;
}

export interface GenerateJobDescriptionRequest {
  job_title: string;
  employment_type: string;
  min_experience: number;
  max_experience: number;
  /**
   * Selected skills to guide AI generation.
   * API accepts string list (e.g. ["Python","Django"]).
   */
  must_have_skills?: string[];
  user_prompt?: string;
}

export interface GenerateJobDescriptionResponse {
  job_title: string;
  must_have_skills: Array<{ label: string; value: string }>;
  job_description: string;
  job_desc_html: string;
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

  /** From GET /job/v1/jobs/:id/ — used to hydrate job create UI */
  location_detail?: {
    id: string;
    place_id?: string | null;
    display_name: string;
    name?: string;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    latitude?: string | null;
    longitude?: string | null;
    location_type?: string;
  } | null;
  score_weight?: {
    skills?: string | number;
    work_experience?: string | number;
    projects?: string | number;
    education?: string | number;
    certifications?: string | number;
  } | null;
  resume_screening_enabled?: boolean;
  salary_currency?: string | null;
  min_salary?: string | number | null;
  max_salary?: string | number | null;
  is_salary_visible?: boolean;
  /** If true, send a status-update email to the candidate when application status changes. */
  email_candidate?: boolean;
  /** GET /job/v1/jobs/:id/ — same meaning as email_candidate; API field name. */
  new_applicant_notify?: boolean;
  workflow_enabled?: boolean;
  workflow_version?: string;
}

/** Dispatched to saga: POST /workflow/assign/:jobId/; API returns `{ message }` — merge uses `job`. */
export interface AssignWorkflowToJobPayload {
  jobId: string;
  workflowId: string;
  workflowName: string;
  invite_via_application_form: boolean;
  invite_via_email: boolean;
  emails: string[];
  /** Local-only merge when POST assign does not return job; optional UI toggle not in assign body. */
  email_candidate?: boolean;
  job: Job;
}

/** Filter criteria draft from the job-create application form (maps to bulk criteria API). */
export interface JobFilterCriteriaPayload {
  questionText: string;
  formatId: string;
  formatLabel: string;
  options: Array<{ id: string; text: string }>;
  correctOptionIds: string[];
}

/** PATCH job with collaborator ids (team invite step). */
export interface PatchJobUsersSharedPayload {
  jobId: string;
  usersSharedWithIds: string[];
}

/** Row from GET /job/:jobId/criteria/ */
export interface JobCriteriaApiRow {
  id: string;
  question: string;
  response_type: string;
  options: string[];
  expected_response: string;
  job?: string;
  [key: string]: unknown;
}

export interface JobCriteriaListApiResponse {
  success?: boolean;
  data?: JobCriteriaApiRow[];
}

/** Question embedded in GET resume-screening-preferences */
export interface ResumeScreeningQuestionApi {
  id: string;
  text: string;
  type: string;
  time_limit?: number;
  [key: string]: unknown;
}

/** GET /resume_parser/resume-screening-preferences/?job_id= */
export interface ResumeScreeningPreferencesApi {
  id?: number;
  job: string;
  currency?: string | null;
  max_retries?: number;
  max_applicants?: number;
  include_github?: string;
  include_linkedin?: string;
  include_personal_website?: string;
  include_profile_pic?: string;
  include_intro_video?: string;
  include_notice_period?: string;
  include_current_ctc?: string;
  include_expected_ctc?: string;
  include_relevant_experience?: string;
  include_questions?: boolean;
  random_questions?: boolean;
  random_questions_count?: number | null;
  questions?: ResumeScreeningQuestionApi[];
  [key: string]: unknown;
}

/** Normalized GET bundle for Application form step (preferences + criteria). */
export interface ApplicationFormDraftData {
  jobId: string;
  preferences: ResumeScreeningPreferencesApi | null;
  criteria: JobCriteriaApiRow[];
}

/** Payload for POST/PATCH resume-screening-preferences + POST criteria bulk (wizard step 2). */
export interface SubmitJobApplicationFormStepPayload {
  jobId: string;
  /** When set (loaded from draft), saga PATCHes this row instead of POSTing a new one. */
  screeningPreferencesId?: number;
  maxRetries: number;
  maxApplicants: number;
  relevantExperience: string;
  noticePeriod: string;
  expectedSalary: string;
  currentSalary: string;
  profilePicture: string;
  introVideo: string;
  includeGithub: string;
  includeLinkedIn: string;
  includeWebsite: string;
  /** ISO currency code when current salary is optional/mandatory; omit or null when off. */
  salaryCurrency?: string | null;
  screeningQuestionIds: string[];
  filterCriteria: JobFilterCriteriaPayload[];
}

export type JobCriteriaBulkResponseType = "radio" | "checkbox" | "text" | "dropdown";

export interface JobCriteriaBulkItem {
  criteria_id: string | null;
  job_id: string;
  question: string;
  response_type: JobCriteriaBulkResponseType;
  options: string[];
  expected_response: string;
}

export interface JobsState {
  publishedJobs: Job[];
  unpublishedJobs: Job[];
  favouriteJobs: Job[];
  favouriteJobIds: string[];
  publishedCount: number;
  unpublishedCount: number;
  favouritesCount: number;
  activeTab: string;
  selectedJob: JobDetail | null;
  /**
   * Global loading used by job-detail + mutations (not the tab lists).
   */
  loading: boolean;
  error: string | null;
  /** Job-create wizard: application form step (preferences + criteria) submit in flight. */
  applicationFormSubmitLoading: boolean;
  applicationFormSubmitError: string | null;
  /**
   * Tab list loading (separate from `loading`).
   */
  publishedListLoading: boolean;
  unpublishedListLoading: boolean;
  favouritesListLoading: boolean;
  generateDescriptionLoading: boolean;
  /**
   * Tab "full refresh" shimmer (append=false).
   */
  publishedIsTabLoading: boolean;
  unpublishedIsTabLoading: boolean;
  favouritesIsTabLoading: boolean;
  /**
   * Latest request guard per tab to prevent slow API races.
   */
  latestPublishedRequestId: number;
  latestUnpublishedRequestId: number;
  latestFavouritesRequestId: number;

  publishedPagination: JobsPagination;
  unpublishedPagination: JobsPagination;
  favouritesPagination: JobsPagination;
  publishedHasMore: boolean;
  unpublishedHasMore: boolean;
  favouritesHasMore: boolean;
  filters: {
    title: string;
    experience: string;
    employmentType: string;
    location: string;
    owner_name: string;
    closeDate: string;
    closeDateTo: string;
    sortBy: string;
    sortDir: "asc" | "desc";
    orderBy: string;
  };
  jobNameList: JobNameItem[];
  jobNameListLoading: boolean;
  jobNameListPage: number;
  jobNameListNext: string | null;
  jobNameListSearch: string;
  /** Latest AI-generated JD; cleared after the screen consumes it. */
  generatedJobDescription: GenerateJobDescriptionResponse | null;
  /**
   * Set when POST /job/v1/jobs/ succeeds during the job-create wizard; consume then clear.
   */
  createdJobForWizard: Job | null;
  /** Team invite wizard: PATCH users_shared_with_ids in flight / result. */
  jobUsersSharedSubmitLoading: boolean;
  jobUsersSharedSubmitError: string | null;
  jobUsersSharedSubmitSucceeded: boolean;
  /** GET /job/v1/jobs/:id/ in flight (does not use `loading` — that is for create/update/delete). */
  jobDetailLoading: boolean;
  /** Job id for the in-flight GET job detail request (avoids duplicate fetches). */
  jobDetailRequestJobId: string | null;
  /** PATCH /job/v1/jobs/:id/ (wizard job details save). */
  jobDetailsSaveLoading: boolean;
  /** GET resume preferences + criteria for application form (step 2). */
  applicationFormDraft: ApplicationFormDraftData | null;
  applicationFormDraftLoading: boolean;
  applicationFormDraftError: string | null;
  /** Ignore stale draft responses when `job_id` changes quickly. */
  latestApplicationFormDraftJobId: string | null;
  /** Jobs list: PATCH `published` in flight for this job id (overflow menu). */
  patchJobPublishedLoadingJobId: string | null;
  /** Jobs list: soft-delete PATCH in flight for this job id. */
  softDeleteJobLoadingJobId: string | null;
  /** POST /workflow/assign/:jobId/ in flight (assign workflow modal). */
  assignWorkflowLoadingJobId: string | null;
  assignWorkflowSubmitError: string | null;
  assignWorkflowSubmitSucceeded: boolean;
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



