import { StyleSheet } from "react-native";
import { useRNSafeAreaInsets } from "../../../hooks/useRNSafeAreaInsets";
import { windowWidth } from "../../../utils/devicelayout";
import { colors } from "../../../theme/colors";
import { Fonts } from "../../../theme/fonts";


export const useStyles = () => {
  const MIN_COL_WIDTH = windowWidth * 0.25;
  const insets = useRNSafeAreaInsets();

  return StyleSheet.create({
    card: {
      backgroundColor: colors.base.white,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.gray["200"],
    },

    headerRow: {
      flexDirection: "row",
      paddingVertical: 8,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.gray["200"],
      paddingLeft: 20,
      backgroundColor: colors.gray[50],
    },

    headerText: {
      minWidth: MIN_COL_WIDTH,
      marginRight: 16,
    },

    row: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: colors.gray["200"],
      height: 69, 
      paddingLeft: 20,
      alignItems: "center",  
    },

    cell: {
      fontFamily: Fonts.InterRegular,
      fontSize: 14,
      minWidth: MIN_COL_WIDTH,
      marginRight: 16,
    },
    
    leftFixedWrapper: {
      width: "50%",
      backgroundColor: colors.base.white,
      borderRightWidth: 1,
      borderColor: colors.gray[200],
      zIndex: 10,
    },

    leftFixedColumn: {
      paddingLeft: 20,
      borderBottomWidth: 1,
      borderColor: colors.gray[200],
      height: 69,
      justifyContent: "center"       
    },

    /** SCROLLBAR */
    scrollTrack: {
      paddingVertical: 10,
    },
    scrollThumb: {
      height: 6,
      backgroundColor: colors.mainColors.scrollBar,
      borderRadius: 10,
    },

    paginationContainer: {
      flexDirection: "row",
      padding: 16,
      borderColor: colors.gray["200"],
      alignSelf: "center",
    },
  });
};
