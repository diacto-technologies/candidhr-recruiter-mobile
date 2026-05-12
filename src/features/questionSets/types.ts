export interface QuestionSet {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
  is_default?: boolean;
  tenant?: string;
  created_by?: string;
  updated_by?: string;
  deleted_by?: string | null;
}

export interface QuestionSetListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: QuestionSet[];
}

/** A question row under a question set (GET /questionnaire/questions/). */
export interface ScreenQuestion {
  id: string;
  text: string;
  type: string;
  time_limit: number;
  created_at?: string;
  is_deleted?: boolean;
  updated_at?: string;
  is_default?: boolean;
  tenant?: string;
  question_set?: string;
  created_by?: string;
  deleted_by?: string | null;
  updated_by?: string | null;
}

export interface SetQuestionsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ScreenQuestion[];
}

export interface SetQuestionsState {
  items: ScreenQuestion[];
  page: number;
  totalCount: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  /** Last successfully loaded set id (server id). */
  questionSetId: string | null;
}

export interface QuestionSetsState {
  items: QuestionSet[];
  page: number;
  totalCount: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  /** Questions for the selected screening set (paginated). */
  setQuestions: SetQuestionsState;
  createQuestionSetLoading: boolean;
  createQuestionSetError: string | null;
  /** Populated after POST success so UI can select the new set; clear with `clearLastCreatedQuestionSet`. */
  lastCreatedQuestionSet: QuestionSet | null;
  createScreenQuestionLoading: boolean;
  createScreenQuestionError: string | null;
  /** Trash button loading while PATCH soft-delete is in flight (by question id). */
  deleteScreenQuestionPendingIds: Record<string, boolean>;
}
