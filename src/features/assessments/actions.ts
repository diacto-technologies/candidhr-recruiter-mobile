import { ASSESSMENTS_ACTION_TYPES } from "./constants";
import { GetAssessmentsListPayload } from "./types";

export const getAssessmentsRequestAction = (payload?: GetAssessmentsListPayload) => ({
  type: ASSESSMENTS_ACTION_TYPES.GET_ASSESSMENTS_REQUEST,
  payload: {
    page: payload?.page ?? 1,
    append: payload?.append ?? false,
  },
});
