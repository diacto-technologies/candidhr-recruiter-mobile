import { AUTH_ACTION_TYPES } from "./constants";
import { LoginRequest, RegisterRequest } from "./types";

// Action creators for saga triggers
export const loginRequestAction = (payload: LoginRequest) => ({
  type: AUTH_ACTION_TYPES.LOGIN_REQUEST,
  payload,
});

export const registerRequestAction = (payload: RegisterRequest) => ({
  type: AUTH_ACTION_TYPES.REGISTER_REQUEST,
  payload,
});

export const logoutRequestAction = () => ({
  type: AUTH_ACTION_TYPES.LOGOUT_REQUEST,
});

export const refreshTokenRequestAction = () => ({
  type: AUTH_ACTION_TYPES.REFRESH_TOKEN_REQUEST,
});

export const clearErrorAction = () => ({
  type: AUTH_ACTION_TYPES.CLEAR_ERROR,
});

// Legacy action creator for backward compatibility
export const addUserRequest = (payload: any) => ({
  type: AUTH_ACTION_TYPES.ADD_USER,
  payload,
});

