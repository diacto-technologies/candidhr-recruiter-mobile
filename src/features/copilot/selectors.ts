import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { initialStreamState } from './slice';

const selectCopilotState = (state: RootState) => state.copilot;

export const selectCopilotSessions = createSelector(
  [selectCopilotState],
  (copilot) => copilot?.sessions ?? []
);

export const selectCopilotSessionsCount = createSelector(
  [selectCopilotState],
  (copilot) => copilot?.sessionsCount ?? 0
);

export const selectCopilotSessionsLoading = createSelector(
  [selectCopilotState],
  (copilot) => copilot?.sessionsLoading ?? false
);

export const selectCopilotSessionsError = createSelector(
  [selectCopilotState],
  (copilot) => copilot?.sessionsError ?? null
);

export const selectCopilotSuggestions = createSelector(
  [selectCopilotState],
  (copilot) => copilot?.suggestions ?? []
);

export const selectCopilotSuggestionsLoading = createSelector(
  [selectCopilotState],
  (copilot) => copilot?.suggestionsLoading ?? false
);

export const selectCopilotSuggestionsError = createSelector(
  [selectCopilotState],
  (copilot) => copilot?.suggestionsError ?? null
);

// Chat Streaming Selectors
export const selectCopilotChatStreamState = createSelector(
  [selectCopilotState],
  (copilot) => copilot?.stream ?? initialStreamState
);

export const selectCopilotIsStreaming = createSelector(
  [selectCopilotChatStreamState],
  (stream) => stream?.isStreaming ?? false
);

export const selectCopilotStreamIsComplete = createSelector(
  [selectCopilotChatStreamState],
  (stream) => stream?.isComplete ?? false
);

export const selectCopilotStreamCurrentStep = createSelector(
  [selectCopilotChatStreamState],
  (stream) => stream?.currentStep ?? null
);

export const selectCopilotStreamStatusMessage = createSelector(
  [selectCopilotChatStreamState],
  (stream) => stream?.statusMessage ?? null
);

export const selectCopilotStreamStatusSteps = createSelector(
  [selectCopilotChatStreamState],
  (stream) => stream?.statusSteps ?? []
);

export const selectCopilotStreamResult = createSelector(
  [selectCopilotChatStreamState],
  (stream) => stream?.result ?? null
);

export const selectCopilotStreamCandidates = createSelector(
  [selectCopilotChatStreamState],
  (stream) => stream?.candidates ?? []
);

export const selectCopilotStreamSessionId = createSelector(
  [selectCopilotChatStreamState],
  (stream) => stream?.sessionId ?? null
);

export const selectCopilotStreamSessionTitle = createSelector(
  [selectCopilotChatStreamState],
  (stream) => stream?.sessionTitle ?? null
);

export const selectCopilotStreamError = createSelector(
  [selectCopilotChatStreamState],
  (stream) => stream?.error ?? null
);

// Session Detail Selectors
export const selectCopilotCurrentSession = createSelector(
  [selectCopilotState],
  (copilot) => copilot?.currentSession ?? null
);

export const selectCopilotCurrentSessionLoading = createSelector(
  [selectCopilotState],
  (copilot) => copilot?.currentSessionLoading ?? false
);

export const selectCopilotCurrentSessionError = createSelector(
  [selectCopilotState],
  (copilot) => copilot?.currentSessionError ?? null
);

export const selectCopilotCurrentSessionMessages = createSelector(
  [selectCopilotCurrentSession],
  (session) => session?.messages ?? []
);
