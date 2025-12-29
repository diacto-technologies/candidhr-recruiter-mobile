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
import { selectSelectedJob } from "../../../features/jobs/selectors";
import { useWindowDimensions } from 'react-native';
import { extractSections } from "../../../utils/extractSections";

const OverviewTab = () => {
  const jobs = useAppSelector(selectSelectedJob);
  const extracted = extractSections(jobs?.jd_html ?? "");
  const { width } = useWindowDimensions();
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
                <Typography key={index} style={styles.tag}>{item.value}</Typography>
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

});
