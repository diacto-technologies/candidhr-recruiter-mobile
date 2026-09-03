import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const selectRapidhireState = (state: RootState) => state.rapidhire;

export const selectRapidhireCandidates = createSelector(
  [selectRapidhireState],
  state => state?.candidates ?? [],
);

export const selectRapidhireLoading = createSelector(
  [selectRapidhireState],
  state => state?.loading ?? false,
);

export const selectRapidhireError = createSelector(
  [selectRapidhireState],
  state => state?.error ?? null,
);

export const selectRapidhirePagination = createSelector(
  [selectRapidhireState],
  state => state?.pagination ?? { page: 1, count: 0, hasMore: false },
);

export const selectRapidhireHasMore = createSelector(
  [selectRapidhireState],
  state => state?.pagination?.hasMore ?? false,
);

export const selectRapidhireSummary = createSelector(
  [selectRapidhireState],
  state => state?.summary ?? null,
);

export const selectRapidlyInterviewReport = createSelector(
  [selectRapidhireState],
  state => state?.interviewReport ?? null,
);

export const selectRapidlyInterviewReportLoading = createSelector(
  [selectRapidhireState],
  state => state?.loadingInterviewReport ?? false,
);

export const selectRapidlyInterviewReportError = createSelector(
  [selectRapidhireState],
  state => state?.interviewReportError ?? null,
);
