import { StyleSheet, useWindowDimensions } from 'react-native';

export const useStyles = () => {
  const { width, height } = useWindowDimensions();

  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.85)",
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    },
    closeButton: {
      position: "absolute",
      top: 50,
      right: 20,
      zIndex: 10,
    },
    image: {
      width: width * 0.9,
      height: height * 0.6,
      borderRadius: 16,
    },
  });
};
