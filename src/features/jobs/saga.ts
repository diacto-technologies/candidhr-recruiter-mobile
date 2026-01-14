import { call, CallEffect, put, PutEffect, takeLatest } from "redux-saga/effects";
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
import { GetJobsRequestActionPayload } from "./actions";
import { JobsListApiResponse } from "./types";
import { PayloadAction } from "@reduxjs/toolkit";

function* getJobsWorker(
  action: { type: string; payload?: GetJobsRequestActionPayload }
): Generator<any, void, any> {
  try {
    const payload = action.payload;
    yield put(getJobsRequest(payload));

    const response: JobsListApiResponse = yield call(
      jobsApi.getJobs,
      payload
    );
    console.log(response, "getJobsWorkergetJobsWorkergetJobsWorker")

    yield put(
      getJobsSuccess({
        page: payload?.page ?? 1,
        append: payload?.append ?? false,
        published: payload?.published ?? true,
        data: response,
      })
    );
  } catch (error: any) {
    yield put(getJobsFailure(error.message || "Failed to fetch jobs"));
  }
}

function* getPublishedJobsWorker(
  action: PayloadAction<GetJobsRequestActionPayload | undefined>
): Generator<CallEffect | PutEffect, void, JobsListApiResponse> {
  try {
    const payload = { ...(action.payload ?? {}), published: true };

    yield put(getJobsRequest(payload));

    const response = yield call(jobsApi.getJobs, payload);

    yield put(
      getJobsSuccess({
        page: payload.page ?? 1,
        append: payload.append ?? false,
        published: true,
        data: response,
      })
    );
  } catch (error: any) {
    yield put(getJobsFailure(error.message));
  }
}


function* getUnpublishedJobsWorker(
  action: PayloadAction<GetJobsRequestActionPayload | undefined>
): Generator<CallEffect | PutEffect, void, JobsListApiResponse> {
  try {
    const payload = { ...(action.payload ?? {}), published: false };

    yield put(getJobsRequest(payload));

    const response = yield call(jobsApi.getJobs, payload);

    yield put(
      getJobsSuccess({
        page: payload.page ?? 1,
        append: payload.append ?? false,
        published: false,
        data: response,
      })
    );
  } catch (error: any) {
    yield put(getJobsFailure(error.message));
  }
}

function* getJobDetailWorker(action: { type: string; payload: string }): Generator<any, void, any> {
  try {
    yield put(getJobDetailRequest(action.payload));
    const response = yield call(jobsApi.getJobDetail, action.payload);
    console.log(response, "getJobDetailWorkergetJobDetailWorkergetJobDetailWorkergetJobDetailWorker")
    yield put(getJobDetailSuccess(response));
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
  yield takeLatest(JOBS_ACTION_TYPES.GET_PUBLISHED_JOBS_REQUEST, getPublishedJobsWorker);
  yield takeLatest(JOBS_ACTION_TYPES.GET_UNPUBLISHED_JOBS_REQUEST, getUnpublishedJobsWorker);
  yield takeLatest(JOBS_ACTION_TYPES.GET_JOBS_REQUEST, getJobsWorker);
  yield takeLatest(JOBS_ACTION_TYPES.GET_JOB_DETAIL_REQUEST, getJobDetailWorker);
  yield takeLatest(JOBS_ACTION_TYPES.CREATE_JOB_REQUEST, createJobWorker);
  yield takeLatest(JOBS_ACTION_TYPES.UPDATE_JOB_REQUEST, updateJobWorker);
  yield takeLatest(JOBS_ACTION_TYPES.DELETE_JOB_REQUEST, deleteJobWorker);
}

