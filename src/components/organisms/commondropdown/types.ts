import type { StyleProp, ViewStyle } from 'react-native';

export interface CommonDropdownOption {
  [key: string]: any;
}

export interface CommonDropdownProps {
  /** Placeholder shown when nothing is selected */
  placeholder: string;
  options: CommonDropdownOption[];

  /** Controlled value (matches valueKey in options) */
  value: any;
  onChange: (value: any, option: CommonDropdownOption) => void;

  labelKey?: string;
  valueKey?: string;
  usernameKey?: string;
  statusKey?: string;

  /** When true, shows count badge like #index / total */
  showIndexAndTotal?: boolean;

  /** Optional prefix label inside the field (like your existing Dropdown) */
  showLabelPrefix?: boolean;
  labelPrefixText?: string;

  disabled?: boolean;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;

  searchable?: boolean;
  searchPlaceholder?: string;
  searchField?: 'label' | 'name';

  /**
   * Force how the list opens. In modals, the library often defaults to 'modal',
   * which looks wrong inside our custom modal sheets.
   */
  mode?: 'default' | 'modal' | 'auto';

  /** Prefer opening list below the field */
  dropdownPosition?: 'auto' | 'top' | 'bottom';
}

