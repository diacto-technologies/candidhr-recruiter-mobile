import React from "react";
import { View, StyleSheet } from "react-native";
import Typography from "../../../atoms/typography";
import { colors } from "../../../../theme/colors";
import FooterButtons from "../../../molecules/footerbuttons";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { selectApplicationsDetailLoading, selectSelectedApplication } from "../../../../features/applications/selectors";
import { formatMonDDYYYY } from "../../../../utils/dateformatter";
import Shimmer from "../../../atoms/shimmer";
import Ionicons from "react-native-vector-icons/Ionicons";

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

const DetailedResumeShimmer = () => {
  return (
    <View style={styles.card}>
      {/* Title */}
      <Shimmer width="40%" height={20} />

      {/* Repeated sections */}
      {[1, 2, 3, 4].map(section => (
        <View key={section} style={{ gap: 12 }}>
          {/* Section header */}
          <View style={styles.sectionHeader}>
            <Shimmer width="30%" height={14} />
            <Shimmer width={24} height={14} borderRadius={8} />
          </View>

          {/* Blocks */}
          {[1, 2].map(item => (
            <View key={item} style={styles.block}>
              <Shimmer width="70%" height={16} />
              <Shimmer width="50%" height={14} />
              <Shimmer width="90%" height={14} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const EmptyState = ({ text }: { text: string }) => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIcon}>
      <Ionicons name="folder-outline" size={20} color={colors.gray[400]} />
    </View>
    <Typography variant="mediumTxtsm" color={colors.gray[500]}>
      {text}
    </Typography>
  </View>
);


const DetailedResume = () => {
  const application = useAppSelector(selectSelectedApplication);
  const loading = useAppSelector(selectApplicationsDetailLoading);

  if (loading) {
    return <DetailedResumeShimmer />;
  }

  const resume = application?.resume;

  return (
    <View style={styles.card}>
      <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
        Detailed Resume
      </Typography>

      {/* ================= WORK EXPERIENCE ================= */}
      <View style={styles.sectionHeader}>
        <Typography variant="mediumTxtsm" color={colors.gray[600]}>
          WORK EXPERIENCE
        </Typography>
        <View style={styles.roundedConatiner}>
          <Typography variant="semiBoldTxtxs" color={colors.gray[600]}>
            {resume?.work_experience?.length ?? 0}
          </Typography>
        </View>
      </View>

      {resume?.work_experience?.length ? (
        resume.work_experience.map((item, index) => (
          <View key={index} style={styles.block}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Typography variant="semiBoldTxtmd" color={colors.gray[900]} numberOfLines={2}
                  ellipsizeMode="tail">
                  {item?.position ?? "_"}
                </Typography>
              </View>

              {item?.relevance && (
                <View
                  style={[
                    styles.relevantPill,
                    {
                      backgroundColor:
                        getRelevanceStyles(item.relevance).backgroundColor,
                      borderColor:
                        getRelevanceStyles(item.relevance).borderColor,
                    },
                  ]}
                >
                  <Typography
                    variant="mediumTxtxs"
                    color={getRelevanceStyles(item.relevance).textColor}
                  >
                    {formatRelevance(item.relevance)}
                  </Typography>
                </View>
              )}
            </View>

            <Typography variant="mediumTxtsm" color={colors.gray[700]}>
              {item?.company ?? "_"}
            </Typography>

            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              {formatMonDDYYYY(item?.startDate, "MMM YYYY")} –{" "}
              {formatMonDDYYYY(item?.endDate, "MMM YYYY")}
            </Typography>

            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              {item?.description ?? "-"}
            </Typography>
          </View>
        ))
      ) : (
        <EmptyState text="No work experience found." />
      )}

      {/* ================= PROJECTS ================= */}
      <View style={styles.sectionHeader}>
        <Typography variant="mediumTxtsm" color={colors.gray[600]}>
          PROJECTS
        </Typography>
        <View style={styles.roundedConatiner}>
          <Typography variant="semiBoldTxtxs" color={colors.gray[600]}>
            {resume?.projects?.length ?? 0}
          </Typography>
        </View>
      </View>

      {resume?.projects?.length ? (
        resume.projects.map((item, index) => (
          <View key={index} style={styles.block}>
            <View style={styles.row}>
              <View style={{flex:1}}>
              <Typography variant="semiBoldTxtmd" color={colors.gray[900]} numberOfLines={3}
                  ellipsizeMode="tail">
                {index + 1}. {item?.name ?? "_"}
              </Typography>
              </View>

              {item?.relevance && (
                <View
                  style={[
                    styles.relevantPill,
                    {
                      backgroundColor:
                        getRelevanceStyles(item.relevance).backgroundColor,
                      borderColor:
                        getRelevanceStyles(item.relevance).borderColor,
                    },
                  ]}
                >
                  <Typography
                    variant="mediumTxtxs"
                    color={getRelevanceStyles(item.relevance).textColor}
                  >
                    {formatRelevance(item.relevance)}
                  </Typography>
                </View>
              )}
            </View>

            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              {item?.description ?? "-"}
            </Typography>
          </View>
        ))
      ) : (
        <EmptyState text="No project details found." />
      )}

      {/* ================= EDUCATION ================= */}
      <View style={styles.sectionHeader}>
        <Typography variant="mediumTxtsm" color={colors.gray[600]}>
          EDUCATION
        </Typography>
        <View style={styles.roundedConatiner}>
          <Typography variant="semiBoldTxtxs" color={colors.gray[600]} numberOfLines={2}
                  ellipsizeMode="tail">
            {resume?.education?.length ?? 0}
          </Typography>
        </View>
      </View>

      {resume?.education?.length ? (
        resume.education.map((item, index) => (
          <View key={index} style={styles.block}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Typography variant="semiBoldTxtmd" color={colors.gray[900]} numberOfLines={3}
                  ellipsizeMode="tail">
                  {item?.school ?? "_"}
                </Typography>
              </View>

              {item?.relevance && (
                <View
                  style={[
                    styles.relevantPill,
                    {
                      backgroundColor:
                        getRelevanceStyles(item.relevance).backgroundColor,
                      borderColor:
                        getRelevanceStyles(item.relevance).borderColor,
                    },
                  ]}
                >
                  <Typography
                    variant="mediumTxtxs"
                    color={getRelevanceStyles(item.relevance).textColor}
                  >
                    {formatRelevance(item.relevance)}
                  </Typography>
                </View>
              )}
            </View>

            <Typography variant="mediumTxtsm" color={colors.gray[700]}>
              {item?.degree ?? "_"}
            </Typography>

            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              {formatMonDDYYYY(item?.startDate)} –{" "}
              {formatMonDDYYYY(item?.endDate)}
            </Typography>
          </View>
        ))
      ) : (
        <EmptyState text="No education details found." />
      )}

      {/* ================= CERTIFICATIONS ================= */}
      <View style={styles.sectionHeader}>
        <Typography variant="mediumTxtsm" color={colors.gray[600]}>
          CERTIFICATIONS
        </Typography>
        <View style={styles.roundedConatiner}>
          <Typography variant="semiBoldTxtxs" color={colors.gray[600]}>
            {resume?.certifications?.length ?? 0}
          </Typography>
        </View>
      </View>

      {resume?.certifications?.length ? (
        resume.certifications.map((item, index) => (
          <View key={index} style={styles.block}>
            <View style={styles.row}>
              <View style={{flex:1}}>
                <Typography variant="semiBoldTxtmd" color={colors.gray[900]} numberOfLines={3} ellipsizeMode="tail">
                  {item?.name ?? "_"}
                </Typography>
                </View>

                {item?.relevance && (
                  <View
                    style={[
                      styles.relevantPill,
                      {
                        backgroundColor:
                          getRelevanceStyles(item.relevance).backgroundColor,
                        borderColor:
                          getRelevanceStyles(item.relevance).borderColor,
                      },
                    ]}
                  >
                    <Typography
                      variant="mediumTxtxs"
                      color={getRelevanceStyles(item.relevance).textColor}
                    >
                      {formatRelevance(item.relevance)}
                    </Typography>
                  </View>
                )}
            </View>

            <Typography variant="mediumTxtsm" color={colors.gray[700]}>
              {item?.description ?? "_"}
            </Typography>
          </View>
        ))
      ) : (
        <EmptyState text="No certifications found." />
      )}
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

