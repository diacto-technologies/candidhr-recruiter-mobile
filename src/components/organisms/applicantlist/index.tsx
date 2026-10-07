import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  View,
  Image,
  Pressable,
  Animated,
  StyleSheet,
  ViewStyle,
  DimensionValue,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { navigate } from '../../../utils/navigationUtils';
import { useStyles } from './styles';
import { Typography } from '../../atoms';
import { colors } from '../../../theme/colors';
import Divider from '../../atoms/divider';
import { Application } from '../../../features/applications/types';
import { formatMonDDYYYY } from '../../../utils/dateformatter';
import { getStatusColor } from './helper';
import { capitalizeFirstLetter } from '../../../utils/stringUtils';
import { SvgXml } from 'react-native-svg';
import { horizontalThreedotIcon } from '../../../assets/svg/horizontalthreedoticon';
import { DropdownMenu } from '../../molecules/dropdownmenu';
import ChangeStatusModal from '../changeStatusModal';
import ShareApplicationModal from '../shareApplicationModal';
import { userIcon } from '../../../assets/svg/usericon';
import { exportIcon } from '../../../assets/svg/export';
import { editIcon } from '../../../assets/svg/edit';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { organizationalOrigin } from '../../../features/auth';
import {
  selectSelectedJob,
  selectPublishedJobs,
  selectUnpublishedJobs,
  selectJobs,
} from '../../../features/jobs/selectors';
import { rapidhireApi } from '../../../features/rapidhire/api';
import { selectRapidhireCandidates } from '../../../features/rapidhire/selectors';
import {
  getRapidhireCandidatesSuccessAction,
  sendInterviewLinkRequestAction,
} from '../../../features/rapidhire/actions';
import {
  updateApplicationStatusRequestAction,
  getApplicationShortLinkRequestAction,
} from '../../../features/applications/actions';
import { applicantUserIcon } from '../../../assets/svg/applicantUser';
import { shareIcon } from '../../../assets/svg/share';
import { copyIcon } from '../../../assets/svg/copy';
import { screenshotIcon } from '../../../assets/svg/screenshot';
import { emailIcon } from '../../../assets/svg/email';
import { exitIcon } from '../../../assets/svg/exitlink';
import { eyeVisibleIcon } from '../../../assets/svg/eyevisible';
import { captureAndShareView } from '../../../utils/captureAndShareView';
import { usePermission } from '../../../hooks/usePermission';
import { PERMISSIONS } from '../../../utils/permission.constants';
import { STATUS_OPTIONS } from './config';
import Clipboard from '@react-native-clipboard/clipboard';
import { showToastMessage } from '../../../utils/toast';
import SendEmailModal from '../SendEmailModal';

