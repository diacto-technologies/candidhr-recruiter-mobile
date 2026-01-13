export type ToastPosition = 'top' | 'bottom';
export type ToastVariant = 'success' | 'info' | 'error' | 'warning';
export type ShowOptions = {
  message: string;
  position?: ToastPosition;
  animatedPosition?: boolean;
  duration?: number;
  edgeOffset?: number;
  maxWidth?: number | string;
  containerStyle?: ViewStyle;
  toastStyle?: ViewStyle;
  textStyle?: TextStyle;
  dismissOnPress?: boolean;
  variant?: ToastVariant;
};
export type ToastContextValue = {
  showToast: (opts: ShowOptions | string) => void;
  hideToast: () => void;
  isVisible: boolean;
};
