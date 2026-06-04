import { StyleSheet } from "react-native";

export const useStyles = () => {
  return StyleSheet.create({
    container: {
      width: 40,
      height: 20,
      padding: 2,
      borderRadius: 15,
      flexDirection: "row",
      alignItems: "center",
    },
    text: {
      flex: 1,
      color: "white",
      textAlign: "center",
      fontSize: 12,
    },
    circle: {
      position: "absolute",
      width: 16,
      height: 16,
      borderRadius: 12,
    },
  });
};
