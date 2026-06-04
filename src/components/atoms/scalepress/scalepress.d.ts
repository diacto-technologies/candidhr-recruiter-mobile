import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export interface ScalePressProps {
  onPress?: () => void;
  onLongPress?: () => void;
  children: ReactNode;
  styles?: ViewStyle | ViewStyle[];
}
