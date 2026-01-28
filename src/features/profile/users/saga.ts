import { call, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { USERS_ACTION_TYPES } from "./constants";
import { rolesApi, usersApi } from "./api";
import {
  createUserFailure,
  createUserRequest,
  createUserSuccess,
  deleteUserFailure,
  deleteUserRequest,
  deleteUserSuccess,
  getRolesFailure,
  getRolesRequest,
  getRolesSuccess,
  getUsersFailure,
  getUsersRequest,
  getUsersSuccess,
  updateUserFailure,
  updateUserRequest,
  updateUserSuccess,
} from "./slice";
import { getUsersRequestAction } from "./actions";
import type { CreateUserRequest as CreateUserRequestPayload } from "./types";

function* getUsersWorker(action: { type: string; payload: { page: number } }): SagaIterator {
  try {
    const page = action.payload?.page ?? 1;
    yield put(getUsersRequest({ page }));
    const response = yield call(usersApi.list, page);
    yield put(getUsersSuccess({ page, response }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch users";
    yield put(getUsersFailure(message));
  }
}

function* getRolesWorker(action: { type: string; payload: { page: number } }): SagaIterator {
  try {
    const page = action.payload?.page ?? 1;
    yield put(getRolesRequest({ page }));
    const response = yield call(rolesApi.list, page);
    yield put(getRolesSuccess({ page, response }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch roles";
    yield put(getRolesFailure(message));
  }
}

function* updateUserWorker(action: {
  type: string;
  payload: { endpoint: string; data: Record<string, unknown> | FormData; refreshPage?: number };
}): SagaIterator {
  try {
    yield put(updateUserRequest());
    yield call(usersApi.update, action.payload.endpoint, action.payload.data);
    yield put(updateUserSuccess());
    yield put(getUsersRequestAction(action.payload.refreshPage ?? 1));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update user";
    yield put(updateUserFailure(message));
  }
}

function* createUserWorker(action: {
  type: string;
  payload: { data: CreateUserRequestPayload; refreshPage?: number };
}): SagaIterator {
  try {
    yield put(createUserRequest());
    yield call(usersApi.create, action.payload.data);
    yield put(createUserSuccess());
    yield put(getUsersRequestAction(action.payload.refreshPage ?? 1));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create user";
    yield put(createUserFailure(message));
  }
}

function* deleteUserWorker(action: {
  type: string;
  payload: { endpoint: string; refreshPage?: number };
}): SagaIterator {
  try {
    yield put(deleteUserRequest());
    yield call(usersApi.remove, action.payload.endpoint);
    yield put(deleteUserSuccess());
    yield put(getUsersRequestAction(action.payload.refreshPage ?? 1));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete user";
    yield put(deleteUserFailure(message));
  }
}

export function* usersSaga() {
  yield takeLatest(USERS_ACTION_TYPES.GET_USERS_REQUEST, getUsersWorker);
  yield takeLatest(USERS_ACTION_TYPES.GET_ROLES_REQUEST, getRolesWorker);
  yield takeLatest(USERS_ACTION_TYPES.UPDATE_USER_REQUEST, updateUserWorker);
  yield takeLatest(USERS_ACTION_TYPES.CREATE_USER_REQUEST, createUserWorker);
  yield takeLatest(USERS_ACTION_TYPES.DELETE_USER_REQUEST, deleteUserWorker);
}

