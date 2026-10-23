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
  AssignmentInviteOption,
} from '../../../../../../features/applications/types';
import { useStyles } from '../styles';

interface Props {
  visible: boolean;
  onClose: () => void;
  report: AssignmentReviewReportResponse | null;
  selectedOption: AssignmentInviteOption | null;
}

const formatDetailDate = (dateVal?: string | null): string => {
  if (!dateVal) return '—';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return '—';

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${day} ${month} · ${hours}:${minutes} ${ampm}`;
};

const formatType = (type?: string | null): string => {
  if (!type) return 'Take-home project';
  const normalized = type.replace(/_/g, ' ').replace(/-/g, '-').trim();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

export const AssignmentDetailsModal: React.FC<Props> = React.memo(({
  visible,
  onClose,
  report,
  selectedOption,
}) => {
  const styles = useStyles();

  const assignmentName =
    report?.assignment?.title || selectedOption?.assignment_title || '—';

  const assignmentType = formatType(
    report?.assignment?.assignment_type || (selectedOption as { assignment_type?: string } | null)?.assignment_type
  );

  const sentDate =
    selectedOption?.sent_at ||
    report?.activity?.find((a) => {
      const m = a.milestone?.toLowerCase() || '';
      return m.includes('sent') || m.includes('assign');
    })?.timestamp ||
    null;

  const deadlineDate =
    selectedOption?.deadline_at ||
    (report?.assignment as { deadline_at?: string; due_date?: string } | undefined)?.deadline_at ||
    (report?.assignment as { deadline_at?: string; due_date?: string } | undefined)?.due_date ||
    null;

  const timeSpentFormatted = useMemo(() => {
    const seconds = report?.submission?.time_spent_seconds;
    if (typeof seconds === 'number' && seconds > 0) {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.round((seconds % 3600) / 60);
      if (hours > 0) {
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
      }
      return `${Math.max(1, mins)}m`;
    }

    const startedAt = report?.submission?.started_at || selectedOption?.started_at;
    const submittedAt = report?.submission?.submitted_at || selectedOption?.completed_at;
    if (startedAt && submittedAt) {
      const start = new Date(startedAt).getTime();
      const end = new Date(submittedAt).getTime();
      if (!isNaN(start) && !isNaN(end) && end > start) {
        const diffSec = Math.round((end - start) / 1000);
        const hours = Math.floor(diffSec / 3600);
        const mins = Math.round((diffSec % 3600) / 60);
        if (hours > 0) {
          return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
        }
        return `${Math.max(1, mins)}m`;
      }
    }

    return '—';
  }, [report?.submission, selectedOption]);

  const rubricFormatted = useMemo(() => {
    const criteria = report?.rubric_criteria || [];
    if (!criteria.length) return '—';
    const count = criteria.length;
    const maxScore = criteria[0]?.max_score || 5;
    return `${count} criteria · scored 1–${maxScore}`;
  }, [report?.rubric_criteria]);

  const detailRows = useMemo(
    () => [
      {
        label: 'Assignment',
        value: assignmentName,
      },
      {
        label: 'Type',
        value: assignmentType,
      },
      {
        label: 'Sent',
        value: formatDetailDate(sentDate),
      },
      {
        label: 'Deadline',
        value: formatDetailDate(deadlineDate),
      },
      {
        label: 'Time spent',
        value: timeSpentFormatted,
      },
      {
        label: 'Rubric',
        value: rubricFormatted,
      },
    ],
    [
      assignmentName,
      assignmentType,
      sentDate,
      deadlineDate,
      timeSpentFormatted,
      rubricFormatted,
    ]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.detailsModalBackdrop} onPress={onClose}>
        <Pressable style={styles.detailsModalCard} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.detailsModalHeader}>
            <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
              Assignment details
            </Typography>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.detailsModalCloseButton}
              accessibilityLabel="Close assignment details"
            >
              <Ionicons name="close" size={20} color={colors.gray[500]} />
            </TouchableOpacity>
          </View>

          {/* Details list */}
          <ScrollView
            style={styles.detailsModalContentList}
            showsVerticalScrollIndicator={false}
          >
            {detailRows.map((row, index) => {
              const isLast = index === detailRows.length - 1;
              return (
                <View
                  key={row.label}
                  style={[styles.detailsModalRow, isLast && styles.detailsModalLastRow]}
                >
                  <Typography
                    variant="regularTxtsm"
                    color={colors.gray[600]}
                    style={styles.detailsModalLabel}
                  >
                    {row.label}
                  </Typography>
                  <Typography
                    variant="regularTxtsm"
                    color={colors.gray[900]}
                    style={styles.detailsModalValue}
                  >
                    {row.value}
                  </Typography>
                </View>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
});


