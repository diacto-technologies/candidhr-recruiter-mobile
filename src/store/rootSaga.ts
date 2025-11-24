import { all } from 'redux-saga/effects';
import { authSaga } from '../features/auth/saga';
// Import other feature sagas as you add them
// import { profileSaga } from '../features/profile/saga';
// import { jobsSaga } from '../features/jobs/saga';
// import { applicationsSaga } from '../features/applications/saga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    // profileSaga(),
    // jobsSaga(),
    // applicationsSaga(),
  ]);
}
