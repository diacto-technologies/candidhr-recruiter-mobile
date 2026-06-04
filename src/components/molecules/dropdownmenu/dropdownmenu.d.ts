import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export interface DropdownMenuItem {
  label: string;
  icon: string;
  onPress: () => void;
  closeOnPress?: boolean;
  /** Optional icon color for this item (overrides iconColor from props) */
  iconColor?: string;
}

export interface DropdownMenuProps {
  visible: boolean;
  onClose: () => void;
  position: { left: number; top: number };
  items: DropdownMenuItem[];
  renderContent?: () => React.ReactNode;
  width?: number;
  iconWidth: number;
  iconHight: number;

  /** styles from parent */
  dropdownStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  /** Dynamic color for all icons (stroke/fill). Overridable per item via item.iconColor */
  iconColor?: string;
}
