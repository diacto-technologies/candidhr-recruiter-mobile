// Navigation type definitions
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  // Legacy paths for compatibility
  'auth/splash': undefined;
  'auth/login': undefined;
  'app/dashboard': undefined;
  'app/jobs': undefined;
  'app/applicants': undefined;
  'app/profile': undefined;

  // Actual Stack Screens
  SplashScreen: undefined;
  OrgnizationalSwitch: undefined;
  LoginScreen: undefined;
  ForgetPasswordScreen: undefined;
  JobDetailScreen: { jobId: string; org?: string };
  UserBottomTab: NavigatorScreenParams<TabParamList> | undefined;
  ApplicantDetails: {
    application_id?: string;
    applicantId?: string;
    job_id?: string;
    tab?: string;
  };
  Comments: undefined;
  GetStartedScreen: undefined;
  ContactUsScreen: undefined;
  CheckMailScreen: undefined;
  CreateNewPasswordScreen: undefined;
  ApplicationOverviewDetails: undefined;
  AccountInfo: undefined;
  CompanyInfo: undefined;
  Users: undefined;
  BrandingScreen: undefined;
  AssessmentScreen: undefined;
  VideoInterviewScreen: undefined;
  OldAssessmentList: undefined;
  AssessmentTestList: undefined;
  AssessmentList: undefined;
  AssessmentOverView: undefined;
  CandidateAssignmentsDeatilsTable: undefined;
  TalentSearchScreen: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  JobsScreen: undefined;
  ApplicantScreen: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}


