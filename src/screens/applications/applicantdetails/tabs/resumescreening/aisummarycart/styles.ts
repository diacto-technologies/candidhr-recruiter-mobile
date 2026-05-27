import { StyleSheet } from "react-native";
import { colors } from "../../../../../../theme/colors";
import { shadowStyles } from "../../../../../../theme/shadowcolor";

export const OVERVIEW_BG = "#F5F7FF";
export const OVERVIEW_BORDER = "#E0E7FF";

export const STRENGTHS_BG = "#F0FDF4";
export const STRENGTHS_BORDER = "#BBF7D0";
export const STRENGTHS_LABEL = "#166534";
export const STRENGTHS_BODY = "#14532D";

export const GAPS_BG = "#FFFBEB";
export const GAPS_BORDER = "#FDE68A";
export const GAPS_LABEL = "#B45309";
export const GAPS_BODY = colors.gray[600];

export const RECRUITER_BG = "#F9FAFB";
export const RECRUITER_BORDER = colors.gray[200];

export const useStyles = () => StyleSheet.create({
  card: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.gray[200],
    padding: 16,
    gap: 12,
    ...shadowStyles.shadow_xs,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },

  sectionBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },

  overviewBox: {
    gap: 8,
  },

  bodyText: {
    lineHeight: 22,
  },

  strengthsGapsRow: {
    alignItems: "stretch",
    gap: 12,
  },

  halfColumn: {
    flex: 1,
    minWidth: 0,
  },

  bulletBlock: {
    gap: 6,
  },

  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 2,
    flexWrap: "wrap",
  },

  bulletGlyph: {
    marginTop: 0,
    width: 14,
  },

  recruiterTitleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
});
