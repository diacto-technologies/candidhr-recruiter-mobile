import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../../../../theme/colors";
import Typography from "../../../atoms/typography";
import { SvgXml } from "react-native-svg";
import { sparkles } from "../../../../assets/svg/sparkles";
import Divider from "../../../atoms/divider";
import Icon from "../../../atoms/vectoricon";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { selectSelectedApplication } from "../../../../features/applications/selectors";

interface Props {
  summary: string;
  matchScore: number;
  readinessScore: number;
  matchedSkills: ResumeSkill[];
  quickFacts: {
    lastRole: string;
    lastCompany: string;
    education: string;
    experience: string[];
    certifications: string[];
  };
  risks: string[];
}

interface ResumeSkill {
  name: string;
  relevance: string;
  relevance_score: number;
}

const AiSummary = ({
  summary,
  matchScore,
  readinessScore,
  matchedSkills,
  quickFacts,
  risks,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const application = useAppSelector(selectSelectedApplication);
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <SvgXml xml={sparkles} height={15} width={20} />
        <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
          AI summary
        </Typography>
      </View>

      {/* Narrative Summary */}
      <View style={styles.narrativeBox}>
        <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>
          Narrative summary
        </Typography>
        <View style={{ position: "relative" }}>
          <Typography
            variant="regularTxtsm"
            color={colors.gray[600]}
            style={{ lineHeight: 20, flexShrink: 1 }}
            numberOfLines={expanded ? undefined : 4}
          >
            {summary}
          </Typography>
          {summary?.length > 120 && (
            <TouchableOpacity
              onPress={() => setExpanded(!expanded)}
              style={{ alignSelf: "flex-end" }}
            >
              <Typography
                variant="semiBoldTxtsm"
                color={colors.brand[600]}
              >
                {expanded ? "read less" : "read more"}
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Divider */}
      <Divider color={colors.gray[200]} />

      {/* Match Score */}
      <Typography variant="semiBoldTxtmd" color={"#1F2937"}>Match score</Typography>
      <Typography variant="regularTxtsm" color={colors.gray[600]}>
        Fit against job requirements
      </Typography>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: matchScore + "%" }]}
          />
        </View>
        <Typography variant="mediumTxtsm" style={{ textAlign: "right" }} color={colors.gray[700]}>
          {matchScore}%
        </Typography>
      </View>
      <Divider />
      {/* Job Readiness */}
      <Typography variant="semiBoldTxtmd" color={"#1F2937"}>
        Job Readiness
      </Typography>
      <Typography variant="regularTxtsm" color={colors.gray[600]}>
        On-the-job capability
      </Typography>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: readinessScore + "%" }]}
          />
        </View>

        <Typography variant="mediumTxtsm" style={{ textAlign: "right" }} color={colors.gray[700]}>
          {readinessScore}%
        </Typography>
      </View>

      <Divider />
      {/* Skills Snapshot */}
      <View>
        <Typography variant="semiBoldTxtmd" color={"#1F2937"}>
          Skills Snapshot
        </Typography>
        <Typography variant="regularTxtsm" color={colors.gray[600]}>
          Matched vs. gaps
        </Typography>
      </View>

      <View style={styles.snapshotRow}>
        <View style={[styles.snapshotBox, { backgroundColor: colors.success[50] }]}>
          <Typography variant="semiBoldTxtmd" color={colors.success[500]}>
            {application?.resume?.ai_summary_json?.matched_skills.length ?? 0}
          </Typography>
          <Typography variant="regularTxtsm" color={colors.gray[600]}>
            Matched
          </Typography>
        </View>

        <View style={[styles.snapshotBox, { backgroundColor: colors.Rose[50] }]}>
          <Typography variant="semiBoldTxtmd" color={colors.error[500]}>
            {application?.resume?.ai_summary_json?.missing_skills.length ?? 0}
          </Typography>
          <Typography variant="regularTxtsm" color={colors.gray[600]}>
            Missing
          </Typography>
        </View>
      </View>

      <Divider />
      {/* Matched Skills */}
      <Typography variant="semiBoldTxtmd" color={"#1F2937"}>
        Matched skills
      </Typography>

      <View style={styles.tagContainer}>
        {application?.resume?.ai_summary_json?.matched_skills?.map((item, index) => (
          <View key={index} style={styles.tag}>
            <Typography variant="mediumTxtsm" color={colors.success[700]}>
              {item}
            </Typography>
          </View>
        ))}
      </View>
      <Divider />

      <Typography variant="semiBoldTxtmd" color={"#1F2937"}>
        Missing Skills
      </Typography>

      <View style={styles.tagContainer}>
        {application?.resume?.ai_summary_json?.missing_skills?.map((item, index) => (
          <View key={index} style={styles.missingtag}>
            <Typography variant="mediumTxtsm" color={colors.error[700]}>
              {item}
            </Typography>
          </View>
        ))}
      </View>

      <Divider />
      {/* Quick Facts */}
      <Typography variant="semiBoldTxtmd" color={"#1F2937"}>
        Quick facts
      </Typography>

      <View>
        <Typography variant="regularTxtsm" color={colors.gray[600]}>
          Last role
        </Typography>
        <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
          {quickFacts.lastRole}
        </Typography>
      </View>

      <View>
        <Typography variant="regularTxtsm" color={colors.gray[600]}>
          Last company
        </Typography>
        <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
          {quickFacts.lastCompany}
        </Typography>
      </View>

      <View>
        <Typography variant="regularTxtsm" color={colors.gray[600]} >
          Highest education
        </Typography>
        <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
          {quickFacts.education}
        </Typography>
      </View>

      <View>
        <Typography variant="regularTxtsm" color={colors.gray[600]}>
          Relevant experience
        </Typography>
        {quickFacts.experience.map((item, index) => (
          <Typography
            key={index}
            variant="semiBoldTxtsm"
            color={colors.gray[900]}
          >
            • {item}
          </Typography>
        ))}
      </View>

      <View>
        <Typography variant="regularTxtsm" color={colors.gray[600]}>
          Notable Certifications
        </Typography>
        {quickFacts.certifications.length > 0 ? (
          quickFacts.certifications.map((cert, index) => (
            <Typography
              key={index}
              variant="semiBoldTxtsm"
              color={colors.gray[900]}
            >
              {cert}
            </Typography>
          ))
        ) : (
          <Typography
            variant="semiBoldTxtsm"
            color={colors.gray[900]}
          >
            None listed
          </Typography>
        )}
      </View>

      {/* Divider */}
      <Divider />

      {/* Risks */}
      <View style={styles.riskBox}>
        <View style={styles.riskHeader}>
          <Icon size={20} name={"alert-circle"} iconFamily={"Feather"} color={colors.error[600]} />
          <Typography
            variant="semiBoldTxtsm"
            color={colors.error[600]}
          >
            Potential Risks / Red Flags
          </Typography>
        </View>

        {risks.map((risk, index) => (
          <View key={index} style={{ flexDirection: 'row', alignContent: 'center' }}>
            <Icon size={20} name={"dot-single"} iconFamily={"Entypo"} color={colors.error[600]} />
            <Typography variant="regularTxtsm" color={colors.error[600]}>
              {risk}
            </Typography>
          </View>
        ))}
      </View>
    </View>
  );
};

