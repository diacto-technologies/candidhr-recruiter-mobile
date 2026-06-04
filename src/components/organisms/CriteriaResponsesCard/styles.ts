import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { shadowStyles } from '../../../theme/shadowcolor';

export const useStyles = () => {
  return StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: colors.common.white,
      borderWidth: 0.5,
      borderColor: colors.gray[200],
      borderRadius: 12,
      padding: 16,
      gap: 16,
      ...shadowStyles.shadow_xs,
    },

    title: {
      marginBottom: 14,
    },

    innerCard: {
      borderWidth: 1,
      borderColor: colors.gray[200],
      borderRadius: 10,
      padding: 12,
      gap: 12,
      backgroundColor: colors.base.white,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    emptyState: {
      borderRadius: 12,
      backgroundColor: colors.gray[50],
      flexDirection: 'row',
      alignSelf: 'center',
      marginHorizontal: 20,
      padding: 20,
      alignItems: 'center',
    },
    
    avatarCircle: {
      height: 48,
      width: 48,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.gray[200],
      alignItems: 'center',
      justifyContent: 'center',
    },
    shimmerMargin: {
      marginLeft: 8,
    },
    questionRow: {
      flexDirection: 'row',
    },
    emptyStateTextContainer: {
      flex: 1,
    },
  });
};
