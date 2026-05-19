import { useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import Orientation from 'react-native-orientation-locker';

/** Keep the app in portrait unless a screen explicitly opts into landscape (e.g. video fullscreen). */
export function usePortraitOrientationLock(): void {
  useEffect(() => {
    Orientation.lockToPortrait();

    const onAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        Orientation.lockToPortrait();
      }
    };

    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);
}
