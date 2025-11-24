import { ReactNode } from 'react';
import { TextInputProps as InputProps } from 'react-native';

export type TextFieldSize = 'Large' | 'Regular' | 'Medium' | 'Small' | 'Tab';
export interface TextFieldProps extends InputProps {
  startIcon?: ReactNode | (() => ReactNode);
  endIcon?: ReactNode | (() => ReactNode);
  lable?: string | number | undefined;
  error?: string;
  isError?: true | false;
  showError?: true | false;
  isRequired?: true | false;
  showOutline?: true | false;
  disable?: false | true;
  size?: TextFieldSize;
  height?: number;
  textFieldColor?: string;
}
