import { TextInputProps } from 'react-native';

export interface UrlInputFieldProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
  disabled?: boolean;
  disable?: boolean;
  label?: string;
  showCopyIcon?: boolean;
  onCopy?: (fullUrl: string) => void;
  error?: string;
  isError?: boolean;
}
