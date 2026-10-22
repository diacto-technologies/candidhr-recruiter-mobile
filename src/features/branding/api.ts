import { apiClient } from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';
import { BrandingData, UpdateBrandingPayload } from './types';

export const brandingApi = {
  getBranding: async (): Promise<BrandingData> => {
    return apiClient.get(API_ENDPOINTS.BRANDING.GET);
  },
  updateBranding: async (data: UpdateBrandingPayload): Promise<BrandingData> => {
    return apiClient.patch(API_ENDPOINTS.BRANDING.PATCH, data);
  },
};
