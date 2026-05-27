import { useState, useMemo, useEffect, useCallback } from 'react';
import { Linking, Platform } from 'react-native';
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
} from '../../../../features/applications/actions';

import {
  selectApplicationsDetailLoading,
  selectApplicationStages,
  selectAssessmentLogs,
  selectResumeScreeningReport,
  selectSelectedApplication,
  selectSelectedApplicationError,
} from '../../../../features/applications/selectors';
import { resetPersonalityScreeningState } from '../../../../features/applications/slice';

export const useApplicantDetailsController = (
  application_id: string,
  job_id: string,
  initialTabLabel: string
) => {
  const dispatch = useAppDispatch();
  const { can } = usePermission();

  const [activeTab, setActiveTab] = useState(initialTabLabel);
  const [resumeModalVisible, setResumeModalVisible] = useState(false);
  
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

  const resumeUrl = application?.resume_file || null;
  const candidateName = application?.applicant?.name || 'N/A';

  // Derived Tabs
  const tabs = useMemo(() => {
    const baseTabs = ['Profile Info'];
    stages?.forEach((stage: any) => {
      const tabName = STAGE_TAB_MAP[stage.stage_type];
      if (tabName && !baseTabs.includes(tabName)) {
        baseTabs.push(tabName);
      }
    });
    return baseTabs;
  }, [stages]);

  // Effects
  useEffect(() => {
    setAssessmentSessionContentId(null);
    setVideoInterviewSessionContentId(null);
    setAssessmentV2SessionContentId(null);
    setAssessmentV2SelectedAssignmentId(null);
  }, [application_id]);

  useEffect(() => {
    dispatch(resetPersonalityScreeningState());
    dispatch(getApplicationStagesRequestAction(application_id));
    dispatch(getApplicationDetailRequestAction(application_id));
    dispatch(getApplicationResponsesRequestAction({ application_id, job_id }));
    dispatch(getResumeScreeningResponsesRequestAction(application_id));
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
    if (!tabs.includes(activeTab)) {
      setActiveTab(tabs[0]);
    }
  }, [tabs]);

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
      showToastMessage('Calling is not supported on iOS Simulator.', 'info');
      return;
    }
    try {
      await Linking.openURL(`tel:${cleanedNumber}`);
    } catch (error) {
      showToastMessage('Unable to open dialer', 'error');
    }
  }, []);

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

  return {
    // State & Derived Data
    activeTab,
    setActiveTab,
    tabs,
    application,
    loading,
    selectApplicationError,
    candidateName,
    resumeUrl,
    resumeModalVisible,
    setResumeModalVisible,
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
    handleCall,
    handleUpdateStatus,
  };
};
