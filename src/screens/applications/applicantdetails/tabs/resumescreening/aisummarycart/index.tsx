import React, { useMemo, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SvgXml } from "react-native-svg";
import Shimmer from "../../../../../../components/atoms/shimmer";
import Typography from "../../../../../../components/atoms/typography";
import { sparkles } from "../../../../../../assets/svg/sparkles";
import { colors } from "../../../../../../theme/colors";
import { shadowStyles } from "../../../../../../theme/shadowcolor";

/** Scorecard v3 `ai_summary` — overview, strengths, gaps, recruiter note */
export interface AiSummaryProps {
  isloading: boolean;
  overview: string;
  strengths: string[];
  gaps: string[];
  redFlags?: string[];
  recruiterNote: string;
  headline?: string;
}

const OVERVIEW_BG = "#F5F7FF";
const OVERVIEW_BORDER = "#E0E7FF";
const OVERVIEW_LABEL = "#5B21B6";

const STRENGTHS_BG = "#F0FDF4";
const STRENGTHS_BORDER = "#BBF7D0";
const STRENGTHS_LABEL = "#166534";
const STRENGTHS_BODY = "#14532D";

const GAPS_BG = "#FFFBEB";
const GAPS_BORDER = "#FDE68A";
const GAPS_LABEL = "#B45309";
const GAPS_BODY = colors.gray[600];

const RECRUITER_BG = "#F9FAFB";
const RECRUITER_BORDER = colors.gray[200];
const RECRUITER_LABEL_MUTED = colors.gray[500];
const RECRUITER_LABEL_BADGE = colors.gray[700];
const RECRUITER_BADGE_BG = colors.gray[200];

const AiSummaryShimmer = () => (
  <View style={styles.card}>
    <View style={styles.headerRow}>
      <Shimmer width={20} height={16} borderRadius={4} />
      <Shimmer width="40%" height={18} borderRadius={4} />
    </View>
    <View style={[styles.sectionBox, { backgroundColor: OVERVIEW_BG }]}>
      <Shimmer width="28%" height={12} borderRadius={4} />
      <Shimmer width="100%" height={14} borderRadius={4} />
      <Shimmer width="95%" height={14} borderRadius={4} />
    </View>
    <View style={styles.strengthsGapsRow}>
      <View style={[styles.sectionBox, { flex: 1, backgroundColor: STRENGTHS_BG }]}>
        <Shimmer width="50%" height={12} borderRadius={4} />
        <Shimmer width="100%" height={12} borderRadius={4} />
        <Shimmer width="88%" height={12} borderRadius={4} />
      </View>
      <View style={[styles.sectionBox, { flex: 1, backgroundColor: GAPS_BG }]}>
        <Shimmer width="35%" height={12} borderRadius={4} />
        <Shimmer width="100%" height={12} borderRadius={4} />
      </View>
    </View>
    <View style={[styles.sectionBox, { backgroundColor: RECRUITER_BG }]}>
      <Shimmer width="45%" height={12} borderRadius={4} />
      <Shimmer width="100%" height={14} borderRadius={4} />
    </View>
  </View>
);

