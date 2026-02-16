import React from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  GestureResponderEvent,
  Pressable,
} from "react-native";
import { useStyles } from "./styles";

interface CardProps {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}

const Card = ({ children, style, onPress, disabled }: CardProps) => {
  const styles = useStyles();

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={[styles.base, style]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.base, style]}>{children}</View>;
};

export default Card;
