import { StyleProp, ViewStyle } from "react-native";
import { textvariant } from "../../atoms/typography";

export interface TagListProps {
  data: string[];
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
  renderIcon?: (item: string, index: number) => React.ReactNode;
  size?: "sm" | "md";
  textVariant?: keyof typeof textvariant;
  tagStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}
