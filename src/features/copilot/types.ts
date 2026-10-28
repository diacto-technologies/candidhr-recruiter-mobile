export interface CopilotSessionItem {
  id: string | number;
  title?: string;
  query?: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CopilotSessionsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CopilotSessionItem[];
}

export interface CopilotSuggestionsResponse {
  suggestions: string[];
}

export interface CopilotChatStreamPayload {
  query: string;
  session_id?: string;
}

export interface CopilotCandidateResult {
  candidate_id: string;
  application_id: string;
  name: string;
  match_score: number | null;
  resume_score?: number | null;
  evidence?: string[];
  rationale?: string;
  city?: string | null;
  experience_years?: number | null;
  notice_period_months?: number | null;
  skills?: string[];
  application_status?: string | null;
  overall_score?: number | null;
  applied_job_title?: string | null;
  current_ctc?: number | null;
  expected_ctc?: number | null;
  ai_summary?: string | null;
  email?: string | null;
  profile_pic?: string | null;
  [key: string]: unknown;
}

export interface CopilotJobResolution {
  query: string;
  confidence: string;
  matched_titles: string[];
  job_count: number;
}

export interface CopilotResultPayload {
  session_id: string;
  intent: string;
  result_type: string;
  filters?: Record<string, unknown>;
  results: CopilotCandidateResult[];
  result_total: number;
  result_shown: number;
  result_offset: number;
  suggested_actions?: string[];
  message?: string;
  job_resolution?: CopilotJobResolution;
}

export interface CopilotSessionEvent {
  type: 'session';
  session_id: string;
  title: string;
}

export interface CopilotStatusEvent {
  type: 'status';
  step: 'routing' | 'resolving_job' | 'searching' | string;
  message: string;
}

export interface CopilotResultEvent extends CopilotResultPayload {
  type: 'result';
}

export interface CopilotDoneEvent {
  type: 'done';
}

export interface CopilotErrorEvent {
  type: 'error';
  message: string;
}

export type CopilotStreamEvent =
  | CopilotSessionEvent
  | CopilotStatusEvent
  | CopilotResultEvent
  | CopilotDoneEvent
  | CopilotErrorEvent;

export interface CopilotStatusStep {
  step: string;
  message: string;
  timestamp: number;
}

export interface CopilotChatStreamState {
  query: string | null;
  sessionId: string | null;
  sessionTitle: string | null;
  isStreaming: boolean;
  isComplete: boolean;
  currentStep: string | null;
  statusMessage: string | null;
  statusSteps: CopilotStatusStep[];
  result: CopilotResultPayload | null;
  candidates: CopilotCandidateResult[];
  error: string | null;
}

export interface CopilotSessionMessage {
  id: string;
  role: 'user' | 'assistant' | string;
  content: string;
  intent?: string | null;
  filters?: Record<string, unknown> | null;
  results?: CopilotCandidateResult[] | null;
  suggested_actions?: string[] | null;
  created_at: string;
  [key: string]: unknown;
}

export interface CopilotSessionDetailResponse {
  id: string;
  title: string;
  created_at: string;
  last_active_at?: string;
  messages: CopilotSessionMessage[];
  [key: string]: unknown;
}

export interface CopilotState {
  sessions: CopilotSessionItem[];
  sessionsCount: number;
  sessionsNext: string | null;
  sessionsPrevious: string | null;
  sessionsLoading: boolean;
  sessionsError: string | null;

  suggestions: string[];
  suggestionsLoading: boolean;
  suggestionsError: string | null;

  stream: CopilotChatStreamState;

  currentSession: CopilotSessionDetailResponse | null;
  currentSessionLoading: boolean;
  currentSessionError: string | null;
}
