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

export const selectInvitesListItems = createSelector(
  [selectUsersState],
  (users) => users.invites.items
);

export const selectInvitesListLoading = createSelector(
  [selectUsersState],
  (users) => users.invites.loading
);

export const selectInvitesListNext = createSelector(
  [selectUsersState],
  (users) => users.invites.next
);

export const selectInvitesListPage = createSelector(
  [selectUsersState],
  (users) => users.invites.page
);

export const selectDirectoryUsersListItems = createSelector(
  [selectUsersState],
  (users) => users.directoryList.items
);

export const selectDirectoryUsersListLoading = createSelector(
  [selectUsersState],
  (users) => users.directoryList.loading
);

export const selectDirectoryUsersListNext = createSelector(
  [selectUsersState],
  (users) => users.directoryList.next
);

export const selectDirectoryUsersListPage = createSelector(
  [selectUsersState],
  (users) => users.directoryList.page
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

