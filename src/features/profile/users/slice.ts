import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { PaginatedResponse, RoleListItem, UsersListItem, UsersState } from "./types";

const initialState: UsersState = {
  list: {
    items: [],
    count: 0,
    next: null,
    previous: null,
    page: 1,
    loading: false,
    error: null,
  },
  roles: {
    items: [],
    count: 0,
    next: null,
    previous: null,
    page: 1,
    loading: false,
    error: null,
  },
  update: {
    loading: false,
    error: null,
  },
  create: {
    loading: false,
    error: null,
  },
  remove: {
    loading: false,
    error: null,
  },
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    getUsersRequest: (state, action: PayloadAction<{ page: number }>) => {
      state.list.loading = true;
      state.list.error = null;
      state.list.page = action.payload.page;
    },
    getUsersSuccess: (
      state,
      action: PayloadAction<{ page: number; response: PaginatedResponse<UsersListItem> }>
    ) => {
      const { page, response } = action.payload;
      state.list.loading = false;
      state.list.count = response.count;
      state.list.next = response.next;
      state.list.previous = response.previous;
      state.list.page = page;
      state.list.error = null;
      state.list.items = page <= 1 ? response.results : [...state.list.items, ...response.results];
    },
    getUsersFailure: (state, action: PayloadAction<string>) => {
      state.list.loading = false;
      state.list.error = action.payload;
    },

    getRolesRequest: (state, action: PayloadAction<{ page: number }>) => {
      state.roles.loading = true;
      state.roles.error = null;
      state.roles.page = action.payload.page;
    },
    getRolesSuccess: (
      state,
      action: PayloadAction<{ page: number; response: PaginatedResponse<RoleListItem> }>
    ) => {
      const { page, response } = action.payload;
      state.roles.loading = false;
      state.roles.count = response.count;
      state.roles.next = response.next;
      state.roles.previous = response.previous;
      state.roles.page = page;
      state.roles.error = null;
      state.roles.items = page <= 1 ? response.results : [...state.roles.items, ...response.results];
    },
    getRolesFailure: (state, action: PayloadAction<string>) => {
      state.roles.loading = false;
      state.roles.error = action.payload;
    },

    updateUserRequest: (state) => {
      state.update.loading = true;
      state.update.error = null;
    },
    updateUserSuccess: (state) => {
      state.update.loading = false;
      state.update.error = null;
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.update.loading = false;
      state.update.error = action.payload;
    },

    createUserRequest: (state) => {
      state.create.loading = true;
      state.create.error = null;
    },
    createUserSuccess: (state) => {
      state.create.loading = false;
      state.create.error = null;
    },
    createUserFailure: (state, action: PayloadAction<string>) => {
      state.create.loading = false;
      state.create.error = action.payload;
    },

    deleteUserRequest: (state) => {
      state.remove.loading = true;
      state.remove.error = null;
    },
    deleteUserSuccess: (state) => {
      state.remove.loading = false;
      state.remove.error = null;
    },
    deleteUserFailure: (state, action: PayloadAction<string>) => {
      state.remove.loading = false;
      state.remove.error = action.payload;
    },
  },
});

export const {
  getUsersRequest,
  getUsersSuccess,
  getUsersFailure,
  getRolesRequest,
  getRolesSuccess,
  getRolesFailure,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailure,
  createUserRequest,
  createUserSuccess,
  createUserFailure,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailure,
} = usersSlice.actions;

export default usersSlice.reducer;

