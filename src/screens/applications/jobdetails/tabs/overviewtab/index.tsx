import React from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { colors } from "../../../../../theme/colors";
import Icon from "../../../../../components/atoms/vectoricon";
import Shimmer from "../../../../../components/atoms/shimmer";
import Typography from "../../../../../components/atoms/typography";
import { useStyles } from "./styles";
import { useOverviewTabController } from "./hooks/useOverviewTabController";

const OverviewTabShimmer = () => {
  const styles = useStyles();
  return (
    <ScrollView bounces={false}>
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

// Extracted Presentational Component for Reusability
const JobSection = ({ section, styles }: { section: any, styles: any }) => (
  <View style={styles.section}>
    <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
      {section.title}
    </Typography>

    {/* Paragraphs */}
    {section.paragraphs.map((p: string, pi: number) => (
      <Typography
        key={`p-${pi}`}
        variant="regularTxtsm"
        color={colors.gray[600]}
      >
        {p}
      </Typography>
    ))}

    {/* Bullet list items */}
    {section.items.map((item: string, ii: number) => (
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
);

const OverviewTab = () => {
  const styles = useStyles();
  const ctrl = useOverviewTabController();

  if (ctrl.loading) {
    return <OverviewTabShimmer />;
  }

  return (
    <ScrollView bounces={false}>
      <View style={styles.container}>
        
        {/* ── Job description (overview before first h2) ── */}
        {ctrl.extracted.overview ? (
          <View style={styles.section}>
            <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
              Job description
            </Typography>
            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              {ctrl.extracted.overview}
            </Typography>
          </View>
        ) : null}

        {/* ── Dynamic sections from jd_html (h2 headings) ── */}
        {ctrl.extracted.sections.map((section: any, idx: number) => (
          <JobSection key={`section-${idx}`} section={section} styles={styles} />
        ))}

        {/* ── Skills required (from must_have_skills) ── */}
        {ctrl.selectedJob?.must_have_skills && ctrl.selectedJob.must_have_skills.length > 0 && (
          <View style={styles.section}>
            <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
              Skills required
            </Typography>
            <View style={styles.tagWrap}>
              {ctrl.selectedJob.must_have_skills.map((item: any, index: number) => (
                <View style={styles.tag} key={`skill-${index}`}>
                  <Typography variant="regularTxtsm" color={colors.gray[700]}>
                    {item.label}
                  </Typography>
                </View>
              ))}
            </View>
          </View>
        )}

      </View>
    </ScrollView>
  );
};

export default OverviewTab;