export default AiSummary;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    padding: 16,
    gap: 16,
    shadowColor: '#0A0D12',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    //paddingVertical:16
  },

  narrativeBox: {
    backgroundColor: colors.brand[25],
    borderWidth: 1,
    gap: 8,
    padding: 20,
    borderRadius: 10,
    borderColor: colors.brand[200]
  },

  readMore: {
    textDecorationLine: "underline",
  },

  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: 16,
  },

  progressBar: {
    //marginTop: 8,
    height: 8,
    width: '90%',
    backgroundColor: colors.gray[200],
    borderRadius: 8,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: colors.brand[600],
    borderRadius: 8,
  },

  sectionSpacing: {
    marginTop: 20,
  },

  snapshotRow: {
    flexDirection: "row",
    gap: 8,
  },

  snapshotBox: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    gap: 8
  },

  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  tag: {
    backgroundColor: colors.success[50],
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.success[200]
  },
  missingtag: {
    backgroundColor: colors.error[50],
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.error[200]
  },

  factRow: {
    marginTop: 10,
  },

  factValue: {
    marginTop: 2,
    fontWeight: "600",
  },

  riskBox: {
    backgroundColor: colors.error[50],
    borderWidth: 1,
    borderColor: colors.error[200],
    borderRadius: 10,
    padding: 12,
    gap: 8
  },

  riskHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },

  riskItem: {
    marginTop: 4,
  },
});
