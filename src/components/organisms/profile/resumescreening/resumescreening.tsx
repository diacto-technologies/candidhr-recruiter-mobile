import React, { Fragment } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ResumeScore from './resumescore';
import SkillScore from './skillscore';
import AiSummary from './aisummary';
import DetailedResume from './detailedresume';
import { Typography } from '../../../atoms';
import { colors } from '../../../../theme/colors';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { selectApplicationsDetailLoading, selectSelectedApplication } from '../../../../features/applications/selectors';
import { formatPercentage, getScoreStatus, getSkillStatus } from '../../../../screens/applications/applicant/helper';
interface ResumeSkill {
  name: string;
  relevance_score: number | string;
  matched?: string;
}
interface ResumeMatchedSkill {
  name: string;
}
interface SkillScoreItem {
  title: string;
  value: string;
  matched: boolean;
}

export default function ResumeScreening() {
  const application = useAppSelector(selectSelectedApplication);
  const loading = useAppSelector(selectApplicationsDetailLoading);
  const matchedSkills =
    application?.resume?.skills_matched?.map((item: any) =>
      typeof item === "string" ? item : item?.name
    ) ?? [];

  const skills: SkillScoreItem[] =
    application?.resume?.resume_json?.skills?.map((skill: any) => {
      const skillName = skill?.name ?? "_";

      const isMatched = matchedSkills.some(
        (matched: string) =>
          matched.includes(skillName)
      );

      return {
        title: skillName,
        value: `${Number(skill?.relevance_score ?? 0) * 10}%`,
        matched: isMatched,
      };
    }) ?? [];

  const calculateOverallSkillScore = (skills: ResumeSkill[] = []) => {
    if (!skills.length) return 0;

    const total = skills.reduce(
      (sum, skill) => sum + Number(skill?.relevance_score ?? 0),
      0
    );

    return Math.round((total / skills.length) * 10);
  };

  // const calculateSkillScore = (skills: any[] = []) => {
  //   if (!skills.length) return 0;

  //   const total = skills.reduce(
  //     (sum, skill) => sum + Number(skill?.relevance_score ?? 0),
  //     0
  //   );

  //   // relevance_score is 0–10 → convert to %
  //   return Math.round((total / skills.length) * 10);
  // };
  return (
    <Fragment>
      <View style={styles.container}>
        <View style={styles.shortListedCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ height: 8, width: 8, borderRadius: 30, backgroundColor: colors.success[500] }}></Text>
            <Typography variant='mediumTxtmd' color={colors.gray[900]}>{application?.resume?.status_text}</Typography>
          </View>
        </View>
        
        <ResumeScore
          overall={formatPercentage(application?.resume?.resume_score?.overall_score ?? "0")}
          isloading={loading}
          status={getScoreStatus(application?.resume?.resume_score?.overall_score ?? "0")}
          details={[
            { title: "Skill", percentage: (Number(application?.job?.score_weight?.skills) * 100) + "%" ?? "0", value: application?.resume?.resume_score?.skills_score ?? "_", completed: true },
            { title: "Experience", percentage: (Number(application?.job?.score_weight?.work_experience) * 100) + "%", value: application?.resume?.resume_score?.work_exp_score ?? "_", completed: false },
            { title: "Projects", percentage: (Number(application?.job?.score_weight?.projects) * 100) + "%", value: application?.resume?.resume_score?.projects_score ?? "_", completed: false },
            { title: "Education", percentage: (Number(application?.job?.score_weight?.education) * 100) + "%", value: application?.resume?.resume_score?.education_score ?? "_", completed: false },
            { title: "Certification", percentage: (Number(application?.job?.score_weight?.certifications) * 100) + "%", value: application?.resume?.resume_score?.certifications_score ?? "_", completed: false },
          ]}
        />

        <SkillScore
          title="Skills"
          isloading={loading}
          overall={String(calculateOverallSkillScore(
            application?.resume?.resume_json?.skills ?? []
          ))}
          status={String(getSkillStatus(calculateOverallSkillScore(
            application?.resume?.resume_json?.skills ?? []
          )))}
          data={skills}
        />

        <AiSummary
          isloading={loading}
          summary={application?.resume?.ai_summary_json?.summary ?? "_"}
          matchScore={application?.resume?.ai_summary_json?.match_score ?? 0}
          readinessScore={application?.resume?.ai_summary_json?.job_readiness_score ?? 0}
          matchedSkills={application?.resume?.resume_json?.skills ?? []}
          quickFacts={{
            lastRole: application?.resume?.ai_summary_json?.last_position_held ?? "_",
            lastCompany: application?.resume?.ai_summary_json?.last_company ?? "_",
            education: application?.resume?.ai_summary_json?.highest_education ?? "_",
            experience: application?.resume?.ai_summary_json?.relevant_experience ?? [],
            certifications: application?.resume?.ai_summary_json?.notable_certifications ?? [],
          }}
          risks={application?.resume?.ai_summary_json?.potential_red_flags ?? []}
        />
        <DetailedResume />
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 16 },
  shortListedCard: {
    backgroundColor: colors.common.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 8,
    shadowColor: '#0A0D12',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  }

});
