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
  /** Red border + inline “!” next to chevron without rendering `error` text (use outer copy for twins). */
  highlightError?: boolean;
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

  /**
   * When set, each option shows two lines: primary (label) on top, returned string below in muted text.
   * Example: `email · job title` for applicant rows.
   */
  subLabelBuilder?: (item: CommonDropdownOption) => string | undefined;

  /** With multiSelect, show a checkbox on the left of each row instead of only a trailing checkmark. */
  multiSelectCheckbox?: boolean;

  /**
   * When true with multiSelect, show comma-separated labels (single line) instead of chip row.
   * Use when selections are echoed elsewhere (e.g. tags above).
   */
  multiSelectSummary?: boolean;

  /**
   * When true with multiSelect, prepend a “select all loaded options” row (use when e.g. a job filter is applied).
   * Disabled automatically if there are no options.
   */
  showSelectAllOption?: boolean;
  /** Label for the select-all row (default: Select all applicants). */
  selectAllOptionLabel?: string;

  /** Optional icon rendered on the left of each row and selected view */
  renderLeftIcon?: (item: CommonDropdownOption) => React.ReactNode;
}

