import React, { useMemo } from 'react';
import {
  Modal,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Typography from '../../../../../../components/atoms/typography';
import { colors } from '../../../../../../theme/colors';
import {
  AssignmentReviewReportResponse,
} from '../../../../../../features/applications/types';
import { useStyles } from '../styles';

interface Props {
  visible: boolean;
  onClose: () => void;
  report: AssignmentReviewReportResponse | null;
}

const formatWeightedTotal = (score: number): string => {
  if (Number.isInteger(score)) return String(score);
  const fixed2 = score.toFixed(2);
  if (fixed2.endsWith('0')) {
    return score.toFixed(1);
  }
  return fixed2;
};

export const HowCalculatedModal: React.FC<Props> = React.memo(({
  visible,
  onClose,
  report,
}) => {
  const styles = useStyles();

  const criteriaData = useMemo(() => {
    const submittedReviewers = (report?.reviewers || []).filter(
      (r) => r.criterion_scores && r.criterion_scores.length > 0
    );

    if (submittedReviewers.length === 0) {
      return (report?.rubric_criteria || []).map((rc) => ({
        id: rc.id,
        name: rc.name,
        weight: rc.weight,
        score: 0,
        points: '0.00',
      }));
    }

    if (submittedReviewers.length === 1) {
      return submittedReviewers[0].criterion_scores.map((cs) => {
        const points = ((cs.score * cs.weight) / 100).toFixed(2);
        return {
          id: cs.criterion_id,
          name: cs.name,
          weight: cs.weight,
          score: cs.score,
          points,
        };
      });
    }

    const criterionMap = new Map<
      string,
      { id: string; name: string; weight: number; totalScore: number; count: number }
    >();

    submittedReviewers.forEach((rev) => {
      rev.criterion_scores.forEach((cs) => {
        const existing = criterionMap.get(cs.criterion_id || cs.name);
        if (existing) {
          existing.totalScore += cs.score;
          existing.count += 1;
        } else {
          criterionMap.set(cs.criterion_id || cs.name, {
            id: cs.criterion_id,
            name: cs.name,
            weight: cs.weight,
            totalScore: cs.score,
            count: 1,
          });
        }
      });
    });

    return Array.from(criterionMap.values()).map((c) => {
      const avgScore = c.count > 0 ? c.totalScore / c.count : 0;
      const points = ((avgScore * c.weight) / 100).toFixed(2);
      const roundedScore = Number.isInteger(avgScore)
        ? avgScore
        : parseFloat(avgScore.toFixed(1));
      return {
        id: c.id,
        name: c.name,
        weight: c.weight,
        score: roundedScore,
        points,
      };
    });
  }, [report]);

  const finalScoreDisplay = useMemo(() => {
    if (report?.final_score != null) {
      return formatWeightedTotal(Number(report.final_score));
    }
    const firstReviewer = report?.reviewers?.[0];
    if (firstReviewer?.overall_score != null) {
      return formatWeightedTotal(Number(firstReviewer.overall_score));
    }
    const sumPoints = criteriaData.reduce(
      (acc, c) => acc + parseFloat(c.points || '0'),
      0
    );
    return sumPoints > 0 ? formatWeightedTotal(sumPoints) : '0';
  }, [report, criteriaData]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.calcModalBackdrop} onPress={onClose}>
        <Pressable style={styles.calcModalCard} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.calcModalHeader}>
            <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
              How the score is calculated
            </Typography>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.calcModalCloseButton}
              accessibilityLabel="Close how score is calculated"
            >
              <Ionicons name="close" size={20} color={colors.gray[500]} />
            </TouchableOpacity>
          </View>

          {/* Explanation Text */}
          <Typography
            variant="regularTxtsm"
            color={colors.gray[600]}
            style={styles.calcModalExplanationText}
          >
            Every reviewer scores each criterion from 1 to 5. The criterion average is multiplied by its weight, and the results are added up.
          </Typography>

          {/* Criteria List */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.calcModalList}>
              {criteriaData.map((c) => (
                <View key={c.id || c.name} style={styles.calcModalRow}>
                  <Typography
                    variant="regularTxtsm"
                    color={colors.gray[900]}
                    style={styles.calcModalCriterionName}
                    numberOfLines={2}
                  >
                    {c.name}
                  </Typography>

                  <View style={styles.calcModalRightGroup}>
                    <Typography
                      variant="regularTxtsm"
                      color={colors.gray[500]}
                      style={styles.calcModalFormula}
                    >
                      {c.score} × {c.weight}%
                    </Typography>
                    <Typography
                      variant="semiBoldTxtsm"
                      color={colors.gray[900]}
                      style={styles.calcModalPoints}
                    >
                      {c.points}
                    </Typography>
                  </View>
                </View>
              ))}
            </View>

            {/* Divider */}
            <View style={styles.calcModalDivider} />

            {/* Total Row */}
            <View style={styles.calcModalTotalRow}>
              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                Weighted total
              </Typography>
              <Typography variant="boldTxtsm" color={colors.gray[900]}>
                {finalScoreDisplay} / 5
              </Typography>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
});


