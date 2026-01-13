import React, { Fragment, useEffect, useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import Assessment from '../../../components/organisms/profile/assessment/assessment';
import ProfileInfo from '../../../components/organisms/profile/profileinfo/profileInfo';
import ResumeScreening from '../../../components/organisms/profile/resumescreening/resumescreening';
import VideoInterview from '../../../components/organisms/profile/videointerview/videoInterview';
import ProfileCart from '../../../components/organisms/profile/profilecart';
import { Header, ResumeModal } from '../../../components';
import { goBack } from '../../../utils/navigationUtils';
import SlideAnimatedTab from '../../../components/molecules/slideanimatedtab';
import { colors } from '../../../theme/colors';
import { useStyles } from './applicantDetails.styles';
import FooterButtons from '../../../components/molecules/footerbuttons';
import { SvgXml } from 'react-native-svg';
import { telePhoneIcon } from '../../../assets/svg/telephone';
import { fileIcon } from '../../../assets/svg/file';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { getApplicationDetailRequestAction, getApplicationResponsesRequestAction, getAssessmentLogsRequestAction, getResumeScreeningResponsesRequestAction, getPersonalityScreeningListRequestAction } from '../../../features/applications/actions';
import { useRoute } from '@react-navigation/native';
import { selectAssessmentLogs, selectPersonalityScreeningList, selectSelectedApplication } from '../../../features/applications/selectors';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { showToastMessage } from '../../../utils/toast';
import DeviceInfo from 'react-native-device-info';
import { resetPersonalityScreeningState } from '../../../features/applications/slice';

export default function ApplicantDetails() {
  const styles = useStyles();
  const [activeTab, setActiveTab] = useState('Profile Info');
  const [resumeModalVisible, setResumeModalVisible] = useState(false);
  const route = useRoute();
  const dispatch = useAppDispatch();
  const selectedApplication = useAppSelector(selectSelectedApplication);
  const { application_id, job_id } = route.params as { application_id: string, job_id: string };

  // Fetch all required data on mount
  useEffect(() => {
    dispatch(resetPersonalityScreeningState());
    dispatch(getApplicationDetailRequestAction(application_id));
    dispatch(getApplicationResponsesRequestAction({ application_id, job_id }));
    dispatch(getResumeScreeningResponsesRequestAction(application_id));
    dispatch(getAssessmentLogsRequestAction(application_id));
    dispatch(getPersonalityScreeningListRequestAction({ application_id, job_id }));
  }, [application_id, job_id, dispatch]);

  // Get resume URL from selected application
  const resumeUrl = selectedApplication?.resume?.resume_file || null;
  const candidateName = selectedApplication?.candidate?.name || 'Candidate';
  const application = useAppSelector(selectSelectedApplication);
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
      application.resume.ai_summary_json||
      application?.resume?.work_experience ||
      application?.resume?.projects || 
      application?.resume?.education ||
      application?.resume?.certifications
    )
  );

  // Dynamic tabs based on available data - permanent fix
  const tabs = useMemo(() => {
    const baseTabs = ['Profile Info'];

    if (hasResumeScreening) {
      baseTabs.push('Resume Screening');
    }
    
    if (hasAssessments) {
      baseTabs.push('Assessments');
    }
    
    if (hasVideoInterview) {
      baseTabs.push('Automated Video Interview');
    }
    
    return baseTabs;
  }, [hasAssessments, hasVideoInterview,hasResumeScreening]);

  // Ensure activeTab is valid when tabs change
  useEffect(() => {
    if (!tabs.includes(activeTab)) {
      setActiveTab(tabs[0] || 'Profile Info');
    }
  }, [tabs, activeTab]);

  const renderTab = () => {
    switch (activeTab) {
      case 'Profile Info':
        return <ProfileInfo />;
      case 'Resume Screening':
        return hasResumeScreening && <ResumeScreening />;
      case 'Assessments':
        return hasAssessments ? <Assessment /> : null;
      case 'Automated Video Interview':
        return hasVideoInterview ? <VideoInterview /> : null;
      default:
        return <></>;
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
        <Header backNavigation={true} onBack={() => goBack()} threedot={true} />
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} bounces={false}>
          <View style={styles.subContainer}>
            <ProfileCart />
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

