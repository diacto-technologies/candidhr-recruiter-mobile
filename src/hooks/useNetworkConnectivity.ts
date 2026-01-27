import { useEffect, useState, useRef } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { showToastMessage } from '../utils/toast';

/**
 * Hook to monitor network connectivity
 * Shows a toast message when internet connection is lost
 */
export function useNetworkConnectivity() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const hasShownDisconnectedToast = useRef(false);

  useEffect(() => {
    // Get initial network state
    NetInfo.fetch().then((state: NetInfoState) => {
      const connected = state.isConnected ?? false;
      setIsConnected(connected);
      // Reset flag based on initial state
      hasShownDisconnectedToast.current = !connected;
    });

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const connected = state.isConnected ?? false;
      setIsConnected(connected);

      // Show toast when internet is disconnected (only once per disconnection)
      if (!connected && !hasShownDisconnectedToast.current) {
        showToastMessage('No internet connection. Please check your network settings.', 'error');
        hasShownDisconnectedToast.current = true;
      } else if (connected && hasShownDisconnectedToast.current) {
        // Reset the flag when connection is restored so we can show toast again if disconnected
        hasShownDisconnectedToast.current = false;
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return isConnected;
}
