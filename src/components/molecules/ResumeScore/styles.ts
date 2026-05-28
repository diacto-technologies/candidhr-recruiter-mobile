import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";
import { shadowStyles } from "../../../theme/shadowcolor";

export const useStyles = () => StyleSheet.create({
  card: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.gray[200],
    padding: 16,
    gap: 16,
    ...shadowStyles.shadow_xs
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap:8
  },

  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
  },

  viewMoreRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  gradientWrapper: {
    flex:1,
    overflow: "hidden",
  },
  
  gradientBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
  },
  gradientTextcontainer:{
    flexDirection:'row',
    paddingHorizontal: 16, 
    paddingVertical:12,
     alignItems:'center'
  }
});
