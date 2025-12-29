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

export const forgotPasswordRequestAction = (email: string) => ({
  type: AUTH_ACTION_TYPES.FORGOT_PASSWORD_REQUEST,
  payload: { email },
});

export const forgotPasswordSuccessAction = (message: string) => ({
  type: AUTH_ACTION_TYPES.FORGOT_PASSWORD_SUCCESS,
  payload: message,
});

export const forgotPasswordFailureAction = (error: string) => ({
  type: AUTH_ACTION_TYPES.FORGOT_PASSWORD_FAILURE,
  payload: error,
});

export const resetPasswordRequestAction = (payload: {
  uid: string;
  token: string;
  password: string;
  password2: string;
}) => ({
  type: AUTH_ACTION_TYPES.RESET_PASSWORD_REQUEST,
  payload,
});

export const resetPasswordSuccessAction = (message: string) => ({
  type: AUTH_ACTION_TYPES.RESET_PASSWORD_SUCCESS,
  payload: message,
});

export const resetPasswordFailureAction = (error: string) => ({
  type: AUTH_ACTION_TYPES.RESET_PASSWORD_FAILURE,
  payload: error,
});


