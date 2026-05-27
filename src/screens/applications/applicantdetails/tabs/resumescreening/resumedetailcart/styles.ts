import { StyleSheet } from "react-native";
import { colors } from "../../../../../../theme/colors";
import { shadowStyles } from "../../../../../../theme/shadowcolor";

export const useStyles = () => StyleSheet.create({
  card: {
    backgroundColor: colors.common.white,
    borderWidth: 0.5,
    borderColor: colors.gray[200],
    borderRadius: 12,
    padding: 16,
    gap: 20,
    ...shadowStyles.shadow_xs
  },

  title: {
    marginBottom: 14,
  },

  sectionHeader: {
    backgroundColor: colors.gray[100],
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },

  block: {
    gap: 4,
  },

  bulletList: {
    gap: 4,
    marginTop: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },

  relevantPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: colors.gray[50],
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  
  roundedConatiner: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    borderWidth: 1.5,
    backgroundColor: colors.gray[50],
    borderColor: colors.gray[200],
  },
  
  emptyContainer: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.gray[300],
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },

  emptyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center'
  },
});
