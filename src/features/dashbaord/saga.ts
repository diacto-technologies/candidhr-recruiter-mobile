import { call, put, takeLatest } from "redux-saga/effects";
import { ANALYTICS_ACTION_TYPES } from "./constants";
import {
  getAnalyticsRequest,
  getAnalyticsSuccess,
  getAnalyticsFailure,
  getStageGraphSuccess,
  getStageGraphFailure,
  getStageGraphRequest,
  getFeatureConsumptionSuccess,
  getFeatureConsumptionFailure,
  getWeeklyGraphSuccess,
  getWeeklyGraphFailure,
  getStageGraphOverviewSuccess,
  getStageGraphOverviewFailure,
} from "./slice";
import { dashboardApi } from "./api";
import { SagaIterator } from "redux-saga";
import { PayloadAction } from "@reduxjs/toolkit";

function* analyticsWorker(
  action: PayloadAction<{ jobId?: string }>
): SagaIterator {
  try {
    yield put(getAnalyticsRequest());

    const jobId = action.payload?.jobId;

    const response = yield call(dashboardApi.getAnalytics, jobId);
    yield put(getAnalyticsSuccess(response));
  } catch (error: any) {
    yield put(getAnalyticsFailure(error.message || "Failed to load analytics"));
  }
}

function* applicantsStageGraphWorker( action: PayloadAction<{ jobId?: string }>): SagaIterator {
  try {
    yield put(getStageGraphRequest());
    const jobId = action.payload?.jobId;
    const response = yield call(dashboardApi.getApplicantsStageGraph,jobId);
    yield put(getStageGraphSuccess(response));
  } catch (error: any) {
    yield put(getStageGraphFailure(error.message));
  }
}

function* featureConsumptionWorker( action: PayloadAction<{ jobId?: string }>): SagaIterator {
  try {
    const jobId = action.payload?.jobId;
    const response = yield call(dashboardApi.getFeatureConsumption,jobId);
    yield put(getFeatureConsumptionSuccess(response));
    console.log("featureConsumptionWorker", response);
  } catch (error: any) {
    yield put(getFeatureConsumptionFailure(error.message));
  }
}

function* weeklyGraphWorker(): Generator<any, void, any> {
  try {
    const response = yield call(dashboardApi.getWeeklyGraph);
    console.log("WEEKLY GRAPH DATA:", response);
    yield put(getWeeklyGraphSuccess(response));
  } catch (error: any) {
    yield put(getWeeklyGraphFailure(error.message));
  }
}

function* stageGraphOverviewWorker(action: PayloadAction<{ jobId?: string }>):SagaIterator {
  try {
    const jobId = action.payload?.jobId;
    const response = yield call(dashboardApi.getApplicantsStageGraphOverview,jobId);
    console.log(response,"getStageGraphOverviewSuccess")
    yield put(getStageGraphOverviewSuccess(response));
  } catch (error: any) {
    yield put(getStageGraphOverviewFailure(error.message));
  }
}


export function* dashbaordSaga() {
  yield takeLatest(ANALYTICS_ACTION_TYPES.GET_ANALYTICS_REQUEST, analyticsWorker);
  yield takeLatest(ANALYTICS_ACTION_TYPES.GET_STAGE_GRAPH_REQUEST, applicantsStageGraphWorker);
  yield takeLatest(ANALYTICS_ACTION_TYPES.GET_FEATURE_CONSUMPTION_REQUEST, featureConsumptionWorker);
  yield takeLatest(ANALYTICS_ACTION_TYPES.GET_WEEKLY_GRAPH_REQUEST, weeklyGraphWorker);
  yield takeLatest(ANALYTICS_ACTION_TYPES.GET_STAGE_GRAPH_OVERVIEW_REQUEST, stageGraphOverviewWorker);
}

