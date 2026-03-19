import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CommentsState, Comment, GetCommentsParams, UpdateCommentPayload, DeleteCommentPayload } from "./types";

const initialState: CommentsState = {
  list: [],
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  deleteError: null,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    getCommentsRequest: (state, _action: PayloadAction<GetCommentsParams>) => {
      state.loading = true;
      state.error = null;
    },
    getCommentsSuccess: (state, action: PayloadAction<Comment[]>) => {
      state.loading = false;
      state.list = action.payload ?? [];
      state.error = null;
    },
    getCommentsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.list = [];
      state.error = action.payload;
    },
    createCommentRequest: (state) => {
      state.createLoading = true;
      state.createError = null;
    },
    createCommentSuccess: (state, action: PayloadAction<Comment>) => {
      state.createLoading = false;
      state.createError = null;
      state.list = [action.payload, ...state.list];
    },
    createCommentFailure: (state, action: PayloadAction<string>) => {
      state.createLoading = false;
      state.createError = action.payload;
    },
    updateCommentRequest: (state, _action: PayloadAction<UpdateCommentPayload>) => {
      state.updateLoading = true;
      state.updateError = null;
    },
    updateCommentSuccess: (
      state,
      action: PayloadAction<{ id: string; text: string; updated_at?: string }>
    ) => {
      state.updateLoading = false;
      state.updateError = null;
      const idx = state.list.findIndex((c) => c.id === action.payload.id);
      if (idx >= 0) {
        state.list[idx] = {
          ...state.list[idx],
          text: action.payload.text,
          updated_at: action.payload.updated_at ?? state.list[idx].updated_at,
        };
      }
    },
    updateCommentFailure: (state, action: PayloadAction<string>) => {
      state.updateLoading = false;
      state.updateError = action.payload;
    },
    deleteCommentRequest: (state, _action: PayloadAction<DeleteCommentPayload>) => {
      state.deleteLoading = true;
      state.deleteError = null;
    },
    deleteCommentSuccess: (state, action: PayloadAction<{ id: string }>) => {
      state.deleteLoading = false;
      state.deleteError = null;
      state.list = state.list.filter((c) => c.id !== action.payload.id);
    },
    deleteCommentFailure: (state, action: PayloadAction<string>) => {
      state.deleteLoading = false;
      state.deleteError = action.payload;
    },
    clearCommentsError: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
  },
});

export const {
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
  clearCommentsError,
} = commentsSlice.actions;

export default commentsSlice.reducer;
