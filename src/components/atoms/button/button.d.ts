import { PressableProps } from 'react-native';

export type ButtonSize = 'Large' | 'Regular' | 'Medium' | 'Small' | 'Tab' | number;
export type ButtonVariant = 'outline' | 'text' | 'contain';
export interface IButton extends PressableProps {
  size?: ButtonSize;
  variant?: ButtonVariant;
  children?: ReactNode | (() => ReactNode) | string;
  startIcon?: ReactNode | (() => ReactNode);
  endIcon?: ReactNode | (() => ReactNode);
  color?: string;
  textColor?: string;
  buttonColor?: string;
  paddingHorizontal?: number;
  isLoading?: true | false;
  borderColor?: string;
  borderRadius?: number;
}
