import type { RootState } from '../../store';

export const selectLocationAutocompleteResults = (state: RootState) =>
  state.locations.autocompleteResults;

export const selectLocationAutocompleteLoading = (state: RootState) =>
  state.locations.autocompleteLoading;

export const selectLocationAutocompleteError = (state: RootState) =>
  state.locations.autocompleteError;

export const selectSavedLocation = (state: RootState) =>
  state.locations.selectedLocation;

export const selectLocationSelectLoading = (state: RootState) =>
  state.locations.selectLoading;

export const selectLocationSelectError = (state: RootState) =>
  state.locations.selectError;
