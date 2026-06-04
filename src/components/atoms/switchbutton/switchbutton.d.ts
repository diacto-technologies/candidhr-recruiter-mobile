import { ViewStyle, TextStyle } from "react-native";

export interface SwitchProps {
  onValueChange?: (value: boolean) => void;
  value?: boolean;
  activeText?: string;
  inActiveText?: string;
  backgroundActive?: string;
  backgroundInactive?: string;
  circleActiveColor?: string;
  circleInActiveColor?: string;
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
  circleStyle?: ViewStyle;
  disabled?: boolean;
}
