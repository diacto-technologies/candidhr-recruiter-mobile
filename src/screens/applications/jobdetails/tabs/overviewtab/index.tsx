import React, { Fragment } from "react";
import { View } from "react-native";
import { colors } from "../../../../../theme/colors";
import Icon from "../../../../../components/atoms/vectoricon";
import { linkIcon } from "../../../../../assets/svg/link";
import { SvgXml } from "react-native-svg";
import { employeeIcon } from "../../../../../assets/svg/employee";
import { ScrollView } from "react-native-gesture-handler";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { selectJobsLoading, selectSelectedJob } from "../../../../../features/jobs/selectors";
import { extractSections } from "../../../../../utils/extractSections";
import Shimmer from "../../../../../components/atoms/shimmer";
import Typography from "../../../../../components/atoms/typography";
import { useStyles } from "./styles";


const OverviewTabShimmer = () => {
  const styles = useStyles();
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Job Description */}
        <Shimmer width="50%" height={18} />
        <Shimmer height={14} />
        <Shimmer height={14} width="90%" />
        <Shimmer height={14} width="80%" />

        {/* Responsibilities */}
        <View style={styles.section}>
          <Shimmer width="40%" height={18} />
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.bulletRow}>
              <Shimmer width={10} height={10} borderRadius={5} />
              <Shimmer height={14} width="85%" />
            </View>
          ))}
        </View>

        {/* Skills & Qualifications */}
        <View style={styles.section}>
          <Shimmer width="45%" height={18} />
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.bulletRow}>
              <Shimmer width={10} height={10} borderRadius={5} />
              <Shimmer height={14} width="80%" />
            </View>
          ))}
        </View>

        {/* Skills required (tags) */}
        <View style={styles.section}>
          <Shimmer width="35%" height={18} />
          <View style={styles.tagWrap}>
            {[1, 2, 3, 4].map((i) => (
              <Shimmer key={i} width={60} height={24} borderRadius={6} />
            ))}
          </View>
        </View>

        {/* About Company */}
        <View style={styles.section}>
          <Shimmer width="40%" height={18} />
          <Shimmer height={14} width="90%" />

          <View>
            <Shimmer width={16} height={16} borderRadius={8} />
            <Shimmer width={100} height={14} />
          </View>

          <View>
            <Shimmer width={16} height={16} borderRadius={8} />
            <Shimmer width={120} height={14} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const OverviewTab = () => {
  const styles = useStyles();
  const jobs = useAppSelector(selectSelectedJob);
  const loading = useAppSelector(selectJobsLoading);
  const extracted = extractSections(jobs?.jd_html ?? "");

  if (loading) {
    return <OverviewTabShimmer />;
  }

  return (
    <Fragment>
      <ScrollView bounces={false}>
        <View style={styles.container}>
          {/* ── Job description (overview before first h2) ── */}
          {extracted.overview ? (
            <View style={{ gap: 8 }}>
              <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                Job description
              </Typography>
              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                {extracted.overview}
              </Typography>
            </View>
          ) : null}

          {/* ── Dynamic sections from jd_html (h2 headings) ── */}
          {extracted.sections.map((section, idx) => (
            <View key={idx} style={{ gap: 8 }}>
              <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                {section.title}
              </Typography>

              {/* Paragraphs */}
              {section.paragraphs.map((p, pi) => (
                <Typography
                  key={`p-${pi}`}
                  variant="regularTxtsm"
                  color={colors.gray[600]}
                >
                  {p}
                </Typography>
              ))}

              {/* Bullet list items */}
              {section.items.map((item, ii) => (
                <View key={`i-${ii}`} style={styles.bulletRow}>
                  <Icon
                    name="dot-single"
                    size={18}
                    iconFamily="Entypo"
                    color={colors.grayScale.darkGray}
                  />
                  <Typography
                    variant="regularTxtsm"
                    color={colors.gray[600]}
                    style={styles.bulletText}
                  >
                    {item}
                  </Typography>
                </View>
              ))}
            </View>
          ))}

          {/* ── Skills required (from must_have_skills) ── */}
          {jobs?.must_have_skills && jobs.must_have_skills.length > 0 && (
            <View style={{ gap: 10 }}>
              <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                Skills required
              </Typography>
              <View style={styles.tagWrap}>
                {jobs.must_have_skills.map((item, index) => (
                  <View style={styles.tag} key={index}>
                    <Typography variant="regularTxtsm" color={colors.gray[700]}>
                      {item.label}
                    </Typography>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ── About Company ── */}
          {/* <View style={{ gap: 8 }}>
            <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
              About company
            </Typography>
            <Typography style={styles.list}>
              Reddit young minds One AI conversation at a time. Fueled by
              cutting-edge AI, Miko connects with kids, responds to their
              emotions and fosters empathy in every interaction.
            </Typography>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <SvgXml xml={linkIcon} />
              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                Swift.com
              </Typography>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <SvgXml xml={employeeIcon} />
              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                51-200 employees
              </Typography>
            </View>
          </View> */}
        </View>
      </ScrollView>
    </Fragment>
  );
};

export default OverviewTab;
