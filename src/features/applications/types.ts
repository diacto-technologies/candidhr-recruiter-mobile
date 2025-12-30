export interface ApplicationsState {
  applications: Application[];
  applicationResponses: ApplicationResponseItem[];
  resumeScreeningResponses?: ResumeScreeningResponseItem[];
  assessmentDetailedReport: AssessmentDetailedReport | null;
  assessmentLogs: AssessmentLog[];
  assessmentReport: AssessmentReport | null
  selectedApplication: Application | null;
  personalityScreeningList: ScreeningAssessment[];
  personalityScreeningResponses: PersonalityScreeningResponse[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  filters: {
    name: string,
    email: string,
    appliedFor: string,
    contact: string,
    sort: string
  },
}

export interface CreateApplicationRequest {
  jobId: string;
  applicantName: string;
  applicantEmail: string;
  resume?: string;
  coverLetter?: string;
}

export interface UpdateApplicationStatusRequest {
  id: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
}

export interface Application {
  id: string;

  candidate: {
    id: string;
    name: string;
    email: string;
    contact?: string | number | null;
    profile_pic?: string | null; // ✅ allows null
    location?: {
      city?: string | null;
      state?: string | null;
      country?: string | null;
      country_code?: string | null;
    };
  };

  job: {
    id: string;
    title: string;
    score_weight: {
      id: string | null;
      skills: string;
      work_experience: string;
      projects: string;
      education: string;
      certifications: string;
      user: string;
      tenant: string;
    },
  };

  resume?: ResumeData;
  applied_at: string;
  last_updated?: string;
  status: string;
  workflow_status?: string;
  source?: string;

  // list-view fallbacks
  cover_letter?: string | null;

  [key: string]: any;
}

export interface ResumeScore {
  id: number;
  ai_score: boolean;
  skills_score: string;
  work_exp_score: string;
  projects_score: string;
  education_score: string;
  certifications_score: string;
  overall_score: string;
  feedback: string | null;
  job: string;
  user: string;
  tenant: string;
  score_weight: string;
}

/* =======================
   Resume Core Types
======================= */

export interface ResumeData {
  id: string;
  resume_score: ResumeScore;
  updated_by: string | null;
  name: string;
  resume_json: ResumeJson;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost: string;
  phone_numbers: string;
  personal_website: string;
  websites: string[];
  emails: string;
  date_of_birth: string;
  addresses: ResumeAddress;
  summary: string;
  ai_summary: string | null;
  ai_summary_json: AiSummaryJson | null;
  education: ResumeEducation[];
  work_experience: ResumeWorkExperience[];
  duration_per_work: number[];
  total_duration: number;
  skills: ResumeSkill[];
  skills_matched: ResumeSkill[];
  skill_match_count: number;
  certifications: ResumeCertification[];
  projects: ResumeProject[];
  overall_score: string;
  resume_file: string;
  introduction_video: string | null;
  upload_count: number;
  task_duration_seconds: number;
  completed: boolean;
  task_message: string;
  retries: number;
  created_at: string;
  updated_at: string;
  relevant_experience_in_months: number;
  expected_ctc: number;
  status_text: string;
  approved_at: string | null;
  is_approved: boolean;
  executed_by_workflow: boolean;
  workflow_last_status: string | null;
  has_been_updated_by_workflow: boolean;
  workflow_status_updated_at: string | null;
  is_status_overridden_by_user: boolean;
  tenant: string;
  job: string;
  score_weight: string;
  preference: number;
  approved_by: string | null;
  users_shared_with: string[];
}


export interface ApplicationsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Application[];
}

export interface ApplicationsPagination {
  page: number;
  limit: number;
  total: number;
}

export interface ApplicationsState {
  applications: Application[];
  selectedApplication: Application | null;
  loading: boolean;
  error: string | null;
  pagination: ApplicationsPagination;
  hasMore: boolean;
}

export interface GetApplicationsParams {
  page?: number;
  limit?: number;
  append?: boolean;
  applicantName?: string;
  email?: string;
  contact?: string;
  jobTitle?: string;
  sort?: string;
  jobId?: string;
  reset?: boolean;
}

export interface GetApplicationsSagaAction {
  type: string;
  payload?: {
    page?: number;
    limit?: number;
    jobId?: string;
    append?: boolean;
  };
}

// types.ts
export interface ApplicationDetailResponse {
  id: string;
  candidate: {
    id: string;
    name: string;
    email: string;
    contact?: string | null;
    profile_pic?: string | null;
    location?: {
      city?: string | null;
      state?: string | null;
      country?: string | null;
      country_code?: string | null;
    };
  };

  job: {
    id: string;
    title: string;
  };

  resume?: any; // You can expand this later if needed

  applied_at: string;
  last_updated: string;
  status: string; // "applied"
  workflow_status: string;
  source?: string;
}

