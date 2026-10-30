import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CopilotChatStreamPayload,
  CopilotChatStreamState,
  CopilotSessionsResponse,
  CopilotSessionDetailResponse,
  CopilotState,
  CopilotStreamEvent,
  CopilotSuggestionsResponse,
} from './types';

export const initialStreamState: CopilotChatStreamState = {
  query: null,
  sessionId: null,
  sessionTitle: null,
  isStreaming: false,
  isComplete: false,
  currentStep: null,
  statusMessage: null,
  statusSteps: [],
  result: null,
  candidates: [],
  error: null,
};

export const copilotInitialState: CopilotState = {
  sessions: [],
  sessionsCount: 0,
  sessionsNext: null,
  sessionsPrevious: null,
  sessionsLoading: false,
  sessionsError: null,

  suggestions: [],
  suggestionsLoading: false,
  suggestionsError: null,

  stream: initialStreamState,

  currentSession: null,
  currentSessionLoading: false,
  currentSessionError: null,
};

const copilotSlice = createSlice({
  name: 'copilot',
  initialState: copilotInitialState,
  reducers: {
    getSessionsRequest: (state) => {
      state.sessionsLoading = true;
      state.sessionsError = null;
    },
    getSessionsSuccess: (state, action: PayloadAction<CopilotSessionsResponse>) => {
      state.sessionsLoading = false;
      state.sessions = action.payload?.results ?? [];
      state.sessionsCount = action.payload?.count ?? 0;
      state.sessionsNext = action.payload?.next ?? null;
      state.sessionsPrevious = action.payload?.previous ?? null;
      state.sessionsError = null;
    },
    getSessionsFailure: (state, action: PayloadAction<string>) => {
      state.sessionsLoading = false;
      state.sessionsError = action.payload;
    },

    getSuggestionsRequest: (state) => {
      state.suggestionsLoading = true;
      state.suggestionsError = null;
    },
    getSuggestionsSuccess: (state, action: PayloadAction<CopilotSuggestionsResponse>) => {
      state.suggestionsLoading = false;
      state.suggestions = action.payload?.suggestions ?? [];
      state.suggestionsError = null;
    },
    getSuggestionsFailure: (state, action: PayloadAction<string>) => {
      state.suggestionsLoading = false;
      state.suggestionsError = action.payload;
    },

    // Chat Streaming Reducers
    chatStreamRequest: (state, action: PayloadAction<CopilotChatStreamPayload>) => {
      state.stream = {
        ...initialStreamState,
        query: action.payload.query,
        sessionId: action.payload.session_id ?? state.stream.sessionId,
        isStreaming: true,
        statusMessage: 'Connecting to Copilot...',
      };
    },
    chatStreamEventReceived: (state, action: PayloadAction<CopilotStreamEvent>) => {
      const event = action.payload;
      switch (event.type) {
        case 'session':
          state.stream.sessionId = event.session_id;
          state.stream.sessionTitle = event.title;
          break;
        case 'status':
          state.stream.currentStep = event.step;
          state.stream.statusMessage = event.message;
          state.stream.statusSteps.push({
            step: event.step,
            message: event.message,
            timestamp: Date.now(),
          });
          break;
        case 'result':
          state.stream.result = {
            session_id: event.session_id,
            intent: event.intent,
            result_type: event.result_type,
            filters: event.filters,
            results: event.results,
            result_total: event.result_total,
            result_shown: event.result_shown,
            result_offset: event.result_offset,
            suggested_actions: event.suggested_actions,
            message: event.message,
            job_resolution: event.job_resolution,
          };
          state.stream.candidates = event.results || [];
          if (event.message) {
            state.stream.statusMessage = event.message;
          }
          break;
        case 'done':
          state.stream.isStreaming = false;
          state.stream.isComplete = true;
          break;
        case 'error':
          state.stream.isStreaming = false;
          state.stream.error = event.message;
          break;
      }
    },
    chatStreamSuccess: (state) => {
      state.stream.isStreaming = false;
      state.stream.isComplete = true;
    },
    chatStreamFailure: (state, action: PayloadAction<string>) => {
      state.stream.isStreaming = false;
      state.stream.error = action.payload;
    },
    chatStreamReset: (state) => {
      state.stream = initialStreamState;
    },

    // Session Detail Reducers
    getSessionDetailRequest: (state) => {
      state.currentSessionLoading = true;
      state.currentSessionError = null;
    },
    getSessionDetailSuccess: (state, action: PayloadAction<CopilotSessionDetailResponse>) => {
      state.currentSessionLoading = false;
      state.currentSession = action.payload;
      state.currentSessionError = null;
    },
    getSessionDetailFailure: (state, action: PayloadAction<string>) => {
      state.currentSessionLoading = false;
      state.currentSessionError = action.payload;
    },
    clearSessionDetail: (state) => {
      state.currentSession = null;
      state.currentSessionLoading = false;
      state.currentSessionError = null;
    },

    clearCopilotState: () => copilotInitialState,
  },
});

export const {
  getSessionsRequest,
  getSessionsSuccess,
  getSessionsFailure,
  getSuggestionsRequest,
  getSuggestionsSuccess,
  getSuggestionsFailure,
  chatStreamRequest,
  chatStreamEventReceived,
  chatStreamSuccess,
  chatStreamFailure,
  chatStreamReset,
  getSessionDetailRequest,
  getSessionDetailSuccess,
  getSessionDetailFailure,
  clearSessionDetail,
  clearCopilotState,
} = copilotSlice.actions;

export default copilotSlice.reducer;
