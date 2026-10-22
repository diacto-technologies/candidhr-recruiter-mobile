import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BrandingData, BrandingState } from './types';
import { setBrandColor } from '../../theme/colors';


const initialState: BrandingState = {
  data: null,
  loading: false,
  updating: false,
  error: null,
  updateSuccess: false,
  isReset: false,
};

const brandingSlice = createSlice({
  name: 'branding',
  initialState,
  reducers: {
    getBrandingRequest: (state) => {
      state.loading = true;
      state.updating = false;
      state.error = null;
    },
    getBrandingSuccess: (state, action: PayloadAction<BrandingData>) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;

      // After fetching, do not override isReset if it was explicitly set to true by a reset action
      // (isReset stays false for normal fetches; only setBrandingReset can set it to true)

      if (action.payload?.primary_color) {
        setBrandColor(action.payload.primary_color);
      }
    },
    getBrandingFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateBrandingRequest: (state, action: PayloadAction<{ isReset?: boolean } | undefined>) => {
      state.updating = true;
      state.error = null;
      state.updateSuccess = false;
      if (action.payload?.isReset !== undefined) {
        state.isReset = action.payload.isReset;
      }
    },
    updateBrandingSuccess: (state, action: PayloadAction<BrandingData>) => {
      state.updating = false;
      state.updateSuccess = true;
      state.error = null;

      if (state.isReset) {
        // Reset action: clear logos and name from local state regardless of server response
        state.data = {
          ...(action.payload ?? {}),
          product_name: '',
          logo: null,
          secondary_logo: null,
          favicon: null,
        } as BrandingData;
        // Keep isReset = true until user makes changes
      } else {
        // Normal save: trust the server response entirely
        state.data = action.payload;
        state.isReset = false;
      }

      if (action.payload?.primary_color) {
        setBrandColor(action.payload.primary_color);
      }
    },
    updateBrandingFailure: (state, action: PayloadAction<string>) => {
      state.updating = false;
      state.error = action.payload;
      state.updateSuccess = false;
    },
    setBrandingReset: (state, action: PayloadAction<boolean>) => {
      state.isReset = action.payload;
      if (action.payload && state.data) {
        state.data = {
          ...state.data,
          product_name: '',
          logo: null,
          secondary_logo: null,
          favicon: null,
        };
      }
    },
    resetUpdateStatus: (state) => {
      state.updating = false;
      state.updateSuccess = false;
    },
    clearBrandingError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getBrandingRequest,
  getBrandingSuccess,
  getBrandingFailure,
  updateBrandingRequest,
  updateBrandingSuccess,
  updateBrandingFailure,
  resetUpdateStatus,
  clearBrandingError,
  setBrandingReset,
} = brandingSlice.actions;

export default brandingSlice.reducer;
