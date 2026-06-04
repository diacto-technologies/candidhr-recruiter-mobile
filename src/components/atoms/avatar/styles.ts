import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const useStyles = (size: number, borderWidth: number, borderColor: string) => {
  return StyleSheet.create({
    wrapper: {
      backgroundColor: colors.gray[100],
      alignItems: "center",
      justifyContent: "center",
      height: size,
      width: size,
      borderRadius: size / 2,
      borderWidth,
      borderColor,
    },
    image: {
      height: size,
      width: size,
      borderRadius: size / 2,
    },
  });
};
