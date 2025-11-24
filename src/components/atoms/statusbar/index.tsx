import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../../theme/colors';
import { useStyles } from './styles';
import { IStatusBar } from './statusbar';
import { hexToRgb } from '../../../utils/hexToRgb';

const StatusBar = (props: IStatusBar) => {
  const styles = useStyles();

  const gradientColors = props.showLightGreen
    ? [hexToRgb(colors.mainColors.lightGreen, 0.1), hexToRgb(colors.mainColors.lightGreen, 0.1)]
    : props.showWhite
    ? [colors.common.white, colors.common.white] 
    :[colors.common.grayBlack,colors.common.grayBlack]  ;

  return <LinearGradient colors={gradientColors} style={styles.statusBar} />;
};

export default StatusBar;
