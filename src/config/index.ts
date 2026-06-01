import { PROD_BASE_URL } from '@env';

export const config = {
  api: {
    baseURL: PROD_BASE_URL,
    timeout: 30000,
  },
};

export default config;