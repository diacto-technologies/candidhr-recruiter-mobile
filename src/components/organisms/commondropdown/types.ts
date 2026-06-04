import type { StyleProp, ViewStyle } from 'react-native';

export interface CommonDropdownOption {
  [key: string]: any;
}
export interface CommonDropdownProps {
  placeholder: string;
  options: CommonDropdownOption[];
  value: any;
  onChange: (value: any, option?: CommonDropdownOption | CommonDropdownOption[]) => void;
  multiSelect?: boolean;
  labelKey?: string;
  valueKey?: string;
  usernameKey?: string;
  statusKey?: string;
  showIndexAndTotal?: boolean;
  showLabelPrefix?: boolean;
  labelPrefixText?: string;

  disabled?: boolean;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;

  searchable?: boolean;
  searchPlaceholder?: string;
  searchField?: 'label' | 'name';
  mode?: 'default' | 'modal' | 'auto';
  dropdownPosition?: 'auto' | 'top' | 'bottom';
  onOpen?: () => void;
  onLoadMore?: () => void;
}

