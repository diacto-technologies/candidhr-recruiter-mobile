import { all } from 'redux-saga/effects';
import { authSaga } from '../features/auth/saga';
// Import other feature sagas as you add them
import { profileSaga } from '../features/profile/saga';
import { dashbaordSaga } from '../features/dashbaord/saga';
import { jobsSaga } from '../features/jobs/saga';
import { applicationsSaga } from '../features/applications/saga';
import { usersSaga } from '../features/profile/users';
import { assessmentsSaga } from '../features/assessments/saga';
import { personalityScreeningSaga } from '../features/personalityScreening/saga';
import { commentsSaga } from '../features/comments';
import { locationsSaga } from '../features/locations';
import { questionSetsSaga } from '../features/questionSets/saga';
import { workflowsSaga } from '../features/workflows';

export default function* rootSaga() {
  yield all([
    authSaga(),
    profileSaga(),
    usersSaga(),
    dashbaordSaga(),
    jobsSaga(),
    applicationsSaga(),
    assessmentsSaga(),
    personalityScreeningSaga(),
    commentsSaga(),
    locationsSaga(),
    questionSetsSaga(),
    workflowsSaga(),
  ]);
}
