import { ReactNode } from "react";
import { ViewStyle, GestureResponderEvent } from "react-native";

export interface CardProps {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}
