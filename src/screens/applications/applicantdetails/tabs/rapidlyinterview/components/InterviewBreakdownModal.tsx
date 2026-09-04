import React, { useState } from 'react';
import {
  View,
  Modal,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Typography } from '../../../../../../components';
import { colors } from '../../../../../../theme/colors';
import { useStyles } from '../styles';
import { HowLevelDecidedModal } from './HowLevelDecidedModal';
import { RapidlyInterviewReportResponse } from '../../../../../../features/rapidhire/types';

interface InterviewBreakdownModalProps {
  visible: boolean;
  onClose: () => void;
  reportData: RapidlyInterviewReportResponse | null;
  candidateName?: string;
  jobTitle?: string;
}

const DEFAULT_SKILLS = [
  {
    name: 'Fluency & coherence',
    level: 'C1',
    description:
      'The candidate produces long, connected stretches of speech with minimal hesitation markers, maintaining a natural pace and coherent flow across all answers without breakdowns.',
  },
  {
    name: 'Grammatical range & accuracy',
    level: 'C1',
    description:
      'Demonstrates control of complex structures including conditional sentences, subjunctive, relative clauses, and varied verb tenses with only minor slips.',
  },
  {
    name: 'Vocabulary / lexical resource',
    level: 'C1',
    description:
      'Uses precise, topic-appropriate professional vocabulary and abstract/evaluative language fluently without obvious lexical gaps.',
  },
  {
    name: 'Coherence & organization',
    level: 'C1',
    description:
      'Answers are well-structured with clear logical progression, using contrastive and connective markers effectively.',
  },
];

const CEFR_LEVEL_DETAILS: Record<string, { name: string; color: string; bg: string }> = {
  A1: { name: 'Beginner', color: colors.error[600], bg: colors.error[50] },
  A2: { name: 'Elementary', color: colors.error[600], bg: colors.error[50] },
  B1: { name: 'Intermediate', color: colors.warning[600], bg: colors.warning[50] },
  B2: { name: 'Upper-intermediate', color: colors.blue[600], bg: colors.blue[50] },
  C1: { name: 'Advanced', color: colors.success[600], bg: colors.success[50] },
  C2: { name: 'Proficient', color: colors.success[700], bg: colors.success[50] },
};

const getLevelFromScore = (score: number): string => {
  if (score >= 90) return 'C2';
  if (score >= 75) return 'C1';
  if (score >= 60) return 'B2';
  if (score >= 40) return 'B1';
  if (score >= 20) return 'A2';
  return 'A1';
};

