import { call, put, takeLatest, select } from "redux-saga/effects";
import { AUTH_ACTION_TYPES } from "./constants";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logoutRequest,
  logoutSuccess,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
  setUser,
  setLoading,
  setError,
} from "./slice";
import { authApi } from "./api";
import { selectRefreshToken } from "./selectors";
import { LoginRequest, LoginResponse, RegisterRequest } from "./types";
import { getProfileRequest } from "../profile/slice";
import { forgotPasswordFailureAction, forgotPasswordSuccessAction, resetPasswordFailureAction, resetPasswordSuccessAction } from "./actions";
import { navigate } from "../../utils/navigationUtils";

// Worker sagas
function* loginWorker(action: { type: string; payload: LoginRequest }): Generator<any, void, any> {
  try {
    yield put(loginRequest(action.payload));
    const response = yield call(authApi.login, action.payload);

    console.log(response, "Loginresponse")
    const mapped: LoginResponse = {
      user: {
        id: response.user_id,
      },
      token: response.access,
      refreshToken: response.refresh,
      tenant: response.tenant,
    };
    yield put(loginSuccess(mapped));
    yield put(getProfileRequest(response.user_id));
  } catch (error: any) {
    // Log detailed error for debugging
    if (__DEV__) {
      console.error('Login Error:', {
        message: error.message,
        error: error,
        stack: error.stack,
      });
    }

    // Extract more detailed error message
    let errorMessage = "Login failed";
    if (error.message) {
      errorMessage = error.message;
    } else if (error.response) {
      errorMessage = error.response.message || error.response.error || errorMessage;
    }

    yield put(loginFailure(errorMessage));
  }
}

function* registerWorker(action: { type: string; payload: RegisterRequest }): Generator<any, void, any> {
  try {
    yield put(registerRequest(action.payload));
    const response = yield call(authApi.register, action.payload);
    yield put(registerSuccess(response));
  } catch (error: any) {
    yield put(registerFailure(error.message || "Registration failed"));
  }
}

function* logoutWorker(): Generator<any, void, any> {
  try {
    yield put(logoutRequest());
    yield call(authApi.logout);
    yield put(logoutSuccess());
  } catch (error: any) {
    // Even if API call fails, clear local state
    yield put(logoutSuccess());
  }
}

function* refreshTokenWorker(): Generator<any, void, any> {
  try {
    yield put(refreshTokenRequest());
    const refreshToken = yield select(selectRefreshToken);
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    const response = yield call(authApi.refreshToken, refreshToken);
    yield put(refreshTokenSuccess(response));
  } catch (error: any) {
    yield put(refreshTokenFailure(error.message || "Token refresh failed"));
    // If refresh fails, logout user
    yield put(logoutSuccess());
  }
}

// Legacy worker for backward compatibility
function* addUserWorker(): Generator<any, void, any> {
  try {
    yield put(setLoading(true));
    yield put(setError(null));
    const response = yield call(authApi.fetchPostsApi);
    yield put(setUser(response));
  } catch (error: any) {
    yield put(setError("Failed to fetch posts"));
  } finally {
    yield put(setLoading(false));
  }
}

function* forgotPasswordWorker(action: any): Generator<any, void, any> {
  try {
    const response = yield call(authApi.sendResetPasswordEmail, action.payload);
    yield put(forgotPasswordSuccessAction(response.message));
    navigate("CreateNewPasswordScreen");
  } catch (error: any) {
    yield put(forgotPasswordFailureAction(error.Error));
  }
}

function* resetPasswordWorker(action: any): Generator<any, void, any> {
  try {
    const { uid, token, password, password2 } = action.payload;

    const response = yield call(authApi.resetPassword, uid, token, {
      password,
      password2,
    });

    yield put(resetPasswordSuccessAction(response.message));

    navigate("LoginScreen"); // Redirect to login
  } catch (error: any) {
    yield put(resetPasswordFailureAction(error.message || "Reset password failed"));
  }
}

// Watcher saga
export function* authSaga() {
  yield takeLatest(AUTH_ACTION_TYPES.LOGIN_REQUEST, loginWorker);
  yield takeLatest(AUTH_ACTION_TYPES.REGISTER_REQUEST, registerWorker);
  yield takeLatest(AUTH_ACTION_TYPES.LOGOUT_REQUEST, logoutWorker);
  yield takeLatest(AUTH_ACTION_TYPES.REFRESH_TOKEN_REQUEST, refreshTokenWorker);
  yield takeLatest(AUTH_ACTION_TYPES.FORGOT_PASSWORD_REQUEST, forgotPasswordWorker);
  // Legacy watcher for backward compatibility
  yield takeLatest(AUTH_ACTION_TYPES.ADD_USER, addUserWorker);
  yield takeLatest(AUTH_ACTION_TYPES.RESET_PASSWORD_REQUEST, resetPasswordWorker);
}

