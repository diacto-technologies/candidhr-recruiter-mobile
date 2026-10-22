import React, { Fragment, useState } from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "./styles";
import { logoXML } from "../../../../assets/svg/logoxml";
import { SvgXml } from "react-native-svg";
import { candidHrLogo } from "../../../../assets/svg/candidhrlogo";
import { Button, Typography } from "../../../../components";
import { navigate } from "../../../../utils/navigationUtils";
import { colors } from "../../../../theme/colors";
import { useAppSelector } from "../../../../store/hooks";
import { selectBrandingData } from "../../../../features/branding/selectors";
import { selectProfile } from "../../../../features/profile/selectors";

const GetStartedScreen = () => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const brandingData = useAppSelector(selectBrandingData);
  const profile = useAppSelector(selectProfile);
  const [imageError, setImageError] = useState(false);

  const productName = brandingData?.product_name || profile?.tenant?.org_name;
  const isCustomProduct = Boolean(
    productName && productName.trim().toLowerCase() !== "candidhr"
  );

  const brandColor = brandingData?.primary_color || colors.brand[600];
  const firstLetter = (productName?.trim()[0] || "C").toUpperCase();

  const tenantLogo = profile?.tenant?.logo || profile?.tenant?.secondary_logo;
  const isDefaultCandidHrLogo = Boolean(tenantLogo && tenantLogo.includes("candidhr-logo"));

  const customUploadedLogo = isCustomProduct
    ? (brandingData?.logo ||
       brandingData?.secondary_logo ||
       (!isDefaultCandidHrLogo ? tenantLogo : null))
    : null;

  return (
    <Fragment>
      {/* <StatusBar translucent backgroundColor="transparent" barStyle="light-content" /> */}
      <ImageBackground
        source={require("../../../../assets/images/welcomescr.png")}
        style={styles.bg}
        resizeMode="stretch"
      >
        {/* HEADER LOGO */}
        <View style={[styles.headerLogo, { marginTop: insets.top + 10 }]}>
          <View style={styles.logoWrapper}>
            {isCustomProduct ? (
              customUploadedLogo && !imageError ? (
                <Image
                  source={{ uri: customUploadedLogo }}
                  style={{ width: 30, height: 36, borderRadius: 4 }}
                  resizeMode="contain"
                  onError={() => setImageError(true)}
                />
              ) : (
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 6,
                    backgroundColor: brandColor,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="semiBoldTxtsm" color={colors.base.white}>
                    {firstLetter}
                  </Typography>
                </View>
              )
            ) : (
              <SvgXml xml={logoXML} width={30} height={36} />
            )}
          </View>
          <View>
            {isCustomProduct ? (
              <Typography variant="semiBoldTxtlg" color={colors.base.white}>
                {productName}
              </Typography>
            ) : (
              <SvgXml xml={candidHrLogo} fill={colors.base.white} width={107} height={17} />
            )}
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          <Typography variant="semiBoldDmd" color={colors.gray[200]}>
            {`Welcome to ${productName || "CandidHR"}`}
          </Typography>

          <Typography
            variant="regularTxtmd"
            color={colors.gray[100]}
            //style={styles.description}
          >
            We are seeking a talented UX Designer to join our team in India.
          </Typography>

          {/* BUTTONS */}
          <View style={{gap:12,paddingTop:40,marginBottom:insets.bottom-20}}>
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
