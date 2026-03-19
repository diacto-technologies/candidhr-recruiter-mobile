import { call, put, takeLatest } from "redux-saga/effects";
import { COMMENTS_ACTION_TYPES } from "./constants";
import {
  getCommentsRequest,
  getCommentsSuccess,
  getCommentsFailure,
  createCommentRequest,
  createCommentSuccess,
  createCommentFailure,
  updateCommentRequest,
  updateCommentSuccess,
  updateCommentFailure,
  deleteCommentRequest,
  deleteCommentSuccess,
  deleteCommentFailure,
} from "./slice";
import { commentsApi } from "./api";
import { showToastMessage } from "../../utils/toast";

function* getCommentsWorker(
  action: { type: string; payload: { application_id: string; job_id: string } }
): Generator<unknown, void, unknown> {
  try {
    yield put(getCommentsRequest(action.payload));
    const list = yield call(commentsApi.getList, action.payload);
    yield put(getCommentsSuccess(list as any));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load comments";
    yield put(getCommentsFailure(message));
  }
}

function* createCommentWorker(
  action: { type: string; payload: { application: string; job: string; content_type: string; object_id: string; text: string } }
): Generator<unknown, void, unknown> {
  try {
    yield put(createCommentRequest());
    const comment = yield call(commentsApi.create, action.payload);
    yield put(createCommentSuccess(comment as any));
    showToastMessage("Comment added", "success");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to add comment";
    yield put(createCommentFailure(message));
    showToastMessage(message, "error");
  }
}

function* updateCommentWorker(
  action: { type: string; payload: { id: string; text: string } }
): Generator<unknown, void, unknown> {
  try {
    yield put(updateCommentRequest(action.payload as any));
    const res: any = yield call(commentsApi.update, action.payload as any);
    yield put(updateCommentSuccess({ id: action.payload.id, text: action.payload.text }));
    showToastMessage(res?.message ?? "Comment updated successfully.", "success");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update comment";
    yield put(updateCommentFailure(message));
    showToastMessage(message, "error");
  }
}

function* deleteCommentWorker(
  action: { type: string; payload: { id: string } }
): Generator<unknown, void, unknown> {
  try {
    yield put(deleteCommentRequest(action.payload as any));
    yield call(commentsApi.delete, action.payload.id);
    yield put(deleteCommentSuccess({ id: action.payload.id }));
    showToastMessage("Comment deleted", "success");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete comment";
    yield put(deleteCommentFailure(message));
    showToastMessage(message, "error");
  }
}

export function* commentsSaga(): Generator<unknown, void, unknown> {
  yield takeLatest(COMMENTS_ACTION_TYPES.GET_COMMENTS_REQUEST, getCommentsWorker as any);
  yield takeLatest(COMMENTS_ACTION_TYPES.CREATE_COMMENT_REQUEST, createCommentWorker as any);
  yield takeLatest(COMMENTS_ACTION_TYPES.UPDATE_COMMENT_REQUEST, updateCommentWorker as any);
  yield takeLatest(COMMENTS_ACTION_TYPES.DELETE_COMMENT_REQUEST, deleteCommentWorker as any);
}
