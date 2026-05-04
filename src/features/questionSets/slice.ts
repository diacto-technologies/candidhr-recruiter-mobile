import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { QuestionSet, QuestionSetsState, ScreenQuestion, SetQuestionsState } from './types';

/** Prefer `next` URL; if missing, infer from DRF-style `count` vs loaded rows. */
function hasMorePages(
  next: string | null | undefined,
  loadedCount: number,
  totalCount: number
): boolean {
  const nextNonEmpty =
    next != null &&
    typeof next === 'string' &&
    next.trim() !== '' &&
    next.toLowerCase() !== 'null';
  if (nextNonEmpty) return true;
  return (
    typeof totalCount === 'number' &&
    totalCount > 0 &&
    loadedCount < totalCount
  );
}

const initialSetQuestionsState: SetQuestionsState = {
  items: [],
  page: 0,
  totalCount: 0,
  hasMore: false,
  loading: false,
  loadingMore: false,
  error: null,
  questionSetId: null,
};

export const questionSetsInitialState: QuestionSetsState = {
  items: [],
  page: 0,
  totalCount: 0,
  hasMore: true,
  loading: false,
  loadingMore: false,
  error: null,
  setQuestions: { ...initialSetQuestionsState },
  createQuestionSetLoading: false,
  createQuestionSetError: null,
  lastCreatedQuestionSet: null,
  createScreenQuestionLoading: false,
  createScreenQuestionError: null,
  deleteScreenQuestionPendingIds: {},
};

const questionSetsSlice = createSlice({
  name: 'questionSets',
  initialState: questionSetsInitialState,
  reducers: {
    fetchQuestionSetsRequest: (
      state,
      action: PayloadAction<{ page: number; append: boolean }>
    ) => {
      state.error = null;
      if (action.payload.append) {
        state.loadingMore = true;
      } else {
        state.loading = true;
      }
    },
    fetchQuestionSetsSuccess: (
      state,
      action: PayloadAction<{
        results: QuestionSet[];
        count: number;
        next: string | null;
        page: number;
        append: boolean;
      }>
    ) => {
      state.loading = false;
      state.loadingMore = false;
      const { results, count, next, page, append } = action.payload;
      state.page = page;
      state.totalCount = count;
      const mergedItems = append ? [...state.items, ...results] : results;
      state.hasMore = hasMorePages(next, mergedItems.length, count);
      state.items = mergedItems;
      state.error = null;
    },
    fetchQuestionSetsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.loadingMore = false;
      state.error = action.payload;
    },
    clearQuestionSetsError: (state) => {
      state.error = null;
    },
    resetQuestionSets: () => questionSetsInitialState,

    fetchSetQuestionsRequest: (
      state,
      action: PayloadAction<{ questionSetId: string; page: number; append: boolean }>
    ) => {
      const { questionSetId, page, append } = action.payload;
      state.setQuestions.error = null;
      if (!append) {
        state.setQuestions.loading = true;
        state.setQuestions.loadingMore = false;
        state.setQuestions.items = [];
        state.setQuestions.questionSetId = questionSetId;
        state.setQuestions.page = 0;
      } else {
        state.setQuestions.loadingMore = true;
      }
    },
    fetchSetQuestionsSuccess: (
      state,
      action: PayloadAction<{
        results: ScreenQuestion[];
        count: number;
        next: string | null;
        page: number;
        append: boolean;
        questionSetId: string;
      }>
    ) => {
      state.setQuestions.loading = false;
      state.setQuestions.loadingMore = false;
      const { results, count, next, page, append, questionSetId } = action.payload;
      state.setQuestions.page = page;
      state.setQuestions.totalCount = count;
      state.setQuestions.questionSetId = questionSetId;
      const mergedItems = append
        ? [...state.setQuestions.items, ...results]
        : results;
      state.setQuestions.hasMore = hasMorePages(next, mergedItems.length, count);
      state.setQuestions.items = mergedItems;
      state.setQuestions.error = null;
    },
    fetchSetQuestionsFailure: (state, action: PayloadAction<string>) => {
      state.setQuestions.loading = false;
      state.setQuestions.loadingMore = false;
      state.setQuestions.error = action.payload;
    },
    removeSetQuestionItem: (state, action: PayloadAction<string>) => {
      state.setQuestions.items = state.setQuestions.items.filter(
        (q) => q.id !== action.payload
      );
      state.setQuestions.totalCount = Math.max(0, state.setQuestions.totalCount - 1);
    },
    clearSetQuestions: (state) => {
      state.setQuestions = { ...initialSetQuestionsState };
    },

    createQuestionSetRequest: (state) => {
      state.createQuestionSetLoading = true;
      state.createQuestionSetError = null;
    },
    createQuestionSetSuccess: (state, action: PayloadAction<QuestionSet>) => {
      state.createQuestionSetLoading = false;
      state.createQuestionSetError = null;
      const row = action.payload;
      if (!state.items.some((s) => s.id === row.id)) {
        state.items = [row, ...state.items];
        state.totalCount += 1;
      }
      state.lastCreatedQuestionSet = row;
    },
    createQuestionSetFailure: (state, action: PayloadAction<string>) => {
      state.createQuestionSetLoading = false;
      state.createQuestionSetError = action.payload;
    },
    clearLastCreatedQuestionSet: (state) => {
      state.lastCreatedQuestionSet = null;
    },

    createScreenQuestionRequest: (state) => {
      state.createScreenQuestionLoading = true;
      state.createScreenQuestionError = null;
    },
    createScreenQuestionSuccess: (state, action: PayloadAction<ScreenQuestion>) => {
      state.createScreenQuestionLoading = false;
      state.createScreenQuestionError = null;
      const q = action.payload;
      if (q.question_set === state.setQuestions.questionSetId) {
        state.setQuestions.items = [q, ...state.setQuestions.items];
        state.setQuestions.totalCount += 1;
      }
    },
    createScreenQuestionFailure: (state, action: PayloadAction<string>) => {
      state.createScreenQuestionLoading = false;
      state.createScreenQuestionError = action.payload;
    },

    markDeleteScreenQuestionPending: (
      state,
      action: PayloadAction<{ questionId: string }>
    ) => {
      state.deleteScreenQuestionPendingIds[action.payload.questionId] = true;
    },
    deleteScreenQuestionSucceeded: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.deleteScreenQuestionPendingIds[id];
      state.setQuestions.items = state.setQuestions.items.filter((q) => q.id !== id);
      state.setQuestions.totalCount = Math.max(0, state.setQuestions.totalCount - 1);
    },
    deleteScreenQuestionFailed: (
      state,
      action: PayloadAction<{ questionId: string }>
    ) => {
      delete state.deleteScreenQuestionPendingIds[action.payload.questionId];
    },
  },
});

export const {
  fetchQuestionSetsRequest,
  fetchQuestionSetsSuccess,
  fetchQuestionSetsFailure,
  clearQuestionSetsError,
  resetQuestionSets,
  fetchSetQuestionsRequest,
  fetchSetQuestionsSuccess,
  fetchSetQuestionsFailure,
  removeSetQuestionItem,
  clearSetQuestions,
  createQuestionSetRequest,
  createQuestionSetSuccess,
  createQuestionSetFailure,
  clearLastCreatedQuestionSet,
  createScreenQuestionRequest,
  createScreenQuestionSuccess,
  createScreenQuestionFailure,
  markDeleteScreenQuestionPending,
  deleteScreenQuestionSucceeded,
  deleteScreenQuestionFailed,
} = questionSetsSlice.actions;

export default questionSetsSlice.reducer;
