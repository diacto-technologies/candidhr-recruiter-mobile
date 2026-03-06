import React, { Fragment, useEffect, useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  Platform,
  Linking,
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
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { getApplicationDetailRequestAction, getApplicationResponsesRequestAction, getAssessmentLogsRequestAction, getResumeScreeningResponsesRequestAction, getPersonalityScreeningListRequestAction, getApplicationStagesRequestAction, updateApplicationStatusRequestAction } from '../../../features/applications/actions';
import { useRoute } from '@react-navigation/native';
import { selectApplicationsDetailLoading, selectApplicationStages, selectAssessmentLogs, selectPersonalityScreeningList, selectSelectedApplication } from '../../../features/applications/selectors';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { showToastMessage } from '../../../utils/toast';
import DeviceInfo from 'react-native-device-info';
import { resetPersonalityScreeningState } from '../../../features/applications/slice';
import Assessment from './tabs/assessment';
import ProfileInfo from './tabs/profileinfo';
import ResumeScreening from './tabs/resumescreening';
import VideoInterview from './tabs/videointerview';

export default function ApplicantDetails() {
  const route = useRoute();
  const { application_id, job_id, tab, } = route.params as { application_id: string, job_id: string, tab: string };
  const styles = useStyles();
  const [activeTab, setActiveTab] = useState(!tab ? 'Profile Info' : tab);
  const [resumeModalVisible, setResumeModalVisible] = useState(false);
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
  }, [application_id, job_id]);

  useEffect(() => {
    if (!stages?.length) return;
    if (activeTab === 'Profile Info') return;

    const stageTypeMap: Record<string, string> = {
      'Resume Screening': 'resume_screening',
      'Assessments': 'assessment',
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


  const renderTab = () => {
    switch (activeTab) {
      case 'Profile Info':
        return <ProfileInfo />;
      case 'Resume Screening':
        return <ResumeScreening />;
      case 'Assessments':
        return <Assessment />;
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
              loading={loading} />
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

