import { StyleSheet } from 'react-native';

export const useStyles = () =>
  StyleSheet.create({
    badge: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeSm: {
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 3,
      minWidth: 36,
    },
    badgeMd: {
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 5,
      minWidth: 44,
    },
    badgeLg: {
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 7,
      minWidth: 54,
    },
    textSm: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '700',
    },
    textMd: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '700',
    },
    textLg: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '700',
    },
    labelText: {
      fontSize: 10,
      lineHeight: 14,
      marginTop: 2,
      fontWeight: '500',
    },
  });

