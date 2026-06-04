import { StyleProp, ViewStyle } from "react-native";
import Button from "../../atoms/button";

export interface FooterButtonsProps {
  leftButtonProps: React.ComponentProps<typeof Button>;
  rightButtonProps: React.ComponentProps<typeof Button>;
  footerStyle?: StyleProp<ViewStyle>;
}
