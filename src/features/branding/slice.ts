import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BrandingData, BrandingState } from './types';
import { setBrandColor } from '../../theme/colors';
import { isDefaultLogoUrl, isDefaultOrCandidHr } from './constants';

const initialState: BrandingState = {
  data: null,
  loading: false,
  updating: false,
  error: null,
  updateSuccess: false,
  isReset: true,
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

      const hasCustomLogo = Boolean(
        (action.payload?.logo && !isDefaultLogoUrl(action.payload.logo)) ||
        (action.payload?.secondary_logo && !isDefaultLogoUrl(action.payload.secondary_logo))
      );
      const isCustomName = Boolean(
        action.payload?.product_name &&
        !isDefaultOrCandidHr(action.payload.product_name)
      );

      if (hasCustomLogo || isCustomName) {
        state.isReset = false;
      }

      if (state.isReset && !hasCustomLogo && isDefaultOrCandidHr(action.payload?.product_name)) {
        if (state.data) {
          state.data = {
            ...state.data,
            product_name: '',
          };
        }
      }

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
      state.data = action.payload;
      state.updateSuccess = true;
      state.error = null;

      if (state.isReset) {
        if (state.data) {
          state.data = {
            ...state.data,
            product_name: '',
            logo: null,
            secondary_logo: null,
            favicon: null,
          };
        }
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
