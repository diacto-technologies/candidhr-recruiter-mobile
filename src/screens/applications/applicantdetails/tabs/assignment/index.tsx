import React, { useEffect, useState, useCallback } from 'react';
import { View, RefreshControl, ScrollView, ActivityIndicator } from 'react-native';
import { SvgXml } from 'react-native-svg';
import Typography from '../../../../../components/atoms/typography';
import Card from '../../../../../components/atoms/card';
import Shimmer from '../../../../../components/atoms/shimmer';
import { colors } from '../../../../../theme/colors';
import { fileIcon } from '../../../../../assets/svg/file';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import {
  getAssignmentInviteOptionsRequestAction,
  getAssignmentReviewReportRequestAction,
  setSelectedAssignmentInviteIdAction,
} from '../../../../../features/applications/actions';
import {
  selectAssignmentInviteOptions,
  selectLoadingAssignmentInviteOptions,
  selectAssignmentInviteOptionsError,
  selectAssignmentReviewReport,
  selectLoadingAssignmentReviewReport,
  selectAssignmentReviewReportError,
  selectSelectedAssignmentInviteId,
} from '../../../../../features/applications/selectors';
import { AssignmentReportCard } from './components/AssignmentReportCard';
import { ReviewerEvaluationCard } from './components/ReviewerEvaluationCard';
import { TheBriefCard } from './components/TheBriefCard';
import { SubmissionCard } from './components/SubmissionCard';
import { AssignmentTimelineCard } from './components/AssignmentTimelineCard';
import { AssignmentDetailsModal } from './components/AssignmentDetailsModal';
import { HowCalculatedModal } from './components/HowCalculatedModal';
import { AssignmentEmptyStateCard } from './components/AssignmentEmptyStateCard';
import { useStyles } from './styles';

interface Props {
  applicationId: string;
}

const AssignmentShimmer: React.FC = () => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      {/* Top dropdown card shimmer */}
      <View style={styles.card}>
        <View style={styles.shimmerRowBetween}>
          <Shimmer width="40%" height={20} borderRadius={6} />
          <Shimmer width={32} height={32} borderRadius={16} />
        </View>
        <Shimmer width="100%" height={44} borderRadius={10} />
      </View>

      {/* Reviewer evaluation card shimmer */}
      <View style={styles.card}>
        <Shimmer width="50%" height={20} borderRadius={6} style={styles.shimmerMarginBottom8} />
        <Shimmer width="40%" height={14} borderRadius={4} style={styles.shimmerMarginBottom16} />
        <Shimmer width="100%" height={64} borderRadius={12} style={styles.shimmerMarginBottom16} />
        <Shimmer width="30%" height={16} borderRadius={4} style={styles.shimmerMarginBottom12} />
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.shimmerRowPadding}>
            <Shimmer width="45%" height={16} borderRadius={4} />
            <Shimmer width="15%" height={16} borderRadius={4} />
          </View>
        ))}
      </View>

      {/* Brief shimmer */}
      <View style={styles.card}>
        <Shimmer width="30%" height={16} borderRadius={4} style={styles.shimmerMarginBottom10} />
        <Shimmer width="90%" height={14} borderRadius={4} style={styles.shimmerMarginBottom6} />
        <Shimmer width="70%" height={14} borderRadius={4} />
      </View>

      {/* Submission shimmer */}
      <View style={styles.card}>
        <Shimmer width="35%" height={18} borderRadius={4} style={styles.shimmerMarginBottom12} />
        <Shimmer width="100%" height={60} borderRadius={10} />
      </View>
    </View>
  );
};

