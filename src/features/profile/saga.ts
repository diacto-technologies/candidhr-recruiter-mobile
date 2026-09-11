import { call, put, takeLatest } from "redux-saga/effects";
import { PROFILE_ACTION_TYPES } from "./constants";
import {
  getProfileRequest,
  getProfileSuccess,
  getProfileFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
} from "./slice";
import { profileApi } from "./api";
import { showToastMessage } from "../../utils/toast";
import { UpdateProfilePayload } from "./types";

function* getProfileWorker(): Generator<any, void, any> {
  try {
    // yield put(getProfileRequest());
    const response = yield call(profileApi.getProfile);
    yield put(getProfileSuccess(response));
  } catch (error: any) {
    if (__DEV__) {
      console.log("Failed to fetch profile:", error?.message || error);
    }
    yield put(getProfileFailure(error.message || "Failed to fetch profile"));
  }
}

function* updateProfileWorker(action: { type: string; payload: UpdateProfilePayload }): Generator<any, void, any> {
  try {
    yield put(updateProfileRequest(action.payload));
    const response = yield call(profileApi.updateProfile, action.payload);
    const nextProfile = response?.profile ?? response;
    yield put(updateProfileSuccess(nextProfile));

    try {
      const fullProfile = yield call(profileApi.getProfile);
      yield put(getProfileSuccess(fullProfile));
    } catch (fetchError) {
      if (__DEV__) {
        console.log("Failed to re-fetch full profile after update:", fetchError);
      }
    }

    showToastMessage("Profile updated successfully", "success");
  } catch (error: any) {
    const message = error?.message || "Failed to update profile";
    yield put(updateProfileFailure(message));
    showToastMessage(message, "error");
  }
}

export function* profileSaga() {
  yield takeLatest(PROFILE_ACTION_TYPES.GET_PROFILE_REQUEST, getProfileWorker);
  yield takeLatest(PROFILE_ACTION_TYPES.UPDATE_PROFILE_REQUEST, updateProfileWorker);
}

