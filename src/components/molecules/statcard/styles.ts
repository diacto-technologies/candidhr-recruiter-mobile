import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { shadowStyles } from '../../../theme/shadowcolor';

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
      ...shadowStyles.shadow_xs,
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