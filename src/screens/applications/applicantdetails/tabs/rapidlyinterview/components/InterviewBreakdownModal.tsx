import React, { useState, useMemo } from 'react';
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
import { getCefrColor } from '../cefrUtils';

interface SkillItem {
  name: string;
  level: string;
  description: string;
}

interface InterviewBreakdownModalProps {
  visible: boolean;
  onClose: () => void;
  reportData: RapidlyInterviewReportResponse | null;
  candidateName?: string;
  jobTitle?: string;
}

const DEFAULT_SKILLS: SkillItem[] = [
  {
    name: 'Fluency & coherence',
    level: 'B2',
    description:
      'Speech flows naturally with connected clauses and minimal disruptive hesitation; fillers are low (1.3 per 100 words) and pauses do not impede understanding. Ideas are delivered at a natural pace with logical progression across sentences.',
  },
  {
    name: 'Grammatical range & accuracy',
    level: 'B2',
    description:
      "Demonstrates control of complex structures like conditional sentences (si pudiera...sería) and subordinate clauses, though there is a minor lapse in verb form ('tener llamadas' instead of 'tengo llamadas'), showing occasional inconsistency at higher complexity.",
  },
  {
    name: 'Vocabulary / lexical resource',
    level: 'B2',
    description:
      'Uses precise, topic-appropriate professional vocabulary and abstract/evaluative language fluently without obvious lexical gaps.',
  },
  {
    name: 'Coherence & organization',
    level: 'B2',
    description:
      'Answers are well-structured with clear logical progression, using contrastive and connective markers effectively.',
  },
];

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
  const score = Math.round(reportData?.score ?? assessment?.overall?.score ?? 85);
  const cefrLevel = reportData?.cefr_level ?? assessment?.overall?.band ?? 'B2';
  const heroBadge = getCefrColor(cefrLevel);

  const levelLabel = useMemo(() => {
    return heroBadge.name || 'Advanced';
  }, [heroBadge]);

  const skillsList: SkillItem[] = useMemo(() => {
    if (assessment?.dimensions && assessment.dimensions.length > 0) {
      return assessment.dimensions.map((dim) => ({
        name: dim.label,
        level: dim.band || cefrLevel,
        description: dim.rationale || '',
      }));
    }
    const skillsData = reportData?.report?.skills;
    if (skillsData) {
      return Object.entries(skillsData).map(([key, item]) => ({
        name: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        level: item.level || cefrLevel,
        description: item.feedback || item.description || '',
      }));
    }
    return DEFAULT_SKILLS;
  }, [assessment, reportData, cefrLevel]);

  const summaryText =
    assessment?.summary ||
    (reportData?.report?.transcript
      ? `The candidate demonstrates strong performance with well-organized spoken responses, precise professional vocabulary, and coherent argumentation across topics.`
      : `The candidate communicates clearly and coherently in Spanish about professional topics, using a good range of vocabulary and grammatical structures including conditionals and subordinate clauses. Minor grammatical slips appear but do not hinder communication, and overall fluency and organization are consistent with a solid B2 level.`);

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
                <View style={[styles.cefrBadgeLarge, { borderColor: heroBadge.border }]}>
                  <Typography variant="boldTxtxl" color={heroBadge.color}>
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
                    {levelLabel} · overall CEFR level
                  </Typography>
                </View>
              </View>

              {/* Progress Segment Bar - 20 Segments */}
              <View style={styles.segmentedBar}>
                {Array.from({ length: 20 }).map((_, i) => {
                  const filledSegments = Math.round((score / 100) * 20);
                  const isFilled = i < filledSegments;
                  return (
                    <View
                      key={i}
                      style={[
                        styles.segment,
                        { backgroundColor: isFilled ? (heroBadge.barColor || '#10B981') : colors.gray[200] },
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
                {skillsList.map((skill: SkillItem, index: number) => {
                  const skillBadge = getCefrColor(skill.level);
                  return (
                    <View key={index} style={styles.skillCard}>
                      <View style={styles.skillCardHeader}>
                        <View style={[styles.skillLevelPill, { backgroundColor: skillBadge.bg }]}>
                          <Typography variant="semiBoldTxtxs" color={skillBadge.color}>
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
