import { APPLICATIONS_ACTION_TYPES } from "./constants";
import { CreateApplicationRequest, UpdateApplicationStatusRequest, Application } from "./types";

export const getApplicationsRequestAction = (params?: { page?: number; limit?: number; jobId?: string }) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_APPLICATIONS_REQUEST,
  payload: params,
});

export const getApplicationDetailRequestAction = (id: string) => ({
  type: APPLICATIONS_ACTION_TYPES.GET_APPLICATION_DETAIL_REQUEST,
  payload: id,
});

export const createApplicationRequestAction = (payload: CreateApplicationRequest) => ({
  type: APPLICATIONS_ACTION_TYPES.CREATE_APPLICATION_REQUEST,
  payload,
});

export const updateApplicationStatusRequestAction = (payload: UpdateApplicationStatusRequest) => ({
  type: APPLICATIONS_ACTION_TYPES.UPDATE_APPLICATION_STATUS_REQUEST,
  payload,
});

export const setSelectedApplicationAction = (application: Application | null) => ({
  type: APPLICATIONS_ACTION_TYPES.SET_SELECTED_APPLICATION,
  payload: application,
});

export const clearErrorAction = () => ({
  type: APPLICATIONS_ACTION_TYPES.CLEAR_ERROR,
});

