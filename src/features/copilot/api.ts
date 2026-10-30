import { apiClient, buildHeaders, API_BASE_URL } from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';
import {
  CopilotSessionsResponse,
  CopilotSessionDetailResponse,
  CopilotSuggestionsResponse,
  CopilotChatStreamPayload,
  CopilotStreamEvent,
} from './types';
import { createSseParser } from './sseParser';

export const copilotApi = {
  getSessions: async (): Promise<CopilotSessionsResponse> => {
    const res = (await apiClient.get(API_ENDPOINTS.COPILOT.SESSIONS)) as CopilotSessionsResponse;
    console.log('[copilotApi.getSessions] Response:', res);
    return res;
  },

  getSessionDetail: async (sessionId: string): Promise<CopilotSessionDetailResponse> => {
    const res = (await apiClient.get(
      API_ENDPOINTS.COPILOT.SESSION_DETAIL(sessionId)
    )) as CopilotSessionDetailResponse;
    console.log('[copilotApi.getSessionDetail] Response:', res);
    return res;
  },

  getSuggestions: async (): Promise<CopilotSuggestionsResponse> => {
    const res = (await apiClient.get(API_ENDPOINTS.COPILOT.SUGGESTIONS)) as CopilotSuggestionsResponse;
    console.log('[copilotApi.getSuggestions] Response:', res);
    return res;
  },

  /**
   * Streams chat responses via POST /api/v1/copilot/chat/stream/
   * Uses apiClient with automatic token refresh, org headers, and SSE parsing.
   * Emits progressive typed events (session, status, result, done).
   * Returns a cleanup/cancel function.
   */
  streamChat: (
    payload: CopilotChatStreamPayload,
    onEvent: (event: CopilotStreamEvent) => void,
    onError: (error: Error) => void,
    onComplete: () => void
  ): (() => void) => {
    console.log('[copilotApi.streamChat] Request Payload:', payload);

    const parser = createSseParser((event) => {
      console.log('[copilotApi.streamChat] Event:', event.type, event);
      onEvent(event);
    });

    let isAborted = false;
    const abortController = new AbortController();

    (async () => {
      try {
        const response = await apiClient.postResponse(
          API_ENDPOINTS.COPILOT.CHAT_STREAM,
          payload,
          {
            headers: {
              Accept: '*/*',
            },
            signal: abortController.signal,
          }
        );

        if (!response.ok) {
          let errMsg = `Stream failed with status ${response.status}`;
          try {
            const errJson = await response.json();
            errMsg = errJson.errors?.detail || errJson.message || errJson.detail || errMsg;
          } catch {
            try {
              const errText = await response.text();
              if (errText) errMsg = errText;
            } catch {
              // ignore
            }
          }
          throw new Error(errMsg);
        }

        const fullText = await response.text();
        console.log('[copilotApi.streamChat] Response text received, length:', fullText.length);

        if (isAborted) return;

        parser.feed(fullText);
        parser.flush();

        console.log('[copilotApi.streamChat] Stream completed successfully');
        onComplete();
      } catch (err: unknown) {
        if (!isAborted) {
          const error = err instanceof Error ? err : new Error(String(err));
          console.error('[copilotApi.streamChat] Error:', error.message);
          onError(error);
        }
      }
    })();

    return () => {
      isAborted = true;
      try {
        abortController.abort();
      } catch {
        // ignore
      }
    };
  },
};
