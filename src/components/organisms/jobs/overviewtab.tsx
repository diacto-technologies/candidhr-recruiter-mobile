import React, { Fragment, useState } from "react";
import { View, StyleSheet } from "react-native";
import Typography from "../../atoms/typography";
import { colors } from "../../../theme/colors";
import Icon from "../../atoms/vectoricon";
import { linkIcon } from "../../../assets/svg/link";
import { SvgXml } from "react-native-svg";
import { employeeIcon } from "../../../assets/svg/employee";
import { ScrollView } from "react-native-gesture-handler";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { selectJobsLoading, selectSelectedJob } from "../../../features/jobs/selectors";
import { useWindowDimensions } from 'react-native';
import { extractSections } from "../../../utils/extractSections";
import Shimmer from "../../atoms/shimmer";


const OverviewTabShimmer = () => {
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

          <View style={styles.iconRow}>
            <Shimmer width={16} height={16} borderRadius={8} />
            <Shimmer width={100} height={14} />
          </View>

          <View style={styles.iconRow}>
            <Shimmer width={16} height={16} borderRadius={8} />
            <Shimmer width={120} height={14} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
const OverviewTab = () => {
  const jobs = useAppSelector(selectSelectedJob);
  const loading=useAppSelector(selectJobsLoading)
  const extracted = extractSections(jobs?.jd_html ?? "");
  const { width } = useWindowDimensions();

  if(loading){
    return <OverviewTabShimmer/>
  }
  return (
    <Fragment>
      <ScrollView>
        <View style={styles.container}>
          <View style={{ gap: 8 }}>
            <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>Job description</Typography>
            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              {extracted.overview.replace(/<[^>]+>/g, "")}
            </Typography>
          </View>
          <>
            {extracted.responsibilities.length > 0 && (
              <View style={{ gap: 8 }}>
                <Typography variant="semiBoldTxtmd">Responsibilities</Typography>

                {extracted.responsibilities.map((item, index) => (
                  <View key={index} style={styles.bulletRow}>
                    <Icon name="dot-single" size={18} iconFamily="Entypo" color={colors.grayScale.darkGray} />
                    <Typography variant="regularTxtsm" color={colors.gray[600]} style={styles.bulletText}>
                      {item}
                    </Typography>
                  </View>
                ))}
              </View>
            )}

          </>
          <View>
            <>
              {extracted.skills.length > 0 && (
                <View style={{ gap: 8 }}>
                  <Typography variant="semiBoldTxtmd">Skills & Qualifications</Typography>

                  {extracted.skills.map((item, index) => (
                    <View key={index} style={styles.bulletRow}>
                      <Icon name="dot-single" size={18} iconFamily="Entypo" color={colors.grayScale.darkGray} />
                      <Typography variant="regularTxtsm" color={colors.gray[600]} style={styles.bulletText}>
                        {item}
                      </Typography>
                    </View>
                  ))}
                </View>
              )}
            </>
          </View>
          <>
            {extracted.about.length > 0 && (
              <View style={{ gap: 8 }}>
                <Typography variant="semiBoldTxtmd">Company benefits</Typography>
                {extracted.about.map((item, index) => (
                  <Typography
                    key={index}
                    variant="regularTxtsm"
                    color={colors.gray[600]}
                  >
                    {item}
                  </Typography>
                ))}
              </View>
  )}
          </>

          <View style={{ gap: 10 }}>
            <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>Skills required</Typography>
            <View style={styles.tagWrap}>
              {jobs?.must_have_skills.map((item, index) => (
                <View style={styles.tag}  key={index}>
                <Typography variant="regularTxtsm" color={colors.gray[700]}>{item.value}</Typography>
                </View>
              ))}
            </View>
          </View>
          <View style={{ gap: 8 }}>
            <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>About Company</Typography>
            <Typography style={styles.list}>Reddit young minds One AI conversation at a time. Fueled by cutting-edge AI, Miko connects with kids, responds to their emotions and fosters empathy in every interaction.</Typography>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <SvgXml xml={linkIcon} />
              <Typography variant="regularTxtsm" color={colors.gray[600]}>Swift.com</Typography>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <SvgXml xml={employeeIcon} />
              <Typography variant="regularTxtsm" color={colors.gray[600]}>51-200 employees</Typography>
            </View>
          </View>
        </View>
      </ScrollView>
    </Fragment>
  );
};

export default OverviewTab;

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16, backgroundColor: colors.common.slightlygray },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginTop: 20 },
  text: { marginTop: 8, color: "#374151", lineHeight: 20 },
  list: { color: "#4B5563" },
  tagWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    backgroundColor: colors.common.white,
    borderWidth: 1,
    borderColor: '#D5D7DA',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 5,
    //minWidth: 56,
    //minHeight: 24,
    shadowColor: "#0A0D12",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
    marginBottom: 4,
  },
  bulletText: {
    flex: 1,
  },
  section: {
    gap: 8,
    marginTop: 16,
  },

});
