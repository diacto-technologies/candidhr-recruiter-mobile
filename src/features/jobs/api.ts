import { apiClient } from "../../api/client";
import { API_ENDPOINTS } from "../../api/endpoints";
import { CreateJobRequest, UpdateJobRequest, Job, GetJobsParams, JobsListApiResponse, JobDetailApiResponse } from "./types";

export const jobsApi = {
  getJobs: async (params?: GetJobsParams): Promise<JobsListApiResponse> => {
    const queryParams = new URLSearchParams();
  
    queryParams.append("page", (params?.page || 1).toString());
    queryParams.append("limit", (params?.limit && params.limit > 0 ? params.limit : 10).toString());
  
    if (typeof params?.published === "boolean") {
      queryParams.append("published__icontains", String(params.published));
    }
  
    if (params?.title) {
      queryParams.append("title__icontains", params.title);
    }
  
    if (params?.experience) {
      console.log(params?.experience,"experienceexperienceexperienceexperience")
      queryParams.append("experience__in", String(params.experience));
    }
  
    if (params?.employmentType) {
      queryParams.append("employment_type__icontains", params.employmentType);
    }
  
    if (params?.location) {
      queryParams.append("location__icontains", params.location);
    }
  
    if (params?.createdBy) {
      queryParams.append("owner__name__icontains", params.createdBy);
    }
  
    // ⭐ NEW — close date filter
    if (params?.closeDate) {
      queryParams.append("close_date__in", params.closeDate);
    }
  
    // ⭐ NEW — ordering
    if (params?.orderBy) {
      queryParams.append("o", params.orderBy);
    }
  
    const query = queryParams.toString();
  
    return apiClient.get(`${API_ENDPOINTS.JOBS.LIST}?${query}`);
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

