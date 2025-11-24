import { apiClient } from "../../api/client";
import { API_ENDPOINTS } from "../../api/endpoints";
import { CreateJobRequest, UpdateJobRequest, Job } from "./types";

export const jobsApi = {
  getJobs: async (params?: { page?: number; limit?: number }): Promise<{ jobs: Job[]; total: number }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    const query = queryParams.toString();
    return apiClient.get(`${API_ENDPOINTS.JOBS.LIST}${query ? `?${query}` : ''}`);
  },

  getJobDetail: async (id: string): Promise<{ job: Job }> => {
    return apiClient.get(API_ENDPOINTS.JOBS.DETAIL(id));
  },

  createJob: async (data: CreateJobRequest): Promise<{ job: Job }> => {
    return apiClient.post(API_ENDPOINTS.JOBS.CREATE, data);
  },

  updateJob: async (data: UpdateJobRequest): Promise<{ job: Job }> => {
    return apiClient.put(API_ENDPOINTS.JOBS.UPDATE(data.id), data);
  },

  deleteJob: async (id: string): Promise<void> => {
    return apiClient.delete(API_ENDPOINTS.JOBS.DELETE(id));
  },
};