const AiSummary = ({
  isloading,
  overview,
  strengths,
  gaps,
  redFlags = [],
  recruiterNote,
  headline,
}: AiSummaryProps) => {
  const [overviewExpanded, setOverviewExpanded] = useState(false);

  const gapLines = useMemo(() => {
    const merged = [...(gaps ?? []), ...(redFlags ?? [])]
      .map(s => String(s).trim())
      .filter(Boolean);
    return [...new Set(merged)];
  }, [gaps, redFlags]);

  if (isloading) {
    return <AiSummaryShimmer />;
  }

  const overviewTrimmed = (overview ?? "").trim();
  const showOverviewToggle = overviewTrimmed.length > 220;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <SvgXml xml={sparkles} height={20} width={20} />
        <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
          AI Candidate Summary
        </Typography>
      </View>

      {/* OVERVIEW */}
      <View
        style={[
          styles.sectionBox,
          styles.overviewBox,
          { backgroundColor: OVERVIEW_BG, borderColor: OVERVIEW_BORDER },
        ]}
      >
        <Typography
          variant="semiBoldTxtsm"
          color={colors.gray[800]}
        >
          Overview
        </Typography>
        <Typography
          variant="regularTxtsm"
          color={colors.gray[700]}
          style={styles.bodyText}
          numberOfLines={overviewExpanded ? undefined : 6}
        >
          {overviewTrimmed || "—"}
        </Typography>
        {showOverviewToggle ? (
          <TouchableOpacity
            onPress={() => setOverviewExpanded(!overviewExpanded)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Typography variant="semiBoldTxtsm" color={colors.brand[600]}>
              {overviewExpanded ? "Read less" : "Read more"}
            </Typography>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* STRENGTHS | GAPS */}
      <View style={styles.strengthsGapsRow}>
        <View
          style={[
            styles.sectionBox,
            styles.halfColumn,
            {
              backgroundColor: STRENGTHS_BG,
              borderColor: STRENGTHS_BORDER,
            },
          ]}
        >
          <Typography
            variant="semiBoldTxtsm"
            color={colors.success[900]}
          >
            Strengths
          </Typography>
          {(strengths ?? []).filter(s => String(s).trim()).length ? (
            <View style={styles.bulletBlock}>
              {(strengths ?? [])
                .map(s => String(s).trim())
                .filter(Boolean)
                .map((line, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Typography
                      variant="regularTxtsm"
                      color={STRENGTHS_BODY}
                    >
                      <Typography
                        variant="regularTxtsm"
                        color={STRENGTHS_LABEL}
                        style={styles.bulletGlyph}
                      >
                        {"\u2022 "}
                      </Typography>
                      {line}
                    </Typography>
                  </View>
                ))}
            </View>
          ) : (
            <Typography variant="regularTxtsm" color={GAPS_BODY}>
              No strengths listed.
            </Typography>
          )}
        </View>

        <View
          style={[
            styles.sectionBox,
            styles.halfColumn,
            { backgroundColor: GAPS_BG, borderColor: GAPS_BORDER },
          ]}
        >
          <Typography
            variant="semiBoldTxtsm"
            color={colors.warning[900]}
          >
            Gaps
          </Typography>
          {gapLines.length ? (
            <View style={styles.bulletBlock}>
              {gapLines.map((line, i) => (
                <View key={i} style={styles.bulletRow}>
                  <Typography
                    variant="regularTxtsm"
                    color={GAPS_BODY}
                  // style={[styles.bodyText, styles.bulletText]}
                  >
                     <Typography
                    variant="regularTxtsm"
                    color={GAPS_LABEL}
                    style={styles.bulletGlyph}
                  >
                    {"\u2022 "}
                  </Typography> 
                    {line}
                  </Typography>
                </View>
              ))}
            </View>
          ) : (
            <Typography variant="regularTxtsm" color={GAPS_BODY}>
              No significant gaps identified.
            </Typography>
          )}
        </View>
      </View>

      {/* RECRUITER NOTE */}
      <View
        style={[
          styles.sectionBox,
          {
            backgroundColor: RECRUITER_BG,
            borderColor: RECRUITER_BORDER,
          },
        ]}
      >
        <View style={styles.recruiterTitleRow}>
            <Typography
              variant="semiBoldTxtsm"
              color={colors.gray[800]}
            >
              Recruiter Note
            </Typography>
          </View>
        <Typography
          variant="regularTxtsm"
          color={colors.gray[800]}
          style={styles.bodyText}
        >
          {(recruiterNote ?? "").trim() || "—"}
        </Typography>
      </View>
    </View>
  );
};

export default AiSummary;

const styles = StyleSheet.create({
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

  sectionLabel: {
    // letterSpacing: 0.6,
  },

  bodyText: {
    lineHeight: 22,
  },

  strengthsGapsRow: {
    // flexDirection: "row",
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
    //lineHeight: 22,
    marginTop: 0,
    width: 14,
  },

  bulletText: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },

  recruiterTitleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },

  recruiterBadge: {
    backgroundColor: RECRUITER_BADGE_BG,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
