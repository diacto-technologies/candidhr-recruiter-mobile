import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = () => {
    return StyleSheet.create({
        tabContainer: {
            position: "relative",
          },
          tabRow: {
            flexDirection: "row",
            paddingHorizontal: 16,
            paddingTop: 10,
            gap: 12,
          },
          tabBtn: {
            paddingBottom: 12,
            paddingHorizontal: 8,
          },
          underline: {
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 3,
            backgroundColor: "#5148CF",
          },
          bottomBorder: {
            height: 1,
            backgroundColor: colors.mainColors.borderColor || "#E5E5E5",
            marginTop: -1,
          },
          leftButton:{
            backgroundColor: colors.common.white,
            borderColor: "#FDA29B",
            borderRadius: 8,
            height: 44,
          },
          leftButtonText: {
            color: "#D92D20",
          },
          rightButton: {
            backgroundColor: colors.common.white,
            borderColor: "#D5D7DA",
            borderRadius: 8,
            height: 44,
          },
          rightButtonText: {
            color: "#414651",
          },
        
          iconRed: {
            color: "#D92D20",
          },
    });
};