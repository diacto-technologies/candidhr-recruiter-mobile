import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  ViewStyle,
  TextStyle,
} from "react-native";

interface SwitchProps {
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

const CustomSwitch: React.FC<SwitchProps> = ({
  onValueChange = () => {},
  value = false,
  activeText = "",
  inActiveText = "",
  backgroundActive = "#645CE7",
  backgroundInactive = "gray",
  circleActiveColor = "white",
  circleInActiveColor = "white",
  textStyle,
  containerStyle,
  circleStyle,
  disabled = false,
}) => {
  const [isActive, setIsActive] = useState(value);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    setIsActive(value);

    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const toggleSwitch = () => {
    if (disabled) return;

    const newValue = !isActive;
    setIsActive(newValue);
    onValueChange(newValue);

    Animated.timing(animatedValue, {
      toValue: newValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const interpolatedBackgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: disabled
      ? ["#a066d8", "#a066d8"]
      : [backgroundInactive, backgroundActive],
  });

  // Replaced moderateScale(2) → 2, and moderateScale(22) → 22
  const interpolatedCirclePosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <TouchableWithoutFeedback
      onPress={toggleSwitch}
      testID="toggle-switch"
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.container,
          containerStyle,
          {
            backgroundColor: interpolatedBackgroundColor,
            opacity: disabled ? 0.7 : 1,
          },
        ]}
        pointerEvents={disabled ? "none" : "auto"}
      >
        <Animated.Text style={[styles.text, textStyle]}>
          {isActive ? activeText : inActiveText}
        </Animated.Text>

        <Animated.View
          style={[
            styles.circle,
            circleStyle,
            {
              left: interpolatedCirclePosition,
              backgroundColor: isActive
                ? circleActiveColor
                : circleInActiveColor,
            },
          ]}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width:40,
    height:20,
    padding:2,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    flex: 1,
    color: "white",
    textAlign: "center",
    fontSize: 12,
  },
  circle: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius:12,
  },
});

export default CustomSwitch;
