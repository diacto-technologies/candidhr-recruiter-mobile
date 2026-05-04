import { call, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { WORKFLOWS_ACTION_TYPES } from "./constants";
import { workflowsApi } from "./api";
import { getWorkflowsFailure, getWorkflowsRequest, getWorkflowsSuccess } from "./slice";
import type { GetWorkflowsRequestPayload } from "./actions";
import { showToastMessage } from "../../utils/toast";

function* getWorkflowsWorker(action: {
  type: string;
  payload: GetWorkflowsRequestPayload;
}): SagaIterator {
  const page = action.payload?.page ?? 1;
  const pageSize = action.payload?.pageSize ?? 10;
  const nameIcontains = action.payload?.nameIcontains ?? "";
  try {
    yield put(getWorkflowsRequest({ page, pageSize, nameIcontains }));
    const response = yield call(workflowsApi.list, { page, pageSize, nameIcontains });
    yield put(getWorkflowsSuccess({ page, response }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch workflows";
    yield put(getWorkflowsFailure(message));
    showToastMessage(message, "error");
  }
}

export function* workflowsSaga(): SagaIterator {
  yield takeLatest(WORKFLOWS_ACTION_TYPES.GET_WORKFLOWS_REQUEST, getWorkflowsWorker);
}
