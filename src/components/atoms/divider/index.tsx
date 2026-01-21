import React from 'react';
import { View } from 'react-native';
import { colors } from '../../../theme/colors';
import type { DimensionValue } from 'react-native';

type DividerProps = {
  color?: string;
  height?: number;
  marginVertical?: number;
  width?: DimensionValue;
};

const Divider = ({
  color = colors.mainColors.borderColor,
  height = 1,
  marginVertical = 0,
  width = '100%',
}: DividerProps) => {
  return (
    <View
      style={{
        width,
        height,
        backgroundColor: color,
        marginVertical,
      }}
    />
  );
};

export default Divider;
