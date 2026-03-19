import React, { Fragment, useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  ScrollView,
  Platform,
  Linking,
  FlatList,
  Modal,
  Button,
} from 'react-native';
import ProfileCart from '../../../components/organisms/profile';
import { Header, ResumeModal } from '../../../components';
import { goBack } from '../../../utils/navigationUtils';
import SlideAnimatedTab from '../../../components/molecules/slideanimatedtab';
import { colors } from '../../../theme/colors';
import { useStyles } from './styles';
import FooterButtons from '../../../components/molecules/footerbuttons';
import { SvgXml } from 'react-native-svg';
import { telePhoneIcon } from '../../../assets/svg/telephone';
import { fileIcon } from '../../../assets/svg/file';
import { FloatingActionButton } from '../../../components/atoms';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import {
  getApplicationDetailRequestAction,
  getApplicationResponsesRequestAction,
  getAssessmentLogsRequestAction,
  getResumeScreeningResponsesRequestAction,
  getPersonalityScreeningListRequestAction,
  getApplicationStagesRequestAction,
  updateApplicationStatusRequestAction,
  getApplicationReasonsListRequestAction,
} from '../../../features/applications/actions';
import { useRoute, useNavigation } from '@react-navigation/native';
import { selectApplicationsDetailLoading, selectApplicationStages, selectAssessmentLogs, selectPersonalityScreeningList, selectSelectedApplication } from '../../../features/applications/selectors';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { showToastMessage } from '../../../utils/toast';
import DeviceInfo from 'react-native-device-info';
import { resetPersonalityScreeningState } from '../../../features/applications/slice';
import * as RNHTMLtoPDF from 'react-native-html-to-pdf';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import { WebView } from 'react-native-webview';
import Assessment from './tabs/assessment';
import ProfileInfo from './tabs/profileinfo';
import ResumeScreening from './tabs/resumescreening';
import VideoInterview from './tabs/videointerview';
import { plusIcon } from '../../../assets/svg/plus';
import { commentIcon } from '../../../assets/svg/comments';
import AssessmentV2 from './tabs/assessmentv2';
import { formatMonDDYYYY } from '../../../utils/dateformatter';
import { buildApplicationPdfHtml } from './tabs/profileinfo/applicationdetails/buildApplicationPdfHtml';

