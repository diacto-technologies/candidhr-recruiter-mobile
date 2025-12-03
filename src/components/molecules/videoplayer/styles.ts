import { StyleSheet } from "react-native";

export const useStyles = () => {
    return StyleSheet.create({
        container: {
            width: "100%",
            height: 180,
            borderRadius: 12,
            overflow: "hidden",
        },
        video: {
            width: "100%",
            height: "100%",
        },

        /* CENTER BIG PLAY BUTTON */
        playButton: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: [{ translateX: -60 }, { translateY: -60 }],
            zIndex: 20,
        },

        playCircle: {
            width: 10,
            height: 10,
            borderRadius: 60,
            backgroundColor: "rgba(255,255,255,0.45)",
            justifyContent: "center",
            alignItems: "center",
        },

        /* BOTTOM LEFT CONTROL ICONS */
        bottomLeft: {
            position: "absolute",
            left: 20,
            bottom: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 28,
            zIndex: 20,
        },

        /* BOTTOM RIGHT FULLSCREEN ICON */
        bottomRight: {
            position: "absolute",
            right: 20,
            bottom: 20,
            zIndex: 20,
        },
        seekBar: {
            width: "98%",
            position: "absolute",
            bottom: 5,
            left: 5,
        },

        controlBar: {
            position: "absolute",
            bottom: 40,
            left: 15,
            right: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        volumeSliderContainer: {
            position: "absolute",
            left: 130,
            bottom: -30,
            width:50,
            height:170,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
        },

        rotateWrapper: {
            transform: [{ rotate: "360deg" }],   // flip slider vertically
        },

        verticalSlider: {
            width: 150,      // becomes height because of rotation
            height: 40,
        },
    });
};
