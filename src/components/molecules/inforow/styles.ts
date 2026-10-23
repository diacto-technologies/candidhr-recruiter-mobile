import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = () =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconBox: {
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      backgroundColor: colors.base.white,
      borderColor: colors.gray[300],
      justifyContent: 'center',
      alignItems: 'center',
    },
    textBox: {
      flex: 1,
      marginLeft: 14,
    },
  });
