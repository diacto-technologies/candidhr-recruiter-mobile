import { call, put, takeLatest } from "redux-saga/effects";
import { ASSESSMENTS_ACTION_TYPES } from "./constants";
import {
  getAssessmentsRequest,
  getAssessmentsSuccess,
  getAssessmentsFailure,
  getAssignedAssessmentsRequest,
  getAssignedAssessmentsSuccess,
  getAssignedAssessmentsFailure,
} from "./slice";
import { assessmentsApi } from "./api";
import { GetAssignedAssessmentsPayload } from "./types";

function* getAssessmentsWorker(
  action: {
    type: string;
    payload?: { page?: number; append?: boolean };
  }
): Generator<any, void, any> {
  try {
    const { append = false, ...params } = action.payload || {};
    const page = params.page ?? 1;
    yield put(getAssessmentsRequest({ page, append }));

    const response = yield call(assessmentsApi.getAssessments, page);

    yield put(
      getAssessmentsSuccess({
        page,
        append,
        data: response,
      })
    );
  } catch (error: any) {
    yield put(
      getAssessmentsFailure(
        error.message || "Failed to fetch assessments"
      )
    );
  }
}

function* getAssignedAssessmentsWorker(
  action: {
    type: string;
    payload?: GetAssignedAssessmentsPayload;
  }
): Generator<any, void, any> {
  try {
    const { append = false, ...filters } = action.payload || {};
    const page = filters.page ?? 1;

    // Update slice state (loading, pagination) before API call
    yield put(
      getAssignedAssessmentsRequest({
        ...(filters || {}),
        page,
        append,
      })
    );

    const response = yield call(
      assessmentsApi.getAssignedAssessments,
      filters || {}
    );
    console.log(response,"hello")

    yield put(
      getAssignedAssessmentsSuccess({
        page,
        append,
        data: response,
      })
    );
  } catch (error: any) {
    yield put(
      getAssignedAssessmentsFailure(
        error.message || "Failed to fetch assigned assessments"
      )
    );
  }
}

export function* assessmentsSaga() {
  yield takeLatest(
    ASSESSMENTS_ACTION_TYPES.GET_ASSESSMENTS_REQUEST,
    getAssessmentsWorker
  );
  yield takeLatest(
    ASSESSMENTS_ACTION_TYPES.GET_ASSIGNED_ASSESSMENTS_REQUEST,
    getAssignedAssessmentsWorker
  );
}
