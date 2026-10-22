import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Typography from '../../../../../../components/atoms/typography';
import { colors } from '../../../../../../theme/colors';
import {
  AssignmentReviewReportResponse,
  AssignmentCriterionScore,
} from '../../../../../../features/applications/types';
import { useStyles } from '../styles';

interface Props {
  report: AssignmentReviewReportResponse;
  onOpenHowCalculated?: () => void;
}

interface DetailItem {
  title: string;
  percentage: string;
  completed: boolean;
  value: string;
}

const getInitials = (name?: string): string => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const ReviewerEvaluationCard: React.FC<Props> = React.memo(({
  report,
  onOpenHowCalculated,
}) => {
  const styles = useStyles();

  const reviewers = report.reviewers || [];
  const firstReviewer = reviewers[0] || null;

  // Final score: prioritize report.final_score, fallback to firstReviewer?.overall_score
  const rawScore = report.final_score ?? firstReviewer?.overall_score ?? null;
  const overall = rawScore !== null ? `${Number(rawScore).toFixed(1)} / 5` : '-';

  const totalReviewers = reviewers.length;
  const submittedCount = reviewers.filter(
    (r) =>
      Boolean(r.submitted_at) ||
      r.status === 'submitted' ||
      (r.overall_score !== null && r.overall_score !== undefined)
  ).length;
  const pendingCount = totalReviewers - submittedCount;

  // When score is not yet generated or there are pending reviews, show Pending state
  const isPending = rawScore === null || rawScore === undefined || pendingCount > 0;

  // Details formatted like ResumeScore
  const details: DetailItem[] = useMemo(() => {
    if (firstReviewer?.criterion_scores && firstReviewer.criterion_scores.length > 0) {
      return firstReviewer.criterion_scores.map((cs: AssignmentCriterionScore) => {
        const rubricDef = report.rubric_criteria?.find(
          (rc) => rc.id === cs.criterion_id || rc.name === cs.name
        );
        const weight = cs.weight || rubricDef?.weight || 0;
        const maxScore = rubricDef?.max_score || 5;
        return {
          title: cs.name,
          percentage: `${weight}%`,
          completed: cs.score > 0,
          value: `${cs.score}/${maxScore}`,
        };
      });
    }

    if (report.rubric_criteria && report.rubric_criteria.length > 0) {
      return report.rubric_criteria.map((rc) => ({
        title: rc.name,
        percentage: `${rc.weight}%`,
        completed: false,
        value: `0/${rc.max_score || 5}`,
      }));
    }

    return [];
  }, [firstReviewer, report.rubric_criteria]);

  if (isPending) {
    return (
      <View style={styles.evalCard}>
        {/* Header */}
        <View style={styles.evalPendingHeader}>
          <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
            Reviewer evaluation
          </Typography>
          <Typography style={styles.evalPendingSubtitle}>
            The score generates once every reviewer has submitted.
          </Typography>
        </View>

        {/* Big Pending Block */}
        <View style={styles.pendingScoreBlock}>
          <Typography style={styles.pendingBigNumber}>
            {pendingCount > 0 ? pendingCount : totalReviewers > 0 ? totalReviewers : 1}
          </Typography>
          <View style={styles.pendingTextCol}>
            <Typography style={styles.pendingTitle}>
              pending review{pendingCount === 1 ? '' : 's'}
            </Typography>
            <Typography style={styles.pendingSubmittedCount}>
              {submittedCount} of {totalReviewers > 0 ? totalReviewers : 1} submitted
            </Typography>
          </View>
        </View>

        {/* Divider */}
        {reviewers.length > 0 && <View style={styles.evalDivider} />}

        {/* Reviewer List */}
        {reviewers.map((rev, index) => {
          const isSubmitted = Boolean(
            rev.submitted_at ||
            rev.status === 'submitted' ||
            (rev.overall_score !== null && rev.overall_score !== undefined)
          );
          const initials = getInitials(rev.reviewer_name);

          return (
            <View key={rev.reviewer_name || index} style={styles.reviewerRow}>
              <View style={styles.reviewerLeft}>
                <View style={styles.reviewerAvatar}>
                  <Typography style={styles.reviewerAvatarText}>{initials}</Typography>
                </View>
                <Typography style={styles.reviewerName}>
                  {rev.reviewer_name || 'Reviewer'}
                </Typography>
              </View>

              {isSubmitted ? (
                <View style={styles.submittedBadge}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={14}
                    color={colors.success[700]}
                  />
                  <Typography style={styles.submittedBadgeText}>Submitted</Typography>
                </View>
              ) : (
                <View style={styles.awaitingBadge}>
                  <Ionicons name="time-outline" size={14} color="#B54708" />
                  <Typography style={styles.awaitingText}>Awaiting</Typography>
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.evalCard}>
      {/* Header */}
      <View style={styles.evalHeaderRow}>
        <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
          Reviewer evaluation
        </Typography>
         <Typography variant="regularTxtsm" color={colors.gray[900]}>
        1 reviewer · each criterion scored 1–5
      </Typography>
      </View>
      {/* Gradient Score Bar */}
      <View style={styles.gradientWrapper}>
        <LinearGradient
          colors={[
            'rgba(138, 218, 255, 0.74)',
            'rgba(138, 218, 255, 0.0)',
          ]}
          start={{ x: 0, y: 0.5 }} // 90deg → left → right
          end={{ x: 1, y: 0.5 }}
          style={styles.gradientBox}
        >
          <View style={styles.gradientTextcontainer}>
            <Typography variant="mediumTxtsm" style={styles.gradientLabel} color={colors.gray[900]}>
              Overall score
            </Typography>
            <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
              {overall}
            </Typography>
          </View>
        </LinearGradient>
      </View>

      {/* Detailed Score */}
      <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
        Detailed score
      </Typography>

      {details.map((item) => (
        <View key={item.title} style={styles.detailRow}>
          <View style={styles.rowLeft}>
            <Typography
              variant="mediumTxtsm"
              color={item.completed ? colors.gray[700] : colors.gray[600]}
            >
              {item.title} ({item.percentage})
            </Typography>
          </View>

          <Typography variant="semiBoldTxtmd" color={colors.gray[700]}>
            {item.value}
          </Typography>
        </View>
      ))}

      {/* How is this calculated link */}
      {Boolean(onOpenHowCalculated) && (
        <TouchableOpacity
          onPress={onOpenHowCalculated}
          style={styles.calcLinkContainer}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Typography style={styles.calcLinkText}>
            How is this calculated?
          </Typography>
        </TouchableOpacity>
      )}
    </View>
  );
});
