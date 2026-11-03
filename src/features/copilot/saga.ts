import { eventChannel, END, EventChannel } from 'redux-saga';
import { call, put, take, takeLatest, cancelled } from 'redux-saga/effects';
import { COPILOT_ACTION_TYPES } from './constants';
import {
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
  getSessionDetailRequest,
  getSessionDetailSuccess,
  getSessionDetailFailure,
  renameSessionRequest,
  renameSessionSuccess,
  renameSessionFailure,
  deleteSessionRequest,
  deleteSessionSuccess,
  deleteSessionFailure,
  clearAllSessionsRequest,
  clearAllSessionsSuccess,
  clearAllSessionsFailure,
} from './slice';
import { copilotApi } from './api';
import { showToastMessage } from '../../utils/toast';
import {
  CopilotSessionsResponse,
  CopilotSuggestionsResponse,
  CopilotChatStreamPayload,
  CopilotRenameSessionPayload,
  CopilotSessionItem,
  CopilotStreamEvent,
  CopilotSessionDetailResponse,
} from './types';

function* getSessionsWorker(): Generator<unknown, void, CopilotSessionsResponse> {
  try {
    yield put(getSessionsRequest());
    const response = yield call(copilotApi.getSessions);
    console.log('COPILOT SESSIONS RESPONSE:', response);
    yield put(getSessionsSuccess(response));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch copilot sessions';
    if (__DEV__) {
      console.log('Failed to fetch copilot sessions:', message);
    }
    yield put(getSessionsFailure(message));
  }
}

function* getSuggestionsWorker(): Generator<unknown, void, CopilotSuggestionsResponse> {
  try {
    yield put(getSuggestionsRequest());
    const response = yield call(copilotApi.getSuggestions);
    console.log('COPILOT SUGGESTIONS RESPONSE:', response);
    yield put(getSuggestionsSuccess(response));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch copilot suggestions';
    if (__DEV__) {
      console.log('Failed to fetch copilot suggestions:', message);
    }
    yield put(getSuggestionsFailure(message));
  }
}

type ChannelMessage =
  | { kind: 'event'; event: CopilotStreamEvent }
  | { kind: 'error'; error: Error };

function createChatStreamChannel(
  payload: CopilotChatStreamPayload
): EventChannel<ChannelMessage> {
  return eventChannel<ChannelMessage>((emitter) => {
    const cancel = copilotApi.streamChat(
      payload,
      (event) => {
        emitter({ kind: 'event', event });
      },
      (error) => {
        emitter({ kind: 'error', error });
        emitter(END);
      },
      () => {
        emitter(END);
      }
    );

    return () => {
      cancel();
    };
  });
}

function* chatStreamWorker(action: {
  type: string;
  payload: CopilotChatStreamPayload;
}): Generator<unknown, void, unknown> {
  yield put(chatStreamRequest(action.payload));
  const channel = (yield call(
    createChatStreamChannel,
    action.payload
  )) as EventChannel<ChannelMessage>;

  let hasError = false;
  let receivedSessionId = action.payload.session_id;

  try {
    while (true) {
      const msg = (yield take(channel)) as ChannelMessage;
      if (msg.kind === 'error') {
        hasError = true;
        yield put(chatStreamFailure(msg.error.message));
        return;
      }
      if (msg.event.type === 'session' && msg.event.session_id) {
        receivedSessionId = msg.event.session_id;
      }
      yield put(chatStreamEventReceived(msg.event));
    }
  } catch (error: unknown) {
    hasError = true;
    const message = error instanceof Error ? error.message : 'Chat stream failed';
    if (__DEV__) {
      console.log('Chat stream worker caught error:', message);
    }
    yield put(chatStreamFailure(message));
  } finally {
    const isTaskCancelled = (yield cancelled()) as boolean;
    channel.close();
    if (!isTaskCancelled && !hasError) {
      yield put(chatStreamSuccess());
      try {
        const sessions = (yield call(copilotApi.getSessions)) as CopilotSessionsResponse;
        yield put(getSessionsSuccess(sessions));
      } catch (sessErr: unknown) {
        if (__DEV__) {
          console.log('Failed to refresh sessions after stream:', sessErr);
        }
      }

      const activeSessionId = receivedSessionId || action.payload.session_id;
      if (activeSessionId) {
        try {
          const updatedDetail = (yield call(
            copilotApi.getSessionDetail,
            activeSessionId
          )) as CopilotSessionDetailResponse;
          yield put(getSessionDetailSuccess(updatedDetail));
        } catch (detailErr: unknown) {
          if (__DEV__) {
            console.log('Failed to reload session detail after stream:', detailErr);
          }
        }
      }
    }
  }
}

