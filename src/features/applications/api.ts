import { apiClient } from "../../api/client";
import { API_ENDPOINTS } from "../../api/endpoints";
import { CreateApplicationRequest, UpdateApplicationStatusRequest, Application } from "./types";

export const applicationsApi = {
  getApplications: async (params?: { page?: number; limit?: number; jobId?: string }): Promise<{ applications: Application[]; total: number }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.jobId) queryParams.append('jobId', params.jobId);
    const query = queryParams.toString();
    return apiClient.get(`${API_ENDPOINTS.APPLICATIONS.LIST}${query ? `?${query}` : ''}`);
  },

  getApplicationDetail: async (id: string): Promise<{ application: Application }> => {
    return apiClient.get(API_ENDPOINTS.APPLICATIONS.DETAIL(id));
  },

  createApplication: async (data: CreateApplicationRequest): Promise<{ application: Application }> => {
    return apiClient.post(API_ENDPOINTS.APPLICATIONS.CREATE, data);
  },

  updateApplicationStatus: async (data: UpdateApplicationStatusRequest): Promise<{ application: Application }> => {
    return apiClient.put(API_ENDPOINTS.APPLICATIONS.STATUS(data.id), { status: data.status });
  },
};

