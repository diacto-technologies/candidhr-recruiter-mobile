// Navigation type definitions
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  'auth/splash': undefined;
  'auth/login': undefined;
  'app/dashboard': undefined;
  'app/jobs': undefined;
  'app/applicants': undefined;
  'app/profile': undefined;
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

