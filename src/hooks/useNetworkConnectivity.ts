import React, { useEffect, useState, useRef } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { showToastMessage } from '../utils/toast';

/**
 * Defer toasts so they run after ToastMessageProvider's `setGlobalToast` effect.
 */
function scheduleToast(message: string, variant: 'error' | 'success' = 'error') {
  setTimeout(() => {
    showToastMessage(message, variant);
  }, 0);
}

/**
 * Hook to monitor network connectivity app-wide.
 * Must be used under `<ToastMessageProvider />` so toasts can render.
 */
export function useNetworkConnectivity() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const prevConnected = useRef<boolean | null>(null);
  /** True after we showed "no internet" for a transition from online → offline. */
  const showedOfflineToastRef = useRef(false);
  /** App opened while already offline — suppress "Back online" until first real reconnect from user. */
  const startedOfflineRef = useRef(false);

  useEffect(() => {
    NetInfo.fetch().then((state: NetInfoState) => {
      const connected = state.isConnected ?? false;
      setIsConnected(connected);
      prevConnected.current = connected;
      if (!connected) {
        startedOfflineRef.current = true;
      }
    });

    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const connected = state.isConnected ?? false;
      const was = prevConnected.current;
      prevConnected.current = connected;
      setIsConnected(connected);

      // Online → offline: notify once per outage
      if (was === true && connected === false) {
        showedOfflineToastRef.current = true;
        scheduleToast('No internet connection', 'error');
        return;
      }

      // Offline → online
      if (was === false && connected === true) {
        if (showedOfflineToastRef.current) {
          showedOfflineToastRef.current = false;
          scheduleToast('Back online', 'success');
        } else if (startedOfflineRef.current) {
          startedOfflineRef.current = false;
        }
        return;
      }

      if (was === null && connected === false) {
        startedOfflineRef.current = true;
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return isConnected;
}

/** Mount once inside ToastMessageProvider to enable global offline/online toasts. */
export function NetworkConnectivityBridge() {
  useNetworkConnectivity();
  return null;
}
