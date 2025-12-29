import { apiClient } from "../../api/client";
import { API_ENDPOINTS } from "../../api/endpoints";
import { CreateJobRequest, UpdateJobRequest, Job, GetJobsParams, JobsListApiResponse, JobDetailApiResponse } from "./types";

export const jobsApi = {
  getJobs: async (params?: GetJobsParams): Promise<JobsListApiResponse> => {
    const queryParams = new URLSearchParams();

    // Always include page (default to 1)
    queryParams.append("page", (params?.page || 1).toString());
    
    // Always include limit (default to 10 if not provided or 0)
    const limit = params?.limit && params.limit > 0 ? params.limit : 10;
    queryParams.append("limit", limit.toString());
    
    if (typeof params?.published === "boolean") {
      queryParams.append("published__icontains", String(params.published));
    }

    const query = queryParams.toString();

    return apiClient.get(
      `${API_ENDPOINTS.JOBS.LIST}${query ? `?${query}` : ""}`
    );
  },

  getJobDetail: async (id: string): Promise<JobDetailApiResponse> => {
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

