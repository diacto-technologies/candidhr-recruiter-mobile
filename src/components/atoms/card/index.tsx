import React from "react";
import { View, Pressable } from "react-native";
import { useStyles } from "./styles";
import { CardProps } from "./card";

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

