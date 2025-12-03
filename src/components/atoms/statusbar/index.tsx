import React from "react";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../../../theme/colors";
import { useStyles } from "./styles";
import { IStatusBar } from "./statusbar";

const StatusBar = ({ showWhite, showBrandGradient }: IStatusBar) => {
  const styles = useStyles();

  // DEFAULT: Dark bar
  let gradientColors = [colors.common.grayBlack, colors.common.grayBlack];
  let startPoint = { x: 0, y: 0 };
  let endPoint = { x: 0, y: 0 };

  // WHITE MODE
  if (showWhite) {
    gradientColors = [colors.common.white, colors.common.white];
  }

  // BRAND GRADIENT (45°)
  else if (showBrandGradient) {
    gradientColors = [colors.brand[700],colors.brand[700]];
    startPoint = { x: 0, y: 0 };
    endPoint = { x: 0, y: 0};
  }

  return (
    <LinearGradient
      colors={gradientColors}
      start={startPoint}
      end={endPoint}
      style={styles.statusBar}
    />
  );
};

export default StatusBar;
