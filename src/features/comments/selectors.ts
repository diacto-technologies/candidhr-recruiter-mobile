import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

const selectCommentsState = (state: RootState) => state.comments;

export const selectCommentsList = createSelector(
  [selectCommentsState],
  (state) => state.list
);

export const selectCommentsLoading = createSelector(
  [selectCommentsState],
  (state) => state.loading
);

export const selectCommentsError = createSelector(
  [selectCommentsState],
  (state) => state.error
);

export const selectCreateCommentLoading = createSelector(
  [selectCommentsState],
  (state) => state.createLoading
);

export const selectCreateCommentError = createSelector(
  [selectCommentsState],
  (state) => state.createError
);

export const selectUpdateCommentLoading = createSelector(
  [selectCommentsState],
  (state) => state.updateLoading
);

export const selectUpdateCommentError = createSelector(
  [selectCommentsState],
  (state) => state.updateError
);

export const selectDeleteCommentLoading = createSelector(
  [selectCommentsState],
  (state) => state.deleteLoading
);

export const selectDeleteCommentError = createSelector(
  [selectCommentsState],
  (state) => state.deleteError
);
