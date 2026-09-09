import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = (size: number, backgroundColor: string) => {
  return StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: 'rgba(10, 13, 18, 0.08)',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 6,
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor,
    },
    badge: {
      position: 'absolute',
      top: -4,
      right: -4,
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      paddingHorizontal: 4,
      backgroundColor: colors.error[500],
      borderWidth: 1.5,
      borderColor: colors.base.white,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
  });
};
