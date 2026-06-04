import { Animated, TouchableOpacity } from 'react-native';
import React, { FC, useRef } from 'react';
import { ScalePressProps } from './scalepress.d';
import { useStyles } from './styles';

const ScalePress: FC<ScalePressProps> = ({
  onLongPress,
  onPress,
  children,
  styles,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const stylesheet = useStyles();

  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressOut={onPressOut}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      activeOpacity={1}
      style={styles}
    >
      <Animated.View style={[stylesheet.animatedView, { transform: [{ scale: scaleValue }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ScalePress;