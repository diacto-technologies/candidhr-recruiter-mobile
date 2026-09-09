import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";
import { shadowStyles } from "../../../theme/shadowcolor";

export const useStyles = () => StyleSheet.create({
  card: {
    backgroundColor: colors.common.white,
    borderWidth: 0.5,
    borderColor: colors.gray[200],
    borderRadius: 12,
    padding: 16,
    gap: 16,
    ...shadowStyles.shadow_xs
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  tabsRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: 'center'
  },

  tabBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.gray[200],
  },

  skillRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftRow: {
    flexDirection: "row",
    gap: 8,
  },

  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
  },

  viewMore: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  tabBtnActive: {
    backgroundColor: colors.brand[50],
    borderColor: colors.brand[200],
    borderWidth: 1,
  },

  tabBtnDeactive: {
    backgroundColor: colors.gray[50],
    borderColor: colors.gray[200],
    borderWidth: 1,
  },

  mustHaveSection: {
    gap: 8,
  },

  mustHaveTitle: {
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});
