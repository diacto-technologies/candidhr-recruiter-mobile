import { StyleSheet } from 'react-native';

export const useStyles = (
  bgColor: string,
  borderColor: string,
  size: "sm" | "md" = "md"
) => {
  const isSm = size === "sm";
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: isSm ? 6 : 8,
    },
    tag: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: isSm ? 2 : 4,
      paddingHorizontal: isSm ? 8 : 10,
      borderRadius: 6,
      borderWidth: 1,
      backgroundColor: bgColor,
      borderColor: borderColor,
    },
    iconContainer: {
      marginRight: isSm ? 4 : 6,
    },
  });
};
