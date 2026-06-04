import { ViewStyle } from 'react-native';

export interface CompanyLogoAvatarProps {
  imageUrl?: string | null;
  name?: string | null;
  size?: number;
  borderRadius?: number;
  style?: ViewStyle;
  fontVariant?: string;
  showEditBadge?: boolean;
  onEditPress?: () => void;
  badgeSize?: number;
  editIcon?: string;
  disabled?: boolean;
}
