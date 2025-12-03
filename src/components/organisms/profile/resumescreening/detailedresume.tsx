import React from "react";
import { View, StyleSheet } from "react-native";
import Typography from "../../../atoms/typography";
import { colors } from "../../../../theme/colors";
import FooterButtons from "../../../molecules/footerbuttons";

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
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificateItem[];
}

const DetailedResume = ({ work, projects, education, certifications }: Props) => {
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
      </View>

      {work.map((item, index) => (
        <View key={index} style={styles.block}>
          <View style={styles.row}>
            <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>{item.title}</Typography>
            {item.relevant && (
              <View style={styles.relevantPill}>
                <Typography variant="mediumTxtxs" color={colors.success[700]}>
                  Highly relevant
                </Typography>
              </View>
            )}
          </View>
          <Typography variant="mediumTxtsm" color={colors.gray[700]}>
            {item.company}
          </Typography>
          <Typography variant="regularTxtsm" color={colors.gray[600]}>
            {item.start}, {item.end}
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
      </View>

      {projects.map((item, index) => (
        <View key={index} style={styles.block}>
          <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
            {index + 1}. {item.title}
          </Typography>

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
      </View>

      {education.map((item, index) => (
        <View key={index} style={styles.block}>
          <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>{item.title}</Typography>

          <Typography variant="mediumTxtsm" color={colors.gray[700]}>
            {item.university}
          </Typography>

          <Typography variant="regularTxtsm"
            color={colors.gray[600]}>
            {item.start}, {item.end}
          </Typography>

          <Typography variant="regularTxtsm"
          color={colors.gray[600]}>
            Percentage: {item.percentage}
          </Typography>
        </View>
      ))}

      {/* CERTIFICATIONS */}
      <View style={styles.sectionHeader}>
        <Typography variant="mediumTxtsm" color={colors.gray[600]}>
          CERTIFICATIONS
        </Typography>
      </View>

      {certifications.map((item, index) => (
        <View key={index} style={styles.block}>
          <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>{item.title}</Typography>

          <Typography variant="mediumTxtsm" color={colors.gray[700]}>
            {item.issuer}
          </Typography>

          <Typography variant="regularTxtsm"
            color={colors.gray[600]}>
            {item.year}
          </Typography>
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
  },

  title: {
    marginBottom: 14,
  },

  sectionHeader: {
    backgroundColor: colors.gray[100],
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },

  block: {
    // marginBottom: 16,
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
    backgroundColor: colors.success[50],
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.success[200],
  },
});
