import React, { Fragment } from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "./styles";
import { logoXML } from "../../../../assets/svg/logoxml";
import { SvgXml } from "react-native-svg";
import { candidHrLogo } from "../../../../assets/svg/candidhrlogo";
import { Button, Typography } from "../../../../components";
import { navigate } from "../../../../utils/navigationUtils";
import { colors } from "../../../../theme/colors";

const GetStartedScreen = () => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  return (
    <Fragment>
      {/* <StatusBar translucent backgroundColor="transparent" barStyle="light-content" /> */}
      <ImageBackground
        source={require("../../../../assets/images/welcomescr.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        {/* HEADER LOGO */}
        <View style={[styles.headerLogo,{marginTop: insets.top+10,}]}>
          <View style={styles.logoWrapper}>
            <SvgXml xml={logoXML} width={30} height={36}/>
          </View>
          <View>
            <SvgXml xml={candidHrLogo} fill={colors.base.white} width={107} height={17}/>
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          <Typography variant="semiBoldDmd" color={colors.gray[200]}>
            Welcome to the CandidHR
          </Typography>

          <Typography
            variant="regularTxtmd"
            color={colors.gray[100]}
            //style={styles.description}
          >
            We are seeking a talented UX Designer to join our team in India.
          </Typography>

          {/* BUTTONS */}
          <View style={{gap:12,paddingTop:40}}>
          <Button
            variant="contain"
            size='Medium'
            borderRadius={8}
            textColor="#fff"
            onPress={()=>navigate('OrgnizationalSwitch')}
          >
            Sign in
          </Button>

          {/* CONTACT US BUTTON */}
            {/* <Button
              buttonColor="#FFFFFF"
              textColor={colors.gray[700]}
              borderGradientOpacity={0.5}
              borderRadius={8}
              borderColor={colors.gray[300]}
              onPress={()=>{navigate('ContactUsScreen')}}
            >
              Contact us
            </Button> */}
          </View>
        </View>
      </ImageBackground>
    </Fragment>
  );
};

export default GetStartedScreen;
