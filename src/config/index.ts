// Application configuration
export const config = {
  // API Configuration
  api: {
    baseURL: __DEV__
      ? 'https://dev-api.example.com'
      : 'https://api.example.com',
    timeout: 30000,
  },

  // App Configuration
  app: {
    name: 'CandidHR',
    version: '0.0.1',
    environment: __DEV__ ? 'development' : 'production',
  },

  // Feature Flags
  features: {
    enablePushNotifications: true,
    enableWebSocket: true,
    enableAnalytics: __DEV__ ? false : true,
  },
};

export default config;

