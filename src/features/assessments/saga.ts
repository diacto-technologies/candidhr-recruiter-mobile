import { call, put, takeLatest } from "redux-saga/effects";
import { ASSESSMENTS_ACTION_TYPES } from "./constants";
import {
  getAssessmentsRequest,
  getAssessmentsSuccess,
  getAssessmentsFailure,
} from "./slice";
import { assessmentsApi } from "./api";

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

    const response = yield call(
      assessmentsApi.getAssessments,
      page
    );
    console.log(response,"hello")

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

export function* assessmentsSaga() {
  yield takeLatest(
    ASSESSMENTS_ACTION_TYPES.GET_ASSESSMENTS_REQUEST,
    getAssessmentsWorker
  );
}
