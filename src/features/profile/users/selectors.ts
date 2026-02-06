import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../store";

const selectUsersState = (state: RootState) => state.users;

export const selectUsersListItems = createSelector(
  [selectUsersState],
  (users) => users.list.items
);

export const selectUsersListLoading = createSelector(
  [selectUsersState],
  (users) => users.list.loading
);

export const selectUsersListNext = createSelector(
  [selectUsersState],
  (users) => users.list.next
);

export const selectUsersListPage = createSelector(
  [selectUsersState],
  (users) => users.list.page
);

export const selectRolesListItems = createSelector(
  [selectUsersState],
  (users) => users.roles.items
);

export const selectRolesListLoading = createSelector(
  [selectUsersState],
  (users) => users.roles.loading
);

export const selectRolesListNext = createSelector(
  [selectUsersState],
  (users) => users.roles.next
);

export const selectRolesListPage = createSelector(
  [selectUsersState],
  (users) => users.roles.page
);

export const selectCreateUserLoading = createSelector(
  [selectUsersState],
  (users) => users.create.loading
);

export const selectCreateUserError = createSelector(
  [selectUsersState],
  (users) => users.create.error
);

