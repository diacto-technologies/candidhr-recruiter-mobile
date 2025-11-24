import { call, put, takeLatest } from "redux-saga/effects";
import { APPLICATIONS_ACTION_TYPES } from "./constants";
import {
  getApplicationsRequest,
  getApplicationsSuccess,
  getApplicationsFailure,
  getApplicationDetailRequest,
  getApplicationDetailSuccess,
  getApplicationDetailFailure,
  createApplicationRequest,
  createApplicationSuccess,
  createApplicationFailure,
  updateApplicationStatusRequest,
  updateApplicationStatusSuccess,
  updateApplicationStatusFailure,
} from "./slice";
import { applicationsApi } from "./api";

function* getApplicationsWorker(action: { type: string; payload?: { page?: number; limit?: number; jobId?: string } }): Generator<any, void, any> {
  try {
    yield put(getApplicationsRequest(action.payload));
    const response = yield call(applicationsApi.getApplications, action.payload);
    yield put(getApplicationsSuccess(response));
  } catch (error: any) {
    yield put(getApplicationsFailure(error.message || "Failed to fetch applications"));
  }
}

function* getApplicationDetailWorker(action: { type: string; payload: string }): Generator<any, void, any> {
  try {
    yield put(getApplicationDetailRequest(action.payload));
    const response = yield call(applicationsApi.getApplicationDetail, action.payload);
    yield put(getApplicationDetailSuccess(response.application));
  } catch (error: any) {
    yield put(getApplicationDetailFailure(error.message || "Failed to fetch application details"));
  }
}

function* createApplicationWorker(action: { type: string; payload: any }): Generator<any, void, any> {
  try {
    yield put(createApplicationRequest(action.payload));
    const response = yield call(applicationsApi.createApplication, action.payload);
    yield put(createApplicationSuccess(response.application));
  } catch (error: any) {
    yield put(createApplicationFailure(error.message || "Failed to create application"));
  }
}

function* updateApplicationStatusWorker(action: { type: string; payload: any }): Generator<any, void, any> {
  try {
    yield put(updateApplicationStatusRequest(action.payload));
    const response = yield call(applicationsApi.updateApplicationStatus, action.payload);
    yield put(updateApplicationStatusSuccess(response.application));
  } catch (error: any) {
    yield put(updateApplicationStatusFailure(error.message || "Failed to update application status"));
  }
}

export function* applicationsSaga() {
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_APPLICATIONS_REQUEST, getApplicationsWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.GET_APPLICATION_DETAIL_REQUEST, getApplicationDetailWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.CREATE_APPLICATION_REQUEST, createApplicationWorker);
  yield takeLatest(APPLICATIONS_ACTION_TYPES.UPDATE_APPLICATION_STATUS_REQUEST, updateApplicationStatusWorker);
}

