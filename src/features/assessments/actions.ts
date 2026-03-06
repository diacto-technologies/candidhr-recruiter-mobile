import { ASSESSMENTS_ACTION_TYPES } from "./constants";
import {
  AssignedFilterParams,
  GetAssessmentsListPayload,
  GetAssignedAssessmentsPayload,
} from "./types";

export const getAssessmentsRequestAction = (payload?: GetAssessmentsListPayload) => ({
  type: ASSESSMENTS_ACTION_TYPES.GET_ASSESSMENTS_REQUEST,
  payload: {
    page: payload?.page ?? 1,
    append: payload?.append ?? false,
  },
});

export const getAssessmentsAssignedRequestAction = (
  payload?: GetAssignedAssessmentsPayload
) => ({
  type: ASSESSMENTS_ACTION_TYPES.GET_ASSIGNED_ASSESSMENTS_REQUEST,
  payload,
});