function* getSessionDetailWorker(action: {
  type: string;
  payload: { sessionId: string };
}): Generator<unknown, void, CopilotSessionDetailResponse> {
  try {
    yield put(getSessionDetailRequest());
    const response = yield call(copilotApi.getSessionDetail, action.payload.sessionId);
    console.log('COPILOT SESSION DETAIL RESPONSE:', response);
    yield put(getSessionDetailSuccess(response));
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch session detail';
    if (__DEV__) {
      console.log('Failed to fetch session detail:', message);
    }
    yield put(getSessionDetailFailure(message));
  }
}

function* renameSessionWorker(action: {
  type: string;
  payload: CopilotRenameSessionPayload;
}): Generator<unknown, void, any> {
  try {
    console.log('[renameSessionWorker] Starting rename saga with payload:', action.payload);
    yield put(renameSessionRequest(action.payload));
    const response = (yield call(copilotApi.renameSession, action.payload)) as CopilotSessionItem;
    console.log('COPILOT RENAME SESSION RESPONSE:', response);
    yield put(
      renameSessionSuccess({
        id: action.payload.id,
        title: (response?.title || action.payload.title).trim(),
      })
    );
    showToastMessage('Chat renamed successfully', 'success');
    const sessions = (yield call(copilotApi.getSessions)) as CopilotSessionsResponse;
    yield put(getSessionsSuccess(sessions));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to rename session';
    if (__DEV__) {
      console.log('Failed to rename session:', message);
    }
    yield put(renameSessionFailure(message));
    showToastMessage(message, 'error');
  }
}

function* deleteSessionWorker(action: {
  type: string;
  payload: { sessionId: string };
}): Generator<unknown, void, any> {
  try {
    console.log('[deleteSessionWorker] Deleting session with ID:', action.payload.sessionId);
    yield put(deleteSessionRequest(action.payload.sessionId));
    const response = yield call(copilotApi.deleteSession, action.payload.sessionId);
    console.log('COPILOT DELETE SESSION RESPONSE:', response);
    yield put(deleteSessionSuccess(action.payload.sessionId));
    showToastMessage('Chat deleted successfully', 'success');
    const sessions = (yield call(copilotApi.getSessions)) as CopilotSessionsResponse;
    yield put(getSessionsSuccess(sessions));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete session';
    console.error('Failed to delete session:', message, error);
    yield put(deleteSessionFailure(message));
    showToastMessage(message, 'error');
  }
}

function* clearAllSessionsWorker(): Generator<unknown, void, any> {
  try {
    console.log('[clearAllSessionsWorker] Clearing all sessions via DELETE /api/v1/copilot/sessions/');
    yield put(clearAllSessionsRequest());
    const response = yield call(copilotApi.clearAllSessions);
    console.log('COPILOT CLEAR ALL SESSIONS RESPONSE:', response);
    yield put(clearAllSessionsSuccess());
    showToastMessage('Chat history cleared successfully', 'success');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to clear chat history';
    console.error('Failed to clear chat history:', message, error);
    yield put(clearAllSessionsFailure(message));
    showToastMessage(message, 'error');
  }
}

export function* copilotSaga() {
  yield takeLatest(COPILOT_ACTION_TYPES.GET_SESSIONS_REQUEST, getSessionsWorker);
  yield takeLatest(COPILOT_ACTION_TYPES.GET_SUGGESTIONS_REQUEST, getSuggestionsWorker);
  yield takeLatest(COPILOT_ACTION_TYPES.CHAT_STREAM_REQUEST, chatStreamWorker);
  yield takeLatest(COPILOT_ACTION_TYPES.GET_SESSION_DETAIL_REQUEST, getSessionDetailWorker);
  yield takeLatest(COPILOT_ACTION_TYPES.RENAME_SESSION_REQUEST, renameSessionWorker);
  yield takeLatest(COPILOT_ACTION_TYPES.DELETE_SESSION_REQUEST, deleteSessionWorker);
  yield takeLatest(COPILOT_ACTION_TYPES.CLEAR_ALL_SESSIONS_REQUEST, clearAllSessionsWorker);
}