export const InterviewBreakdownModal: React.FC<InterviewBreakdownModalProps> = ({
  visible,
  onClose,
  reportData,
  candidateName,
  jobTitle,
}) => {
  const styles = useStyles();
  const [howDecidedVisible, setHowDecidedVisible] = useState(false);

  const assessment = reportData?.report?.assessment;
  const score = Math.round(assessment?.overall?.score ?? reportData?.score ?? 68);

  // Detect level from reportData assessment band, cefr_level, or candidate/persona text
  const detectedLevelFromText = React.useMemo(() => {
    const textToSearch = `${candidateName || ''} ${jobTitle || ''} ${reportData?.simulation_persona || ''}`;
    const match = textToSearch.match(/\b([A-C][1-2])\b/i);
    return match ? match[1].toUpperCase() : null;
  }, [candidateName, jobTitle, reportData?.simulation_persona]);

  const rawCefr =
    assessment?.overall?.band ||
    reportData?.cefr_level ||
    reportData?.report?.cefr_level ||
    detectedLevelFromText ||
    getLevelFromScore(score);

  const cefrLevel = (rawCefr || 'B2').toUpperCase();
  const levelMeta = CEFR_LEVEL_DETAILS[cefrLevel] || CEFR_LEVEL_DETAILS['B2'];
  const levelName = levelMeta.name;

  const assessmentDimensions = assessment?.dimensions;
  const skillsData = reportData?.report?.skills;

  const skillsList = assessmentDimensions && assessmentDimensions.length > 0
    ? assessmentDimensions.map((dim) => ({
        name: dim.label || dim.key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        level: (dim.band || cefrLevel).toUpperCase(),
        description: dim.rationale || '',
      }))
    : skillsData
    ? Object.entries(skillsData).map(([key, item]) => ({
        name: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        level: (item.level || cefrLevel).toUpperCase(),
        description: item.feedback || item.description || '',
      }))
    : DEFAULT_SKILLS.map((s) => ({
        ...s,
        level: cefrLevel,
      }));

  const summaryText =
    assessment?.summary ||
    reportData?.report?.transcript ||
    'The candidate communicates clearly and coherently about professional topics.';

  return (
    <>
      <Modal
        visible={visible && !howDecidedVisible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={onClose} />
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.modalHeaderRow}>
              <View style={styles.flex1}>
                <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
                  Interview breakdown
                </Typography>
                <Typography variant="regularTxtsm" color={colors.gray[600]} style={styles.marginTop2}>
                  {[jobTitle, 'CEFR', candidateName].filter(Boolean).join(' · ')}
                </Typography>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Typography variant="semiBoldTxtmd" color={colors.gray[500]}>
                  ✕
                </Typography>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              {/* Score & CEFR Hero Card */}
              <View style={styles.scoreHeroRow}>
                <View style={[styles.cefrBadgeLarge, { borderColor: levelMeta.color, backgroundColor: levelMeta.bg }]}>
                  <Typography variant="boldTxtxl" color={levelMeta.color}>
                    {cefrLevel}
                  </Typography>
                </View>

                <View style={styles.scoreHeroInfo}>
                  <View style={styles.rowAlignBaseline}>
                    <Typography variant="boldTxtxl" color={colors.gray[900]}>
                      {score}
                    </Typography>
                    <Typography variant="mediumTxtsm" color={colors.gray[500]}>
                      /100
                    </Typography>
                  </View>
                  <Typography variant="regularTxtsm" color={colors.gray[600]}>
                    {`${levelName} · overall CEFR level`}
                  </Typography>
                </View>
              </View>

              {/* Progress Segment Bar */}
              <View style={styles.segmentedBar}>
                {Array.from({ length: 24 }).map((_, i) => {
                  const filledSegments = Math.round((score / 100) * 24);
                  const isFilled = i < filledSegments;
                  return (
                    <View
                      key={i}
                      style={[
                        styles.segment,
                        { backgroundColor: isFilled ? levelMeta.color : colors.gray[200] },
                      ]}
                    />
                  );
                })}
              </View>

              {/* Summary Text */}
              <Typography variant="regularTxtsm" color={colors.gray[700]} style={styles.summaryParagraph}>
                {summaryText}
              </Typography>

              {/* Skills Section */}
              <Typography variant="semiBoldTxtxs" color={colors.gray[500]} style={styles.sectionHeader}>
                SKILLS
              </Typography>

              <View style={styles.skillCardsList}>
                {skillsList.map((skill, index) => {
                  const skillMeta = CEFR_LEVEL_DETAILS[skill.level] || levelMeta;
                  return (
                    <View key={index} style={styles.skillCard}>
                      <View style={styles.skillCardHeader}>
                        <View style={[styles.skillLevelPill, { backgroundColor: skillMeta.bg }]}>
                          <Typography variant="semiBoldTxtxs" color={skillMeta.color}>
                            {skill.level}
                          </Typography>
                        </View>
                        <Typography variant="semiBoldTxtsm" color={colors.gray[900]} style={styles.flex1}>
                          {skill.name}
                        </Typography>
                      </View>
                      <Typography variant="regularTxtxs" color={colors.gray[600]} style={styles.skillDesc}>
                        {skill.description}
                      </Typography>
                    </View>
                  );
                })}
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.breakdownFooterRow}>
              <TouchableOpacity
                onPress={() => setHowDecidedVisible(true)}
                style={styles.howCalculatedButton}
              >
                <Typography variant="semiBoldTxtxs" color={colors.brand[600]}>
                  ⓘ How is this calculated?
                </Typography>
              </TouchableOpacity>

              <Typography variant="mediumTxtxs" color={colors.gray[400]}>
                GRADED AUTOMATICALLY
              </Typography>
            </View>
          </View>
        </View>
      </Modal>

      {/* Nested How Level Decided Modal */}
      <HowLevelDecidedModal
        visible={howDecidedVisible}
        onClose={() => {
          setHowDecidedVisible(false);
          onClose();
        }}
        onBack={() => setHowDecidedVisible(false)}
      />
    </>
  );
};
