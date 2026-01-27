import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = () => {
  return StyleSheet.create({
    card: {
      flex: 1,
      width: '100%',
      height: 140,
      backgroundColor: colors.base.white,
      padding: 16,
      borderRadius: 12,
      borderWidth: 0.5,
      borderColor: colors.gray['200'],
      gap: 16,

      // Shadow = box-shadow: 0 1px 2px 0 rgba(10, 13, 18, 0.05)
      shadowColor: '#0A0D12',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      borderBottomWidth:0,

      // Android
      elevation:1,
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      marginLeft: 8,
    },
    percent: {
      marginLeft: 6,
    },
    subText: {
      marginLeft: 6,
    },
  });
};