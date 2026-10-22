import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const selectBrandingState = (state: RootState) => state.branding;

export const selectBrandingData = createSelector(
  [selectBrandingState],
  (branding) => branding?.data ?? null
);

export const selectBrandingLoading = createSelector(
  [selectBrandingState],
  (branding) => branding?.loading ?? false
);

export const selectBrandingUpdating = createSelector(
  [selectBrandingState],
  (branding) => branding?.updating ?? false
);

export const selectBrandingError = createSelector(
  [selectBrandingState],
  (branding) => branding?.error ?? null
);

export const selectBrandingUpdateSuccess = createSelector(
  [selectBrandingState],
  (branding) => branding?.updateSuccess ?? false
);

export const selectIsBrandingReset = createSelector(
  [selectBrandingState],
  (branding) => branding?.isReset ?? true
);
