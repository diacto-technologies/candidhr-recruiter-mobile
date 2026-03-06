import { all } from 'redux-saga/effects';
import { authSaga } from './feature/auth/authsaga';

export default function* rootSaga() {
    yield all([
      authSaga(),
    ]);
  }
  