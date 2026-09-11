import { PROFILE_ACTION_TYPES } from "./constants";
import { UpdateProfilePayload } from "./types";

export const getProfileRequestAction = () => ({
  type: PROFILE_ACTION_TYPES.GET_PROFILE_REQUEST,
});

export const updateProfileRequestAction = (payload: UpdateProfilePayload) => ({
  type: PROFILE_ACTION_TYPES.UPDATE_PROFILE_REQUEST,
  payload,
});

export const clearErrorAction = () => ({
  type: PROFILE_ACTION_TYPES.CLEAR_ERROR,
});