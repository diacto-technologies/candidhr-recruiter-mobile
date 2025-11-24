import { call, put, takeLatest } from "redux-saga/effects";
import { JOBS_ACTION_TYPES } from "./constants";
import {
  getJobsRequest,
  getJobsSuccess,
  getJobsFailure,
  getJobDetailRequest,
  getJobDetailSuccess,
  getJobDetailFailure,
  createJobRequest,
  createJobSuccess,
  createJobFailure,
  updateJobRequest,
  updateJobSuccess,
  updateJobFailure,
  deleteJobRequest,
  deleteJobSuccess,
  deleteJobFailure,
} from "./slice";
import { jobsApi } from "./api";

function* getJobsWorker(action: { type: string; payload?: { page?: number; limit?: number } }): Generator<any, void, any> {
  try {
    yield put(getJobsRequest(action.payload));
    const response = yield call(jobsApi.getJobs, action.payload);
    yield put(getJobsSuccess(response));
  } catch (error: any) {
    yield put(getJobsFailure(error.message || "Failed to fetch jobs"));
  }
}

function* getJobDetailWorker(action: { type: string; payload: string }): Generator<any, void, any> {
  try {
    yield put(getJobDetailRequest(action.payload));
    const response = yield call(jobsApi.getJobDetail, action.payload);
    yield put(getJobDetailSuccess(response.job));
  } catch (error: any) {
    yield put(getJobDetailFailure(error.message || "Failed to fetch job details"));
  }
}

function* createJobWorker(action: { type: string; payload: any }): Generator<any, void, any> {
  try {
    yield put(createJobRequest(action.payload));
    const response = yield call(jobsApi.createJob, action.payload);
    yield put(createJobSuccess(response.job));
  } catch (error: any) {
    yield put(createJobFailure(error.message || "Failed to create job"));
  }
}

function* updateJobWorker(action: { type: string; payload: any }): Generator<any, void, any> {
  try {
    yield put(updateJobRequest(action.payload));
    const response = yield call(jobsApi.updateJob, action.payload);
    yield put(updateJobSuccess(response.job));
  } catch (error: any) {
    yield put(updateJobFailure(error.message || "Failed to update job"));
  }
}

function* deleteJobWorker(action: { type: string; payload: string }): Generator<any, void, any> {
  try {
    yield put(deleteJobRequest(action.payload));
    yield call(jobsApi.deleteJob, action.payload);
    yield put(deleteJobSuccess(action.payload));
  } catch (error: any) {
    yield put(deleteJobFailure(error.message || "Failed to delete job"));
  }
}

export function* jobsSaga() {
  yield takeLatest(JOBS_ACTION_TYPES.GET_JOBS_REQUEST, getJobsWorker);
  yield takeLatest(JOBS_ACTION_TYPES.GET_JOB_DETAIL_REQUEST, getJobDetailWorker);
  yield takeLatest(JOBS_ACTION_TYPES.CREATE_JOB_REQUEST, createJobWorker);
  yield takeLatest(JOBS_ACTION_TYPES.UPDATE_JOB_REQUEST, updateJobWorker);
  yield takeLatest(JOBS_ACTION_TYPES.DELETE_JOB_REQUEST, deleteJobWorker);
}

