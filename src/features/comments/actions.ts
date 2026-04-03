import { COMMENTS_ACTION_TYPES } from "./constants";
import type { GetCommentsParams, CreateCommentPayload, UpdateCommentPayload, DeleteCommentPayload } from "./types";

export const getCommentsRequestAction = (payload: GetCommentsParams) => ({
  type: COMMENTS_ACTION_TYPES.GET_COMMENTS_REQUEST,
  payload,
});

export const createCommentRequestAction = (payload: CreateCommentPayload) => ({
  type: COMMENTS_ACTION_TYPES.CREATE_COMMENT_REQUEST,
  payload,
});

export const updateCommentRequestAction = (payload: UpdateCommentPayload) => ({
  type: COMMENTS_ACTION_TYPES.UPDATE_COMMENT_REQUEST,
  payload,
});

export const deleteCommentRequestAction = (payload: DeleteCommentPayload) => ({
  type: COMMENTS_ACTION_TYPES.DELETE_COMMENT_REQUEST,
  payload,
});

export const clearCommentsErrorAction = () => ({
  type: COMMENTS_ACTION_TYPES.CLEAR_COMMENTS_ERROR,
});
