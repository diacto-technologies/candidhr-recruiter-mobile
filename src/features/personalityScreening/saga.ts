import { call, put, select, takeLatest } from "redux-saga/effects";
import { PERSONALITY_SCREENING_ACTION_TYPES, DEFAULT_ORDER } from "./constants";
import {
  getListRequest,
  getListSuccess,
  getListFailure,
} from "./slice";
import { personalityScreeningApi } from "./api";
import { selectPersonalityScreeningFilters } from "./selectors";
import type {
  GetPersonalityScreeningListPayload,
  PersonalityScreeningFilters,
} from "./types";

function* getListWorker(
  action: { type: string; payload?: GetPersonalityScreeningListPayload }
): Generator<any, void, any> {
  try {
    const payload = action.payload || {};
    const { page = 1, append = false } = payload;
    const filters = (yield select(
      selectPersonalityScreeningFilters
    )) as PersonalityScreeningFilters;

    const params = {
      ...filters,
      page,
      o: DEFAULT_ORDER,
    };

    yield put(getListRequest({ page, append, ...payload }));

    const data = yield call(personalityScreeningApi.getList, params);

    yield put(getListSuccess({ page, append, data }));
  } catch (error: any) {
    yield put(
      getListFailure(error?.message ?? "Failed to fetch personality screening list")
    );
  }
}

export function* personalityScreeningSaga() {
  yield takeLatest(
    PERSONALITY_SCREENING_ACTION_TYPES.GET_LIST_TRIGGER,
    getListWorker
  );
}
