import { ViewStyle } from 'react-native';

export interface ProfileAvatarProps {
  imageUrl?: string | null;
  name?: string | null;
  size?: number;
  style?: ViewStyle;
  fontVariant?: string;
  /** extra padding outside avatar (gap/ring size) */
  outerSize?: number;
}
