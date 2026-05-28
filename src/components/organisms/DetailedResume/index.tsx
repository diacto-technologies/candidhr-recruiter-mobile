import React, { useMemo } from "react";
import { View } from "react-native";
import { useAppSelector } from "../../../hooks/useAppSelector";
import {
  selectApplicationsDetailLoading,
  selectResumeScreeningReport,
} from "../../../features/applications/selectors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../../../theme/colors";
import Shimmer from "../../../components/atoms/shimmer";
import Typography from "../../../components/atoms/typography";
import { formatMonDDYYYY } from "../../../utils/dateformatter";
import { useStyles } from "./styles";
import {
  formatRelevance,
  getRelevanceStyles,
  sortByTierOrRelevance,
  tieredItemsForKeys,
  pickStartDate,
  pickEndDate,
  pickTierLabel,
} from "./helper";

const DetailedResumeShimmer = () => {
  const styles = useStyles();
  return (
    <View style={styles.card}>
      <Shimmer width="40%" height={20} />
      {[1, 2, 3, 4].map((section) => (
        <View key={section} style={{ gap: 12 }}>
          <View style={styles.sectionHeader}>
            <Shimmer width="30%" height={14} />
            <Shimmer width={24} height={14} borderRadius={8} />
          </View>
          {[1, 2].map((item) => (
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

const EmptyState = ({ text }: { text: string }) => {
  const styles = useStyles();
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons name="folder-outline" size={20} color={colors.gray[400]} />
      </View>
      <Typography variant="mediumTxtsm" color={colors.gray[500]}>
        {text}
      </Typography>
    </View>
  );
};

const SectionHeader = ({ title, count }: { title: string; count: number }) => {
  const styles = useStyles();
  return (
    <View style={styles.sectionHeader}>
      <Typography variant="mediumTxtsm" color={colors.gray[600]}>
        {title}
      </Typography>
      <View style={styles.roundedConatiner}>
        <Typography variant="semiBoldTxtxs" color={colors.gray[600]}>
          {count}
        </Typography>
      </View>
    </View>
  );
};

const DetailedResume = () => {
  const styles = useStyles();
  const report = useAppSelector(selectResumeScreeningReport);
  const loading = useAppSelector(selectApplicationsDetailLoading);

  const components = report?.attributes?.scorecard_v3?.components ?? [];

  const workExperience = useMemo(() => {
    const data = tieredItemsForKeys(components, ["experience", "work_experience"]);
    return sortByTierOrRelevance(data);
  }, [components]);

  const projects = useMemo(() => {
    const data = tieredItemsForKeys(components, ["projects"]);
    return sortByTierOrRelevance(data);
  }, [components]);

  const education = useMemo(() => {
    const data = tieredItemsForKeys(components, ["education"]);
    return sortByTierOrRelevance(data);
  }, [components]);

  const certifications = useMemo(() => {
    const data = tieredItemsForKeys(components, ["certifications"]);
    return sortByTierOrRelevance(data);
  }, [components]);

  if (loading) {
    return <DetailedResumeShimmer />;
  }

  return (
    <View style={styles.card}>
      <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
        Detailed Resume
      </Typography>

      {/* ================= WORK EXPERIENCE ================= */}
      <SectionHeader title="WORK EXPERIENCE" count={workExperience.length} />

      {workExperience.length ? (
        workExperience.map((item, index) => {
          const tierLabel = pickTierLabel(item);
          const key = item?.id ?? item?.title ?? item?.name ?? `work-${index}`;
          return (
            <View key={key} style={styles.block}>
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
                        borderColor: getRelevanceStyles(tierLabel).borderColor,
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
                  {item.responsibilities.map((line: string, i: number) => (
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
      <SectionHeader title="PROJECTS" count={projects.length} />

      {projects.length ? (
        projects.map((item, index) => {
          const tierLabel = pickTierLabel(item);
          const key = item?.id ?? item?.name ?? item?.title ?? `project-${index}`;
          return (
            <View key={key} style={styles.block}>
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
                        borderColor: getRelevanceStyles(tierLabel).borderColor,
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
      <SectionHeader title="EDUCATION" count={education.length} />

      {education.length ? (
        education.map((item, index) => {
          const tierLabel = pickTierLabel(item);
          const school = item?.school ?? item?.institution ?? "_";
          const key = item?.id ?? item?.degree ?? school ?? `edu-${index}`;
          return (
            <View key={key} style={styles.block}>
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
                        borderColor: getRelevanceStyles(tierLabel).borderColor,
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
      <SectionHeader title="CERTIFICATIONS" count={certifications.length} />

      {certifications.length ? (
        certifications.map((item, index) => {
          const tierLabel = pickTierLabel(item);
          const issuerLine = [
            item?.issuer,
            item?.year != null ? String(item.year) : null,
          ]
            .filter(Boolean)
            .join(" · ");
          const key = item?.id ?? item?.name ?? `cert-${index}`;
          return (
            <View key={key} style={styles.block}>
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
                        borderColor: getRelevanceStyles(tierLabel).borderColor,
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
