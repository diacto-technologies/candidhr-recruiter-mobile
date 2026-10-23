import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Card from '../../../../../../components/atoms/card';
import Typography from '../../../../../../components/atoms/typography';
import { colors } from '../../../../../../theme/colors';
import { AssignmentInviteOption } from '../../../../../../features/applications/types';
import { useStyles } from '../styles';

interface Props {
  selectedOption: AssignmentInviteOption | null;
  candidateName?: string;
  onRefresh: () => void;
  refreshing?: boolean;
}

export const AssignmentEmptyStateCard: React.FC<Props> = React.memo(({
  selectedOption,
  candidateName,
  onRefresh,
  refreshing = false,
}) => {
  const styles = useStyles();

  const isDeadlinePassed = useMemo(() => {
    const status = (selectedOption?.status || '').toLowerCase();
    if (
      status.includes('deadline') ||
      status.includes('expired') ||
      status.includes('overdue') ||
      status.includes('passed')
    ) {
      return true;
    }
    if (selectedOption?.deadline_at) {
      const deadline = new Date(selectedOption.deadline_at);
      if (!isNaN(deadline.getTime())) {
        return deadline.getTime() < Date.now();
      }
    }
    return true;
  }, [selectedOption]);

  const candidateLabel = candidateName || 'This candidate';

  return (
    <Card style={styles.card}>
      <View style={styles.emptyCardBody}>
        {/* Warning Icon Badge */}
        <View style={styles.emptyWarningIconBox}>
          <Ionicons
            name={isDeadlinePassed ? 'warning-outline' : 'time-outline'}
            size={24}
            color={colors.warning?.[700] ?? '#B54708'}
          />
        </View>

        {/* Title and Subtitle */}
        <View style={styles.emptyCardTextContainer}>
          <Typography variant="semiBoldTxtlg" color={colors.gray[900]} style={styles.emptyCardTitle}>
            {isDeadlinePassed ? 'Deadline passed' : 'Result Not Available Yet'}
          </Typography>

          {isDeadlinePassed ? (
            <Typography variant="regularTxtsm" color={colors.gray[500]} style={styles.emptyCardDescription}>
              <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                {candidateLabel}
              </Typography>{' '}
              did not submit before the deadline.{'\n'}
              Reopening the window from the Assignments tab lets them submit, and the work shows up here if it arrives.
            </Typography>
          ) : (
            <Typography variant="regularTxtsm" color={colors.gray[500]} style={styles.emptyCardDescription}>
              Assessment result not yet generated. Please ensure assessment is completed.
            </Typography>
          )}
        </View>

        {/* Bullet points when waiting for completion */}
        {!isDeadlinePassed && (
          <View style={styles.emptyBulletsContainer}>
            <View style={styles.emptyBulletRow}>
              <View style={styles.emptyBulletDot} />
              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                Waiting for completion
              </Typography>
            </View>

            <View style={styles.emptyBulletRow}>
              <View style={styles.emptyBulletDot} />
              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                Results auto-generate on completion
              </Typography>
            </View>
          </View>
        )}
      </View>
    </Card>
  );
});

export default AssignmentEmptyStateCard;
