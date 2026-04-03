import type { StyleProp, ViewStyle } from 'react-native';

export interface CommonDropdownOption {
  [key: string]: any;
}

export interface CommonDropdownProps {
  /** Placeholder shown when nothing is selected */
  /** Placeholder shown when nothing is selected */
  placeholder: string;
  options: CommonDropdownOption[];

  /** Controlled value (matches valueKey in options) */
  value: any;
  onChange: (value: any, option?: CommonDropdownOption | CommonDropdownOption[]) => void;

  /**
   * When true, allows selecting multiple values.
   * `value` should be an array, and `onChange` will receive an array.
   */
  multiSelect?: boolean;

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

  /**
   * Optional callback fired when the dropdown is opened (focus gained).
   * Useful for lazy-loading options via Redux/Saga when the field is first used.
   */
  onOpen?: () => void;

  /**
   * Optional callback fired when the user scrolls to the end of the options list.
   * Use for pagination: load next page of options (e.g. dispatch getUsersRequestAction(page + 1)).
   */
  onLoadMore?: () => void;
}