interface ApplicantCardProps {
  item?: Application | null;
  loading?: boolean;
  cardWidth?: number
}
const ShimmerBox: React.FC<{
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}> = ({ width = '100%', height = 12, borderRadius = 6, }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);


  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          overflow: 'hidden',
          backgroundColor: '#E6E6E6',
        },
      ]}
    >
      <Animated.View style={{ flex: 1, transform: [{ translateX }] }}>
        <LinearGradient
          colors={['#E6E6E6', '#F2F2F2', '#E6E6E6']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

const MENU_WIDTH = 200;

const ApplicantCard: React.FC<ApplicantCardProps> = ({ item = null, loading = false, cardWidth }) => {
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const { can } = usePermission();
  const origin = useAppSelector(organizationalOrigin);
  const selectedJob = useAppSelector(selectSelectedJob);
  const publishedJobs = useAppSelector(selectPublishedJobs);
  const unpublishedJobs = useAppSelector(selectUnpublishedJobs);
  const favouriteJobs = useAppSelector(selectJobs);
  const rapidhireCandidates = useAppSelector(selectRapidhireCandidates);
  const [menuVisible, setMenuVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  });
  const menuTriggerRef = useRef<View | null>(null);
  const cardCaptureRef = useRef<View | null>(null);
  const [changeStatusVisible, setChangeStatusVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [sendEmailVisible, setSendEmailVisible] = useState(false);

  const handleCopyProfileLink = () => {
    setMenuVisible(false);
    const appId = item?.application || item?.id;
    if (!appId) {
      showToastMessage('Profile link not available', 'error');
      return;
    }
    dispatch(getApplicationShortLinkRequestAction(String(appId)));
  };

  const handleCopyInterviewLink = async () => {
    setMenuVisible(false);
    const appId = item?.application || item?.id;
    const currentJobId = item?.job?.id || item?.job_id || selectedJob?.id || '';

    // 1. Direct candidate property
    let finalUrl =
      item?.interview_invite_url ||
      item?.interview_invite_url_candidate ||
      item?.interview_link ||
      item?.interview_url;

    // 2. Search in existing Redux rapidhire candidates
    if (!finalUrl && appId && Array.isArray(rapidhireCandidates)) {
      const candidateEmail = item?.candidate?.email || item?.candidate_email || item?.email;
      const matched = rapidhireCandidates.find(
        (c: any) =>
          c.application === appId ||
          c.id === appId ||
          (candidateEmail && c.candidate_email === candidateEmail)
      );
      if (matched?.interview_invite_url) {
        finalUrl = matched.interview_invite_url;
      }
    }

    // 3. If still not found, fetch lite-candidates for the job
    if (!finalUrl && currentJobId) {
      try {
        const candidateEmail = item?.candidate?.email || item?.candidate_email || item?.email;
        const res = await rapidhireApi.getCandidates({
          jobId: currentJobId,
        });
        if (res?.results?.length) {
          dispatch(
            getRapidhireCandidatesSuccessAction({
              data: res,
              page: 1,
              append: true,
            })
          );
          const matched = res.results.find(
            (c: any) =>
              c.application === appId ||
              c.id === appId ||
              (candidateEmail && c.candidate_email === candidateEmail) ||
              (candidateName && candidateName !== '?' && c.candidate_name?.toLowerCase() === candidateName.toLowerCase())
          );
          if (matched?.interview_invite_url) {
            finalUrl = matched.interview_invite_url;
          }
        }
      } catch (err) {
        console.log('Error fetching candidate interview link:', err);
      }
    }

    if (!finalUrl) {
      showToastMessage('Interview link not available', 'error');
      return;
    }
    Clipboard.setString(finalUrl);
    showToastMessage('Interview link copied to clipboard', 'success');
  };

  const handleOpenMenu = () => {
    if (menuTriggerRef.current && 'measureInWindow' in menuTriggerRef.current) {
      (menuTriggerRef.current as any).measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          setDropdownPosition({
            left: Math.max(8, x + width - MENU_WIDTH),
            top: y + height - 5,
          });
          setMenuVisible(true);
        }
      );
    } else {
      setMenuVisible(true);
    }
  };

  // If loading or no item provided -> show skeleton built from ShimmerBox
  if (loading || !item) {
    return (
      <View style={styles.card}>
        {/* Top row: avatar + two lines */}
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <ShimmerBox width={56} height={56} borderRadius={28} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <ShimmerBox width={'60%'} height={14} borderRadius={6} style={{ marginBottom: 8 }} />
              <ShimmerBox width={'40%'} height={12} borderRadius={6} />
            </View>
          </View>

          {/* <ShimmerBox width={24} height={24} borderRadius={12} /> */}
        </View>

        {/* Applied for lines */}
        <View style={{ marginTop: 12 }}>
          <ShimmerBox width={'45%'} height={12} borderRadius={6} style={{ marginBottom: 8 }} />
          <ShimmerBox width={'85%'} height={12} borderRadius={6} />
        </View>

        <Divider />

        {/* Footer: stage + status */}
        <View style={[styles.rowBetween, { marginTop: 12 }]}>
          <ShimmerBox width={'30%'} height={12} borderRadius={6} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ShimmerBox width={12} height={12} borderRadius={6} />
            <ShimmerBox width={60} height={12} borderRadius={6} />
          </View>
        </View>
      </View>
    );
  }
  const handlePress = (application_id: string, job_id?: string) => {
    navigate('ApplicantDetails', {
      application_id,
      job_id: job_id || '',
    });
  };

  const candidateName = item?.name ?? item?.candidate_name ?? (item?.id ? '?' : '');
  const candidateEmail = item?.candidate?.email || item?.candidate_email || item?.email || '';
  const candidateInitial = (candidateName?.trim()?.[0] ?? '?').toUpperCase();
  const appliedDate = item?.applied_at ? formatMonDDYYYY(item.applied_at) : '_';
  const jobTitle = item?.job?.title ?? '_';
  const resumeScore = item?.resume_score?.score ?? (typeof item?.resume_score === 'number' ? item.resume_score : '_');

  const formatStatus = (str?: string) => {
    if (!str) return '_';
    return str
      .split(/[_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const stageOrInterviewStatus = item?.interview_status
    ? formatStatus(item.interview_status)
    : item?.latest_stage?.stage_name ?? '_';

  const statusLabel = item?.status_label
    ? item.status_label
    : item?.application_status
    ? formatStatus(item.application_status)
    : item?.status
    ? formatStatus(item.status)
    : '';

  const appId = item?.application || item?.id;
  const jobId = item?.job?.id || item?.job_id || '';

  const isRapidlyCandidate = useMemo(() => {
    if (!item) return false;

    // 1. Direct candidate properties (lite candidates or enriched application)
    if (
      Boolean(item.interview_status) ||
      Boolean(item.interview_invite_url) ||
      Boolean(item.interview_invite_url_candidate) ||
      Boolean(item.recording_url) ||
      Boolean(item.rapidhire_enabled) ||
      Boolean(item.is_rapidhire) ||
      Boolean(item.is_rapidly) ||
      Boolean(item.rapidhire) ||
      Boolean(item.rapidly_interview_mode)
    ) {
      return true;
    }

    // 2. Candidate's nested job properties
    const candidateJob = item.job as any;
    if (
      Boolean(candidateJob?.rapidhire_enabled) ||
      Boolean(candidateJob?.is_rapidhire) ||
      Boolean(candidateJob?.is_rapidly) ||
      Boolean(candidateJob?.rapidhire) ||
      Boolean(candidateJob?.rapidly_interview_mode)
    ) {
      return true;
    }

    // 3. Stage properties
    const latestStageType = (item.latest_stage?.stage_type || '').toLowerCase();
    const latestStageName = (item.latest_stage?.stage_name || '').toLowerCase();
    if (
      latestStageType === 'rapidhire' ||
      latestStageType === 'rapidly_interview' ||
      latestStageType === 'rapidhire_interview' ||
      latestStageName.includes('rapid')
    ) {
      return true;
    }

    if (Array.isArray(item.stages)) {
      const hasRapidStage = item.stages.some((s: any) => {
        const sType = (s?.stage_type || '').toLowerCase();
        const sName = (s?.stage_name || '').toLowerCase();
        return (
          sType === 'rapidhire' ||
          sType === 'rapidly_interview' ||
          sType === 'rapidhire_interview' ||
          sName.includes('rapid')
        );
      });
      if (hasRapidStage) return true;
    }

    // 4. Match job against Redux store
    const candidateJobId = candidateJob?.id || item.job_id;
    if (candidateJobId) {
      if (
        selectedJob?.id === candidateJobId &&
        (Boolean((selectedJob as any)?.rapidhire_enabled) || Boolean((selectedJob as any)?.rapidly_interview_mode))
      ) {
        return true;
      }
      const isJobRapidly = (j: any) =>
        j?.id === candidateJobId &&
        (Boolean(j?.rapidhire_enabled) || Boolean(j?.rapidly_interview_mode));

      if (publishedJobs?.some(isJobRapidly)) return true;
      if (unpublishedJobs?.some(isJobRapidly)) return true;
      if (Array.isArray(favouriteJobs) && favouriteJobs.some(isJobRapidly)) return true;
    }

    // 5. Match by job title if present
    const candidateJobTitle = (candidateJob?.title || '').trim().toLowerCase();
    if (candidateJobTitle && candidateJobTitle !== '_') {
      const isTitleRapidly = (j: any) =>
        (j?.title || '').trim().toLowerCase() === candidateJobTitle &&
        (Boolean(j?.rapidhire_enabled) || Boolean(j?.rapidly_interview_mode));

      if (selectedJob && isTitleRapidly(selectedJob)) return true;
      if (publishedJobs?.some(isTitleRapidly)) return true;
      if (unpublishedJobs?.some(isTitleRapidly)) return true;
      if (Array.isArray(favouriteJobs) && favouriteJobs.some(isTitleRapidly)) return true;
    }

    return false;
  }, [item, selectedJob, publishedJobs, unpublishedJobs, favouriteJobs]);

  const sourceText = item?.source ? formatStatus(item.source) : '_';

  const rapidlyMenuItems = [
    {
      label: 'View interview',
      icon: eyeVisibleIcon,
      onPress: () => {
        setMenuVisible(false);
        if (appId) {
          navigate('ApplicantDetails', {
            application_id: appId,
            job_id: jobId,
            tab: 'Rapidly Interview',
          });
        }
      },
    },
    {
      label: 'Send interview link',
      icon: emailIcon,
      onPress: () => {
        setMenuVisible(false);
        console.log('[ApplicantCard] Clicked "Send interview link" for application:', appId, {
          candidateName,
          candidateEmail,
        });
        if (appId) {
          dispatch(sendInterviewLinkRequestAction(appId));
        } else {
          console.warn('[ApplicantCard] Cannot send interview link: appId is empty/undefined', item);
        }
      },
    },
    {
      label: 'Copy interview link',
      icon: copyIcon,
      onPress: handleCopyInterviewLink,
    },
  ];

  const standardMenuItems = [
    ...(can(PERMISSIONS.VIEW_APPLICATION_PROFILE) ? [
      {
        label: 'Profile',
        icon: applicantUserIcon,
        onPress: () => {
          if (appId) {
            navigate('ApplicantDetails', {
              application_id: appId,
              job_id: jobId,
            });
          }
        },
      },
    ]
      : []),
    ...(can(PERMISSIONS.UPDATE_APPLICATION_STATUS)
      ? [
        {
          label: 'Change status',
          icon: editIcon,
          onPress: () => {
            setChangeStatusVisible(true);
          },
        },
      ]
      : []),
    {
      label: 'Copy profile link',
      icon: copyIcon,
      onPress: handleCopyProfileLink,
    },
    ...(can(PERMISSIONS.SHARE_APPLICATION)
      ? [
        {
          label: 'Share',
          icon: shareIcon,
          onPress: () => {
            setMenuVisible(false);
            setShareModalVisible(true);
          },
        },
      ]
      : []),
  ];

  const menuItems = isRapidlyCandidate
    ? [...rapidlyMenuItems, ...standardMenuItems]
    : standardMenuItems;

  return (
    <Pressable style={[styles.card]} onPress={() => handlePress(appId, jobId)}>
      <View ref={cardCaptureRef} collapsable={false} style={{ width: '100%', gap: 12 }}>
        {/* Top Row - Avatar + Name */}
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <View style={[styles.borderWrapper]}>
              {item?.candidate?.profile_pic ?
                <Image
                  source={{ uri: item?.candidate?.profile_pic }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
                :
                <Typography variant="semiBoldTxtlg" color={colors?.gray[700]} style={{ paddingRight: 5 }}>
                  {candidateInitial}
                </Typography>
              }
            </View>
            <View style={{ marginLeft: 12 }}>
              <Typography variant="semiBoldTxtmd">
                {candidateName}
              </Typography>
              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                Applied on : {appliedDate}
              </Typography>
            </View>
          </View>

          <View style={{ alignSelf: 'flex-start' }}>
            <View
              ref={(el) => {
                menuTriggerRef.current = el;
              }}
              collapsable={false}
            >
              <Pressable onPress={handleOpenMenu}>
                <SvgXml xml={horizontalThreedotIcon} height={20} width={20} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Applied For / Source */}
        {jobTitle && jobTitle !== '_' ? (
          <Typography variant="regularTxtsm" color={colors.gray[600]}>
            Applied for :{' '}
            <Typography variant="mediumTxtsm" color={colors.gray[700]}>
              {jobTitle}
            </Typography>
          </Typography>
        ) : (
          <Typography variant="regularTxtsm" color={colors.gray[600]}>
            Source :{' '}
            <Typography variant="mediumTxtsm" color={colors.gray[700]}>
              {sourceText}
            </Typography>
          </Typography>
        )}

        <Typography variant="regularTxtsm" color={colors.gray[600]}>
          Resume Score :{' '}
          <Typography variant="mediumTxtsm" color={colors.gray[700]}>
            {resumeScore}
          </Typography>
        </Typography>

        <Divider />

        {/* Stage + Status */}
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <Typography variant="regularTxtsm" color={colors.gray[500]}>
              {stageOrInterviewStatus}
            </Typography>
          </View>
          {Boolean(statusLabel) && (
            <View style={styles.statusBadge}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(statusLabel) }]} />
              <Typography variant="mediumTxtxs" color={colors.gray[700]}>
                {statusLabel}
              </Typography>
            </View>
          )}
        </View>
      </View>

      <DropdownMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        position={dropdownPosition}
        iconColor={colors?.gray[400]}
        width={MENU_WIDTH}
        iconStyle={{
          marginRight: 12,
        }}
        iconHight={20}
        iconWidth={20}
        items={menuItems}
      />

      {item && (
        <ChangeStatusModal
          visible={changeStatusVisible}
          onClose={() => setChangeStatusVisible(false)}
          applicantName={item.name ?? ''}
          currentStatus={item.status ?? null}
          newStatusOptions={STATUS_OPTIONS}
          onUpdateStatus={(selectedStatusId, options) => {
            if (!item?.id) return;
            dispatch(
              updateApplicationStatusRequestAction({
                id: item.id,
                status: selectedStatusId,
                emailCandidate: options?.emailCandidate,
                subject: options?.subject,
                message: options?.message,
              })
            );
          }}
          hideAddReason
          initialEmailMessage={
            'Hi {{candidate_name}},\n\nYour application status has been updated to "{{application_status}}".\n\nThanks,\n{{company}}'
          }
        />
      )}
      {item && (
        <ShareApplicationModal
          visible={shareModalVisible}
          onClose={() => setShareModalVisible(false)}
          applicationId={item.id}
          initialSharedMemberIds={item.users_shared_with ?? []}
        />
      )}
      {item && (
        <SendEmailModal
          visible={sendEmailVisible}
          onClose={() => setSendEmailVisible(false)}
          applicationId={appId}
          candidateName={candidateName}
          candidateEmail={item?.candidate_email || item?.email || item?.candidate?.email || ''}
          jobTitle={jobTitle !== '_' ? jobTitle : undefined}
          status={statusLabel || undefined}
        />
      )}
    </Pressable>
  );
};

export default ApplicantCard;

