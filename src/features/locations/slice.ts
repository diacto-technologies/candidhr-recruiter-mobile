import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  LocationAutocompleteItem,
  LocationsState,
  SavedLocationData,
} from './types';

export const locationsInitialState: LocationsState = {
  autocompleteResults: [],
  autocompleteLoading: false,
  autocompleteError: null,
  selectedLocation: null,
  selectLoading: false,
  selectError: null,
};

const locationsSlice = createSlice({
  name: 'locations',
  initialState: locationsInitialState,
  reducers: {
    locationAutocompleteRequest: (
      state,
      _action: PayloadAction<{ q: string; page?: number; page_size?: number }>
    ) => {
      state.autocompleteLoading = true;
      state.autocompleteError = null;
    },
    locationAutocompleteSuccess: (
      state,
      action: PayloadAction<LocationAutocompleteItem[]>
    ) => {
      state.autocompleteLoading = false;
      state.autocompleteResults = action.payload ?? [];
      state.autocompleteError = null;
    },
    locationAutocompleteFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.autocompleteLoading = false;
      state.autocompleteResults = [];
      state.autocompleteError = action.payload;
    },
    locationAutocompleteClear: (state) => {
      state.autocompleteResults = [];
      state.autocompleteLoading = false;
      state.autocompleteError = null;
    },

    selectLocationRequest: (
      state,
      _action: PayloadAction<LocationAutocompleteItem>
    ) => {
      state.selectLoading = true;
      state.selectError = null;
      state.selectedLocation = null;
    },
    selectLocationSuccess: (state, action: PayloadAction<SavedLocationData>) => {
      state.selectLoading = false;
      state.selectError = null;
      state.selectedLocation = action.payload;
    },
    selectLocationFailure: (state, action: PayloadAction<string>) => {
      state.selectLoading = false;
      state.selectError = action.payload;
      state.selectedLocation = null;
    },
    clearSelectedLocation: (state) => {
      state.selectedLocation = null;
      state.selectLoading = false;
      state.selectError = null;
    },
  },
});

export const {
  locationAutocompleteRequest,
  locationAutocompleteSuccess,
  locationAutocompleteFailure,
  locationAutocompleteClear,
  selectLocationRequest,
  selectLocationSuccess,
  selectLocationFailure,
  clearSelectedLocation,
} = locationsSlice.actions;

export default locationsSlice.reducer;
