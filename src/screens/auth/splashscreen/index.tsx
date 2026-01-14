import React, { Fragment, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SvgXml } from "react-native-svg";
import { colors } from "../../../theme/colors";
import { candidHrLogo, candidHrTxt } from "../../../assets/svg/candidhrlogo";
import { Typography } from "../../../components";
import { bgLeftShap } from "../../../assets/svg/bgleftshap";
import { bgRightShape } from "../../../assets/svg/bgrightshape";
import { logoXML } from "../../../assets/svg/logoxml";
import { navigate } from "../../../utils/navigationUtils";
import { useStyles } from "./styles";
import { useAppSelector } from "../../../store/hooks";
import { selectIsAuthenticated } from "../../../features/auth/selectors";
import StatusBarBackground from "../../../components/atoms/statusbar";

const { width, height } = Dimensions.get("window");

const SplashScreen = () => {
  const styles = useStyles();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    let timeoutId: number;
    if (isAuthenticated) {
      timeoutId = setTimeout(() => {
      navigate('UserBottomTab');
    }, 3000);
    } else {
      timeoutId = setTimeout(() => {
        navigate('GetStartedScreen');
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [isAuthenticated]);
  
    
  return (
    <Fragment>
      <StatusBarBackground showBrandGradient />

      <LinearGradient
        colors={[colors.brand[700], colors.brand[600]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <SvgXml xml={bgLeftShap} width={width * 1.2} height={height * 1.5}
          style={styles.leftShape} />

        <SvgXml xml={bgRightShape} width={width * 1.2} height={height * 0.9}
          style={styles.rightShape} />

        <View style={styles.centerBox}>
          <SvgXml xml={logoXML} width={40.318} height={48}/>
          <View style={{gap:10}}>
          <SvgXml xml={candidHrLogo} fill={colors.base.white} width={'143.872'} height={'22.679'} />
          <SvgXml xml={candidHrTxt} fill={colors.base.white} width={'144.291'} height={'11.917'}/>
          </View>
        </View>

        <Typography variant="regularTxtsm" color={colors.base.white} style={styles.footer}>Powered by Diacto</Typography>
      </LinearGradient>
    </Fragment>
  );
};

export default SplashScreen;