export default function AssignmentTab({ applicationId }: Props) {
  const styles = useStyles();
  const dispatch = useAppDispatch();

  const options = useAppSelector(selectAssignmentInviteOptions);
  const loadingOptions = useAppSelector(selectLoadingAssignmentInviteOptions);
  const optionsError = useAppSelector(selectAssignmentInviteOptionsError);

  const report = useAppSelector(selectAssignmentReviewReport);
  const loadingReport = useAppSelector(selectLoadingAssignmentReviewReport);
  const reportError = useAppSelector(selectAssignmentReviewReportError);

  const selectedId = useAppSelector(selectSelectedAssignmentInviteId);

  const [refreshing, setRefreshing] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [howCalculatedVisible, setHowCalculatedVisible] = useState(false);
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(null);

  // Synchronize localSelectedId when Redux selectedId changes
  useEffect(() => {
    if (selectedId) {
      setLocalSelectedId(selectedId);
    }
  }, [selectedId]);

  const effectiveSelectedId = localSelectedId || selectedId || options[0]?.id || null;

  const selectedOption =
    options.find((item) => item.id === effectiveSelectedId) || options[0] || null;

  // Fetch assignment invite options on mount or when applicationId changes
  useEffect(() => {
    if (applicationId) {
      dispatch(getAssignmentInviteOptionsRequestAction(applicationId));
    }
  }, [applicationId, dispatch]);

  // When selected invite changes, fetch its report
  const handleSelectOption = useCallback(
    (inviteId: string) => {
      setLocalSelectedId(inviteId);
      dispatch(setSelectedAssignmentInviteIdAction(inviteId));
      dispatch(getAssignmentReviewReportRequestAction(inviteId));
    },
    [dispatch]
  );

  const handleRefresh = useCallback(() => {
    if (!applicationId) return;
    setRefreshing(true);
    dispatch(getAssignmentInviteOptionsRequestAction(applicationId));
    if (effectiveSelectedId) {
      dispatch(getAssignmentReviewReportRequestAction(effectiveSelectedId));
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }, [applicationId, effectiveSelectedId, dispatch]);

  // Initial loading state (no options and loading)
  if (loadingOptions && options.length === 0) {
    return <AssignmentShimmer />;
  }

  // Empty state when no assignment invites are found
  if (!loadingOptions && options.length === 0) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <View style={styles.emptyContainer}>
            <SvgXml xml={fileIcon} width={48} height={48} fill={colors.gray[400]} />
            <Typography style={styles.emptyTitle}>No assignments found</Typography>
            <Typography style={styles.emptySubtitle}>
              There are no assignments assigned or submitted for this application yet.
            </Typography>
          </View>
        </Card>
      </View>
    );
  }

  const submissions =
    report?.submission?.deliverable_submissions || [];
  const deliverables = report?.deliverables || [];
  const briefDescription =
    report?.assignment?.description || selectedOption?.assignment_title || '';

  return (
    <View style={styles.container}>
      {/* 1. Header Card with Dropdown and Actions (Screenshot 2 reference) */}
      <AssignmentReportCard
        options={options}
        selectedId={selectedOption?.id || null}
        onSelectOption={handleSelectOption}
        onRefresh={handleRefresh}
        onOpenDetails={() => setDetailsModalVisible(true)}
        refreshing={refreshing || loadingOptions}
      />

      {loadingReport ? (
        <View style={styles.centerLoadingContainer}>
          <ActivityIndicator size="large" color={colors.brand[600]} />
        </View>
      ) : report ? (
        <View style={styles.contentContainer}>
          <AssignmentTimelineCard activities={report.activity || []} />
          
          {/* 2. Reviewer Evaluation Card (Screenshot 1 & Screenshot 3 reference) */}
          <ReviewerEvaluationCard
            report={report}
            onOpenHowCalculated={() => setHowCalculatedVisible(true)}
          />

          {/* 3. The Brief Card (Screenshot 1 reference) */}
          {Boolean(briefDescription) && (
            <TheBriefCard description={briefDescription} />
          )}

          {/* 4. Submission Card (Screenshot 1 reference) */}
          <SubmissionCard
            submissions={submissions}
            deliverables={deliverables}
            candidateName={report.candidate?.name}
            candidateComments={report.submission?.candidate_comments}
          />
        </View>
      ) : (
        <AssignmentEmptyStateCard
          selectedOption={selectedOption}
          candidateName={report?.candidate?.name}
          onRefresh={handleRefresh}
          refreshing={refreshing || loadingReport}
        />
      )}

      {/* Assignment Details Modal */}
      <AssignmentDetailsModal
        visible={detailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        report={report}
        selectedOption={selectedOption}
      />

      {/* How Calculated Modal */}
      <HowCalculatedModal
        visible={howCalculatedVisible}
        onClose={() => setHowCalculatedVisible(false)}
        report={report}
      />
    </View>
  );
}
