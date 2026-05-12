import { JOBS_ACTION_TYPES } from "./constants";
import {
  CreateJobRequest,
  UpdateJobRequest,
  Job,
  GetJobsParams,
  GenerateJobDescriptionRequest,
  SubmitJobApplicationFormStepPayload,
  PatchJobUsersSharedPayload,
  PatchJobDetailsRequest,
  PatchJobPublishedPayload,
  SoftDeleteJobPayload,
  AssignWorkflowToJobPayload,
} from "./types";

export interface GetJobsRequestActionPayload extends GetJobsParams {
  append?: boolean; // false / undefined = replace list, true = append
}

export const getJobsRequestAction = (params?: GetJobsRequestActionPayload) => ({
  type: JOBS_ACTION_TYPES.GET_JOBS_REQUEST,
  payload: {
    ...(params ?? {}),
    requestId: params?.requestId ?? Date.now(),
  },
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
  payload: {
    ...(params ?? {}),
    // Always count-only for tab badges; must never overwrite lists.
    onlyCount: true,
    published: true,
    page: 1,
    limit: 1,
    append: false,
    requestId: Date.now(),
  },
});

export const getUnpublishedJobsRequestAction = (params?: GetJobsRequestActionPayload) => ({
  type: JOBS_ACTION_TYPES.GET_UNPUBLISHED_JOBS_REQUEST,
  payload: {
    ...(params ?? {}),
    // Always count-only for tab badges; must never overwrite lists.
    onlyCount: true,
    published: false,
    page: 1,
    limit: 1,
    append: false,
    requestId: Date.now(),
  },
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

export const generateJobDescriptionRequestAction = (payload: GenerateJobDescriptionRequest) => ({
  type: JOBS_ACTION_TYPES.GENERATE_JOB_DESCRIPTION_REQUEST,
  payload,
});

export const submitApplicationFormStepRequestAction = (
  payload: SubmitJobApplicationFormStepPayload
) => ({
  type: JOBS_ACTION_TYPES.SUBMIT_APPLICATION_FORM_STEP_REQUEST,
  payload,
});

export const patchJobUsersSharedRequestAction = (payload: PatchJobUsersSharedPayload) => ({
  type: JOBS_ACTION_TYPES.PATCH_JOB_USERS_SHARED_REQUEST,
  payload,
});

export const patchJobDetailsRequestAction = (payload: PatchJobDetailsRequest) => ({
  type: JOBS_ACTION_TYPES.PATCH_JOB_DETAILS_REQUEST,
  payload,
});

export const fetchApplicationFormDraftRequestAction = (payload: { jobId: string }) => ({
  type: JOBS_ACTION_TYPES.FETCH_APPLICATION_FORM_DRAFT_REQUEST,
  payload,
});

export const patchJobPublishedRequestAction = (payload: PatchJobPublishedPayload) => ({
  type: JOBS_ACTION_TYPES.PATCH_JOB_PUBLISHED_REQUEST,
  payload,
});

export const softDeleteJobRequestAction = (payload: SoftDeleteJobPayload) => ({
  type: JOBS_ACTION_TYPES.SOFT_DELETE_JOB_REQUEST,
  payload,
});

export const assignWorkflowToJobRequestAction = (payload: AssignWorkflowToJobPayload) => ({
  type: JOBS_ACTION_TYPES.ASSIGN_WORKFLOW_TO_JOB_REQUEST,
  payload,
});

