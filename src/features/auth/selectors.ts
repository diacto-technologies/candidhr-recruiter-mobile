import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

// Base selectors
const selectAuthState = (state: RootState) => state.auth;

// Memoized selectors
export const selectUser = createSelector(
  [selectAuthState],
  (auth) => auth.user
);

export const selectUserId = createSelector(
  [selectAuthState],
  (auth) => auth.user?.id
);
export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth) => auth.isAuthenticated
);

export const selectAuthLoading = createSelector(
  [selectAuthState],
  (auth) => auth.loading
);

export const selectAuthError = createSelector(
  [selectAuthState],
  (auth) => auth.error
);

export const selectToken = createSelector(
  [selectAuthState],
  (auth) => auth.token
);

export const selectRefreshToken = createSelector(
  [selectAuthState],
  (auth) => auth.refreshToken
);

export const tenant = createSelector(
  [selectAuthState],
  (auth) => auth.tenant
);

export const selectForgotPasswordLoading = createSelector(
  [selectAuthState],
  (auth) => auth.forgotPasswordLoading
);

export const selectForgotPasswordMessage = createSelector(
  [selectAuthState],
  (auth) => auth.forgotPasswordMessage
);

export const selectSavedEmail = createSelector(
  [selectAuthState],
  (auth) => auth.email
);

export const selectSavedPassword = createSelector(
  [selectAuthState],
  (auth) => auth.password
);

export const selectSavedRemember = createSelector(
  [selectAuthState],
  (auth) => auth.remember
);

export const selectResetPasswordLoading = createSelector(
  [selectAuthState],
  (auth) => auth.resetPasswordLoading
);

export const selectResetPasswordMessage = createSelector(
  [selectAuthState],
  (auth) => auth.resetPasswordMessage
);

export const selectResetPasswordError = createSelector(
  [selectAuthState],
  (auth) => auth.resetPasswordError
);




// Legacy selectors for backward compatibility
export const selectUserLoading = selectAuthLoading;
export const selectUserError = selectAuthError;

