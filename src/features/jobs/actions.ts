import { JOBS_ACTION_TYPES } from "./constants";
import { CreateJobRequest, UpdateJobRequest, Job, GetJobsParams } from "./types";

export interface GetJobsRequestActionPayload extends GetJobsParams {
  append?: boolean; // false / undefined = replace list, true = append
}

export const getJobsRequestAction = (params?: GetJobsRequestActionPayload) => ({
  type: JOBS_ACTION_TYPES.GET_JOBS_REQUEST,
  payload: params,
})

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

export const getPublishedJobsRequestAction = (params?: GetJobsRequestActionPayload) => ({
  type: JOBS_ACTION_TYPES.GET_PUBLISHED_JOBS_REQUEST,
  payload: params,
});

export const getUnpublishedJobsRequestAction = (params?: GetJobsRequestActionPayload) => ({
  type: JOBS_ACTION_TYPES.GET_UNPUBLISHED_JOBS_REQUEST,
  payload: params,
});

export type GetJobNameListPayload = {
  page?: number;
  search?: string;
  append?: boolean;
};

export const getJobNameListRequestAction = (payload?: GetJobNameListPayload) => ({
  type: JOBS_ACTION_TYPES.GET_JOB_NAME_LIST_REQUEST,
  payload,
});

