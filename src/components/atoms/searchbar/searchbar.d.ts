import { TextInputProps } from 'react-native';

export type DropItem = {
  id: string;
  title: string;
};

export interface SearchBarProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  dropdown?: boolean;
  data?: DropItem[];
  onSelect?: (item: DropItem) => void;
  onEndReached?: () => void;
  loading?: boolean;
  onClear?: () => void;
  /** When true, the dropdown list is NOT rendered internally (parent renders it externally). */
  externalDropdown?: boolean;
}
