import { StyleSheet, DimensionValue } from 'react-native';

export const useStyles = (
  width: DimensionValue,
  height: DimensionValue,
  borderRadius: number
) => {
  return StyleSheet.create({
    container: {
      width,
      height,
      borderRadius,
      overflow: 'hidden',
      backgroundColor: '#E0E0E0',
    },
    animatedContainer: {
      flex: 1,
    },
  });
};
