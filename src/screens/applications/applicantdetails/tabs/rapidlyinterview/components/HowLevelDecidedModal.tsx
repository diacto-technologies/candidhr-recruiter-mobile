import React from 'react';
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

interface HowLevelDecidedModalProps {
  visible: boolean;
  onClose: () => void;
  onBack: () => void;
}

const SKILL_CRITERIA = [
  {
    title: 'Fluency & coherence',
    desc: 'Flow and pace, and how cleanly ideas connect.',
  },
  {
    title: 'Grammatical range & accuracy',
    desc: 'Range and accuracy of grammatical structures.',
  },
  {
    title: 'Vocabulary / lexical resource',
    desc: 'Range and precision of word choice.',
  },
  {
    title: 'Coherence & organization',
    desc: 'How the answer is organised and held together.',
  },
];

const CEFR_LEVELS = [
  { level: 'A1', name: 'Beginner', color: colors.error[600], bg: colors.error[50] },
  { level: 'A2', name: 'Elementary', color: colors.error[600], bg: colors.error[50] },
  { level: 'B1', name: 'Intermediate', color: colors.warning[600], bg: colors.warning[50] },
  { level: 'B2', name: 'Upper-intermediate', color: colors.blue[600], bg: colors.blue[50] },
  { level: 'C1', name: 'Advanced', color: colors.success[600], bg: colors.success[50] },
  { level: 'C2', name: 'Proficient', color: colors.success[700], bg: colors.success[50] },
];

export const HowLevelDecidedModal: React.FC<HowLevelDecidedModalProps> = ({
  visible,
  onClose,
  onBack,
}) => {
  const styles = useStyles();

  return (
    <Modal
      visible={visible}
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
                How the level is decided
              </Typography>
              <Typography variant="regularTxtsm" color={colors.gray[600]} style={styles.marginTop2}>
                CEFR scale · A1 → C2
              </Typography>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Typography variant="semiBoldTxtmd" color={colors.gray[500]}>
                ✕
              </Typography>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
            {/* Intro Paragraph */}
            <Typography variant="regularTxtsm" color={colors.gray[700]} style={styles.introParagraph}>
              Every answer is transcribed, then an AI examiner rates the spoken responses against the international CEFR scale on the skills below. Each skill must cite evidence from the transcript; together they set the overall level and the 0–100 score shown. Accent and pronunciation are never judged.
            </Typography>

            {/* What each skill looks at */}
            <Typography variant="semiBoldTxtxs" color={colors.gray[500]} style={styles.sectionHeader}>
              WHAT EACH SKILL LOOKS AT
            </Typography>

            <View style={styles.criteriaList}>
              {SKILL_CRITERIA.map((crit, idx) => (
                <View key={idx} style={styles.criteriaRow}>
                  <View style={styles.criteriaIconWrap}>
                    <Typography variant="mediumTxtsm" color={colors.brand[600]}>
                      ✦
                    </Typography>
                  </View>
                  <View style={styles.criteriaContent}>
                    <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
                      {crit.title}
                    </Typography>
                    <Typography variant="regularTxtsm" color={colors.gray[600]}>
                      {crit.desc}
                    </Typography>
                  </View>
                </View>
              ))}
            </View>

            {/* CEFR Levels */}
            <Typography variant="semiBoldTxtxs" color={colors.gray[500]} style={styles.sectionHeader}>
              CEFR LEVELS
            </Typography>

            <View style={styles.levelsList}>
              {CEFR_LEVELS.map((lvl) => (
                <View key={lvl.level} style={styles.levelRow}>
                  <View style={[styles.levelBadge, { backgroundColor: lvl.bg }]}>
                    <Typography variant="semiBoldTxtsm" color={lvl.color}>
                      {lvl.level}
                    </Typography>
                  </View>
                  <Typography variant="semiBoldTxtsm" color={colors.gray[800]} style={styles.levelName}>
                    {lvl.name}
                  </Typography>
                </View>
              ))}
            </View>

            {/* Disclaimer */}
            <Typography variant="regularTxtxs" color={colors.gray[500]} style={styles.disclaimerText}>
              Levels are advisory. They rate spoken proficiency against the role's requirements, not against other candidates, and a recruiter decision always overrides them.
            </Typography>
          </ScrollView>

          {/* Footer Back Button */}
          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={onBack} style={styles.backButtonWrap}>
              <Typography variant="semiBoldTxtsm" color={colors.brand[600]}>
                ‹ Back to breakdown
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
