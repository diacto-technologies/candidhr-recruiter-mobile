import React, { useMemo } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import Typography from '../typography';
import { colors } from '../../../theme/colors';
import { useStyles } from './styles';
import { getStatusColor, getStatusLabel } from '../../../constants/applicantStatus';
import { ApplicationStage } from '../../../features/applications/types';

export interface ApplicantTabStatusProps {
  label?: string;
  status?: string;
  stage?: ApplicationStage | null;
  style?: StyleProp<ViewStyle>;
}

export const getStageDisplayStatus = (
  stage?: ApplicationStage | null,
  fallbackStatus?: string
): { label: string; color: string } => {
  const statusCandidate =
    fallbackStatus?.trim().toLowerCase() ||
    stage?.latest_session?.progress_status?.trim().toLowerCase();

  if (statusCandidate === 'assigned') {
    return { label: 'Assigned', color: colors.warning[500] };
  }

  if (statusCandidate) {
    if (statusCandidate === 'stage_completed' || statusCandidate === 'stage completed' || statusCandidate === 'completed') {
      return { label: 'Completed', color: colors.success[500] };
    }
    const formatted = statusCandidate
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return { label: formatted, color: getStatusColor(statusCandidate) };
  }

  if (!stage) {
    return { label: 'Completed', color: colors.success[500] };
  }

  // 1. If latest_session object is not there, show "Completed"
  if (!stage.latest_session) {
    return { label: 'Completed', color: colors.success[500] };
  }

  // 2. Fallback to stage.status
  if (stage.status) {
    if (stage.status === 'stage_completed' || stage.status === 'stage completed' || stage.status === 'completed') {
      return { label: 'Completed', color: colors.success[500] };
    }
    const formatted = stage.status
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return { label: formatted, color: getStatusColor(stage.status) };
  }

  return { label: 'Completed', color: colors.success[500] };
};

const ApplicantTabStatus: React.FC<ApplicantTabStatusProps> = ({
  label = 'Stages',
  status,
  stage,
  style,
}) => {
  const styles = useStyles();

  const { label: displayLabel, color: dotColor } = useMemo(() => {
    return getStageDisplayStatus(stage, status);
  }, [stage, status]);

  return (
    <View style={[styles.shortListedCard, style]}>
      <View style={styles.row}>
        <Typography variant="semiBoldTxtmd" color={colors.gray[900]} style={styles.label}>
          {label}
        </Typography>

        <View
          style={[
            styles.dot,
            { backgroundColor: dotColor },
          ]}
        />

        <Typography variant="mediumTxtmd" color={colors.gray[900]}>
          {displayLabel}
        </Typography>
      </View>
    </View>
  );
};

export default ApplicantTabStatus;

// const styles = StyleSheet.create({
//   shortListedCard: {
//     backgroundColor: colors.common.white,
//     borderRadius: 8,
//     borderWidth: 0.5,
//     borderColor: colors.gray[300],
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     gap: 8,
//     ...shadowStyles.shadow_xs,
//   },

//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },

//   dot: {
//     height: 8,
//     width: 8,
//     borderRadius: 30,
//   },
// });