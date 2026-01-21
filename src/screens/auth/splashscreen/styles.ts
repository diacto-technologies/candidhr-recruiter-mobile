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
      gap: 12,
      marginLeft: width / 10
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
      bottom: 44,
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