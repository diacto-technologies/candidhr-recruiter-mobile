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
import { CEFR_LEVELS_LIST } from '../cefrUtils';

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
            {/* Criteria List */}
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
              {CEFR_LEVELS_LIST.map((lvl) => (
                <View key={lvl.level} style={styles.levelRow}>
                  <View style={[styles.levelBadge, { backgroundColor: lvl.bg }]}>
                    <Typography variant="semiBoldTxtsm" color={lvl.color}>
                      {lvl.level}
                    </Typography>
                  </View>
                  <Typography variant="semiBoldTxtsm" color={colors.gray[900]} style={styles.levelName}>
                    {lvl.name}
                  </Typography>
                </View>
              ))}
            </View>
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
