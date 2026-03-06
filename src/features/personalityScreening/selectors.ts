import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const selectPersonalityScreeningState = (state: RootState) =>
  state.personalityScreening;

export const selectPersonalityScreeningList = createSelector(
  [selectPersonalityScreeningState],
  (state) => state.list
);

export const selectPersonalityScreeningLoading = createSelector(
  [selectPersonalityScreeningState],
  (state) => state.loading
);

export const selectPersonalityScreeningError = createSelector(
  [selectPersonalityScreeningState],
  (state) => state.error
);

export const selectPersonalityScreeningPagination = createSelector(
  [selectPersonalityScreeningState],
  (state) => state.pagination
);

export const selectPersonalityScreeningHasMore = createSelector(
  [selectPersonalityScreeningState],
  (state) => state.hasMore
);

export const selectPersonalityScreeningFilters = createSelector(
  [selectPersonalityScreeningState],
  (state) => state.filters
);
