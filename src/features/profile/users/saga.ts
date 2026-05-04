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
  directoryListFailure,
  directoryListRequest,
  directoryListSuccess,
  getRolesFailure,
  getRolesRequest,
  getRolesSuccess,
  getInvitesFailure,
  getInvitesRequest,
  getInvitesSuccess,
  getUsersFailure,
  getUsersRequest,
  getUsersSuccess,
  updateUserFailure,
  updateUserRequest,
  updateUserSuccess,
} from "./slice";
import { getInvitesRequestAction, getUsersRequestAction } from "./actions";
import type { CreateUserRequest as CreateUserRequestPayload } from "./types";
import { showToastMessage } from "../../../utils/toast";

function* getUsersWorker(action: { type: string; payload: { page: number } }): SagaIterator {
  try {
    const page = action.payload?.page ?? 1;
    yield put(getUsersRequest({ page }));

    // Single-page fetch; caller (screen/dropdown) is responsible for requesting next pages
    const response = yield call(usersApi.list, page);
    yield put(getUsersSuccess({ page, response }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch users";
    yield put(getUsersFailure(message));
  }
}

function* getInvitesWorker(action: { type: string; payload: { page: number } }): SagaIterator {
  try {
    const page = action.payload?.page ?? 1;
    yield put(getInvitesRequest({ page }));
    const response = yield call(usersApi.invitesList, page);
    yield put(getInvitesSuccess({ page, response }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch invites";
    yield put(getInvitesFailure(message));
  }
}

function* fetchDirectoryUsersListWorker(action: {
  type: string;
  payload: { page: number };
}): SagaIterator {
  try {
    const page = action.payload?.page ?? 1;
    yield put(directoryListRequest({ page }));
    const response = yield call(usersApi.directoryList, page);
    yield put(directoryListSuccess({ page, response }));
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch user directory";
    yield put(directoryListFailure(message));
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
    showToastMessage("User's role updated", 'success');
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
    showToastMessage('User added successfully', 'success');
    yield put(getUsersRequestAction(action.payload.refreshPage ?? 1));
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to create user';
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
    showToastMessage('User removed successfully', 'success');
    yield put(getUsersRequestAction(action.payload.refreshPage ?? 1));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete user";
    yield put(deleteUserFailure(message));
  }
}

function* inviteResendWorker(action: { type: string; payload: { inviteId: string } }): SagaIterator {
  try {
    const res: any = yield call(usersApi.resendInvite, action.payload.inviteId);
    showToastMessage(res?.message ?? "Invite resent successfully.", "success");
    yield put(getInvitesRequestAction(1));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to resend invite";
    showToastMessage(message, "error");
  }
}

function* inviteRevokeWorker(action: { type: string; payload: { inviteId: string } }): SagaIterator {
  try {
    const res: any = yield call(usersApi.revokeInvite, action.payload.inviteId);
    showToastMessage(res?.message ?? "Invite revoked successfully.", "success");
    yield put(getInvitesRequestAction(1));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to revoke invite";
    showToastMessage(message, "error");
  }
}

export function* usersSaga() {
  yield takeLatest(USERS_ACTION_TYPES.GET_USERS_REQUEST, getUsersWorker);
  yield takeLatest(USERS_ACTION_TYPES.GET_INVITES_REQUEST, getInvitesWorker);
  yield takeLatest(
    USERS_ACTION_TYPES.FETCH_DIRECTORY_USERS_LIST_REQUEST,
    fetchDirectoryUsersListWorker
  );
  yield takeLatest(USERS_ACTION_TYPES.GET_ROLES_REQUEST, getRolesWorker);
  yield takeLatest(USERS_ACTION_TYPES.UPDATE_USER_REQUEST, updateUserWorker);
  yield takeLatest(USERS_ACTION_TYPES.CREATE_USER_REQUEST, createUserWorker);
  yield takeLatest(USERS_ACTION_TYPES.DELETE_USER_REQUEST, deleteUserWorker);
  yield takeLatest(USERS_ACTION_TYPES.INVITE_RESEND_REQUEST, inviteResendWorker);
  yield takeLatest(USERS_ACTION_TYPES.INVITE_REVOKE_REQUEST, inviteRevokeWorker);
}

