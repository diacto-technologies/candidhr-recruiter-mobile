import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const useStyles = () => {
  return StyleSheet.create({
    footer: {
      flexDirection: "row",
      paddingHorizontal: 12,
      backgroundColor: colors.base.white,
      borderTopWidth: 1,
      borderColor: "#E5E5E5",
      columnGap: 12,
      paddingTop: 16,
    },
    buttonWrapper: {
      flex: 1,
    },
  });
};
