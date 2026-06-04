import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = () => {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.common.white,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.gray[200],
    },
    cardExpanded: {
      paddingBottom: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 16,
      borderColor: colors.gray[200],
    },
    headerExpanded: {
      borderBottomWidth: 1,
    },
    headerCollapsed: {
      borderBottomWidth: 0,
    },
    headerLeft: {
      flex: 1,
      paddingRight: 12,
      gap: 6,
    },
    contentContainer: {
      paddingHorizontal: 16,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    pointsRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    timeRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    subTitle: {
      marginTop: 16,
      marginBottom: 8,
      color: colors.gray[700],
    },
    testHeader: {
      marginTop: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    testCard: {
      borderRadius: 10,
      padding: 12,
      marginTop: 12,
    },
    pass: {
      backgroundColor: colors.success[50],
    },
    fail: {
      backgroundColor: colors.error[50],
    },
    testTitle: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    label: {
      marginTop: 8,
      marginBottom: 4,
      color: colors.gray[600],
    },
    box: {
      backgroundColor: colors.gray[50],
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.gray[300],
    },
    arrowExpanded: {
      transform: [{ rotate: "180deg" }],
    },
    arrowCollapsed: {
      transform: [{ rotate: "0deg" }],
    },
  });
};
