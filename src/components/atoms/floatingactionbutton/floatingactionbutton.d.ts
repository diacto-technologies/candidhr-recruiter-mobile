import { PressableProps } from 'react-native';

export interface FloatingActionButtonProps extends PressableProps {
  value: string;
  size?: number;
  backgroundColor?: string;
  iconColor?: string;
  badgeCount?: number | string | null;
  badgeBackgroundColor?: string;
  badgeTextColor?: string;
}
