import * as Sentry from '@sentry/react-native';
import config from '../config';

// 1. Create the routing integration for React Navigation
export const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

// 2. Initialize Sentry with performance tracing and Hermes profiling
export const initSentry = () => {
  Sentry.init({
    dsn: config.sentryDSN,
    tracesSampleRate: 1.0,   // Monitor 100% of transactions for testing
    profilesSampleRate: 1.0, // Profile 100% of JS executions
    enableAutoSessionTracking: true, // Explicitly track user session health
    enableUserInteractionTracing: true,
    enableNativeFramesTracking: true,
    enableAutoPerformanceTracing: true, // Automatically capture performance metrics
    enableCaptureFailedRequests: true,  // Capture failed HTTP requests
    sendDefaultPii: true,
    enableLogs: true,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
    debug: true,
    integrations: (defaults) => {
      // Retain all default integrations (like native performance tracing, error handlers, etc.)
      // and append our custom integrations.
      return [
        ...defaults,
        navigationIntegration,
        Sentry.mobileReplayIntegration({
          maskAllText: false,
          maskAllImages: false,
          maskAllVectors: false,
        }),
        Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
      ];
    },
    beforeSendTransaction: (event) => {
      // Discard transaction events with abnormally long app starts (e.g. > 30 seconds).
      // This commonly happens during local development if the app is suspended in background,
      // the debugger is paused, or the Metro packager reload delays the launch.
      if (event.measurements) {
        const coldStart = event.measurements.app_start_cold?.value;
        const warmStart = event.measurements.app_start_warm?.value;
        if ((coldStart && coldStart > 30000) || (warmStart && warmStart > 30000)) {
          return null; // Discard transaction
        }
      }

      if (event.spans) {
        const hasLongAppStartSpan = event.spans.some((span) => {
          if (span.op && span.op.startsWith('app.start') && span.start_timestamp && span.timestamp) {
            const durationMs = (span.timestamp - span.start_timestamp) * 1000;
            return durationMs > 30000;
          }
          return false;
        });
        if (hasLongAppStartSpan) {
          return null; // Discard transaction
        }
      }

      return event;
    },
  });
};

