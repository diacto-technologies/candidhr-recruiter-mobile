import React, { Fragment, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, useWindowDimensions, Image } from "react-native";
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




const SplashScreen = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;

  const logoWidth = isTablet ? width * 0.28 : width * 0.38;
  const logoHeight = logoWidth * 0.16;

  const textWidth = isTablet ? width * 0.30 : width * 0.40;
  const textHeight = textWidth * 0.08;

  const candidLogoWidth = isTablet ? width * 0.08 : width * 0.11;
  const candidLogoHeight = candidLogoWidth * 1.19;
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const styles = useStyles();

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
    <>
      <StatusBarBackground showBrandGradient />

      <LinearGradient
        colors={[colors.brand[700], colors.brand[600]]}
        style={styles.gradient}
      >
        {/* RIGHT BACKGROUND SHAPE */}
        <Image
          source={require("../../../assets/images/bgrighticon.png")}
          style={styles.rightBg}
          resizeMode="cover"
        />

        {/* LEFT BACKGROUND SHAPE */}
        <Image
          source={require("../../../assets/images/bglefticon.png")}
          style={styles.leftBg}
          resizeMode="cover"
        />

        {/* CENTER LOGO */}
        <View style={styles.centerBox}>
          <SvgXml
            xml={logoXML}
            width={candidLogoWidth}
            height={candidLogoHeight}
          />

          <View style={{ gap: 10 }}>
            <SvgXml
              xml={candidHrLogo}
              fill={colors.base.white}
              width={logoWidth}
              height={logoHeight}
            />

            <SvgXml
              xml={candidHrTxt}
              fill={colors.base.white}
              width={textWidth}
              height={textHeight}
            />
          </View>
        </View>

        {/* FOOTER */}
        <Typography
          variant="regularTxtsm"
          color={colors.base.white}
          style={styles.footer}
        >
          Powered by diacto
        </Typography>
      </LinearGradient>
    </>
  );
};


export default SplashScreen;
