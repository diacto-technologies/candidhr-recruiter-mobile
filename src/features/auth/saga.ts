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
import { LoginRequest, RegisterRequest } from "./types";

// Worker sagas
function* loginWorker(action: { type: string; payload: LoginRequest }): Generator<any, void, any> {
  try {
    yield put(loginRequest(action.payload));
    const response = yield call(authApi.login, action.payload);
    yield put(loginSuccess(response));
  } catch (error: any) {
    yield put(loginFailure(error.message || "Login failed"));
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

// Watcher saga
export function* authSaga() {
  yield takeLatest(AUTH_ACTION_TYPES.LOGIN_REQUEST, loginWorker);
  yield takeLatest(AUTH_ACTION_TYPES.REGISTER_REQUEST, registerWorker);
  yield takeLatest(AUTH_ACTION_TYPES.LOGOUT_REQUEST, logoutWorker);
  yield takeLatest(AUTH_ACTION_TYPES.REFRESH_TOKEN_REQUEST, refreshTokenWorker);
  // Legacy watcher for backward compatibility
  yield takeLatest(AUTH_ACTION_TYPES.ADD_USER, addUserWorker);
}

