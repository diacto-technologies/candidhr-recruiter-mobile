import { StyleSheet } from 'react-native';

export const useStyles = () => {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 14,
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: '#D1D5DB',
      justifyContent: 'center',
      alignItems: 'center',
    },
    checked: {
      backgroundColor: '#6C4BE7',
      borderColor: '#6C4BE7',
    },
    badge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      backgroundColor: '#F3F4F6',
      borderRadius: 12,
    },
  });
};
