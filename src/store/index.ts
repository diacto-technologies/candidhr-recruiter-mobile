import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore, createTransform } from "redux-persist";
import AsyncStorage from '@react-native-async-storage/async-storage';
import createSagaMiddleware from 'redux-saga';
import rootReducer from "./rootReducer";
import rootSaga from "./rootSaga";
import { JobsState } from "../features/jobs/types";
import { jobsInitialState } from "../features/jobs/slice";

// Only persist favouriteJobIds and favouritesCount from the jobs slice
const jobsTransform = createTransform<JobsState, JobsState>(
  (inboundState) => ({
    ...jobsInitialState,
    favouriteJobIds: inboundState.favouriteJobIds,
    favouritesCount: inboundState.favouritesCount,
  }),
  (outboundState) => ({
    ...jobsInitialState,
    favouriteJobIds: outboundState.favouriteJobIds,
    favouritesCount: outboundState.favouritesCount,
  }),
  { whitelist: ["jobs"] }
);

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "language", "theme", "profile", "jobs"], // Persist auth, language, theme, profile (for permissions), and jobs (for favourites)
  transforms: [jobsTransform],
  blacklist: [], // Add slices you don't want to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
      },
    }).concat(sagaMiddleware),
  devTools: __DEV__,
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
