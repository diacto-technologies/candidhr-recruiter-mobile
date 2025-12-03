import React, { Fragment, useState } from "react";
import { View, StyleSheet } from "react-native";
import Typography from "../../atoms/typography";
import { colors } from "../../../theme/colors";
import Icon from "../../atoms/vectoricon";
import { linkIcon } from "../../../assets/svg/link";
import { SvgXml } from "react-native-svg";
import { employeeIcon } from "../../../assets/svg/employee";
import { ScrollView } from "react-native-gesture-handler";

const OverviewTab = () => {
  return (
    <Fragment>
    <ScrollView>
    <View style={styles.container}>
      <View style={{gap:8}}>
        <Typography variant="H1" color={colors.mainColors.blueGrayTitle}>Job description</Typography>
        <Typography variant="P1" color={colors.grayScale.darkGray}>
          We are seeking a talented UX Designer to join our team in India. The ideal candidate will have 0-3 years of experience in user experience design, with a passion for creating user-friendly interfaces and improving the overall user experience
        </Typography>
      </View>
      <View style={{ gap: 8 }}>
        <Typography variant="P1" color={colors.grayScale.darkGray}>Responsibilities</Typography>
        <View>
          <View style={styles.bulletRow}>
            <Icon size={18} name="dot-single" iconFamily="Entypo" color={colors.grayScale.darkGray} />
            <Typography variant="P1" color={colors.grayScale.darkGray} style={styles.bulletText}>
              Conduct user research and usability testing to gather insights and validate design concepts.
            </Typography>
          </View>

          <View style={styles.bulletRow}>
            <Icon size={18} name="dot-single" iconFamily="Entypo" color={colors.grayScale.darkGray} />
            <Typography variant="P1" color={colors.grayScale.darkGray} style={styles.bulletText}>
              Create wireframes, prototypes, and high-fidelity mockups for web and mobile applications.
            </Typography>
          </View>

          <View style={styles.bulletRow}>
            <Icon size={18} name="dot-single" iconFamily="Entypo" color={colors.grayScale.darkGray} />
            <Typography variant="P1" color={colors.grayScale.darkGray} style={styles.bulletText}>
              Collaborate with product managers, developers, and other stakeholders to deliver user-centered designs.
            </Typography>
          </View>

          <View style={styles.bulletRow}>
            <Icon size={18} name="dot-single" iconFamily="Entypo" color={colors.grayScale.darkGray} />
            <Typography variant="P1" color={colors.grayScale.darkGray} style={styles.bulletText}>
              Design user interfaces that are accessible, intuitive, and visually appealing.
            </Typography>
          </View>

          <View style={styles.bulletRow}>
            <Icon size={18} name="dot-single" iconFamily="Entypo" color={colors.grayScale.darkGray} />
            <Typography variant="P1" color={colors.grayScale.darkGray} style={styles.bulletText}>
              Stay updated with industry trends and best practices in UX design.
            </Typography>
          </View>
        </View>
      </View>
      <View>
        <View style={{ gap: 8 }}>
          <Typography variant="P1" color={colors.grayScale.darkGray}>Skills & Qualifications</Typography>
          <View>
            <View style={styles.bulletRow}>
              <Icon size={18} name="dot-single" iconFamily="Entypo" color={colors.grayScale.darkGray} />
              <Typography variant="P1" color={colors.grayScale.darkGray} style={styles.bulletText}>
                Proficiency in design tools such as Sketch, Adobe XD, Figma, or similar.
              </Typography>
            </View>

            <View style={styles.bulletRow}>
              <Icon size={18} name="dot-single" iconFamily="Entypo" color={colors.grayScale.darkGray} />
              <Typography variant="P1" color={colors.grayScale.darkGray} style={styles.bulletText}>
                Strong understanding of user-centered design principles and methodologies.
              </Typography>
            </View>

            <View style={styles.bulletRow}>
              <Icon size={18} name="dot-single" iconFamily="Entypo" color={colors.grayScale.darkGray} />
              <Typography variant="P1" color={colors.grayScale.darkGray} style={styles.bulletText}>
                Basic knowledge of HTML, CSS, and JavaScript is a plus.
              </Typography>
            </View>

            <View style={styles.bulletRow}>
              <Icon size={18} name="dot-single" iconFamily="Entypo" color={colors.grayScale.darkGray} />
              <Typography variant="P1" color={colors.grayScale.darkGray} style={styles.bulletText}>
                Experience with creating wireframes, prototypes, and user flows.
              </Typography>
            </View>

            <View style={styles.bulletRow}>
              <Icon size={18} name="dot-single" iconFamily="Entypo" color={colors.grayScale.darkGray} />
              <Typography variant="P1" color={colors.grayScale.darkGray} style={styles.bulletText}>
                Good communication skills and ability to work in a team environment.
              </Typography>
            </View>
          </View>
        </View>
      </View>
      <View style={{ gap: 8 }}>
        <Typography variant="H1" color={colors.mainColors.blueGrayTitle}>Company benefits</Typography>
        <Typography variant="P1" color={colors.grayScale.darkGray}>Bachelor's degree in Computer Science, Software Engineering, or related field</Typography>
      </View>
      <View style={{ gap: 10 }}>
        <Typography variant="H1" color={colors.mainColors.blueGrayTitle}>Skills required</Typography>
        <View style={styles.tagWrap}>
          {["Design", "UI/UX", "User research", "Problem solving"].map((item) => (
            <Typography key={item} style={styles.tag}>{item}</Typography>
          ))}
        </View>
      </View>
      <View style={{ gap: 8 }}>
        <Typography variant="H1" color={colors.mainColors.blueGrayTitle}>About Company</Typography>
        <Typography style={styles.list}>Reddit young minds One AI conversation at a time. Fueled by cutting-edge AI, Miko connects with kids, responds to their emotions and fosters empathy in every interaction.</Typography>
        <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
        <SvgXml xml={linkIcon} />
        <Typography variant="P1" color={colors.grayScale.darkGray}>Swift.com</Typography>
        </View>
        <View style={{flexDirection:'row',alignItems:'center', gap:8}}>
        <SvgXml xml={employeeIcon} />
        <Typography variant="P1" color={colors.grayScale.darkGray}>51-200 employees</Typography>
        </View>
      </View>
    </View>
    </ScrollView>
    </Fragment>
  );
};

export default OverviewTab;

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16, backgroundColor:colors.common.slightlygray},
  sectionTitle: { fontSize: 18, fontWeight: "700", marginTop: 20 },
  text: { marginTop: 8, color: "#374151", lineHeight: 20 },
  list: { color: "#4B5563" },
  tagWrap: { flexDirection: "row", flexWrap: "wrap",gap:8},
  tag: {
    backgroundColor: colors.common.white,
    borderWidth:1,
    borderColor:'#D5D7DA',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 9,
    minWidth: 56,
    minHeight: 24,
    shadowColor: "#0A0D12",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
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
