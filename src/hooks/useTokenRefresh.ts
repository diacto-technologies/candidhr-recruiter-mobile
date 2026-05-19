import { useCallback, useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { refreshAuthTokens } from '../api/client';
import { selectIsAuthenticated, selectRefreshToken, selectToken } from '../features/auth/selectors';
import { getJwtExpiryMs } from '../utils/jwtUtils';
import { useAppSelector } from '../store/hooks';

/** Refresh this many ms before access token expires (matches typical web behavior). */
const REFRESH_BUFFER_MS = 5 * 60 * 1000;
const MIN_REFRESH_INTERVAL_MS = 60 * 1000;

/**
 * Proactively refresh JWTs while the user is logged in.
 * Reactive refresh on 401 alone is not enough when access and refresh share the same lifetime.
 */
export function useTokenRefresh(): void {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const accessToken = useAppSelector(selectToken);
  const refreshToken = useAppSelector(selectRefreshToken);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRefreshAtRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const refreshIfNeeded = useCallback(
    async (reason: string) => {
      if (!isAuthenticated || !accessToken || !refreshToken) return;

      const accessExpiryMs = getJwtExpiryMs(accessToken);
      const refreshExpiryMs = getJwtExpiryMs(refreshToken);
      if (accessExpiryMs == null || refreshExpiryMs == null) return;

      const now = Date.now();
      const accessMsLeft = accessExpiryMs - now;
      const refreshMsLeft = refreshExpiryMs - now;

      if (refreshMsLeft <= 0) return;

      const shouldRefresh = accessMsLeft <= REFRESH_BUFFER_MS;
      if (!shouldRefresh) return;

      if (now - lastRefreshAtRef.current < MIN_REFRESH_INTERVAL_MS) return;

      if (__DEV__) {
        console.log(`[TokenRefresh] proactive refresh (${reason})`);
      }

      lastRefreshAtRef.current = now;
      await refreshAuthTokens();
    },
    [isAuthenticated, accessToken, refreshToken]
  );

  const scheduleNextRefresh = useCallback(() => {
    clearTimer();
    if (!isAuthenticated || !accessToken) return;

    const accessExpiryMs = getJwtExpiryMs(accessToken);
    if (accessExpiryMs == null) return;

    const delay = Math.max(0, accessExpiryMs - Date.now() - REFRESH_BUFFER_MS);

    if (__DEV__) {
      console.log(`[TokenRefresh] next check in ${Math.round(delay / 1000)}s`);
    }

    timerRef.current = setTimeout(() => {
      void refreshIfNeeded('scheduled');
    }, delay);
  }, [isAuthenticated, accessToken, clearTimer, refreshIfNeeded]);

  useEffect(() => {
    if (!isAuthenticated) {
      clearTimer();
      return;
    }

    void refreshIfNeeded('session-start');
    scheduleNextRefresh();

    return clearTimer;
  }, [isAuthenticated, accessToken, refreshToken, clearTimer, refreshIfNeeded, scheduleNextRefresh]);

  useEffect(() => {
    const onAppStateChange = (nextState: AppStateStatus) => {
      if (nextState !== 'active') return;
      void refreshIfNeeded('foreground').then(() => {
        scheduleNextRefresh();
      });
    };

    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, [refreshIfNeeded, scheduleNextRefresh]);
}
