import { StyleSheet } from "react-native";
import { screenWidth } from "../../../utils/devicelayout";

export const useStyles = () => {
  return StyleSheet.create({
    container: { flexGrow: 1 },

    monthTitle: {
      textAlign: "center",
      fontWeight: "600",
      fontSize: 18,
      marginBottom: 10,
    },

    row: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 8,
      alignItems: "center",
    },

    inputBox: {
      borderWidth: 1,
      borderColor: "#DDD",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      minWidth: 130,
    },

    singleBox: {
      borderWidth: 1,
      borderColor: "#6C4BE7",
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 10,
      minWidth: 200,
    },

    todayBtn: {
      marginLeft: 10,
      borderWidth: 1,
      borderColor: "#DDD",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
    },

    todayText: {
      fontWeight: "600",
    },

    presets: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 10,
    },

    presetText: {
      color: "#6C4BE7",
      fontWeight: "600",
    },

    calendarBox: {
      width: "100%",
      alignSelf: "center",
      borderRadius: 12,
      overflow: "hidden",
    },

    calendar: {
      width: screenWidth - 70,
    },

    footer: {
      flexDirection: "row",
      marginTop: 14,
      columnGap: 10,
    },

    cancel: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "#DDD",
      padding: 12,
      alignItems: "center",
    },

    apply: {
      flex: 1,
      backgroundColor: "#6C4BE7",
      borderRadius: 10,
      padding: 12,
      alignItems: "center",
    },

    applyText: {
      color: "white",
    },
  });
};
