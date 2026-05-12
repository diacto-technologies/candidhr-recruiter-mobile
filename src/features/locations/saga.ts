import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';

import { locationsApi } from './api';
import {
  locationAutocompleteRequest,
  locationAutocompleteSuccess,
  locationAutocompleteFailure,
  selectLocationRequest,
  selectLocationSuccess,
  selectLocationFailure,
} from './slice';
import type {
  LocationAutocompleteEnvelope,
  LocationAutocompleteItem,
  LocationSelectEnvelope,
} from './types';

function* locationAutocompleteWorker(
  action: PayloadAction<{ q: string; page?: number; page_size?: number }>
): Generator<unknown, void, LocationAutocompleteEnvelope> {
  try {
    const res = yield call(locationsApi.autocomplete, action.payload);
    const rows = Array.isArray(res?.data) ? res.data : [];
    yield put(locationAutocompleteSuccess(rows));
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Could not load locations';
    yield put(locationAutocompleteFailure(message));
  }
}

function* selectLocationWorker(
  action: PayloadAction<LocationAutocompleteItem>
): Generator<unknown, void, LocationSelectEnvelope> {
  try {
    const res = yield call(locationsApi.selectLocation, action.payload);
    if (res?.success && res.data) {
      yield put(selectLocationSuccess(res.data));
    } else {
      yield put(
        selectLocationFailure(
          typeof res?.message === 'string'
            ? res.message
            : 'Could not save location'
        )
      );
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Could not save location';
    yield put(selectLocationFailure(message));
  }
}

export function* locationsSaga(): Generator<unknown, void, unknown> {
  yield takeLatest(
    locationAutocompleteRequest.type,
    locationAutocompleteWorker
  );
  yield takeLatest(selectLocationRequest.type, selectLocationWorker);
}
