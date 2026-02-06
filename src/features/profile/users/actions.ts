import { USERS_ACTION_TYPES } from "./constants";
import type { CreateUserRequest } from "./types";

export const getUsersRequestAction = (page: number) => ({
  type: USERS_ACTION_TYPES.GET_USERS_REQUEST,
  payload: { page },
});

export const getRolesRequestAction = (page: number) => ({
  type: USERS_ACTION_TYPES.GET_ROLES_REQUEST,
  payload: { page },
});

// Future: when you get exact endpoints, pass them here (no URL guessing).
export const updateUserRequestAction = (payload: {
  endpoint: string;
  data: Record<string, unknown> | FormData;
  refreshPage?: number;
}) => ({
  type: USERS_ACTION_TYPES.UPDATE_USER_REQUEST,
  payload,
});

export const createUserRequestAction = (payload: { data: CreateUserRequest; refreshPage?: number }) => ({
  type: USERS_ACTION_TYPES.CREATE_USER_REQUEST,
  payload,
});

export const deleteUserRequestAction = (payload: {
  endpoint: string;
  refreshPage?: number;
}) => ({
  type: USERS_ACTION_TYPES.DELETE_USER_REQUEST,
  payload,
});

