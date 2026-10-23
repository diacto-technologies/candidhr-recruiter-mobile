import React, { Fragment, useEffect, useState } from "react";
import { View, useWindowDimensions, Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SvgXml, SvgUri } from "react-native-svg";
import { colors } from "../../../theme/colors";
import { candidHrLogo, candidHrTxt } from "../../../assets/svg/candidhrlogo";
import { Typography } from "../../../components";
import { logoXML } from "../../../assets/svg/logoxml";
import { navigate } from "../../../utils/navigationUtils";
import { useStyles } from "./styles";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectIsAuthenticated } from "../../../features/auth/selectors";
import { getProfileRequestAction } from "../../../features/profile/actions";
import { getBrandingRequestAction } from "../../../features/branding/actions";
import { selectBrandingData, selectIsBrandingReset } from "../../../features/branding/selectors";
import { selectProfile } from "../../../features/profile/selectors";
import { useBrandTheme } from "../../../hooks/useBrandTheme";
import StatusBarBackground from "../../../components/atoms/statusbar";
import { isDefaultLogoUrl, isDefaultOrCandidHr } from "../../../features/branding/constants";

const SplashScreen = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const logoWidth = isTablet ? width * 0.28 : width * 0.38;
  const logoHeight = logoWidth * 0.16;

  const textWidth = isTablet ? width * 0.30 : width * 0.40;
  const textHeight = textWidth * 0.08;

  const candidLogoWidth = isTablet ? width * 0.08 : width * 0.11;
  const candidLogoHeight = candidLogoWidth * 1.19;

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const brandingData = useAppSelector(selectBrandingData);
  const isBrandingReset = useAppSelector(selectIsBrandingReset);
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const [imageError, setImageError] = useState(false);

  useBrandTheme();
  const styles = useStyles();

  const companyName = profile?.tenant?.org_name?.trim() || '';
  const rawProductName = brandingData?.product_name?.trim() || '';
  const customProductName =
    !isBrandingReset && !isDefaultOrCandidHr(rawProductName) ? rawProductName : '';

  const customUploadedLogo =
    !isBrandingReset
      ? brandingData?.secondary_logo || brandingData?.favicon || brandingData?.logo || null
      : null;
  const hasCustomUploadedLogo = Boolean(customUploadedLogo && !isDefaultLogoUrl(customUploadedLogo));

  // Custom product is active when branding is NOT reset AND has custom product name, custom logo, or company name fallback
  const isCustomProduct = Boolean(
    !isBrandingReset &&
    (customProductName || hasCustomUploadedLogo || (companyName && (brandingData?.logo || brandingData?.secondary_logo)))
  );

  const productName = customProductName || (isCustomProduct && companyName ? companyName : 'CandidHR');
  const brandColor = brandingData?.primary_color || colors.brand[600];

  const companyInitials = React.useMemo(() => {
    if (!productName || productName === 'CandidHR') return 'C';
    const words = productName.split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (productName[0] || 'C').toUpperCase();
  }, [productName]);

  const firstLetter = companyInitials;

  const isSvgLogo = Boolean(
    customUploadedLogo &&
    (customUploadedLogo.endsWith('.svg') || customUploadedLogo.includes('.svg?'))
  );

  const showPoweredBy = Boolean(isCustomProduct && brandingData?.powered_by_enabled);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (isAuthenticated) {
      dispatch(getProfileRequestAction());
      dispatch(getBrandingRequestAction());
      timeoutId = setTimeout(() => {
        navigate('UserBottomTab');
      }, 1500);
    } else {
      timeoutId = setTimeout(() => {
        navigate('GetStartedScreen');
      }, 1500);
    }
    return () => clearTimeout(timeoutId);
  }, [dispatch, isAuthenticated]);

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
        {isCustomProduct ? (
          <View style={styles.centerBox}>
            {customUploadedLogo && !imageError ? (
              isSvgLogo ? (
                <View style={styles.customLogo}>
                  <SvgUri
                    uri={customUploadedLogo}
                    width={52}
                    height={52}
                  />
                </View>
              ) : (
                <Image
                  source={{ uri: customUploadedLogo }}
                  style={styles.customLogo}
                  resizeMode="contain"
                  onError={() => setImageError(true)}
                />
              )
            ) : (
              <View style={[styles.autoLetterBadge, { backgroundColor: brandColor }]}>
                <Typography variant="boldDsm" color={colors.base.white} style={styles.autoLetterText}>
                  {firstLetter}
                </Typography>
              </View>
            )}

            <Typography
              variant={isTablet ? "semiBoldDmd" : "semiBoldDsm"}
              color={colors.base.white}
              style={styles.customTitle}
            >
              {productName}
            </Typography>
          </View>
        ) : (
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
        )}

        {/* FOOTER */}
        {showPoweredBy && (
          <Typography
            variant="regularTxtsm"
            color={colors.base.white}
            style={styles.footer}
          >
            Powered by diacto
          </Typography>
        )}
      </LinearGradient>
    </>
  );
};


export default SplashScreen;
