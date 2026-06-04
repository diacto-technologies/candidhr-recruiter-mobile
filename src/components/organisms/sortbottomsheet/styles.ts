import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = () => {
  return StyleSheet.create({
    sortSheetContent: {
      marginBottom: 5,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 16,
      gap: 18,
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderBottomWidth: 2,
      marginHorizontal: 5,
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
      borderColor: colors.gray[200],
    },
    sortRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    radioOuter: {
      height: 24,
      width: 24,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.gray[300],
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.base.white,
    },
    radioOuterSelected: {
      borderColor: colors.brand[600],
      borderWidth: 2,
    },
    radioInner: {
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: colors.brand[600],
    },
    applyButton: {
      marginTop: 8,
      backgroundColor: colors.brand[600],
      borderRadius: 10,
      minHeight: 48,
      alignItems: "center",
      justifyContent: "center",
    },
  });
};
