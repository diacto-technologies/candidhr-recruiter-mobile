import React from "react";
import { View, StyleSheet } from "react-native";
import Typography from "../../../atoms/typography";
import { colors } from "../../../../theme/colors";
import FooterButtons from "../../../molecules/footerbuttons";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { selectSelectedApplication } from "../../../../features/applications/selectors";
import { formatMonDDYYYY } from "../../../../utils/dateformatter";

interface WorkItem {
  title: string;
  company: string;
  start: string;
  end: string;
  description: string;
  relevant?: boolean;
}

interface ProjectItem {
  title: string;
  description: string;
}

interface EducationItem {
  title: string;
  university: string;
  start: string;
  end: string;
  percentage: string;
}

interface CertificateItem {
  title: string;
  issuer: string;
  year: string;
}

interface Props {
  work: WorkItem[];
}
export type RelevanceLevel = string;

export const formatRelevance = (
  relevance?: RelevanceLevel
): string => {
  if (!relevance) return "_";

  const map: Record<RelevanceLevel, string> = {
    high: "Highly relevant",
    medium: "Relevant",
    low: "Low",
  };

  return map[relevance];
};

export const relevanceStyleMap: Record<
  RelevanceLevel,
  {
    textColor: string;
    borderColor: string;
    backgroundColor: string;
  }
> = {
  high: {
    textColor: colors.success[700],
    borderColor: colors.success[200],
    backgroundColor: colors.success[50],
  },
  medium: {
    textColor: colors.brand[700],
    borderColor: colors.brand[200],
    backgroundColor: colors.brand[50],
  },
  low: {
    textColor: colors.gray[600],
    borderColor: colors.gray[200],
    backgroundColor: colors.gray[50],
  },
};

export const getRelevanceStyles = (
  relevance?: RelevanceLevel
) => {
  return relevance
    ? relevanceStyleMap[relevance]
    : {
      textColor: colors.gray[600],
      borderColor: colors.gray[200],
      backgroundColor: colors.gray[50],
    };
};




