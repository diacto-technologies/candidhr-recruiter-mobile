import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';

import { QUESTION_SETS_ACTION_TYPES } from './constants';
import { fetchSetQuestionsRequestAction } from './actions';
import { questionSetsApi } from './api';
import {
  fetchQuestionSetsRequest,
  fetchQuestionSetsSuccess,
  fetchQuestionSetsFailure,
  fetchSetQuestionsRequest,
  fetchSetQuestionsSuccess,
  fetchSetQuestionsFailure,
  createQuestionSetRequest,
  createQuestionSetSuccess,
  createQuestionSetFailure,
  createScreenQuestionRequest,
  createScreenQuestionSuccess,
  createScreenQuestionFailure,
  markDeleteScreenQuestionPending,
  deleteScreenQuestionSucceeded,
  deleteScreenQuestionFailed,
} from './slice';
import type { QuestionSetListResponse, ScreenQuestion, SetQuestionsListResponse } from './types';
import type { RootState } from '../../store';
import { showToastMessage } from '../../utils/toast';

function* fetchQuestionSetsWorker(
  action: PayloadAction<{ page: number; append: boolean }>
): Generator<
  unknown,
  void,
  QuestionSetListResponse
> {
  try {
    const { page, append } = action.payload;
    yield put(fetchQuestionSetsRequest({ page, append }));
    const response = yield call(questionSetsApi.list, page);
    yield put(
      fetchQuestionSetsSuccess({
        results: response.results ?? [],
        count: response.count ?? 0,
        next: response.next ?? null,
        page,
        append,
      })
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to load question sets';
    yield put(fetchQuestionSetsFailure(message));
  }
}

function* fetchSetQuestionsWorker(
  action: PayloadAction<{ questionSetId: string; page: number; append: boolean }>
): Generator<unknown, void, SetQuestionsListResponse> {
  const { questionSetId, page, append } = action.payload;
  if (!questionSetId) {
    yield put(
      fetchSetQuestionsSuccess({
        results: [],
        count: 0,
        next: null,
        page: 1,
        append: false,
        questionSetId: '',
      })
    );
    return;
  }
  try {
    yield put(fetchSetQuestionsRequest({ questionSetId, page, append }));
    const response = yield call(questionSetsApi.listQuestions, questionSetId, page);
    yield put(
      fetchSetQuestionsSuccess({
        results: response.results ?? [],
        count: response.count ?? 0,
        next: response.next ?? null,
        page,
        append,
        questionSetId,
      })
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to load questions';
    yield put(fetchSetQuestionsFailure(message));
  }
}

function* createQuestionSetWorker(
  action: PayloadAction<{ name: string }>
): Generator<unknown, void, unknown> {
  const name = action.payload?.name?.trim();
  if (!name) {
    return;
  }
  try {
    const profile = (yield select(
      (s: RootState) => s.profile.profile
    )) as { id?: string } | null;
    const createdBy = profile?.id?.trim();
    if (!createdBy) {
      const msg = 'Sign in again to create a question set.';
      yield put(createQuestionSetFailure(msg));
      showToastMessage(msg, 'error');
      return;
    }
    yield put(createQuestionSetRequest());
    const created = (yield call(questionSetsApi.create, {
      name,
      created_by: createdBy,
    })) as Awaited<ReturnType<typeof questionSetsApi.create>>;
    yield put(createQuestionSetSuccess(created));
    /** Load questions for the new set (same GET as library: text + audio, page 1). */
    yield put(fetchSetQuestionsRequestAction(created.id, 1, false));
    showToastMessage('Question set created', 'success');
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Could not create question set';
    yield put(createQuestionSetFailure(message));
    showToastMessage(message, 'error');
  }
}

function* createScreenQuestionWorker(
  action: PayloadAction<{
    text: string;
    time_limit: number;
    type: 'text' | 'audio';
    question_set: string;
  }>
): Generator<unknown, void, unknown> {
  const text = action.payload?.text?.trim();
  const time_limit = action.payload?.time_limit;
  const type = action.payload?.type;
  const question_set = action.payload?.question_set?.trim();
  if (!text || !question_set || (type !== 'text' && type !== 'audio')) {
    return;
  }
  if (typeof time_limit !== 'number' || Number.isNaN(time_limit)) {
    return;
  }
  try {
    const profile = (yield select(
      (s: RootState) => s.profile.profile
    )) as { id?: string } | null;
    const createdBy = profile?.id?.trim();
    if (!createdBy) {
      const msg = 'Sign in again to add a question.';
      yield put(createScreenQuestionFailure(msg));
      showToastMessage(msg, 'error');
      return;
    }
    yield put(createScreenQuestionRequest());
    const created = (yield call(questionSetsApi.createQuestion, {
      text,
      time_limit,
      type,
      created_by: createdBy,
      question_set,
    })) as ScreenQuestion;
    yield put(createScreenQuestionSuccess(created));
    showToastMessage('Question added', 'success');
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Could not add question';
    yield put(createScreenQuestionFailure(message));
    showToastMessage(message, 'error');
  }
}

function* deleteScreenQuestionWorker(
  action: PayloadAction<{ questionId: string }>
): Generator<unknown, void, unknown> {
  const questionId = action.payload?.questionId?.trim();
  if (!questionId) {
    return;
  }
  try {
    yield put(markDeleteScreenQuestionPending({ questionId }));
    yield call(questionSetsApi.softDeleteQuestion, questionId);
    yield put(deleteScreenQuestionSucceeded(questionId));
    showToastMessage('Question removed', 'success');
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Could not remove question';
    yield put(deleteScreenQuestionFailed({ questionId }));
    showToastMessage(message, 'error');
  }
}

export function* questionSetsSaga(): Generator<unknown, void, unknown> {
  yield takeEvery(
    QUESTION_SETS_ACTION_TYPES.FETCH_QUESTION_SETS_REQUEST,
    fetchQuestionSetsWorker
  );
  /** Latest wins when switching sets quickly so stale responses do not merge. */
  yield takeLatest(
    QUESTION_SETS_ACTION_TYPES.FETCH_SET_QUESTIONS_REQUEST,
    fetchSetQuestionsWorker
  );
  yield takeLatest(
    QUESTION_SETS_ACTION_TYPES.CREATE_QUESTION_SET_REQUEST,
    createQuestionSetWorker
  );
  yield takeLatest(
    QUESTION_SETS_ACTION_TYPES.CREATE_SCREEN_QUESTION_REQUEST,
    createScreenQuestionWorker
  );
  yield takeEvery(
    QUESTION_SETS_ACTION_TYPES.DELETE_SCREEN_QUESTION_REQUEST,
    deleteScreenQuestionWorker
  );
}
