import { StyleSheet } from 'react-native';

export const useStyles = (bgColor: string, borderColor: string) => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    tag: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 6,
      borderWidth: 1,
      backgroundColor: bgColor,
      borderColor: borderColor,
    },
    iconContainer: {
      marginRight: 6,
    },
  });
};