const DetailedResume = () => {
  const application = useAppSelector(selectSelectedApplication);

  return (
    <View style={styles.card}>
      <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
        Detailed resume
      </Typography>

      {/* WORK EXPERIENCE */}
      <View style={styles.sectionHeader}>
        <Typography variant="mediumTxtsm" color={colors.gray[600]}>
          WORK EXPERIENCE
        </Typography>
        <View style={styles.roundedConatiner}>
          <Typography variant="semiBoldTxtxs" color={colors.gray[600]}>
            {application?.resume?.work_experience.length ?? 0}
          </Typography>
        </View>
      </View>

      {application?.resume?.work_experience?.map((item, index) => (
        <View key={index} style={styles.block}>
          <View style={styles.row}>
            <Typography variant="semiBoldTxtmd" color={colors.gray[900]} style={{ flexShrink: 1 }}>{item?.position ?? "_"}</Typography>
            {item?.company && (
              <View style={[styles.relevantPill, { backgroundColor: getRelevanceStyles(item?.relevance).backgroundColor, borderColor: getRelevanceStyles(item?.relevance).borderColor }]}>
                <Typography variant="mediumTxtxs" color={getRelevanceStyles(item?.relevance).textColor}>
                  {formatRelevance(item?.relevance)}
                </Typography>
              </View>
            )}
          </View>
          <Typography variant="mediumTxtsm" color={colors.gray[700]}>
            {item?.company ?? "_"}
          </Typography>
          <Typography variant="regularTxtsm" color={colors.gray[600]}>
            {formatMonDDYYYY(item?.startDate, "MMM YYYY")}, {formatMonDDYYYY(item?.endDate, "MMM YYYY")}
          </Typography>

          <Typography
            variant="regularTxtsm"
            color={colors.gray[600]}
          >
            {item.description}
          </Typography>
        </View>
      ))}

      {/* PROJECTS */}
      <View style={styles.sectionHeader}>
        <Typography variant="mediumTxtsm" color={colors.gray[600]}>
          PROJECTS
        </Typography>
        <View style={styles.roundedConatiner}>
          <Typography variant="semiBoldTxtxs" color={colors.gray[600]}>
            {application?.resume?.projects.length ?? 0}
          </Typography>
        </View>
      </View>

      {application?.resume?.projects?.map((item, index) => (
        <View key={index} style={styles.block}>
          <View style={styles.row}>
            <Typography variant="semiBoldTxtmd" color={colors.gray[900]} style={{ flexShrink: 1 }}>
              {index + 1}. {item?.name ?? "_"}
            </Typography>
            <View style={[styles.relevantPill, { backgroundColor: getRelevanceStyles(item?.relevance).backgroundColor, borderColor: getRelevanceStyles(item?.relevance).borderColor }]}>
              <Typography variant="mediumTxtxs" color={getRelevanceStyles(item?.relevance).textColor}>
                {formatRelevance(item?.relevance)}
              </Typography>
            </View>
          </View>
          <Typography
            variant="regularTxtsm"
            color={colors.gray[600]}
          >
            {item.description}
          </Typography>
        </View>
      ))}

      {/* EDUCATION */}
      <View style={styles.sectionHeader}>
        <Typography variant="mediumTxtsm" color={colors.gray[600]}>
          EDUCATION
        </Typography>
        <View style={styles.roundedConatiner}>
          <Typography variant="semiBoldTxtxs" color={colors.gray[600]}>
            {application?.resume?.education.length ?? 0}
          </Typography>
        </View>
      </View>

      {application?.resume?.education.map((item, index) => (
        <View key={index} style={styles.block}>
          <View style={styles.row}>
            <Typography variant="semiBoldTxtmd" color={colors.gray[900]} style={{ flexShrink: 1 }}>{item?.school ?? "_"}</Typography>
            <View style={[styles.relevantPill, { backgroundColor: getRelevanceStyles(item?.relevance).backgroundColor, borderColor: getRelevanceStyles(item?.relevance).borderColor }]}>
              <Typography variant="mediumTxtxs" color={getRelevanceStyles(item?.relevance).textColor}>
                {formatRelevance(item?.relevance)}
              </Typography>
            </View>
          </View>

          <Typography variant="mediumTxtsm" color={colors.gray[700]}>
            {item?.degree ?? "_"}
          </Typography>

          <Typography variant="regularTxtsm"
            color={colors.gray[600]}>
            {formatMonDDYYYY(item?.startDate ?? 0)}, {formatMonDDYYYY(item?.endDate ?? 0)}
          </Typography>

          <Typography variant="regularTxtsm"
            color={colors.gray[600]}>
            {item?.cgpa
              ? `CGPA: ${item.cgpa}`
              : item?.percent
                ? `Percentage: ${item.percent}`
                : "-"}
          </Typography>
        </View>
      ))}

      {/* CERTIFICATIONS */}
      <View style={styles.sectionHeader}>
        <Typography variant="mediumTxtsm" color={colors.gray[600]}>
          CERTIFICATIONS
        </Typography>
        <View style={styles.roundedConatiner}>
          <Typography variant="semiBoldTxtxs" color={colors.gray[600]}>
            {application?.resume?.certifications.length ?? 0}
          </Typography>
        </View>
      </View>

      {application?.resume?.certifications.map((item, index) => (
        <View key={index} style={styles.block}>
          <View style={styles.row}>
            <Typography variant="semiBoldTxtmd" color={colors.gray[900]}  style={{ flexShrink: 1 }}>{item?.name ?? "_"}</Typography>
            <View style={[styles.relevantPill, { backgroundColor: getRelevanceStyles(item?.relevance).backgroundColor, borderColor: getRelevanceStyles(item?.relevance).borderColor }]}>
              <Typography variant="mediumTxtxs" color={getRelevanceStyles(item?.relevance).textColor}>
                {formatRelevance(item?.relevance)}
              </Typography>
            </View>
          </View>

          <Typography variant="mediumTxtsm" color={colors.gray[700]}>
            {item?.description ?? "_"}
          </Typography>
          {/* <Typography variant="regularTxtsm"
            color={colors.gray[600]}>
            {item.year}
          </Typography> */}
        </View>
      ))}
    </View>
  );
};

export default DetailedResume;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.common.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    padding: 16,
    gap: 20,
    shadowColor: '#0A0D12',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
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
    gap: 4
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
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
  }
});
