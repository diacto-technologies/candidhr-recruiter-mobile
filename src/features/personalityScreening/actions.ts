import { PERSONALITY_SCREENING_ACTION_TYPES } from "./constants";
import { GetPersonalityScreeningListPayload } from "./types";

export const getPersonalityScreeningListRequestAction = (
  payload?: GetPersonalityScreeningListPayload
) => ({
  // This is the saga trigger action. The slice listens to its own
  // RTK-generated action types (e.g. getListRequest), so we never
  // risk a saga → reducer → saga recursion loop.
  type: PERSONALITY_SCREENING_ACTION_TYPES.GET_LIST_TRIGGER,
  payload,
});
