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

function* getProfileWorker(): Generator<any, void, any> {
  try {
    // yield put(getProfileRequest());
    const response = yield call(profileApi.getProfile);
    console.log(response,"responseresponseresponseresponse")
    yield put(getProfileSuccess(response));
  } catch (error: any) {
    console.log(error,"errorerrorerrorerror")
    yield put(getProfileFailure(error.message || "Failed to fetch profile"));
  }
}

function* updateProfileWorker(action: { type: string; payload: any }): Generator<any, void, any> {
  try {
    yield put(updateProfileRequest(action.payload));
    const response = yield call(profileApi.updateProfile, action.payload);
    yield put(updateProfileSuccess(response.profile));
  } catch (error: any) {
    yield put(updateProfileFailure(error.message || "Failed to update profile"));
  }
}

export function* profileSaga() {
  yield takeLatest(PROFILE_ACTION_TYPES.GET_PROFILE_REQUEST, getProfileWorker);
  yield takeLatest(PROFILE_ACTION_TYPES.UPDATE_PROFILE_REQUEST, updateProfileWorker);
}

