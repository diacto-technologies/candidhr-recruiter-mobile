import { useState, useMemo, useEffect, useCallback } from 'react';
import { Linking, Platform, Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { usePermission } from '../../../../hooks/usePermission';
import { PERMISSIONS } from '../../../../utils/permission.constants';
import { showToastMessage } from '../../../../utils/toast';
import { STAGE_TAB_MAP } from '../config';
import { generatePreviewHtmlString } from '../utils/htmlBuilderUtils';
import { exportApplicationPdf } from '../utils/pdfExportUtils';

import {
  getApplicationDetailRequestAction,
  getApplicationResponsesRequestAction,
  getAssessmentLogsBatchRequestAction,
  getResumeScreeningReportRequestAction,
  getResumeScreeningResponsesRequestAction,
  getApplicationStagesRequestAction,
  updateApplicationStatusRequestAction,
  getApplicationViewersRequestAction,
} from '../../../../features/applications/actions';

import {
  selectApplicationsDetailLoading,
  selectApplicationStages,
  selectAssessmentLogs,
  selectResumeScreeningReport,
  selectSelectedApplication,
  selectSelectedApplicationError,
  selectApplicationViewers,
  selectLoadingApplicationViewers,
} from '../../../../features/applications/selectors';
import { resetPersonalityScreeningState } from '../../../../features/applications/slice';
import {
  getRapidlyInterviewReportRequestAction,
  resetRapidlyInterviewReportAction,
} from '../../../../features/rapidhire/actions';
import { selectRapidlyInterviewReport } from '../../../../features/rapidhire/selectors';

export const useApplicantDetailsController = (
  application_id: string,
  job_id: string,
  initialTabLabel: string
) => {
  const dispatch = useAppDispatch();
  const { can } = usePermission();

  const [activeTab, setActiveTab] = useState(initialTabLabel);
  const [resumeModalVisible, setResumeModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [viewersModalVisible, setViewersModalVisible] = useState(false);
  
  const [htmlPreviewVisible, setHtmlPreviewVisible] = useState(false);
  const [htmlPreview, setHtmlPreview] = useState<string>('');
  const [htmlPreviewMountKey, setHtmlPreviewMountKey] = useState(0);

  // Tab sessions
  const [assessmentSessionContentId, setAssessmentSessionContentId] = useState<string | null>(null);
  const [videoInterviewSessionContentId, setVideoInterviewSessionContentId] = useState<string | null>(null);
  const [assessmentV2SessionContentId, setAssessmentV2SessionContentId] = useState<string | null>(null);
  const [assessmentV2SelectedAssignmentId, setAssessmentV2SelectedAssignmentId] = useState<string | null>(null);

  // Redux
  const application = useAppSelector(selectSelectedApplication);
  const selectApplicationError = useAppSelector(selectSelectedApplicationError);
  const loading = useAppSelector(selectApplicationsDetailLoading);
  const assessmentLogs = useAppSelector(selectAssessmentLogs);
  const resumeScreeningReport = useAppSelector(selectResumeScreeningReport);
  const stages = useAppSelector(selectApplicationStages);
  const rapidlyInterviewReport = useAppSelector(selectRapidlyInterviewReport);
  const viewers = useAppSelector(selectApplicationViewers);
  const loadingViewers = useAppSelector(selectLoadingApplicationViewers);

  const resumeUrl = application?.resume_file || null;
  const candidateName = application?.applicant?.name || 'N/A';

  // Derived Tabs
  const tabs = useMemo(() => {
    const baseTabs: Array<{ key: string; label: string }> = [
      { key: 'profile_info', label: 'Profile Info' },
    ];
    stages?.forEach((stage: any) => {
      const config = STAGE_TAB_MAP[stage.stage_type];
      if (config && !baseTabs.some((t) => t.key === config.key)) {
        baseTabs.push(config);
      }
    });

    // Add Rapidly Interview tab if rapidhire interview exists or job is rapidhire enabled
    if (
      rapidlyInterviewReport?.has_interview ||
      rapidlyInterviewReport?.recording_url ||
      (application as any)?.job?.rapidhire_enabled
    ) {
      if (!baseTabs.some((t) => t.key === 'rapidly_interview')) {
        baseTabs.push({ key: 'rapidly_interview', label: 'Rapidly Interview' });
      }
    }

    return baseTabs;
  }, [stages, rapidlyInterviewReport, application]);

  // Effects
  useEffect(() => {
    setAssessmentSessionContentId(null);
    setVideoInterviewSessionContentId(null);
    setAssessmentV2SessionContentId(null);
    setAssessmentV2SelectedAssignmentId(null);
  }, [application_id]);

  useEffect(() => {
    dispatch(resetPersonalityScreeningState());
    dispatch(resetRapidlyInterviewReportAction());
    dispatch(getApplicationStagesRequestAction(application_id));
    dispatch(getApplicationDetailRequestAction(application_id));
    dispatch(getApplicationResponsesRequestAction({ application_id, job_id }));
    dispatch(getResumeScreeningResponsesRequestAction(application_id));
    dispatch(getRapidlyInterviewReportRequestAction(application_id));
    dispatch(getApplicationViewersRequestAction({ applicationId: application_id, limit: 20 }));
  }, [application_id, job_id, dispatch]);

  useEffect(() => {
    if (!stages?.length) return;
    const stageIds = stages
      .filter((s: any) =>
        ['resume_screening', 'assessment', 'assessment_v2', 'automated_video_interview'].includes(s.stage_type)
      )
      .map((s: any) => s.id)
      .filter(Boolean);
    if (!stageIds.length) return;
    dispatch(getAssessmentLogsBatchRequestAction(stageIds));
  }, [stages, application_id, dispatch]);

  const resumeStage = useMemo(
    () => stages?.find((s: any) => s.stage_type === 'resume_screening'),
    [stages]
  );

  const resumeSessionLog = useMemo(() => {
    if (!resumeStage?.id) return null;
    return (
      assessmentLogs?.find(
        (l: any) => l?.stage_id === resumeStage.id && l?.content_type === 'resume_screening'
      ) ?? null
    );
  }, [assessmentLogs, resumeStage?.id]);

  const resumeScreeningContentId = useMemo(() => {
    const fromLog = String(resumeSessionLog?.content_id ?? '').trim();
    if (fromLog) return fromLog;
    return String(application?.resume_id ?? '').trim();
  }, [resumeSessionLog?.content_id, application?.resume_id]);

  useEffect(() => {
    if (!resumeScreeningContentId) return;
    dispatch(getResumeScreeningReportRequestAction(resumeScreeningContentId));
  }, [resumeScreeningContentId, dispatch]);

  useEffect(() => {
    const activeExists = tabs.some(
      (t) => t.key === activeTab || t.label === activeTab
    );
    if (!activeExists && tabs.length > 0) {
      setActiveTab(tabs[0].key);
    }
  }, [tabs, activeTab]);

  // Handlers
  const handleViewResume = useCallback(() => {
    if (resumeUrl) {
      setResumeModalVisible(true);
    } else {
      console.warn('Resume URL is not available');
    }
  }, [resumeUrl]);

  const handlePreviewHtml = useCallback(() => {
    try {
      const html = generatePreviewHtmlString({ application, stages, resumeScreeningReport });
      if (!html) return;
      setHtmlPreview(html);
      setHtmlPreviewMountKey((k) => k + 1);
      setHtmlPreviewVisible(true);
    } catch (e) {
      console.error('HTML preview build failed', e);
      const msg = e instanceof Error ? e.message : String(e);
      showToastMessage(`Could not build preview: ${msg}`, 'error');
    }
  }, [application, stages, resumeScreeningReport]);

  const handleDownloadHtmlPreview = useCallback(async () => {
    try {
      const html = generatePreviewHtmlString({ application, stages, resumeScreeningReport });
      if (!html) return;
      await exportApplicationPdf(html, candidateName, application_id);
      if (Platform.OS === 'android') {
        showToastMessage('PDF saved to Downloads (CandidHR)', 'success');
      } else {
        showToastMessage('Saved to the location you chose in Files.', 'success');
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      console.error('PDF export failed', e);
      showToastMessage(`Export failed: ${message}`, 'error');
    }
  }, [application, stages, resumeScreeningReport, candidateName, application_id]);

  const handleCall = useCallback(async (phoneNumber?: string | number) => {
    const targetNumber = phoneNumber || application?.applicant?.contact || (application as any)?.candidate?.contact;
    if (!targetNumber) {
      showToastMessage('Phone number not available', 'error');
      return;
    }
    const cleanedNumber = targetNumber.toString().replace(/\D/g, '');
    if (cleanedNumber.length < 8) {
      showToastMessage('Invalid phone number', 'error');
      return;
    }
    if (Platform.OS === 'ios' && DeviceInfo.isEmulatorSync()) {
      showToastMessage('Calling is not supported on iOS Simulator.', 'info');
      return;
    }
    try {
      await Linking.openURL(`tel:${cleanedNumber}`);
    } catch (error) {
      showToastMessage('Could not launch dialer', 'error');
    }
  }, [application]);

  const handleUpdateStatus = useCallback((selectedStatusId: string, options?: any) => {
    dispatch(updateApplicationStatusRequestAction({ 
      id: application_id, 
      status: selectedStatusId,
      emailCandidate: options?.emailCandidate,
      subject: options?.subject,
      message: options?.message, 
    }));
    dispatch(getApplicationDetailRequestAction(application_id));
  }, [dispatch, application_id]);

  const handleExport = useCallback(() => {
    Alert.alert('Export Application', 'Choose an option', [
      { text: 'Preview PDF', onPress: handlePreviewHtml },
      { text: 'Download PDF', onPress: handleDownloadHtmlPreview },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [handlePreviewHtml, handleDownloadHtmlPreview]);

  const handleOpenViewers = useCallback(() => {
    if (application_id) {
      dispatch(getApplicationViewersRequestAction({ applicationId: application_id, limit: 20 }));
    }
    setViewersModalVisible(true);
  }, [application_id, dispatch]);

  return {
    // State & Derived Data
    activeTab,
    setActiveTab,
    tabs,
    application,
    stages,
    loading,
    selectApplicationError,
    candidateName,
    candidateEmail: application?.applicant?.email ?? '',
    jobTitle: application?.job?.title ?? '',
    resumeUrl,
    resumeModalVisible,
    setResumeModalVisible,
    emailModalVisible,
    setEmailModalVisible,
    htmlPreviewVisible,
    setHtmlPreviewVisible,
    htmlPreview,
    htmlPreviewMountKey,
    
    // Tab Sessions
    assessmentSessionContentId,
    setAssessmentSessionContentId,
    videoInterviewSessionContentId,
    setVideoInterviewSessionContentId,
    assessmentV2SessionContentId,
    setAssessmentV2SessionContentId,
    assessmentV2SelectedAssignmentId,
    setAssessmentV2SelectedAssignmentId,

    // Permissions
    canUpdateStatus: can(PERMISSIONS.UPDATE_APPLICATION_STATUS),
    canExportProfile: can(PERMISSIONS.EXPORT_APPLICATION_PROFILE),

    // Handlers
    handleViewResume,
    handlePreviewHtml,
    handleDownloadHtmlPreview,
    handleExport,
    handleCall,
    handleUpdateStatus,
    handleOpenViewers,
    viewersModalVisible,
    setViewersModalVisible,
    viewers,
    loadingViewers,
  };
};
