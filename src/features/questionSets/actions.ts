import { QUESTION_SETS_ACTION_TYPES } from './constants';

export const createQuestionSetRequestAction = (payload: { name: string }) => ({
  type: QUESTION_SETS_ACTION_TYPES.CREATE_QUESTION_SET_REQUEST,
  payload,
});

export const fetchQuestionSetsRequestAction = (page: number, append = false) => ({
  type: QUESTION_SETS_ACTION_TYPES.FETCH_QUESTION_SETS_REQUEST,
  payload: { page, append },
});

export const fetchSetQuestionsRequestAction = (
  questionSetId: string,
  page: number,
  append = false
) => ({
  type: QUESTION_SETS_ACTION_TYPES.FETCH_SET_QUESTIONS_REQUEST,
  payload: { questionSetId, page, append },
});

export const createScreenQuestionRequestAction = (payload: {
  text: string;
  time_limit: number;
  type: 'text' | 'audio';
  question_set: string;
}) => ({
  type: QUESTION_SETS_ACTION_TYPES.CREATE_SCREEN_QUESTION_REQUEST,
  payload,
});

export const deleteScreenQuestionRequestAction = (payload: { questionId: string }) => ({
  type: QUESTION_SETS_ACTION_TYPES.DELETE_SCREEN_QUESTION_REQUEST,
  payload,
});
