import { StyleSheet } from "react-native";
import { windowWidth } from "../../../../utils/devicelayout";
import { colors } from "../../../../theme/colors";
import { useRNSafeAreaInsets } from "../../../../hooks/useRNSafeAreaInsets";
import { Fonts } from "../../../../theme/fonts";

export const useStyles = () => {
  const MIN_COL_WIDTH = windowWidth * 0.35;
  const insets = useRNSafeAreaInsets();

  return StyleSheet.create({
    card: {
      flex: 1,
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
      height:73,
      borderBottomWidth: 1,
      borderColor: colors.gray["200"],
      paddingLeft: 20,
      alignItems:"center"
    },

    cell: {
      fontFamily: Fonts.InterRegular,
      fontSize: 14,
      minWidth: MIN_COL_WIDTH,
      marginRight: 16,
    },

    /** FIXED LEFT COLUMN */
    leftFixedWrapper: {
      //width: 140,
      backgroundColor: colors.base.white,
      borderRightWidth: 1,
      borderColor: colors.gray[200],
      zIndex: 10,
    },

    leftFixedColumn: {
      height: 73,   
      //paddingVertical: 24,
      paddingLeft: 20,
      borderBottomWidth: 1,
      borderColor: colors.gray[200],
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
      paddingBottom: insets.insetsBottom,
      borderTopWidth: 1,
      borderColor: colors.gray["200"],
      alignSelf: "center",
    },
  });
};
