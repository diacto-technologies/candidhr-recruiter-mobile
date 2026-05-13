import React from "react";
import { View, StyleSheet } from "react-native";
import { useAppSelector } from "../../../../../../hooks/useAppSelector";
import { selectApplicationsDetailLoading, selectResumeScreeningReport } from "../../../../../../features/applications/selectors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../../../../../../theme/colors";
import Shimmer from "../../../../../../components/atoms/shimmer";
import Typography from "../../../../../../components/atoms/typography";
import { formatMonDDYYYY } from "../../../../../../utils/dateformatter";
import { shadowStyles } from "../../../../../../theme/shadowcolor";
import type { ResumeScreeningReportApiResponse } from "../../../../../../features/applications/types";

export type RelevanceLevel = string;

export const formatRelevance = (
  relevance?: RelevanceLevel
): string => {
  if (!relevance) return "_";

  const map: Record<RelevanceLevel, string> = {
    matched: "Matched",
    high: "Highly relevant",
    medium: "Relevant",
    low: "Low",
  };

  return map[relevance] ?? relevance;
};

export const relevanceStyleMap: Record<
  RelevanceLevel,
  {
    textColor: string;
    borderColor: string;
    backgroundColor: string;
  }
> = {
  matched: {
    textColor: colors.success[900],
    borderColor: colors.success[200],
    backgroundColor: colors.success[100],
  },
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

const RELEVANCE_ORDER: RelevanceLevel[] = ["matched", "high", "medium", "low"];

const tierIndex = (t?: RelevanceLevel) =>
  t && RELEVANCE_ORDER.indexOf(t) >= 0
    ? RELEVANCE_ORDER.indexOf(t)
    : RELEVANCE_ORDER.length;

/** Scorecard v3 uses `tier`; resume_details uses `relevance`. */
const sortByTierOrRelevance = <
  T extends { tier?: RelevanceLevel; relevance?: RelevanceLevel },
>(
  items: T[]
): T[] =>
  [...(items ?? [])].sort((a, b) => {
    const ta = a.tier ?? a.relevance;
    const tb = b.tier ?? b.relevance;
    return tierIndex(ta) - tierIndex(tb);
  });

type ScorecardComponent = NonNullable<
  NonNullable<
    NonNullable<
      ResumeScreeningReportApiResponse["attributes"]["scorecard_v3"]
    >["components"]
  >[number]
>;

function tieredItemsForKeys(
  components: ScorecardComponent[] | undefined,
  keys: readonly string[]
) {
  const list = components ?? [];
  for (const k of keys) {
    const found = list.find(c => c?.key === k);
    if (found?.tiered_items?.length) return found.tiered_items;
  }
  return [];
}

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


/** Snake_case dates from scorecard / resume_details. */
const pickStartDate = (item: {
  start_date?: string;
  startDate?: string;
}) => item.start_date ?? item.startDate;

const pickEndDate = (item: { end_date?: string; endDate?: string }) =>
  item.end_date ?? item.endDate;

const pickTierLabel = (item: {
  tier?: RelevanceLevel;
  relevance?: RelevanceLevel;
}) => item.tier ?? item.relevance;

const DetailedResume = () => {
  const report = useAppSelector(selectResumeScreeningReport);
  const loading = useAppSelector(selectApplicationsDetailLoading);

  if (loading) {
    return <DetailedResumeShimmer />;
  }

  const components = report?.attributes?.scorecard_v3?.components ?? [];
  const workExperience = tieredItemsForKeys(components, [
    "experience",
    "work_experience",
  ]);
  const projects = tieredItemsForKeys(components, ["projects"]);
  const education = tieredItemsForKeys(components, ["education"]);
  const certifications = tieredItemsForKeys(components, ["certifications"]);

  return (
    <View style={styles.card}>
      <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
        Detailed Resume
      </Typography>

      {/* ================= WORK EXPERIENCE (scorecard_v3 experience) ================= */}
      <View style={styles.sectionHeader}>
        <Typography variant="mediumTxtsm" color={colors.gray[600]}>
          WORK EXPERIENCE
        </Typography>
        <View style={styles.roundedConatiner}>
          <Typography variant="semiBoldTxtxs" color={colors.gray[600]}>
            {workExperience.length}
          </Typography>
        </View>
      </View>

      {workExperience.length ? (
        sortByTierOrRelevance(workExperience).map((item, index) => {
          const tierLabel = pickTierLabel(item);
          return (
            <View key={index} style={styles.block}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Typography
                    variant="semiBoldTxtmd"
                    color={colors.gray[900]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {item?.title ?? item?.name ?? "_"}
                  </Typography>
                </View>

                {tierLabel ? (
                  <View
                    style={[
                      styles.relevantPill,
                      {
                        backgroundColor:
                          getRelevanceStyles(tierLabel).backgroundColor,
                        borderColor:
                          getRelevanceStyles(tierLabel).borderColor,
                      },
                    ]}
                  >
                    <Typography
                      variant="mediumTxtxs"
                      color={getRelevanceStyles(tierLabel).textColor}
                    >
                      {formatRelevance(tierLabel)}
                    </Typography>
                  </View>
                ) : null}
              </View>

              <Typography variant="mediumTxtsm" color={colors.gray[700]}>
                {item?.company ?? "_"}
              </Typography>

              {/* <Typography variant="regularTxtsm" color={colors.gray[600]}>
                {formatMonDDYYYY(pickStartDate(item), "MMM YYYY")} –{" "}
                {formatMonDDYYYY(pickEndDate(item), "MMM YYYY")}
              </Typography> */}

              {item?.months != null ? (
                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                  Duration: {item.months} months
                </Typography>
              ) : null}

              {item?.technologies?.length ? (
                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                  Tech: {item.technologies.join(", ")}
                </Typography>
              ) : null}

              {item?.responsibilities?.length ? (
                <View style={styles.bulletList}>
                  {item.responsibilities.map((line, i) => (
                    <Typography
                      key={i}
                      variant="regularTxtsm"
                      color={colors.gray[600]}
                    >
                      • {line}
                    </Typography>
                  ))}
                </View>
              ) : item?.description ? (
                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                  {item.description}
                </Typography>
              ) : null}
            </View>
          );
        })
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
            {projects.length}
          </Typography>
        </View>
      </View>

      {projects.length ? (
        sortByTierOrRelevance(projects).map((item, index) => {
          const tierLabel = pickTierLabel(item);
          return (
            <View key={index} style={styles.block}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Typography
                    variant="semiBoldTxtmd"
                    color={colors.gray[900]}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    {index + 1}. {item?.name ?? "_"}
                  </Typography>
                </View>

                {tierLabel ? (
                  <View
                    style={[
                      styles.relevantPill,
                      {
                        backgroundColor:
                          getRelevanceStyles(tierLabel).backgroundColor,
                        borderColor:
                          getRelevanceStyles(tierLabel).borderColor,
                      },
                    ]}
                  >
                    <Typography
                      variant="mediumTxtxs"
                      color={getRelevanceStyles(tierLabel).textColor}
                    >
                      {formatRelevance(tierLabel)}
                    </Typography>
                  </View>
                ) : null}
              </View>
              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                {item?.description ?? "-"}
              </Typography>

              {item?.technologies?.length ? (
                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                  Tech: {item.technologies.join(", ")}
                </Typography>
              ) : null}
            </View>
          );
        })
      ) : (
        <EmptyState text="No project details found." />
      )}

      {/* ================= EDUCATION ================= */}
      <View style={styles.sectionHeader}>
        <Typography variant="mediumTxtsm" color={colors.gray[600]}>
          EDUCATION
        </Typography>
        <View style={styles.roundedConatiner}>
          <Typography
            variant="semiBoldTxtxs"
            color={colors.gray[600]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {education.length}
          </Typography>
        </View>
      </View>

      {education.length ? (
        sortByTierOrRelevance(education).map((item, index) => {
          const tierLabel = pickTierLabel(item);
          const school =
            item?.school ?? item?.institution ?? "_";
          return (
            <View key={index} style={styles.block}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Typography
                    variant="semiBoldTxtmd"
                    color={colors.gray[900]}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                  {item?.degree ?? "_"} 
                  </Typography>
                </View>

                {tierLabel ? (
                  <View
                    style={[
                      styles.relevantPill,
                      {
                        backgroundColor:
                          getRelevanceStyles(tierLabel).backgroundColor,
                        borderColor:
                          getRelevanceStyles(tierLabel).borderColor,
                      },
                    ]}
                  >
                    <Typography
                      variant="mediumTxtxs"
                      color={getRelevanceStyles(tierLabel).textColor}
                    >
                      {formatRelevance(tierLabel)}
                    </Typography>
                  </View>
                ) : null}
              </View>

              <Typography variant="mediumTxtsm" color={colors.gray[700]}>
                {school ?? "_"}
              </Typography>

              {item?.field_of_study || item?.degree_type ? (
                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                  {[item?.degree_type, item?.field_of_study]
                    .filter(Boolean)
                    .join(" · ")}
                </Typography>
              ) : null}

              {pickStartDate(item) || pickEndDate(item) ? (
                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                  {formatMonDDYYYY(pickStartDate(item))} –{" "}
                  {formatMonDDYYYY(pickEndDate(item))}
                </Typography>
              ) : null}
            </View>
          );
        })
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
            {certifications.length}
          </Typography>
        </View>
      </View>

      {certifications.length ? (
        sortByTierOrRelevance(certifications).map((item, index) => {
          const tierLabel = pickTierLabel(item);
          const issuerLine = [item?.issuer, item?.year != null ? String(item.year) : null]
            .filter(Boolean)
            .join(" · ");
          return (
            <View key={index} style={styles.block}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Typography
                    variant="semiBoldTxtmd"
                    color={colors.gray[900]}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    {item?.name ?? "_"}
                  </Typography>
                </View>

                {tierLabel ? (
                  <View
                    style={[
                      styles.relevantPill,
                      {
                        backgroundColor:
                          getRelevanceStyles(tierLabel).backgroundColor,
                        borderColor:
                          getRelevanceStyles(tierLabel).borderColor,
                      },
                    ]}
                  >
                    <Typography
                      variant="mediumTxtxs"
                      color={getRelevanceStyles(tierLabel).textColor}
                    >
                      {formatRelevance(tierLabel)}
                    </Typography>
                  </View>
                ) : null}
              </View>

              {issuerLine ? (
                <Typography variant="mediumTxtsm" color={colors.gray[700]}>
                  {issuerLine}
                </Typography>
              ) : null}
            </View>
          );
        })
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
    borderWidth: 0.5,
    borderColor: colors.gray[200],
    borderRadius: 12,
    padding: 16,
    gap: 20,
    // shadowColor: '#0A0D12',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    // shadowRadius: 3,
    // elevation: 1,
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

