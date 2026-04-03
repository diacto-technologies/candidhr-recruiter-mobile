import React, { Fragment, useEffect, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  Platform,
  Linking,
  Modal,
  Text,
  TouchableOpacity,
} from 'react-native';
import ProfileCart from '../../../components/organisms/profile';
import { FloatingActionButton, Header, ResumeModal } from '../../../components';
import { goBack, navigate } from '../../../utils/navigationUtils';
import SlideAnimatedTab from '../../../components/molecules/slideanimatedtab';
import { colors } from '../../../theme/colors';
import { useStyles } from './styles';
import FooterButtons from '../../../components/molecules/footerbuttons';
import { SvgXml } from 'react-native-svg';
import { telePhoneIcon } from '../../../assets/svg/telephone';
import { fileIcon } from '../../../assets/svg/file';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { getApplicationDetailRequestAction, getApplicationResponsesRequestAction, getAssessmentLogsBatchRequestAction, getResumeScreeningResponsesRequestAction, getPersonalityScreeningListRequestAction, getApplicationStagesRequestAction, updateApplicationStatusRequestAction } from '../../../features/applications/actions';
import { useRoute } from '@react-navigation/native';
import { selectApplicationsDetailLoading, selectApplicationStages, selectAssessmentLogs, selectPersonalityScreeningList, selectSelectedApplication } from '../../../features/applications/selectors';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { showToastMessage } from '../../../utils/toast';
import DeviceInfo from 'react-native-device-info';
import { resetPersonalityScreeningState } from '../../../features/applications/slice';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import { WebView } from 'react-native-webview';
import Assessment from './tabs/assessment';
import AssessmentV2 from './tabs/assessmentv2';
import ProfileInfo from './tabs/profileinfo';
import ResumeScreening from './tabs/resumescreening';
import VideoInterview from './tabs/videointerview';
import { formatMonDDYYYY } from '../../../utils/dateformatter';
import { buildApplicationPdfHtml } from './tabs/profileinfo/applicationdetails/buildApplicationPdfHtml';
import { commentIcon } from '../../../assets/svg/comments';
import navigation from '../../../navigation';

