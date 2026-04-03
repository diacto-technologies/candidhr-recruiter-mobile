import { StyleSheet } from "react-native";
import { windowWidth } from "../../../../../utils/devicelayout";
import { shadowStyles } from "../../../../../theme/shadowcolor";
import { colors } from "../../../../../theme/colors";
import { Fonts } from "../../../../../theme/fonts";
import { useRNSafeAreaInsets } from "../../../../../hooks/useRNSafeAreaInsets";


export const useStyles = () => {
  const insets = useRNSafeAreaInsets();
  const COL_WIDTH = 130;        // 🔥 fixed width
  const LEFT_COL_WIDTH = 210;   // 🔥 fixed left column

  return StyleSheet.create({
    container:{
      flex:1,
      marginBottom: insets.insetsBottom,
    },
    toolbar: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 12,
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
      // paddingLeft: 16,
      backgroundColor: colors.gray[50],
      alignItems: "center",
    },

    headerText: {
      width: COL_WIDTH,     // ✅ FIXED WIDTH
      marginRight: 12,
      justifyContent: "center",
      alignItems: "flex-start",
    },

    row: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: colors.gray["200"],
      minHeight: 76,        // ✅ allow multi-line
      paddingLeft: 16,
      alignItems: "center",
    },

    cell: {
      width: COL_WIDTH,     // ✅ FIXED WIDTH
      marginRight: 12,
      justifyContent: "center",
      alignItems: "flex-start",
    },

    leftFixedWrapper: {
      width: LEFT_COL_WIDTH,   // ❗ NOT %
      backgroundColor: colors.base.white,
      borderRightWidth: 1,
      borderColor: colors.gray[200],
      zIndex: 10,
    },

    leftFixedColumn: {
      flexDirection:'row',
      alignItems:'center',
      width: LEFT_COL_WIDTH,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderColor: colors.gray[200],
      minHeight: 76,
      justifyContent: "flex-start",
    },

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
      paddingTop:20,
      paddingBottom: insets.insetsBottom-20,
      // borderTopWidth: 1,
      borderColor: colors.gray["200"],
      alignSelf: "center",
    },
  });
};
