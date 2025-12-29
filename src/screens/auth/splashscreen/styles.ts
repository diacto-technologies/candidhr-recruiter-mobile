import { Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get("screen");

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
            left: -width * 0.38,
            top: -height * 0.233,
            opacity: 0.2,
          },
        
          rightShape: {
            position: "absolute",
            top: height * 0.06,
            opacity: 0.2,
          },
        
          centerBox: {
            flexDirection:'row',
            alignItems:'center',
            gap:12,
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
    });
};