export default function ApplicantDetails() {
  const route = useRoute();
  const { application_id, job_id, tab, } = route.params as { application_id: string, job_id: string, tab: string };
  const styles = useStyles();
  const initialTabLabel = !tab ? 'Profile Info' : tab;
  const [activeTab, setActiveTab] = useState(initialTabLabel);
  /** Tabs that have been opened at least once — kept mounted so switching back does not remount (fixes Assessment V2 flash). */
  const [visitedTabKeys, setVisitedTabKeys] = useState(() => new Set<string>([initialTabLabel]));
  const [resumeModalVisible, setResumeModalVisible] = useState(false);
  const [htmlPreviewVisible, setHtmlPreviewVisible] = useState(false);
  const [htmlPreview, setHtmlPreview] = useState<string>('');
  const dispatch = useAppDispatch();
  const selectedApplication = useAppSelector(selectSelectedApplication);
  const selectApplicationStage = useAppSelector(selectApplicationStages)
  // Status options for dropdown – API-only statuses (e.g. "Applied") are not in the list; they still show as selected when coming from API
  const STATUS_OPTIONS = [
    { id: "shortlisted", name: "Shortlisted" },
    { id: "rejected", name: "Rejected" },
    { id: "on_hold", name: "On Hold" },
    { id: "interview_scheduled", name: "Interview Scheduled" },
    { id: "final_interview", name: "Final Interview" },
    { id: "hired", name: "Hired" },
    { id: "offer_extended", name: "Offer Extended" },
    { id: "offer_accepted", name: "Offer Accepted" },
    { id: "offer_rejected", name: "Offer Rejected" },
    { id: "not_selected", name: "Not Selected" },
    { id: "withdrawn", name: "Withdrawn" },
    { id: "archived", name: "Archived" },
  ];

  // Get resume URL from selected application
  const resumeUrl = selectedApplication?.resume?.resume_file || null;
  const candidateName = selectedApplication?.candidate?.name || 'Candidate';
  const application = useAppSelector(selectSelectedApplication);
  const loading = useAppSelector(selectApplicationsDetailLoading);
  const assessmentLogs = useAppSelector(selectAssessmentLogs);
  const personalityScreeningList = useAppSelector(selectPersonalityScreeningList);

  const hasAssessments = Boolean(assessmentLogs && assessmentLogs.length > 0);
  const hasVideoInterview = Boolean(
    personalityScreeningList && personalityScreeningList.length > 0
  );
  const hasResumeScreening = Boolean(
    application?.resume &&
    (
      application.resume.resume_score ||
      application.resume.resume_json ||
      application.resume.ai_summary_json ||
      application?.resume?.work_experience ||
      application?.resume?.projects ||
      application?.resume?.education ||
      application?.resume?.certifications
    )
  );
  const stages = useAppSelector(selectApplicationStages);
  const tabs = useMemo(() => {
    const baseTabs = ['Profile Info'];
    const stageTabMap: Record<string, string> = {
      resume_screening: 'Resume Screening',
      assessment: 'Assessments',
      assessment_v2: 'Assessment V2',
      automated_video_interview:
        'Automated Video Interview',
    };
    stages?.forEach(stage => {
      const tabName =
        stageTabMap[stage.stage_type];

      if (
        tabName &&
        !baseTabs.includes(tabName)
      ) {
        baseTabs.push(tabName);
      }
    });
    return baseTabs;
  }, [stages]);

  /** Persist session selection per tab — survives tab switches (child screens unmount). */
  const [assessmentSessionContentId, setAssessmentSessionContentId] = useState<string | null>(null);
  const [videoInterviewSessionContentId, setVideoInterviewSessionContentId] = useState<string | null>(null);
  const [assessmentV2SessionContentId, setAssessmentV2SessionContentId] = useState<string | null>(null);
  const [assessmentV2SelectedAssignmentId, setAssessmentV2SelectedAssignmentId] = useState<string | null>(null);

  useEffect(() => {
    setAssessmentSessionContentId(null);
    setVideoInterviewSessionContentId(null);
    setAssessmentV2SessionContentId(null);
    setAssessmentV2SelectedAssignmentId(null);
    setVisitedTabKeys(new Set([activeTab]));
  }, [application_id]);

  useEffect(() => {
    setVisitedTabKeys((prev) => new Set(prev).add(activeTab));
  }, [activeTab]);

  useEffect(() => {
    dispatch(resetPersonalityScreeningState());
    dispatch(getApplicationStagesRequestAction(application_id));
    dispatch(getApplicationDetailRequestAction(application_id));
    dispatch(getApplicationResponsesRequestAction({ application_id, job_id }));
    dispatch(getResumeScreeningResponsesRequestAction(application_id));
    dispatch(getPersonalityScreeningListRequestAction({ application_id, job_id }));
  }, [application_id, job_id]);

  /** Sessions API uses `?stage_id=` — fetch each relevant stage and merge (see saga batch). */
  useEffect(() => {
    if (!stages?.length) return;
    const stageIds = stages
      .filter(
        (s) =>
          s.stage_type === 'assessment' ||
          s.stage_type === 'assessment_v2' ||
          s.stage_type === 'automated_video_interview'
      )
      .map((s) => s.id)
      .filter(Boolean);
    if (!stageIds.length) return;
    dispatch(getAssessmentLogsBatchRequestAction(stageIds));
  }, [stages, application_id, dispatch]);

  useEffect(() => {
    if (!tabs.includes(activeTab)) {
      setActiveTab(tabs[0]);
    }
  }, [tabs]);


  const renderTabPanel = (tabName: string) => {
    switch (tabName) {
      case 'Profile Info':
        return <ProfileInfo />;
      case 'Resume Screening':
        return <ResumeScreening />;
      case 'Assessments':
        return (
          <Assessment
            sessionContentId={assessmentSessionContentId}
            onSessionContentIdChange={setAssessmentSessionContentId}
          />
        );
      case 'Assessment V2':
        return (
          <AssessmentV2
            sessionContentId={assessmentV2SessionContentId}
            onSessionContentIdChange={setAssessmentV2SessionContentId}
            selectedAssignmentId={assessmentV2SelectedAssignmentId}
            onSelectedAssignmentIdChange={setAssessmentV2SelectedAssignmentId}
          />
        );
      case 'Automated Video Interview':
        return (
          <VideoInterview
            sessionContentId={videoInterviewSessionContentId}
            onSessionContentIdChange={setVideoInterviewSessionContentId}
          />
        );
      default:
        return <View />;
    }
  };

  const handleViewResume = () => {
    if (resumeUrl) {
      setResumeModalVisible(true);
    } else {
      console.warn('Resume URL is not available');
    }
  };

  const humanizeStatus = (status?: string | null) => {
    if (!status) return 'Under Review';
    return status
      .replace(/_/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const buildHtmlPreview = () => {
    if (!application) {
      showToastMessage('Application data is not available yet', 'error');
      return '';
    }

    const applicant = application?.candidate;
    const appliedAt =
      application?.applied_at ? formatMonDDYYYY(application.applied_at) : 'N/A';

    const stageCards = (stages ?? []).map((s) => ({
      id: s.id,
      name: s.stage_name,
      statusText: humanizeStatus(s.status || s.workflow_last_status),
      date: formatMonDDYYYY(s.workflow_status_updated_at || s.updated_at || s.created_at),
    }));

    const ai: any = application?.resume?.ai_summary_json ?? {};

    const html = buildApplicationPdfHtml({
      application,
      applicant: {
        name: applicant?.name ?? application?.name ?? 'Candidate',
        appliedAt,
        email: applicant?.email ?? 'N/A',
        contact: String(applicant?.contact ?? 'N/A'),
        location: [applicant?.location?.city, applicant?.location?.state].filter(Boolean).join(', ') || 'N/A',
      },
      job: {
        title: application?.job?.title ?? 'N/A',
      },
      stages: stageCards,
      aiSummary: {
        summary: ai?.summary ?? 'No data found.',
        potentialRedFlags: Array.isArray(ai?.potentialRedFlags)
          ? ai.potentialRedFlags
          : Array.isArray(ai?.potential_red_flags)
            ? ai.potential_red_flags
            : [],
        recruiterRecommendation: ai?.recruiterRecommendation ?? ai?.recruiter_recommendation ?? 'No data found.',
        matchedSkills: Array.isArray(ai?.matchedSkills)
          ? ai.matchedSkills
          : Array.isArray(ai?.matched_skills)
            ? ai.matched_skills
            : [],
        missingSkills: Array.isArray(ai?.missingSkills)
          ? ai.missingSkills
          : Array.isArray(ai?.missing_skills)
            ? ai.missing_skills
            : [],
        jobReadinessScore: Number(ai?.jobReadinessScore ?? ai?.job_readiness_score ?? 0),
        matchScore: Number(ai?.matchScore ?? ai?.match_score ?? 0),
      },
    });

    return html;
  };

  const handlePreviewHtml = () => {
    const html = buildHtmlPreview();
    if (!html) return;
    setHtmlPreview(html);
    setHtmlPreviewVisible(true);
  };

  const handleDownloadHtmlPreview = async () => {
    try {
      const html = buildHtmlPreview();
      if (!html) return;

      const safeCandidateName =
        (candidateName || 'Candidate')
          .trim()
          .replace(/[^a-z0-9-_ ]/gi, '')
          .replace(/\s+/g, '_') || 'Candidate';

      const fileName = `Application_${safeCandidateName}_${String(application_id).slice(-6)}_${Date.now()}.html`;
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      await RNFS.writeFile(filePath, html, 'utf8');

      await Share.open({
        url: `file://${filePath}`,
        type: 'text/html',
        filename: fileName,
        failOnCancel: false,
      });
    } catch (e) {
      const message =
        e && typeof e === 'object' && 'message' in e ? String((e as any).message) : 'Unknown error';
      console.error('HTML export failed', e);
      showToastMessage(`Export failed: ${message}`, 'error');
    }
  };

  const handleCall = async (phoneNumber?: string | number) => {
    if (!phoneNumber) {
      showToastMessage('Phone number not available', 'error');
      return;
    }

    const cleanedNumber = phoneNumber.toString().replace(/\D/g, '');

    if (cleanedNumber.length < 8) {
      showToastMessage('Invalid phone number', 'error');
      return;
    }

    if (Platform.OS === 'ios' && DeviceInfo.isEmulatorSync()) {
      showToastMessage(
        'Calling is not supported on iOS Simulator. Use a real device.',
        'info'
      );
      return;
    }

    try {
      await Linking.openURL(`tel:${cleanedNumber}`);
    } catch (error) {
      showToastMessage('Unable to open dialer', 'error');
    }
  };


  return (
    <Fragment>
      <CustomSafeAreaView>
        <Header
          backNavigation={true}
          onBack={() => goBack()}
          statusDropdown={true}
          // threedot={true}
          statusOptions={STATUS_OPTIONS}
          statusLabelKey="name"
          statusValueKey="id"
          statusValue={application?.status ?? ''}
          onStatusSelect={(item) => {
            dispatch(updateApplicationStatusRequestAction({ id: application_id, status: item.id }));
          }}
          statusOpenModalOnSelect={true}
          statusChangeStatusModalProps={{
            applicantName: candidateName,
            currentStatus: application?.status ?? null,
            newStatusOptions: STATUS_OPTIONS,
            onUpdateStatus: (selectedStatusId) => {
              // selectedStatusId is the STATUS_OPTIONS id (e.g. "on_hold") — sent as ?status=on_hold
              dispatch(updateApplicationStatusRequestAction({ id: application_id, status: selectedStatusId }));
              dispatch(getApplicationDetailRequestAction(application_id));
            },
            hideAddReason: true,
            initialEmailMessage: 'Hi {{candidate_name}},\n\nYour application status has been updated to "{{application_status}}".\n\nThanks,\n{{company}}',
          }}
        />
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} bounces={false}>
          <View style={styles.subContainer}>
            <ProfileCart
              application={application}
              loading={loading}
              onPressPreview={handlePreviewHtml}
              onPressExport={handleDownloadHtmlPreview}
            />
            <View style={styles.tabContainer}>
              <SlideAnimatedTab
                tabs={tabs}
                activeTab={activeTab}
                onChangeTab={(label) => setActiveTab(label)}
              />

              <View style={styles.bottomBorder} />
            </View>
            <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
              {tabs
                .filter(
                  (tabName) => visitedTabKeys.has(tabName) || tabName === activeTab
                )
                .map((tabName) => {
                  const isActive = activeTab === tabName;
                  return (
                    <View
                      key={tabName}
                      collapsable={false}
                      style={
                        isActive
                          ? { width: '100%' }
                          : {
                              width: '100%',
                              height: 0,
                              overflow: 'hidden',
                              opacity: 0,
                              position: 'absolute',
                              left: 0,
                              right: 0,
                              zIndex: -1,
                            }
                      }
                      pointerEvents={isActive ? 'auto' : 'none'}
                    >
                      {renderTabPanel(tabName)}
                    </View>
                  );
                })}
            </View>
          </View>
        </ScrollView>
        <View>
          <FooterButtons
            leftButtonProps={{
              children: "View resume",
              variant: "contain",
              size: 44,
              buttonColor: colors.base.white,
              textColor: colors.gray[700],
              borderColor: colors.gray[300],
              borderWidth: 1,
              borderRadius: 8,
              borderGradientOpacity: 0.25,
              shadowColor: colors.gray[700],
              onPress: handleViewResume,
              startIcon: <SvgXml xml={fileIcon} />,
              disabled: !resumeUrl,
            }}
            rightButtonProps={{
              children: "call",
              variant: "contain",
              size: 44,
              borderWidth: 1,
              buttonColor: colors.brand[600],
              textColor: colors.base.white,
              borderColor: colors.base.white,
              borderRadius: 8,
              onPress: () => { handleCall(application?.candidate?.contact ?? "") },
              startIcon: <SvgXml xml={telePhoneIcon} />,
            }}
          />
        </View>
        <View style={styles.floatingButton}>
          <FloatingActionButton
            value={commentIcon}
            backgroundColor={colors.brand[600]}
            iconColor={colors.base.white}
            size={50}
            onPress={() => {
             navigate('Comments', { application_id, job_id });
            }}
          />
        </View>
      </CustomSafeAreaView>

      <Modal
        visible={htmlPreviewVisible}
        animationType="slide"
        onRequestClose={() => setHtmlPreviewVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <WebView originWhitelist={['*']} source={{ html: htmlPreview }} style={{ flex: 1 }} />
          <TouchableOpacity
            onPress={() => setHtmlPreviewVisible(false)}
            style={{
              position: 'absolute',
              top: Platform.OS === 'android' ? 14 : 52,
              right: 16,
              backgroundColor: '#111827',
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 999,
              zIndex: 10,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <ResumeModal
        visible={resumeModalVisible}
        resumeUrl={resumeUrl}
        onClose={() => setResumeModalVisible(false)}
        candidateName={candidateName}
      />
    </Fragment>
  );
}