export interface Criteria {
  id: string;
  question: string;
  response_type: "radio" | "checkbox" | "text" | "dropdown";
  options: string[];
  expected_response: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  job: string;
  tenant: string;
  owner: string;
  deleted_by: string | null;
}

export interface ApplicationResponseItem {
  id: string;
  application: {
    id: string;
    name: string;
    status: string;
    applied_at: string;
  };
  criteria: Criteria;
  response: string;
}

export interface ApplicationResponsesApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApplicationResponseItem[];
}

export interface GetApplicationResponsesParams {
  application_id: string;
  job_id: string;
}

export interface ResumeScreeningQuestion {
  id: string;
  text: string;
  type: "audio" | "video" | "text";
  time_limit: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  is_default: boolean;
  tenant: string;
  question_set: string | null;
  created_by: string;
  updated_by: string | null;
  deleted_by: string | null;
}

export interface ResumeScreeningResponseItem {
  id: string;
  question: ResumeScreeningQuestion;
  text: string | null;
  audio_file: string | null;
  video_file: string | null;
  video_thumbnail: string | null;
  audio_analysis: any[];
  video_analysis: any | null;
  transcription_segments: any | null;
  duration: number;
  type: "audio" | "video" | "text";
  screening_type: string;
  screening_id: string;
  submitted_at: string;
  application: string;
}

export interface ResumeScreeningApiResponse {
  results: ResumeScreeningResponseItem[];
}

export interface ResumeJson {
  name: string;
  emails: string[];
  skills: ResumeSkill[];
  summary: string;
  projects: ResumeProject[];
  websites: string[];
  addresses: ResumeAddress;
  education: ResumeEducation[];
  dateOfBirth: string;
  phoneNumbers: string | null;
  certifications: ResumeCertification[];
  workExperience: ResumeWorkExperience[];
}

export interface ResumeSkill {
  name: string;
  relevance: string;
  relevance_score: number;
}

export interface ResumeProject {
  name: string;
  relevance: string;
  description: string;
  relevance_score: number;
}

export interface ResumeAddress {
  city: string;
  state: string;
  country: string;
  country_code: string;
}

export interface ResumeEducation {
  cgpa: number | null;
  degree: string;
  school: string;
  endDate: string | null;
  percent: number | null;
  relevance: string;
  startDate: string | null;
  relevance_score: number;
}

export interface ResumeCertification {
  name: string;
  relevance: string;
  description: string;
  relevance_score: number;
}

export interface ResumeWorkExperience {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  relevance: "low" | "medium" | "high";
  relevance_score: number;  // 0–10 scale
}

export interface AiSummaryJson {
  notes: string[];
  summary: string;
  match_score: number;
  key_insights: string[];
  last_company: string;
  questionnaire: AiQuestionnaire;
  matched_skills: string[];
  missing_skills: string[];
  highest_education: string;
  last_position_held: string;
  project_highlights: string[];
  job_readiness_score: number;
  potential_red_flags: string[];
  relevant_experience: string[];
  top_relevant_skills: string[];
  low_relevance_skills: string[];
  internship_experience: string;
  notable_certifications: string[];
  total_years_experience: number;
  recruiter_recommendation: string;
  education_relevance_score: number;
}

export interface AiQuestionnaire {
  skill_based: string[];
  project_based: string[];
  experience_based: string[];
}

export interface AssessmentLog {
  id: string;
  status_text: string;
  updated_at: string | null;
  assigned_at: string;
  job_title: string;
  assessments_count: number;
  updated_by: string | null;
  workflow_last_status: string | null;
  workflow_status_updated_at: string | null;
}

export interface AssessmentLogApiResponse {
  assessmentlogs: AssessmentLog[];
}

export interface AssessmentTimeline {
  assigned_at: string;
  link_opened: boolean;
  link_opened_at: string | null;
  started: boolean;
  started_at: string | null;
  completed: boolean;
  completed_at: string | null;
  status_text: string;
  approved_at: string | null;
  updated_at: string | null;
  updated_by: string | null;
  approved_by: string | null;
  workflow_status_updated_at: string | null;
  workflow_last_status: string | null;
}

export interface AssessmentResult {
  question_count: number;
  correct: number;
  wrong: number;
  percentage: number;
}

export interface AssessmentItem {
  id: string;
  name: string;
  type: string;
  result: AssessmentResult;
}

export interface AssessmentReport {
  id: string;
  timeline: AssessmentTimeline;
  assessments: AssessmentItem[];
}

export interface AssessmentReportApiResponse {
  assessmentlog: AssessmentReport;
}


// applications/types.ts

export interface DetailedAssessment {
  id: string;
  title: string;
  total_question: number;
  duration: number;
  type: string;
  started_at: string;
  correct: number;
  wrong: number;
  percentage: number;
}

