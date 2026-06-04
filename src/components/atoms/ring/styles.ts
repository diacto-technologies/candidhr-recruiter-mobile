import { StyleSheet } from "react-native";

export const useStyles = (size: number) => {
  return StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    },
    textContainer: {
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
    },
  });
};
