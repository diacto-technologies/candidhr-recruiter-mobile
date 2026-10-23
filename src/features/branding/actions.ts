import { BRANDING_ACTION_TYPES } from './constants';
import { UpdateBrandingPayload } from './types';

export const getBrandingRequestAction = () => ({
  type: BRANDING_ACTION_TYPES.GET_BRANDING_REQUEST,
});

export const updateBrandingRequestAction = (
  payload: UpdateBrandingPayload,
  isReset?: boolean,
  submittedProductName?: string
) => ({
  type: BRANDING_ACTION_TYPES.UPDATE_BRANDING_REQUEST,
  payload,
  meta: { isReset, submittedProductName },
});
