export interface MenuItem {
  name: string;
  title?: string;
  onPress: () => void;
}

export interface ThreeDotDropdownProps {
  visible: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  top?: number;
  right?: number;
  left?: number;
  bottom?: number;
}
