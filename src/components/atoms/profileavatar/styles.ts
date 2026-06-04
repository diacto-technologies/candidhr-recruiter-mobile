import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = (size: number, outerSize: number) => {
  const totalOuterSize = size + outerSize;
  const borderRadius = totalOuterSize / 2;
  const innerBorderRadius = size / 2;

  return StyleSheet.create({
    outerWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      width: totalOuterSize,
      height: totalOuterSize,
      borderRadius,
    },
    borderWrapper: {
      backgroundColor: colors.base.white,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'rgba(0, 0, 0, 0.08)',
      padding: 4,
      width: totalOuterSize,
      height: totalOuterSize,
      borderRadius,
    },
    image: {
      width: size,
      height: size,
      borderRadius: innerBorderRadius,
      borderWidth: 2,
      borderColor: 'rgba(0, 0, 0, 0.08)',
    },
    initialCircle: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.gray[100],
      shadowColor: '#0A0D12',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 8,
      width: size,
      height: size,
      borderRadius: innerBorderRadius,
    },
  });
};
