import { COPILOT_ACTION_TYPES } from './constants';
import { CopilotChatStreamPayload } from './types';

export const getCopilotSessionsRequestAction = () => ({
  type: COPILOT_ACTION_TYPES.GET_SESSIONS_REQUEST,
});

export const getCopilotSuggestionsRequestAction = () => ({
  type: COPILOT_ACTION_TYPES.GET_SUGGESTIONS_REQUEST,
});

export const chatStreamRequestAction = (payload: CopilotChatStreamPayload) => ({
  type: COPILOT_ACTION_TYPES.CHAT_STREAM_REQUEST,
  payload,
});

export const chatStreamCancelAction = () => ({
  type: COPILOT_ACTION_TYPES.CHAT_STREAM_CANCEL,
});

export const chatStreamResetAction = () => ({
  type: COPILOT_ACTION_TYPES.CHAT_STREAM_RESET,
});

export const getCopilotSessionDetailRequestAction = (sessionId: string) => ({
  type: COPILOT_ACTION_TYPES.GET_SESSION_DETAIL_REQUEST,
  payload: { sessionId },
});

export const clearCopilotSessionDetailAction = () => ({
  type: COPILOT_ACTION_TYPES.CLEAR_SESSION_DETAIL,
});

export const clearCopilotStateAction = () => ({
  type: COPILOT_ACTION_TYPES.CLEAR_COPILOT_STATE,
});
