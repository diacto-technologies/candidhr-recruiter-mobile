import React, { Fragment } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';

import {
  AppHeader,
  ResumeModal,
  Typography,
  Button,
  FloatingActionButton,
} from '../../../components';
import ProfileCard from '../../../components/organisms/profile';
import SlideAnimatedTab from '../../../components/molecules/slideanimatedtab';
import FooterButtons from '../../../components/molecules/footerbuttons';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import StatusDropdown from '../../../components/organisms/dropdown/statusDropdown';

import { goBack, navigate } from '../../../utils/navigationUtils';
import { colors } from '../../../theme/colors';
import { telePhoneIcon } from '../../../assets/svg/telephone';
import { fileIcon } from '../../../assets/svg/file';
import { commentIcon } from '../../../assets/svg/comments';
import { permissionDeniedIcon } from '../../../assets/svg/permissionDenied';
import { backButtonIcon } from '../../../assets/svg/backbutton';

import { STATUS_OPTIONS } from './config';
import { useStyles } from './styles';
import { useApplicantDetailsController } from './hooks/useApplicantDetailsController';
import { HtmlPreviewModal } from './components/HtmlPreviewModal';

// Tabs
import Assessment from './tabs/assessment';
import AssessmentV2 from './tabs/assessmentv2';
import ProfileInfo from './tabs/profileinfo';
import ResumeScreening from './tabs/resumescreening';
import VideoInterview from './tabs/videointerview';

export default function ApplicantDetails() {
  const route = useRoute();
  const { application_id, job_id, tab } = route.params as { application_id: string; job_id: string; tab: string };
  
  const styles = useStyles();
  const ctrl = useApplicantDetailsController(application_id, job_id, tab || 'Profile Info');

  const renderTabPanel = (tabName: string) => {
    switch (tabName) {
      case 'Profile Info':
        return <ProfileInfo />;
      case 'Resume Screening':
        return <ResumeScreening />;
      case 'Assessments':
        return (
          <Assessment
            sessionContentId={ctrl.assessmentSessionContentId}
            onSessionContentIdChange={ctrl.setAssessmentSessionContentId}
          />
        );
      case 'Assessment V2':
        return (
          <AssessmentV2
            sessionContentId={ctrl.assessmentV2SessionContentId}
            onSessionContentIdChange={ctrl.setAssessmentV2SessionContentId}
            selectedAssignmentId={ctrl.assessmentV2SelectedAssignmentId}
            onSelectedAssignmentIdChange={ctrl.setAssessmentV2SelectedAssignmentId}
          />
        );
      case 'Automated Video Interview':
        return (
          <VideoInterview
            sessionContentId={ctrl.videoInterviewSessionContentId}
            onSessionContentIdChange={ctrl.setVideoInterviewSessionContentId}
          />
        );
      default:
        return <View />;
    }
  };

  return (
    <Fragment>
      <CustomSafeAreaView>
        <AppHeader
          left={
            <Pressable onPress={goBack} style={{ padding: 8, marginLeft: -8 }}>
              <SvgXml xml={backButtonIcon} />
            </Pressable>
          }
          right={
            ctrl.canUpdateStatus ? (
              <View style={{ minWidth: 180, maxWidth: 200 }}>
                <StatusDropdown
                  label="Status"
                  options={STATUS_OPTIONS}
                  labelKey="name"
                  valueKey="id"
                  setValue={ctrl.application?.status?.value ?? ''}
                  onSelect={(item) => ctrl.handleUpdateStatus(item.id)}
                  compact
                  openModalOnSelect={true}
                  changeStatusModalProps={{
                    applicantName: ctrl.candidateName,
                    currentStatus: ctrl.application?.status?.value ?? null,
                    newStatusOptions: STATUS_OPTIONS,
                    onUpdateStatus: ctrl.handleUpdateStatus,
                    hideAddReason: true,
                    initialEmailMessage:
                      'Hi {{candidate_name}},\n\nYour application status has been updated to "{{application_status}}".\n\nThanks,\n{{company}}',
                  }}
                />
              </View>
            ) : null
          }
        />

        {ctrl.application || ctrl.loading ? (
          <>
            <ScrollView
              style={styles.scrollViewContainer}
              showsVerticalScrollIndicator={false}
              bounces={false}
              nestedScrollEnabled
              removeClippedSubviews={false}
            >
              <View style={styles.subContainer}>
                <ProfileCard
                  application={ctrl.application}
                  loading={ctrl.loading}
                  onPressPreview={ctrl.handlePreviewHtml}
                  onPressExport={ctrl.handleDownloadHtmlPreview}
                />
                
                <View style={styles.tabContainer}>
                  <SlideAnimatedTab
                    tabs={ctrl.tabs}
                    activeTab={ctrl.activeTab}
                    onChangeTab={ctrl.setActiveTab}
                  />
                  <View style={styles.bottomBorder} />
                </View>

                <View style={styles.tabContentContainer}>
                  <View key={ctrl.activeTab} collapsable={false} style={styles.tabContentWrapper}>
                    {renderTabPanel(ctrl.activeTab)}
                  </View>
                </View>
              </View>
            </ScrollView>

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

            <View>
              {ctrl.canExportProfile && (
                <FooterButtons
                  leftButtonProps={{
                    children: 'View resume',
                    variant: 'contain',
                    size: 44,
                    buttonColor: colors.base.white,
                    textColor: colors.gray[700],
                    borderColor: colors.gray[300],
                    borderWidth: 1,
                    borderRadius: 8,
                    borderGradientOpacity: 0.25,
                    shadowColor: colors.gray[700],
                    onPress: ctrl.handleViewResume,
                    startIcon: <SvgXml xml={fileIcon} />,
                    disabled: !ctrl.resumeUrl,
                  }}
                  rightButtonProps={{
                    children: 'call',
                    variant: 'contain',
                    size: 44,
                    borderWidth: 1,
                    buttonColor: colors.brand[600],
                    textColor: colors.base.white,
                    borderColor: colors.base.white,
                    borderRadius: 8,
                    onPress: () => ctrl.handleCall(ctrl.application?.applicant?.contact ?? ''),
                    startIcon: <SvgXml xml={telePhoneIcon} />,
                  }}
                />
              )}
            </View>
          </>
        ) : (
          <View style={styles.errorContainer}>
            <SvgXml xml={permissionDeniedIcon} style={styles.errorIcon} color={colors.brand[600]} />
            <Typography variant="semiBoldTxtsm" color={colors.gray[600]} style={styles.errorText}>
              {ctrl.selectApplicationError}
            </Typography>
          </View>
        )}
      </CustomSafeAreaView>

      <HtmlPreviewModal
        visible={ctrl.htmlPreviewVisible}
        htmlPreview={ctrl.htmlPreview}
        mountKey={ctrl.htmlPreviewMountKey}
        onClose={() => ctrl.setHtmlPreviewVisible(false)}
        onError={(msg) => console.error(msg)}
      />

      <ResumeModal
        visible={ctrl.resumeModalVisible}
        resumeUrl={ctrl.resumeUrl}
        onClose={() => ctrl.setResumeModalVisible(false)}
        candidateName={ctrl.candidateName}
      />
    </Fragment>
  );
}
