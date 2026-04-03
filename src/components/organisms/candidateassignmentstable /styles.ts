import { StyleSheet } from "react-native";
import { useRNSafeAreaInsets } from "../../../hooks/useRNSafeAreaInsets";
import { windowWidth } from "../../../utils/devicelayout";
import { colors } from "../../../theme/colors";
import { Fonts } from "../../../theme/fonts";
import { shadowStyles } from "../../../theme/shadowcolor";


export const useStyles = () => {
  const COL_WIDTH = 140; // 🔥 fixed width for all columns
  const LEFT_COL_WIDTH = 180; // 🔥 fixed left column

  const insets = useRNSafeAreaInsets();

  return StyleSheet.create({
    card: {
      backgroundColor: colors.base.white,
      borderRadius: 12,
      borderWidth: 0.5,
      borderColor: colors.gray["200"],
      ...shadowStyles.shadow_xs,
    },

    headerRow: {
      flexDirection: "row",
      paddingVertical: 10,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.gray["200"],
      paddingLeft: 16,
      backgroundColor: colors.gray[50],
      alignItems: "center",
    },

    headerText: {
      width: COL_WIDTH, // ✅ FIXED WIDTH
      marginRight: 12,
    },

    row: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: colors.gray["200"],
      minHeight: 70, // ✅ allow multi-line
      paddingLeft: 16,
      alignItems: "center",
    },

    cell: {
      width: COL_WIDTH, // ✅ FIXED WIDTH
      marginRight: 12,
      justifyContent: "center",
      alignItems: "flex-start", // ✅ important for 2-line text
    },

    leftFixedWrapper: {
      width: LEFT_COL_WIDTH, // ✅ FIXED (NOT %)
      backgroundColor: colors.base.white,
      borderRightWidth: 1,
      borderColor: colors.gray[200],
      zIndex: 10,
    },

    leftFixedColumn: {
      flexDirection:'row',
      alignItems:'center',
      width: LEFT_COL_WIDTH-20,
      paddingLeft: 16,
      borderBottomWidth: 1,
      borderColor: colors.gray[200],
      minHeight: 70, // ✅ match row height
      justifyContent: "center",
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
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    // paddingTop: 8,
    paddingBottom: 5,
  },
  searchBarWrap: {
    flex: 1,
    minWidth: 0,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: colors.base.white,
  },
  });
};
