import { JOBS_ACTION_TYPES } from "./constants";
import { CreateJobRequest, UpdateJobRequest, Job } from "./types";

export const getJobsRequestAction = (params?: { page?: number; limit?: number }) => ({
  type: JOBS_ACTION_TYPES.GET_JOBS_REQUEST,
  payload: params,
});

export const getJobDetailRequestAction = (id: string) => ({
  type: JOBS_ACTION_TYPES.GET_JOB_DETAIL_REQUEST,
  payload: id,
});

export const createJobRequestAction = (payload: CreateJobRequest) => ({
  type: JOBS_ACTION_TYPES.CREATE_JOB_REQUEST,
  payload,
});

export const updateJobRequestAction = (payload: UpdateJobRequest) => ({
  type: JOBS_ACTION_TYPES.UPDATE_JOB_REQUEST,
  payload,
});

export const deleteJobRequestAction = (id: string) => ({
  type: JOBS_ACTION_TYPES.DELETE_JOB_REQUEST,
  payload: id,
});

export const setSelectedJobAction = (job: Job | null) => ({
  type: JOBS_ACTION_TYPES.SET_SELECTED_JOB,
  payload: job,
});

export const clearErrorAction = () => ({
  type: JOBS_ACTION_TYPES.CLEAR_ERROR,
});

