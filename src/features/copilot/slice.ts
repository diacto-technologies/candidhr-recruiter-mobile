import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CopilotChatStreamPayload,
  CopilotChatStreamState,
  CopilotSessionsResponse,
  CopilotSessionDetailResponse,
  CopilotSessionItem,
  CopilotState,
  CopilotStreamEvent,
  CopilotSuggestionsResponse,
  CopilotRenameSessionPayload,
} from './types';
import { COPILOT_ACTION_TYPES } from './constants';

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
        case 'session': {
          state.stream.sessionId = event.session_id;
          state.stream.sessionTitle = event.title;
          if (event.session_id) {
            const newTitle = (event.title || 'New Search').trim();
            const existingIndex = state.sessions.findIndex(
              (s) => String(s.id) === String(event.session_id)
            );
            if (existingIndex >= 0) {
              state.sessions[existingIndex].title = newTitle;
            } else {
              const newSessionItem: CopilotSessionItem = {
                id: event.session_id,
                title: newTitle,
                created_at: new Date().toISOString(),
                last_active_at: new Date().toISOString(),
                message_count: 1,
              };
              state.sessions = [newSessionItem, ...state.sessions];
              state.sessionsCount = state.sessions.length;
            }
          }
          break;
        }
        case 'status':
          state.stream.currentStep = event.step;
          state.stream.statusMessage = event.message;
          state.stream.statusSteps.push({
            step: event.step,
            message: event.message,
            timestamp: Date.now(),
          });
          break;
        case 'result': {
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

          // Optimistically build currentSession so conversation history persists across follow-up queries
          const sessionId = event.session_id || state.stream.sessionId;
          if (sessionId) {
            const userMsgContent = state.stream.query || '';
            const existingMessages = state.currentSession?.messages
              ? [...state.currentSession.messages]
              : [];

            const lastMsg = existingMessages[existingMessages.length - 1];
            const alreadyHasUserMsg =
              lastMsg?.role === 'user' && lastMsg.content === userMsgContent;

            if (userMsgContent && !alreadyHasUserMsg) {
              existingMessages.push({
                id: `user-${Date.now()}`,
                role: 'user',
                content: userMsgContent,
                created_at: new Date().toISOString(),
              });
            }

            existingMessages.push({
              id: `asst-${Date.now()}`,
              role: 'assistant',
              content:
                event.message ||
                `Showing ${event.results?.length ?? 0} candidate${
                  (event.results?.length ?? 0) === 1 ? '' : 's'
                }.`,
              results: event.results || [],
              created_at: new Date().toISOString(),
            });

            state.currentSession = {
              id: sessionId,
              title:
                state.stream.sessionTitle ||
                state.currentSession?.title ||
                userMsgContent ||
                'Talent Search',
              created_at: state.currentSession?.created_at || new Date().toISOString(),
              last_active_at: new Date().toISOString(),
              messages: existingMessages,
            };
          }
          break;
        }
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

    // Rename Session Reducers
    renameSessionRequest: (_state, _action: PayloadAction<CopilotRenameSessionPayload>) => {},
    renameSessionSuccess: (state, action: PayloadAction<CopilotRenameSessionPayload>) => {
      const { id, title } = action.payload;
      const idx = state.sessions.findIndex((s) => String(s.id) === String(id));
      if (idx >= 0) {
        state.sessions[idx].title = title;
      }
      if (state.currentSession && String(state.currentSession.id) === String(id)) {
        state.currentSession.title = title;
      }
      if (state.stream.sessionId && String(state.stream.sessionId) === String(id)) {
        state.stream.sessionTitle = title;
      }
    },
    renameSessionFailure: (_state, _action: PayloadAction<string>) => {},

    // Delete Session Reducers
    deleteSessionRequest: (_state, _action: PayloadAction<string>) => {},
    deleteSessionSuccess: (state, action: PayloadAction<string>) => {
      const sessionId = String(action.payload);
      state.sessions = state.sessions.filter((s) => String(s.id) !== sessionId);
      state.sessionsCount = Math.max(0, state.sessionsCount - 1);
      if (state.currentSession && String(state.currentSession.id) === sessionId) {
        state.currentSession = null;
      }
      if (state.stream.sessionId && String(state.stream.sessionId) === sessionId) {
        state.stream.sessionId = null;
      }
    },
    deleteSessionFailure: (_state, _action: PayloadAction<string>) => {},

    // Clear All Sessions Reducers
    clearAllSessionsRequest: (state) => {
      state.sessionsLoading = true;
      state.sessionsError = null;
    },
    clearAllSessionsSuccess: (state) => {
      state.sessionsLoading = false;
      state.sessions = [];
      state.sessionsCount = 0;
      state.sessionsNext = null;
      state.sessionsPrevious = null;
      state.currentSession = null;
      state.stream = initialStreamState;
      state.sessionsError = null;
    },
    clearAllSessionsFailure: (state, action: PayloadAction<string>) => {
      state.sessionsLoading = false;
      state.sessionsError = action.payload;
    },

    clearCopilotState: () => copilotInitialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(COPILOT_ACTION_TYPES.CHAT_STREAM_RESET, (state) => {
        state.stream = initialStreamState;
      })
      .addCase(COPILOT_ACTION_TYPES.CLEAR_SESSION_DETAIL, (state) => {
        state.currentSession = null;
        state.currentSessionLoading = false;
        state.currentSessionError = null;
      })
      .addCase(COPILOT_ACTION_TYPES.CLEAR_COPILOT_STATE, () => copilotInitialState);
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
  renameSessionRequest,
  renameSessionSuccess,
  renameSessionFailure,
  deleteSessionRequest,
  deleteSessionSuccess,
  deleteSessionFailure,
  clearAllSessionsRequest,
  clearAllSessionsSuccess,
  clearAllSessionsFailure,
  clearCopilotState,
} = copilotSlice.actions;

export default copilotSlice.reducer;
