import { ViewStyle } from 'react-native';

export interface CompanyLogoAvatarProps {
  /** URL of the company logo image */
  imageUrl?: string | null;
  /** Company name for generating initials when no image */
  name?: string | null;
  /** Size of the logo (width and height) */
  size?: number;
  /** Border radius of the logo container */
  borderRadius?: number;
  /** Custom style for the container */
  style?: ViewStyle;
  /** Font variant for initials */
  fontVariant?: string;
  /** Whether to show the edit badge */
  showEditBadge?: boolean;
  /** Callback when edit badge is pressed */
  onEditPress?: () => void;
  /** Size of the edit badge */
  badgeSize?: number;
  /** Custom edit icon (SVG XML string) */
  editIcon?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
}
