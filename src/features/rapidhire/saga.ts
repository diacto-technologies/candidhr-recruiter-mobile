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
  sendInterviewLinkRequestAction,
  sendInterviewLinkSuccessAction,
  sendInterviewLinkFailureAction,
} from './actions';
import {
  GetRapidhireCandidatesParams,
  RapidhireCandidatesResponse,
  RapidlyInterviewReportResponse,
  SendInterviewLinkResponse,
} from './types';
import { showToastMessage } from '../../utils/toast';

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

function* handleSendInterviewLink(action: PayloadAction<string>) {
  try {
    const applicationId = action.payload;
    console.log('[handleSendInterviewLink Saga] Action dispatched for applicationId:', applicationId);
    const response: SendInterviewLinkResponse = yield call(
      rapidhireApi.sendInterviewLink,
      applicationId,
    );
    console.log('[handleSendInterviewLink Saga] API Success response received:', response);
    yield put(sendInterviewLinkSuccessAction({ applicationId, response }));
    showToastMessage('Interview link sent successfully', 'success');
  } catch (error: any) {
    console.log(
      '[handleSendInterviewLink Saga] API Error caught:',
      error?.response?.status,
      error?.response?.data || error?.message || error
    );
    const errorMessage =
      error?.response?.data?.message || error?.message || 'Failed to send interview link';
    yield put(sendInterviewLinkFailureAction(errorMessage));
    showToastMessage(errorMessage, 'error');
  }
}

export function* rapidhireSaga() {
  yield takeLatest(getRapidhireCandidatesRequestAction.type, handleGetRapidhireCandidates);
  yield takeLatest(getRapidlyInterviewReportRequestAction.type, handleGetRapidlyInterviewReport);
  yield takeLatest(sendInterviewLinkRequestAction.type, handleSendInterviewLink);
}
