import React, { Fragment } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ResumeScore from './resumescore';
import SkillScore from './skillscore';
import AiSummary from './aisummary';
import DetailedResume from './detailedresume';
import { Typography } from '../../../atoms';
import { colors } from '../../../../theme/colors';

export default function ResumeScreening() {
  return (
    <Fragment>
      <View style={styles.container}>
        <View style={styles.shortListedCard}>
          <View style={{flexDirection:'row', alignItems:'center', gap:8}}>
          <Text style={{height:8, width:8, borderRadius:30, backgroundColor:colors.success[500]}}></Text>
          <Typography variant='mediumTxtmd' color={colors.gray[900]}>Shortlisted</Typography>
          </View>
        </View>
        <ResumeScore
          overall="70"
          status="Good"
          details={[
            { title: "Skill", value: "10%", completed: true },
            { title: "Experience", value: "23%", completed: false },
            { title: "Projects", value: "43%", completed: false },
            { title: "Projects", value: "56%", completed: false },
          ]}
        />

        <SkillScore
          title="Skill"
          overall="70"
          status="Below avg."
          data={[
            { title: "Python", value: "10%", matched: true },
            { title: "Critical thinker", value: "23%", matched: false },
            { title: "Team player", value: "43%", matched: false },
            { title: "Communication", value: "56%", matched: false },
          ]}
        />

        <AiSummary
          summary="The candidate has a degree in Computer Science; however, there is no direct experience or expertise in Python, Django, or RESTful APIs, which are crit "
          matchScore="20"
          readinessScore="40"
          matchedSkills={["Problem solving", "SQL", "Python", "Data analysis", "Java"]}
          quickFacts={{
            lastRole: "Blog writer",
            lastCompany: "SLU Computer Science Department",
            education: "Bachelor of Science in Computer Science",
            experience: "-",
            certifications: "Non listed",
          }}
          risks={[
            "Lack of relevant programming experience",
            "No internships or professional work in software development",
          ]}
        />
        <DetailedResume
          work={[
            {
              title: "UI/UX Designer",
              company: "NeoSOFT technologies",
              start: "Nov 2022",
              end: "Present",
              description:
                "Worked on a project “Twitter sentiment analysis” and developed a Bert cnn Bilstm supervised learning pipeline...",
              relevant: true,
            },
            {
              title: "Graphic Designer",
              company: "NeoSOFT technologies",
              start: "Nov 2022",
              end: "Apr 2024",
              description:
                "Worked on a project “Twitter sentiment analysis” and developed a Bert cnn Bilstm supervised learning pipeline...",
            },
          ]}
          projects={[
            {
              title: "HR Salary Prediction Dashboard",
              description:
                "Worked on a project “Twitter sentiment analysis” and developed a Bert cnn Bilstm pipeline...",
            },
            {
              title: "Twitter Sentiment Analysis",
              description:
                "Worked on a project “Twitter sentiment analysis” and developed a Bert cnn Bilstm pipeline...",
            },
          ]}
          education={[
            {
              title: "BSc Computer Science",
              university: "Vishwakarma University",
              start: "Nov 2022",
              end: "Apr 2024",
              percentage: "75%",
            },
            {
              title: "MSc Statistics (Big Data Analytics)",
              university: "Vishwakarma University",
              start: "Nov 2022",
              end: "Apr 2024",
              percentage: "75%",
            },
          ]}
          certifications={[
            {
              title: "Machine Learning – TCS ION",
              issuer: "Vishwakarma University",
              year: "2023",
            },
            {
              title: "The Ultimate MySQL Bootcamp – Udemy",
              issuer: "Vishwakarma University",
              year: "2023",
            },
          ]}
        />
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 16 },
  shortListedCard:{
    backgroundColor: colors.common.white,
    borderRadius:8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    paddingVertical:10,
    paddingHorizontal:14,
    gap:8,
  }

});
