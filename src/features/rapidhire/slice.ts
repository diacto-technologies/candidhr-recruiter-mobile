import { createSlice } from '@reduxjs/toolkit';
import { RapidhireState } from './types';
import {
  getRapidhireCandidatesRequestAction,
  getRapidhireCandidatesSuccessAction,
  getRapidhireCandidatesFailureAction,
  resetRapidhireCandidatesAction,
  getRapidlyInterviewReportRequestAction,
  getRapidlyInterviewReportSuccessAction,
  getRapidlyInterviewReportFailureAction,
  resetRapidlyInterviewReportAction,
} from './actions';

const initialState: RapidhireState = {
  candidates: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    count: 0,
    hasMore: false,
  },
  summary: null,

  interviewReport: null,
  loadingInterviewReport: false,
  interviewReportError: null,
};

const rapidhireSlice = createSlice({
  name: 'rapidhire',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Candidates List
      .addCase(getRapidhireCandidatesRequestAction, (state, action) => {
        state.loading = true;
        state.error = null;
        if (action.payload.reset) {
          state.candidates = [];
          state.pagination.page = 1;
        }
      })
      .addCase(getRapidhireCandidatesSuccessAction, (state, action) => {
        const { data, page, append } = action.payload;
        state.loading = false;
        state.error = null;
        state.candidates = append ? [...state.candidates, ...(data.results ?? [])] : (data.results ?? []);
        state.pagination = {
          page,
          count: data.count ?? 0,
          hasMore: Boolean(data.has_more),
        };
        state.summary = data.summary ?? null;
      })
      .addCase(getRapidhireCandidatesFailureAction, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetRapidhireCandidatesAction, state => {
        state.candidates = [];
        state.loading = false;
        state.error = null;
        state.pagination = {
          page: 1,
          count: 0,
          hasMore: false,
        };
        state.summary = null;
      })

      // Interview Report
      .addCase(getRapidlyInterviewReportRequestAction, state => {
        state.loadingInterviewReport = true;
        state.interviewReportError = null;
      })
      .addCase(getRapidlyInterviewReportSuccessAction, (state, action) => {
        state.loadingInterviewReport = false;
        state.interviewReport = action.payload;
        state.interviewReportError = null;
      })
      .addCase(getRapidlyInterviewReportFailureAction, (state, action) => {
        state.loadingInterviewReport = false;
        state.interviewReportError = action.payload;
      })
      .addCase(resetRapidlyInterviewReportAction, state => {
        state.interviewReport = null;
        state.loadingInterviewReport = false;
        state.interviewReportError = null;
      });
  },
});

export default rapidhireSlice.reducer;
