import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = () => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingVertical: 12,
      backgroundColor: colors.common.white,
      borderBottomWidth: 1,
      borderColor: colors.gray[200],
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 8,
    },
    iconWrapper: {
      position: 'relative',
    },
    notificationDot: {
      position: 'absolute',
      top: 1,
      left: 0,
      height: 7,
      width: 7,
      borderRadius: 4,
      backgroundColor: colors.brand[500],
    },
    titleText: {
      color: '#535862',
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      marginRight: 8,
      gap: 8,
    },
    chipActive: {
      borderColor: colors.brand[200],
      backgroundColor: colors.brand[50],
    },
    chipInactive: {
      borderColor: colors.gray[200],
      backgroundColor: colors.gray[50],
    },
  });
};
