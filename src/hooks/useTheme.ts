import { useColorScheme } from 'react-native';
import { useAppSelector } from './useAppSelector';
import { selectThemeMode } from '../features/theme/selectors';
import { ThemeMode } from '../features/theme/types';

/**
 * Hook to get the resolved theme mode based on user preference
 * Returns 'light' or 'dark' based on:
 * - User's explicit preference (if set to 'light' or 'dark')
 * - Device settings (if set to 'device')
 */
export const useTheme = (): 'light' | 'dark' => {
  const deviceColorScheme = useColorScheme();
  const themeMode = useAppSelector(selectThemeMode);

  if (themeMode === 'device') {
    // Use device's color scheme, default to 'light' if not available
    return deviceColorScheme === 'dark' ? 'dark' : 'light';
  }

  // Return explicit user preference
  return themeMode;
};

/**
 * Hook to get the raw theme mode preference
 * Returns 'device', 'light', or 'dark'
 */
export const useThemeMode = (): ThemeMode => {
  return useAppSelector(selectThemeMode);
};
