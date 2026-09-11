import { createAction } from '@reduxjs/toolkit';
import { RAPIDHIRE_ACTION_TYPES } from './constants';
import {
  GetRapidhireCandidatesParams,
  RapidhireCandidatesResponse,
  RapidlyInterviewReportResponse,
  SendInterviewLinkResponse,
} from './types';

// Candidates List Actions
export const getRapidhireCandidatesRequestAction = createAction<GetRapidhireCandidatesParams>(
  RAPIDHIRE_ACTION_TYPES.GET_CANDIDATES_REQUEST,
);

export const getRapidhireCandidatesSuccessAction = createAction<{
  data: RapidhireCandidatesResponse;
  page: number;
  append: boolean;
}>(RAPIDHIRE_ACTION_TYPES.GET_CANDIDATES_SUCCESS);

export const getRapidhireCandidatesFailureAction = createAction<string>(
  RAPIDHIRE_ACTION_TYPES.GET_CANDIDATES_FAILURE,
);

export const resetRapidhireCandidatesAction = createAction(
  RAPIDHIRE_ACTION_TYPES.RESET_CANDIDATES,
);

// Interview Report Actions
export const getRapidlyInterviewReportRequestAction = createAction<string>(
  RAPIDHIRE_ACTION_TYPES.GET_INTERVIEW_REPORT_REQUEST,
);

export const getRapidlyInterviewReportSuccessAction = createAction<RapidlyInterviewReportResponse>(
  RAPIDHIRE_ACTION_TYPES.GET_INTERVIEW_REPORT_SUCCESS,
);

export const getRapidlyInterviewReportFailureAction = createAction<string>(
  RAPIDHIRE_ACTION_TYPES.GET_INTERVIEW_REPORT_FAILURE,
);

export const resetRapidlyInterviewReportAction = createAction(
  RAPIDHIRE_ACTION_TYPES.RESET_INTERVIEW_REPORT,
);

// Send Interview Link Actions
export const sendInterviewLinkRequestAction = createAction<string>(
  RAPIDHIRE_ACTION_TYPES.SEND_INTERVIEW_LINK_REQUEST,
);

export const sendInterviewLinkSuccessAction = createAction<{
  applicationId: string;
  response: SendInterviewLinkResponse;
}>(RAPIDHIRE_ACTION_TYPES.SEND_INTERVIEW_LINK_SUCCESS);

export const sendInterviewLinkFailureAction = createAction<string>(
  RAPIDHIRE_ACTION_TYPES.SEND_INTERVIEW_LINK_FAILURE,
);
