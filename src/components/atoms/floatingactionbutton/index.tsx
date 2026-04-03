import React from 'react';
import {
  Pressable,
  StyleSheet,
  PressableProps,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { SvgXml } from 'react-native-svg';

export interface FloatingActionButtonProps extends PressableProps {
  value: string;
  size?: number;
  backgroundColor?: string;
  iconColor?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  value,
  size = 56,
  backgroundColor = colors.brand[600],
  iconColor = colors.common.white,
  style,
  ...rest
}) => {
  const radius = size / 2;

  return (
    <Pressable
      {...rest}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor,
        },
        style as StyleProp<ViewStyle>,
      ]}
    >
      <SvgXml
        xml={value}
        width={size * 0.50}
        height={size * 0.50}
        //fill={iconColor}
        stroke={iconColor}
        color={iconColor}
      />
    </Pressable>
  );
};

export default FloatingActionButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(10, 13, 18, 0.08)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
});

