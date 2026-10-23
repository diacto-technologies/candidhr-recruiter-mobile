import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BrandingData, BrandingState } from './types';
import { setBrandColor } from '../../theme/colors';


import { isDefaultOrCandidHr } from './constants';

const initialState: BrandingState = {
  data: null,
  loading: false,
  updating: false,
  error: null,
  updateSuccess: false,
  isReset: false,
  hasCustomProductName: false,
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
      state.error = null;

      const serverData = action.payload;
      if (!serverData) {
        state.data = null;
        return;
      }

      const serverProductName = serverData.product_name?.trim() || '';
      const isDefaultName = isDefaultOrCandidHr(serverProductName);

      let resolvedProductName = serverProductName;
      if (isDefaultName) {
        // If server returns CandidHR/default:
        // Only keep CandidHR if the user has previously explicitly saved a custom product name.
        // Otherwise (first load or user saved empty or reset), treat as empty.
        resolvedProductName = state.hasCustomProductName && !state.isReset ? (state.data?.product_name || serverProductName) : '';
      } else {
        state.hasCustomProductName = true;
      }

      state.data = {
        ...serverData,
        product_name: resolvedProductName,
      };

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
    updateBrandingSuccess: (
      state,
      action: PayloadAction<{ data: BrandingData; submittedProductName?: string } | BrandingData>
    ) => {
      state.updating = false;
      state.updateSuccess = true;
      state.error = null;

      const payloadData = 'data' in action.payload ? action.payload.data : action.payload;
      const submittedProductName =
        'submittedProductName' in action.payload ? action.payload.submittedProductName : undefined;

      if (state.isReset) {
        state.hasCustomProductName = false;
        state.data = {
          ...(payloadData ?? {}),
          product_name: '',
          logo: null,
          secondary_logo: null,
          favicon: null,
        } as BrandingData;
      } else {
        let finalProductName = payloadData?.product_name?.trim() || '';

        if (submittedProductName !== undefined) {
          const trimmedSubmitted = submittedProductName.trim();
          if (trimmedSubmitted === '') {
            state.hasCustomProductName = false;
            finalProductName = '';
          } else {
            state.hasCustomProductName = true;
            finalProductName = trimmedSubmitted;
          }
        } else {
          if (isDefaultOrCandidHr(finalProductName)) {
            finalProductName = state.hasCustomProductName ? finalProductName : '';
          } else {
            state.hasCustomProductName = true;
          }
        }

        state.data = {
          ...(payloadData ?? {}),
          product_name: finalProductName,
        } as BrandingData;
        state.isReset = false;
      }

      if (payloadData?.primary_color) {
        setBrandColor(payloadData.primary_color);
      }
    },
    updateBrandingFailure: (state, action: PayloadAction<string>) => {
      state.updating = false;
      state.error = action.payload;
      state.updateSuccess = false;
    },
    setBrandingReset: (state, action: PayloadAction<boolean>) => {
      state.isReset = action.payload;
      if (action.payload) {
        state.hasCustomProductName = false;
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
