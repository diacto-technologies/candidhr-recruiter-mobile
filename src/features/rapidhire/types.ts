export interface RapidhireCandidate {
  id: string;
  application: string;
  candidate_name: string;
  candidate_email: string;
  applied_at: string;
  application_status: string;
  source: string;
  resume_score: number | null;
  interview_status: string;
  recording_url: string | null;
  interview_invite_sent_at: string | null;
  interview_invite_count: number;
  interview_invite_expires_at: string | null;
  interview_invite_url: string | null;
  status_label?: string;
  job?: { id: string; title: string };
  candidate?: {
    id?: string;
    profile_pic?: string | null;
    email?: string;
    name?: string;
  };
  name?: string;
  [key: string]: any;
}

export interface RapidhireCandidatesSummaryCounts {
  total: number;
  completed: number;
  in_progress: number;
  not_started: number;
}

export interface RapidhireCandidatesSummary {
  counts: RapidhireCandidatesSummaryCounts;
  enabled: boolean;
  start_mode: string;
}

export interface RapidhireCandidatesResponse {
  results: RapidhireCandidate[];
  count: number;
  has_more: boolean;
  summary: RapidhireCandidatesSummary;
}

export interface GetRapidhireCandidatesParams {
  jobId: string;
  page?: number;
  limit?: number;
  search?: string;
  name?: string;
  append?: boolean;
  reset?: boolean;
}

// ─── Rapidly Interview Report Types ──────────────────────────────────────────

export interface RapidlyInterviewQuestion {
  text: string;
  order: number;
}

export interface RapidlyInterviewTurn {
  role: 'ai' | 'candidate';
  text: string;
}

export interface RapidlyInterviewTimelineWord {
  w: string;
  start: number;
  end: number;
}

export interface RapidlyInterviewTimelineItem {
  role: 'ai' | 'candidate';
  text: string;
  startMs: number;
  endMs: number;
  words?: RapidlyInterviewTimelineWord[];
}

export interface RapidlyInterviewSkillDetail {
  level?: string;
  score?: number;
  feedback?: string;
  description?: string;
}

export interface RapidlyInterviewAssessmentDimension {
  key: string;
  band: string;
  label: string;
  score: number;
  verdict?: string;
  rationale?: string;
  confidence?: string;
  evidence?: Array<{ quote: string; questionRef: number }>;
}

export interface RapidlyInterviewAssessment {
  scale?: string;
  overall?: {
    band: string;
    score: number;
  };
  summary?: string;
  version?: number;
  delivery?: {
    total_time_sec?: number;
    speaking_time_sec?: number;
    word_count?: number;
    words_per_minute?: number;
    [key: string]: any;
  };
  language?: string;
  dimensions?: RapidlyInterviewAssessmentDimension[];
  engine_key?: string;
  generated_at?: string;
  engine_version?: string;
  language_label?: string;
  target_language_used?: boolean;
}

export interface RapidlyInterviewReportData {
  turns: RapidlyInterviewTurn[];
  language?: string;
  questions: RapidlyInterviewQuestion[];
  transcript?: string;
  report_type?: string;
  skills?: Record<string, RapidlyInterviewSkillDetail>;
  assessment?: RapidlyInterviewAssessment;
  [key: string]: any;
}

// ─── Proctoring Types ─────────────────────────────────────────────────────────

export interface ProctoringDeviceInfo {
  language?: string;
  platform?: string;
  timezone?: string;
  viewport?: string;
  user_agent?: string;
  screen_count?: number;
}

export interface ProctoringDeviceLabel {
  headline: string;
  details: string[];
  known: boolean;
}

export interface ProctoringCapabilities {
  camera?: string;
  fullscreen?: string;
  microphone?: string;
  screen_layout?: string;
  window_visibility?: string;
}

export interface ProctoringByQuestion {
  index: number;
  label: string;
  count: number;
}

export interface ProctoringObserved {
  key: string;
  icon: string;
  state: string;
  sentence: string;
  where?: string;
  notable: boolean;
  occurrences: number;
  total_seconds?: number;
  longest_seconds?: number;
  questions: number[];
}

export interface ProctoringData {
  session_id?: string;
  consent_given_at?: string;
  device?: ProctoringDeviceInfo;
  device_label?: ProctoringDeviceLabel;
  capabilities?: ProctoringCapabilities;
  started_at?: string;
  last_signal_at?: string;
  signal_count?: number;
  observed_count?: number;
  observed_questions?: number;
  total_questions?: number;
  by_question?: ProctoringByQuestion[];
  observed?: ProctoringObserved[];
  clear_names?: string[];
  clear_count?: number;
  unavailable?: string[];
  gap_count?: number;
  gap_note?: string | null;
}

// ─── Report Response ──────────────────────────────────────────────────────────

export interface RapidlyInterviewReportResponse {
  has_interview: boolean;
  report_type?: string;
  status?: string;
  score?: number | null;
  cefr_level?: string | null;
  recording_url?: string | null;
  thumbnail_url?: string | null;
  candidate_name?: string | null;
  attempt_id?: string | null;
  updated_at?: string | null;
  report?: RapidlyInterviewReportData | null;
  timeline?: RapidlyInterviewTimelineItem[];
  simulated?: boolean;
  simulation_persona?: string | null;
  duration_seconds?: number;
  proctoring?: ProctoringData | null;
  [key: string]: any;
}

export interface RapidhireState {
  candidates: RapidhireCandidate[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    count: number;
    hasMore: boolean;
  };
  summary: RapidhireCandidatesSummary | null;

  // Interview Report state
  interviewReport: RapidlyInterviewReportResponse | null;
  loadingInterviewReport: boolean;
  interviewReportError: string | null;
}
