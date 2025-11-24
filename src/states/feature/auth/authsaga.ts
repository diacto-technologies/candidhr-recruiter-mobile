import { call, put, takeLatest } from "redux-saga/effects";
import { ADD_USER } from "./constants";
import { setUser, setLoading, setError } from "./authSlice";
import { fetchPostsApi } from "../../api/api";

function* addUserWorker(): any {
    try {
        yield put(setLoading(true));
        yield put(setError(null));
        const response = yield call(fetchPostsApi);
        yield put(setUser(response));
    } catch (error: any) {
        yield put(setError("Failed to fetch posts"));
    } finally {
        yield put(setLoading(false));
    }
}

export function* authSaga() {
    yield takeLatest(ADD_USER, addUserWorker);
}
