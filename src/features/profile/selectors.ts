import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const selectProfileState = (state: RootState) => state.profile;

export const selectProfile = createSelector(
  [selectProfileState],
  (profile) => profile.profile
);

export const selectProfileLoading = createSelector(
  [selectProfileState],
  (profile) => profile.loading
);

export const selectProfileError = createSelector(
  [selectProfileState],
  (profile) => profile.error
);

