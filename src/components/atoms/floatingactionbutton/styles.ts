import { StyleSheet } from 'react-native';

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
  });
};
