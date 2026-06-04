import { StyleSheet } from "react-native";

export const TOOLTIP_WIDTH = 260;
export const GAP = 8;
export const SIDE_PADDING = 10;

export const useStyles = (position: { top: number; left: number }) => {
  return StyleSheet.create({
    overlay: {
      flex: 1,
    },
    tooltipBox: {
      position: "absolute",
      width: TOOLTIP_WIDTH,
      backgroundColor: "#1F2937",
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      top: position.top,
      left: position.left,
    },
  });
};
