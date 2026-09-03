import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { rapidhireApi } from './api';
import {
  getRapidhireCandidatesRequestAction,
  getRapidhireCandidatesSuccessAction,
  getRapidhireCandidatesFailureAction,
  getRapidlyInterviewReportRequestAction,
  getRapidlyInterviewReportSuccessAction,
  getRapidlyInterviewReportFailureAction,
} from './actions';
import {
  GetRapidhireCandidatesParams,
  RapidhireCandidatesResponse,
  RapidlyInterviewReportResponse,
} from './types';

function* handleGetRapidhireCandidates(action: PayloadAction<GetRapidhireCandidatesParams>) {
  try {
    const { page = 1, append = false } = action.payload;
    const response: RapidhireCandidatesResponse = yield call(rapidhireApi.getCandidates, action.payload);
    yield put(
      getRapidhireCandidatesSuccessAction({
        data: response,
        page,
        append,
      }),
    );
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch rapidhire candidates';
    yield put(getRapidhireCandidatesFailureAction(errorMessage));
  }
}

function* handleGetRapidlyInterviewReport(action: PayloadAction<string>) {
  try {
    const applicationId = action.payload;
    const response: RapidlyInterviewReportResponse = yield call(
      rapidhireApi.getInterviewReport,
      applicationId,
    );
    yield put(getRapidlyInterviewReportSuccessAction(response));
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || error?.message || 'Failed to fetch rapidly interview report';
    yield put(getRapidlyInterviewReportFailureAction(errorMessage));
  }
}

export function* rapidhireSaga() {
  yield takeLatest(getRapidhireCandidatesRequestAction.type, handleGetRapidhireCandidates);
  yield takeLatest(getRapidlyInterviewReportRequestAction.type, handleGetRapidlyInterviewReport);
}
