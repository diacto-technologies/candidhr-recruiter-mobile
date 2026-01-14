import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import {
  persistReducer,
} from "redux-persist";
import persistStore from "redux-persist/es/persistStore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../states/rootSaga'

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["authSlice"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer,);
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware)
});
sagaMiddleware.run(rootSaga);
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
