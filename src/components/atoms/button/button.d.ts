// components/Button/button.ts
import { PressableProps, ReactNode } from 'react-native';

export type ButtonSize = 'Large' | 'Regular' | 'Medium' | 'Small' | 'Tab' | number;
export type ButtonVariant = 'outline' | 'text' | 'contain';

export interface IButton extends PressableProps {
  size?: ButtonSize;
  variant?: ButtonVariant;
  children?: ReactNode | string;
  startIcon?: ReactNode;
  middleIcon?: ReactNode;
  endIcon?: ReactNode;

  // Core colors
  buttonColor?: string;        // background
  textColor?: string;          // text & loader
  borderColor?: string;        // fallback solid border
  borderWidth?: number;        // solid border width (when provided)

  // New: Full customization for the modern style
  borderGradientOpacity?: number;   // opacity of white top gradient (0–1, default 0.12)
  shadowColor?: string;             // base color for all inset shadows (default #0A0D12)
  shadowOpacityLight?: number;      // for 1px & 2px highlights (default 0.05)
  shadowOpacityDark?: number;       // for inner border (default 0.18)

  paddingHorizontal?: number;
  borderRadius?: number;
  isLoading?: boolean;
}