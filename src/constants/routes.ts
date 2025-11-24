// Navigation route constants
export const ROUTES = {
  // Auth Routes
  AUTH: {
    SPLASH: 'auth/splash',
    LOGIN: 'auth/login',
  },
  // Application Routes
  APP: {
    DASHBOARD: 'app/dashboard',
    JOBS: 'app/jobs',
    APPLICANTS: 'app/applicants',
    PROFILE: 'app/profile',
  },
} as const;

export type RouteKeys = typeof ROUTES;

