import { PROD_BASE_URL, SENTRY_DSN } from '@env';

export const config = {
  api: {
    baseURL: PROD_BASE_URL,
    timeout: 30000,
  },
  sentryDSN: SENTRY_DSN,
};

export default config;