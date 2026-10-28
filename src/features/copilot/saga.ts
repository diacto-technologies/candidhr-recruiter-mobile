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
} from './slice';
import { copilotApi } from './api';
import {
  CopilotSessionsResponse,
  CopilotSuggestionsResponse,
  CopilotChatStreamPayload,
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

  try {
    while (true) {
      const msg = (yield take(channel)) as ChannelMessage;
      if (msg.kind === 'error') {
        hasError = true;
        yield put(chatStreamFailure(msg.error.message));
        return;
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

      if (action.payload.session_id) {
        try {
          const updatedDetail = (yield call(
            copilotApi.getSessionDetail,
            action.payload.session_id
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

export function* copilotSaga() {
  yield takeLatest(COPILOT_ACTION_TYPES.GET_SESSIONS_REQUEST, getSessionsWorker);
  yield takeLatest(COPILOT_ACTION_TYPES.GET_SUGGESTIONS_REQUEST, getSuggestionsWorker);
  yield takeLatest(COPILOT_ACTION_TYPES.CHAT_STREAM_REQUEST, chatStreamWorker);
  yield takeLatest(COPILOT_ACTION_TYPES.GET_SESSION_DETAIL_REQUEST, getSessionDetailWorker);
}
