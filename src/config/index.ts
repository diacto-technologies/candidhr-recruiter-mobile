import { PROD_BASE_URL, QA_BASE_URL } from '@env';
import { store } from '../store';
import { organizationalOrigin } from '../features/auth/selectors';

export const getBaseURL = () => {
  const origin = organizationalOrigin(store.getState());
  console.log(origin,"originoriginoriginorigin")

  if (organizationalOrigin(store.getState()) &&  organizationalOrigin(store.getState()).includes('qa')) {
    return QA_BASE_URL;
  }

  return PROD_BASE_URL;
};

export const config = {
  api: {
    get baseURL() {
      return getBaseURL();
    },
    timeout: 30000,
  },
};

export default config;
