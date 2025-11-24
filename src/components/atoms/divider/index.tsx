import React from 'react';
import { View } from 'react-native';
import { colors } from '../../../theme/colors';

const Divider = ({ color = colors.mainColors.borderColor, height = 1, marginVertical = 0 }) => {
  return (
    <View
      style={{
        width: '100%',
        height: height,
        backgroundColor: color,
        marginVertical: marginVertical,
      }}
    />
  );
};

export default Divider;
