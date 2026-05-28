import React, { useMemo, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SvgXml } from "react-native-svg";
import Shimmer from "../../../components/atoms/shimmer";
import Typography from "../../../components/atoms/typography";
import { sparkles } from "../../../assets/svg/sparkles";
import { colors } from "../../../theme/colors";
import { shadowStyles } from "../../../theme/shadowcolor";

import {
  useStyles,
  OVERVIEW_BG,
  OVERVIEW_BORDER,
  STRENGTHS_BG,
  STRENGTHS_BORDER,
  STRENGTHS_BODY,
  STRENGTHS_LABEL,
  GAPS_BG,
  GAPS_BORDER,
  GAPS_BODY,
  GAPS_LABEL,
  RECRUITER_BG,
  RECRUITER_BORDER,
} from "./styles";
import { AiSummaryProps } from "./aisummary";

const AiSummaryShimmer = () => {
  const styles = useStyles();
  return (
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
  </View>
  );
};

const AiSummary = ({
  isloading,
  overview,
  strengths,
  gaps,
  redFlags,
  recruiterNote,
}: AiSummaryProps) => {
  const styles = useStyles();
  const [overviewExpanded, setOverviewExpanded] = useState(false);

  const gapLines = useMemo(() => {
    const merged = [...(gaps ?? []), ...(redFlags ?? [])]
      .map((s) => String(s).trim())
      .filter(Boolean);
    return [...new Set(merged)];
  }, [gaps, redFlags]);

  const strengthLines = useMemo(() => {
    return (strengths ?? [])
      .map((s) => String(s).trim())
      .filter(Boolean);
  }, [strengths]);

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
          {(strengthLines.length > 0) ? (
            <View style={styles.bulletBlock}>
              {strengthLines.map((line) => (
                  <View key={line} style={styles.bulletRow}>
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
              {gapLines.map((line) => (
                <View key={line} style={styles.bulletRow}>
                  <Typography
                    variant="regularTxtsm"
                    color={GAPS_BODY}
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


