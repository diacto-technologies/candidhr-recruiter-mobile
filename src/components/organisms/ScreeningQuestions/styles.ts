import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { shadowStyles } from '../../../theme/shadowcolor';

export const useStyles = () => {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.common.white,
      borderWidth: 0.5,
      borderColor: colors.gray[200],
      borderRadius: 12,
      padding: 16,
      gap: 16,
      ...shadowStyles.shadow_xs,
    },
    tabsRow: {
      flexDirection: "row",
      gap: 8,
    },
    tabBtn: {
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    tabBtnActive: {
      backgroundColor: colors.brand[50],
      borderColor: colors.brand[200],
      borderWidth: 1,
    },
    tabBtnDeactive: {
      backgroundColor: colors.gray[50],
      borderColor: colors.gray[200],
      borderWidth: 1,
    },
    innerCard: {
      borderWidth: 1,
      borderColor: colors.gray[200],
      borderRadius: 10,
      padding: 12,
      gap: 12,
    },
    audioBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: colors.gray[100],
      padding: 12,
      borderRadius: 12,
      justifyContent: 'center',
    },
    progressBackground: {
      flex: 1,
      height: 10,
      backgroundColor: "#E5E7EB",
      borderRadius: 10,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: "#635BFF",
      borderRadius: 10,
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
    emptyStateTextContainer: {
      flex: 1,
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
  });
};
