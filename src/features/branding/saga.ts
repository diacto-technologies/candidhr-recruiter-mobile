import { call, put, takeLatest } from 'redux-saga/effects';
import { BRANDING_ACTION_TYPES } from './constants';
import {
  getBrandingRequest,
  getBrandingSuccess,
  getBrandingFailure,
  updateBrandingRequest,
  updateBrandingSuccess,
  updateBrandingFailure,
} from './slice';
import { brandingApi } from './api';
import { showToastMessage } from '../../utils/toast';
import { BrandingData, UpdateBrandingPayload } from './types';

function* getBrandingWorker(): Generator<unknown, void, BrandingData> {
  try {
    yield put(getBrandingRequest());
    const response = yield call(brandingApi.getBranding);
    yield put(getBrandingSuccess(response));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch branding details';
    if (__DEV__) {
      console.log('Failed to fetch branding:', message);
    }
    yield put(getBrandingFailure(message));
  }
}

function* updateBrandingWorker(action: {
  type: string;
  payload: UpdateBrandingPayload;
  meta?: { isReset?: boolean; submittedProductName?: string };
}): Generator<unknown, void, BrandingData> {
  try {
    const isReset = action.meta?.isReset ?? false;
    const submittedProductName = action.meta?.submittedProductName;
    yield put(updateBrandingRequest({ isReset }));
    const response = yield call(brandingApi.updateBranding, action.payload);
    yield put(updateBrandingSuccess({ data: response, submittedProductName }));
    showToastMessage('Branding updated successfully', 'success');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update branding';
    if (__DEV__) {
      console.log('Failed to update branding:', message);
    }
    yield put(updateBrandingFailure(message));
    showToastMessage(message, 'error');
  }
}

export function* brandingSaga() {
  yield takeLatest(BRANDING_ACTION_TYPES.GET_BRANDING_REQUEST, getBrandingWorker);
  yield takeLatest(BRANDING_ACTION_TYPES.UPDATE_BRANDING_REQUEST, updateBrandingWorker);
}
