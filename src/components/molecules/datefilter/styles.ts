import { StyleSheet } from "react-native";

export const useStyles = () => {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
    },
    dateInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: "#E2E8F0",
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
  });
};
