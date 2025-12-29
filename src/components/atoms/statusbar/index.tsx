import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useStyles } from './styles';
import { IStatusBar } from './statusbar';
import { hexToRgb } from '../../../utils/hexToRgb';
import { colors } from '../../../theme/colors';

const StatusBar = (props: IStatusBar) => {
  const styles = useStyles();

  const gradientColors = props.showLightGreen
    ? [hexToRgb(colors.mainColors.lightGreen, 0.1), hexToRgb(colors.mainColors.lightGreen, 0.1)]
    : props.showWhite
    ? [hexToRgb(colors.base.white, 0), hexToRgb(colors.common.white, 0)]
    : [hexToRgb(colors.mainColors.brightGreen, 0.1), hexToRgb(colors.mainColors.main, 0.1)];

  return <LinearGradient colors={gradientColors} style={styles.statusBar} />;
};

export default StatusBar;
