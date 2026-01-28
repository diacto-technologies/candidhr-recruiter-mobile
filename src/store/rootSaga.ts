import { all } from 'redux-saga/effects';
import { authSaga } from '../features/auth/saga';
// Import other feature sagas as you add them
import { profileSaga } from '../features/profile/saga';
import { dashbaordSaga } from '../features/dashbaord/saga';
import { jobsSaga } from '../features/jobs/saga';
import { applicationsSaga } from '../features/applications/saga';
import { usersSaga } from '../features/profile/users';

export default function* rootSaga() {
  yield all([
    authSaga(),
    profileSaga(),
    usersSaga(),
    dashbaordSaga(),
    jobsSaga(),
    applicationsSaga(),
  ]);
}
