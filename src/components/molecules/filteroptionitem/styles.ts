import { StyleSheet } from 'react-native';

export const useStyles = () => {
  return StyleSheet.create({
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
      width: 20,
      height: 20,
      borderWidth: 1.5,
      borderColor: '#D1D5DB',
      borderRadius: 4,
    },
    checkedBox: {
      backgroundColor: '#6C4BE7',
      borderColor: '#6C4BE7',
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      backgroundColor: '#F3F4F6',
      borderRadius: 12,
    },
  });
};
