import { Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get("window");

export const useStyles = () => {
  return StyleSheet.create({
    gradient: {
      flex: 1,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    },

    leftShape: {
      position: "absolute",
      left: "-40%",
      top: "-20%",
      opacity: 0.2,
    },

    rightShape: {
      position: "absolute",
      right: "-5%",
      top: "-10%",
      opacity: 0.2,
    },

    centerBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },

    customLogo: {
      width: 52,
      height: 52,
      borderRadius: 8,
    },

    autoLetterBadge: {
      width: 44,
      height: 44,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 2,
    },

    autoLetterText: {
      fontSize: 22,
      fontWeight: '700',
      color: 'white',
      lineHeight: 26,
    },

    customTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: 'white',
      letterSpacing: 0.3,
    },

    title: {
      marginTop: 20,
      fontSize: 32,
      fontWeight: "700",
      color: "white",
    },

    subtitle: {
      marginTop: 6,
      color: "white",
      opacity: 0.9,
      fontSize: 14,
    },

    footer: {
      position: "absolute",
      bottom: 48,
      color: "white",
      opacity: 0.9,
      fontSize: 14,
    },
    leftBg: {
      position: "absolute",
      width: "100%",
      height: "100%",
      opacity: 0.04,
      top:-16,
    },

    rightBg: {
      position: "absolute",
      width: "100%",
      height: "100%",
      top: -height * 0.001,
      right: width / 5,
      opacity: 0.04,
    },
  });
};