import React from 'react';
import { Pressable, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../../../theme/colors';
import { SvgXml } from 'react-native-svg';
import { FloatingActionButtonProps } from './floatingactionbutton.d';
import { useStyles } from './styles';

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  value,
  size = 56,
  backgroundColor = colors.brand[600],
  iconColor = colors.common.white,
  style,
  ...rest
}) => {
  const styles = useStyles(size, backgroundColor);

  return (
    <Pressable
      {...rest}
      style={[styles.button, style as StyleProp<ViewStyle>]}
    >
      <SvgXml
        xml={value}
        width={size * 0.50}
        height={size * 0.50}
        stroke={iconColor}
        color={iconColor}
      />
    </Pressable>
  );
};

export default FloatingActionButton;


