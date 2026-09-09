import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";
import { shadowStyles } from "../../../theme/shadowcolor";

export const useStyles = () => {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    },
    card: {
      width: "100%",
      maxWidth: 420,
      backgroundColor: colors.common.white,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.gray[200],
      padding: 20,
      gap: 4,
      ...shadowStyles.shadow_lg,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray[200],
    },
    closeButton: {
      padding: 4,
    },
    contentList: {
      marginTop: 4,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 11,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray[200],
      borderStyle: "dashed",
    },
    lastRow: {
      borderBottomWidth: 0,
    },
    label: {
      flex: 1,
      marginRight: 12,
    },
    value: {
      textAlign: "right",
      flexShrink: 1,
    },
  });
};