export interface AssessmentDifficulty {
  id: number;
  difficulty: string;
  multiplier: number;
}

export interface AssessmentQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: AssessmentDifficulty;
  time_limit: number;
}

export interface AssessmentTestCase {
  input: string;
  passed: boolean;
  stderr: string;
  stdout: string;
  message: string | null;
  compile_output: string;
  status_description: string;
}

export interface AssessmentSubmission {
  id: string;
  question: AssessmentQuestion;
  test_cases: AssessmentTestCase[];
  code: string;
  language: string;
  status: string;
  submitted_at: string;
  is_submitted: boolean;
  assessment: string;
  assessment_log: string;
}

export interface AssessmentResultSummary {
  id: string;
  assessment_type: string;
  score: number;
  correct_answer_count: number;
  wrong_answer_count: number;
  proctoring?: Proctoring;
}

export interface QuestionDifficulty {
  id: number;
  difficulty: string;
  multiplier: number;
}

export interface AssessmentQuestion {
  id: string;
  difficulty: QuestionDifficulty;
  text: string;
  html_content: string;
  type: "text" | "mcq" | "multiple";
  domain: string | null;
  choices: string; // JSON string from API
  photo: string | null;
  query: string | null;
  created_at: string;
  updated_at: string;
  time_limit: number;
  points: number;
  tenant: string;
  created_by: string;
  updated_by: string | null;
  question_set: string[];
}

export interface AssessmentAnswer {
  id: string;
  question: AssessmentQuestion;
  duration: number;
  submitted_at: string;
  text: string;
  type: string;
  assessment_type: string;
  correct: boolean;
  selected_choice: any[];
  query: string | null;
  started_at: string;
  tenant: string;
  job: string;
  application: string;
  assessment: string;
  prebuilt_assessment: string | null;
  assessment_log: string;
}

export interface AssessmentDetailedReport {
  assessment: DetailedAssessment;
  answers: AssessmentAnswer[];
  submissions: AssessmentSubmission[];
  result: AssessmentResultSummary;
}

export interface AssessmentDetailedReportApiResponse {
  assessment_report: AssessmentDetailedReport;
}
export interface Proctoring {
  id: string;
  mouse_leave_count: number;
  fullscreen_exit_count: number;
  tab_switch_count: number;
  assessment_submit: boolean;
  message: string | null;
  video_file: string | null;
  video_thumbnail: string | null;
  gaze_snapshots: any[]; // can be refined later if structure is known
}

export interface ScreeningAssessment {
  id: string;

  application: Application;
  job: Job;

  questions: number;
  question_set: string;

  random_questions: boolean;
  random_questions_count: number;

  assigned_at: string;
  assigned_by: User;

  started_at: string | null;
  completed: boolean;
  completed_at: string | null;
  duration: number | null;

  approved_at: string | null;
  approved_by: User | null;
  is_approved: boolean;

  status_text: ScreeningStatus;

  expired_at: string;
  revoked: boolean;
  revoked_by: User | null;

  feedback: string | null;
  feedback_status: boolean;

  executed_by_workflow: boolean;
  has_been_updated_by_workflow: boolean;
  is_status_overridden_by_user: boolean;

  key: string;
  screening_link: string;

  link_opened: boolean;
  link_opened_at: string | null;

  preference: string | null;
  summary: ScreeningSummary | null;

  tenant: string;

  updated_at: string | null;
  updated_by: User | null;

  users_shared_with: User[];

  workflow_last_status: string | null;
  workflow_status_updated_at: string | null;
}

export interface ScreeningSummary {
  id: string;
  articulation_score: number;
  communication_score: number;
  response_quality_score: number;
  language_score: number;
  logical_thinking_score: number;
  technical_score: number | null;
  overall_score: number;
  communication_exp: string;
  logical_thinking_exp: string;
  articulation_exp: string;
  language_exp: string;
  response_quality_exp: string;
  questions_exp: string;
  technical_question_exp: string;
  created_at: string;
  updated_at: string;
  tenant: string;
  application: string;
  screening: string;
}

export interface AssessmentLog {
  id: string;
  status_text: string;
  updated_at: string | null;
  assigned_at: string;
  job_title: string;
  assessments_count: number;
  updated_by: string | null;
  workflow_last_status: string | null;
  workflow_status_updated_at: string | null;
}

export interface AssessmentLogApiResponse {
  assessmentlogs: AssessmentLog[];
}

export interface AssessmentTimeline {
  assigned_at: string;
  link_opened: boolean;
  link_opened_at: string | null;
  started: boolean;
  started_at: string | null;
  completed: boolean;
  completed_at: string | null;
  status_text: string;
  approved_at: string | null;
  updated_at: string | null;
  updated_by: string | null;
  approved_by: string | null;
  workflow_status_updated_at: string | null;
  workflow_last_status: string | null;
}