export default function ApplicantDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { application_id, job_id, tab, } = route.params as { application_id: string, job_id: string, tab: string };
  const styles = useStyles();
  const [activeTab, setActiveTab] = useState(!tab ? 'Profile Info' : tab);
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

  useEffect(() => {
    dispatch(resetPersonalityScreeningState());
    dispatch(getApplicationStagesRequestAction(application_id));
    dispatch(getApplicationDetailRequestAction(application_id));
    dispatch(getApplicationResponsesRequestAction({ application_id, job_id }));
    dispatch(getResumeScreeningResponsesRequestAction(application_id));
    dispatch(getPersonalityScreeningListRequestAction({ application_id, job_id }));
    dispatch(getApplicationReasonsListRequestAction({ applicationId: application_id, jobId: job_id }));
  }, [application_id, job_id]);

  useEffect(() => {
    if (!stages?.length) return;
    if (activeTab === 'Profile Info') return;

    const stageTypeMap: Record<string, string> = {
      'Resume Screening': 'resume_screening',
      'Assessments': 'assessment',
      'Assessment V2': 'assessment_v2',
      'Automated Video Interview': 'automated_video_interview',
    };

    const stageType = stageTypeMap[activeTab];
    if (!stageType) return;

    const stage = stages.find(
      s => s.stage_type === stageType
    );

    if (stage?.id) {
      dispatch(getAssessmentLogsRequestAction(stage.id));
    }

  }, [activeTab, stages]);

  useEffect(() => {
    if (!tabs.includes(activeTab)) {
      setActiveTab(tabs[0]);
    }
  }, [tabs]);

  const applicationDetailsRef = useRef<ViewShot>(null);

  const renderTab = () => {
    switch (activeTab) {
      case 'Profile Info':
        return <ProfileInfo />;
      case 'Resume Screening':
        return <ResumeScreening />;
      case 'Assessments':
        return <Assessment />;
      case 'Assessment V2':
        return <AssessmentV2 />;
      case 'Automated Video Interview':
        return <VideoInterview />;
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

  const handleExportPdf = async () => {
    try {
      const toPdf = (RNHTMLtoPDF as any)?.generatePDF;
      if (!RNHTMLtoPDF || typeof toPdf !== 'function') {
        console.log('RNHTMLtoPDF not linked or convert not available:', RNHTMLtoPDF);
        showToastMessage('PDF module not available. Check installation.', 'error');
        return;
      }

      if (
        !applicationDetailsRef.current ||
        typeof (applicationDetailsRef.current as any).capture !== 'function'
      ) {
        showToastMessage('Details not ready to export', 'error');
        return;
      }

      // 1) Capture ApplicationDetailsCard as base64 image
      const base64: string = await (applicationDetailsRef.current as any).capture();

      // 2) Wrap the image in simple HTML
      const html = `
        <html>
          <body style="margin:0;padding:0;">
            <img src="data:image/png;base64,${base64}" style="width:100%;" />
          </body>
        </html>
      `;

      // 3) Generate PDF to Documents directory
      const safeName =
        candidateName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'application_details';
      const options = {
        html,
        fileName: safeName,
        directory: 'Documents',
      };

      const file = await toPdf(options);

      showToastMessage(`PDF saved: ${file.filePath}`, 'success');
    } catch (error) {
      console.log('PDF export error:', error);
      showToastMessage('Unable to export PDF', 'error');
    }
  };

  const NOT_AVAILABLE = 'Data is not available';

  const buildHtmlPreview = () => {
    const application = selectedApplication;
    const stagesFromStore = selectApplicationStage as any[] | null;

    const applicant = {
      name: application?.candidate?.name || NOT_AVAILABLE,
      appliedAt: application?.applied_at
        ? formatMonDDYYYY(application.applied_at, 'DD MMM YYYY')
        : NOT_AVAILABLE,
      email: application?.candidate?.email || NOT_AVAILABLE,
      contact:
        application?.candidate?.contact !== null &&
        application?.candidate?.contact !== undefined &&
        String(application?.candidate?.contact).trim() !== ''
          ? String(application.candidate.contact)
          : NOT_AVAILABLE,
      location:
        [application?.candidate?.location?.city, application?.candidate?.location?.state]
          .filter(Boolean)
          .join(', ') || NOT_AVAILABLE,
    };

    const job = { title: application?.job?.title || NOT_AVAILABLE };

    const stages =
      stagesFromStore && stagesFromStore.length
        ? stagesFromStore.map((stage: any, index: number) => ({
            id: String(stage.id ?? index),
            name:
              stage.stage_name ??
              stage.name ??
              stage.stage_type ??
              `Stage ${index + 1}`,
            statusText: stage.status_text ?? stage.status ?? NOT_AVAILABLE,
            date:
              stage.workflow_status_updated_at ||
              stage.reviewed_at ||
              stage.updated_at ||
              application?.applied_at
                ? formatMonDDYYYY(
                    stage.workflow_status_updated_at ??
                      stage.reviewed_at ??
                      stage.updated_at ??
                      application?.applied_at,
                    'DD MMM YYYY'
                  )
                : NOT_AVAILABLE,
          }))
        : [];

    const aiSummaryJson: any | null = application?.resume?.ai_summary_json ?? null;
    const aiSummary = {
      summary: aiSummaryJson?.summary || NOT_AVAILABLE,
      potentialRedFlags:
        aiSummaryJson?.potential_red_flags?.length > 0 ? aiSummaryJson.potential_red_flags : [],
      recruiterRecommendation: aiSummaryJson?.recruiter_recommendation || NOT_AVAILABLE,
      matchedSkills: aiSummaryJson?.matched_skills?.length > 0 ? aiSummaryJson.matched_skills : [],
      missingSkills: aiSummaryJson?.missing_skills?.length > 0 ? aiSummaryJson.missing_skills : [],
      jobReadinessScore: aiSummaryJson?.job_readiness_score ?? 0,
      matchScore: aiSummaryJson?.match_score ?? 0,
    };

    return buildApplicationPdfHtml({
      application,
      applicant,
      job,
      stages,
      aiSummary,
    });
  };

  const handlePreviewHtml = () => {
    const html = buildHtmlPreview();
    setHtmlPreview(html);
    setHtmlPreviewVisible(true);
  };

  const handleDownloadHtmlPreview = async () => {
    try {
      const html = buildHtmlPreview();

      const safeName =
        candidateName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'application_details';
      const fileName = `${safeName}_${Date.now()}.html`;
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      await RNFS.writeFile(filePath, html, 'utf8');

      await Share.open({
        url: `file://${filePath}`,
        type: 'text/html',
        filename: fileName,
        saveToFiles: true,
      });
    } catch (error: any) {
      if (String(error?.message ?? '').toLowerCase().includes('cancel')) return;
      console.log('HTML export error:', error);
      showToastMessage('Unable to download HTML', 'error');
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
        <FlatList
          data={[{}]}
          keyExtractor={() => "main"}
          renderItem={() => (
            <View style={styles.subContainer}>
              <ProfileCart
                application={application}
                loading={loading}
                onPressExport={handleDownloadHtmlPreview}
                onPressPreview={handlePreviewHtml}
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
                {renderTab()}
              </View>
            </View>
          )}
        />

        <Modal
          visible={htmlPreviewVisible}
          animationType="slide"
          onRequestClose={() => setHtmlPreviewVisible(false)}
        >
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ padding: 12 }}>
              <Button title="Close Preview" onPress={() => setHtmlPreviewVisible(false)} />
            </View>
            <WebView originWhitelist={['*']} source={{ html: htmlPreview }} style={{ flex: 1 }} />
          </View>
        </Modal>

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
              (navigation as any).navigate('Comments', { application_id, job_id });
            }}
          />
        </View>
      </CustomSafeAreaView>
      <ResumeModal
        visible={resumeModalVisible}
        resumeUrl={resumeUrl}
        onClose={() => setResumeModalVisible(false)}
        candidateName={candidateName}
      />
    </Fragment>
  );
}

