// NOTE: The app store (`src/states/store.tsx`) runs this root saga.
// Delegate to the canonical root saga that includes all feature sagas.
export { default } from '../store/rootSaga';
