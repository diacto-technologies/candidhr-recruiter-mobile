import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export interface BackgroundPatternProps {
  children: ReactNode;
  bgStyle?: ViewStyle;
  containerStyle?: ViewStyle;
}
