import { ThemeMode } from '../../../features/theme/types';

export interface DisplayPreferenceOption {
  value: ThemeMode;
  labelKey: string;
}

export interface DisplayPreferenceSelectorProps {
  visible: boolean;
  onClose: () => void;
  currentThemeMode: ThemeMode;
  onSelectThemeMode: (themeMode: ThemeMode) => void;
}