export interface AssessmentResult {
  question_count: number;
  correct: number;
  wrong: number;
  percentage: number;
}

export interface AssessmentItem {
  id: string;
  name: string;
  type: string;
  result: AssessmentResult;
}

export interface AssessmentReport {
  id: string;
  timeline: AssessmentTimeline;
  assessments: AssessmentItem[];
}

export interface AssessmentReportApiResponse {
  assessmentlog: AssessmentReport;
}

export interface DetailedAssessment {
  id: string;
  title: string;
  total_question: number;
  duration: number;
  type: string;
  started_at: string;
  correct: number;
  wrong: number;
  percentage: number;
}

export interface AssessmentDifficulty {
  id: number;
  difficulty: string;
  multiplier: number;
}

export interface AssessmentQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: AssessmentDifficulty;
  time_limit: number;
}

export interface AssessmentTestCase {
  input: string;
  passed: boolean;
  stderr: string;
  stdout: string;
  message: string | null;
  compile_output: string;
  status_description: string;
}

export interface AssessmentSubmission {
  id: string;
  question: AssessmentQuestion;
  test_cases: AssessmentTestCase[];
  code: string;
  language: string;
  status: string;
  submitted_at: string;
  is_submitted: boolean;
  assessment: string;
  assessment_log: string;
}

export interface AssessmentResultSummary {
  id: string;
  assessment_type: string;
  score: number;
  correct_answer_count: number;
  wrong_answer_count: number;
  proctoring?: Proctoring;
}

export interface AssessmentDetailedReport {
  assessment: DetailedAssessment;
  answers: AssessmentAnswer[];
  submissions: AssessmentSubmission[];
  result: AssessmentResultSummary;
}

export interface AssessmentDetailedReportApiResponse {
  assessment_report: AssessmentDetailedReport;
}

export interface Proctoring {
  id: string;
  mouse_leave_count: number;
  fullscreen_exit_count: number;
  tab_switch_count: number;
  assessment_submit: boolean;
  message: string | null;
  video_file: string | null;
  video_thumbnail: string | null;
  gaze_snapshots: any[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  profile_pic?: string | null;
  user_type?: string | null;
}

export interface Role {
  id: number;
  name: string;
  tenant: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}


export interface Location {
  city: string;
  state: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  contact: string;
  city: string;
  state: string;
  location: Location;
  profile_pic: string | null;
  github: string;
  linkedin: string;
  notice_period_in_months: number | null;
  current_ctc: number | null;
  last_increment: number | null;
  updated_at: string;
}
export interface Skill {
  label: string;
  value: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  jd_html: string;

  employment_type: string;
  experience: number;
  min_experience: number;
  max_experience: number;

  location: string;
  city: string;
  state: string;
  country: string;

  must_have_skills: Skill[];

  published: boolean;
  invite_via_application_form: boolean;
  invite_via_email: boolean;

  applicants_count: number;
  applicants_today_count: number;

  created_at: string;
  updated_at?: string;

  owner: User & { role: Role };

  users_shared_with: User[];

  workflow: {
    id: string;
    name: string;
  };

  tenant: string;
}
export type ScreeningStatus =
  | "Completed"
  | "Pending"
  | "Expired"
  | "In Progress"
  | string;

export interface AudioAnalysis {
  id: string;
  analysis_date: string;
  transcription: string;
  field?: string;
  value?: number | string | null;
}

export interface VideoAnalysis {
  id: string;
  analysis_date: string,
  articulation_score: number;
  articulation_explanation: string;
  clarity_score: number;
  clarity_explanation: string;
  logical_thinking_score: number;
  logical_thinking_explanation: string;
  response_quality_score: number;
  response_quality_explanation: string;
  language_proficiency_score: number;
  language_proficiency_explanation: string;
  technical_correctness_score: number;
  audio_analyses: AudioAnalysis[];
  transcription_segments?: TranscriptionSegment[];
}

export interface PersonalityQuestion {
  id: string;
  text: string;
  type: "text" | "video";
  time_limit: number;
  created_at: string,
  updated_at: string,
  created_by: string,
}

export interface TranscriptionWord {
  start: number;
  end: number;
  word: string;
}

export interface TranscriptionSegment {
  start: number;
  end: number;
  text: string;
  words: TranscriptionWord[];
}


export interface PersonalityScreeningResponse {
  id: string;
  screening_id: string;
  application: string;
  question: PersonalityQuestion;
  video_file: string | null;
  video_thumbnail: string | null;
  audio_file: string | null;
  duration: number;
  detected_language: string;
  transcription_segments?: TranscriptionSegment[];
  video_analysis: VideoAnalysis;
  audio_analysis: AudioAnalysis[] | null;
  started: string,
  created_at: string;
  submitted_at: string;
}

