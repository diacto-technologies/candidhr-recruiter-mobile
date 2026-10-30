import { View, Text, Linking, AppState, type AppStateStatus } from 'react-native'
import React, { FC, useEffect } from 'react'
import { useTokenRefresh } from '../hooks/useTokenRefresh'
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { navigationRef, navigate } from '../utils/navigationUtils'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectIsAuthenticated } from '../features/auth/selectors'
import { getProfileRequestAction } from '../features/profile/actions'
import { getBrandingRequestAction } from '../features/branding/actions'
import LoginScreen from '../screens/auth/loginscreen'
import SplashScreen from '../screens/auth/splashscreen'
import UserBottomTab from './bottomtabs'
import ApplicantDetails from '../screens/applications/applicantdetails'
import GetStartedScreen from '../screens/applications/onboarding/getstartedscreen'
import ForgetPasswordScreen from '../screens/auth/forgetpassword'
import ContactUsScreen from '../screens/auth/contactus'
import CheckMailScreen from '../screens/auth/checkmail'
import CreateNewPasswordScreen from '../screens/auth/createnewpassword'
import AccountInfo from '../screens/applications/profile/tabs/accountinfo';
import CompanyInfo from '../screens/applications/profile/tabs/companyinfo';
import Users from '../screens/applications/profile/tabs/users';
import BrandingScreen from '../screens/applications/profile/tabs/branding';
import linking, { parseDeepLinkUrl } from './linking'
import OrgnizationalSwitch from '../screens/auth/orgnizationalswitch'
import { useTheme } from '../hooks/useTheme'
import { useBrandTheme } from '../hooks/useBrandTheme'
import JobDetailScreen from '../screens/applications/jobdetails'
import ApplicationStageOverview from '../components/organisms/applicationstageoverview'
import ApplicationOverviewDetails from '../components/organisms/ApplicationStageOverviewDetails';
import AssessmentScreen from '../screens/applications/services/assessment'
import VideoInterviewScreen from '../screens/applications/services/videoInterview'
import CommentsScreen from '../screens/applications/comments'
import OldAssessmentList from '../screens/applications/services/assessment/oldassessmentList'
import AssessmentTestList from '../screens/applications/services/assessment/assessmentTestList'
import AssessmentList from '../screens/applications/services/assessment/assessmentList'
import AssessmentOverView from '../screens/applications/services/assessment/assessmentoverview'
import CandidateAssignmentsDeatilsTable from '../components/organisms/CandidateAssignmentsDetailsTable';
import TalentSearchScreen from '../screens/applications/talentsearch';

const Stack = createNativeStackNavigator()
const Navigation: FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useTokenRefresh();
  useBrandTheme();
  const theme = useTheme();
  const isDarkMode = theme === 'dark';

  const navigationTheme = isDarkMode
    ? {
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        background: '#303030',
        card: '#303030',
      },
    }
    : DefaultTheme;

  // Fetch profile and branding when app starts or reloads while authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getProfileRequestAction());
      dispatch(getBrandingRequestAction());
    }
  }, [isAuthenticated, dispatch]);

  // Re-fetch profile and branding when app returns to foreground
  useEffect(() => {
    const onAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active' && isAuthenticated) {
        dispatch(getProfileRequestAction());
        dispatch(getBrandingRequestAction());
      }
    };

    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    const handleIncomingUrl = (url: string | null) => {
      if (!url) return;
      console.log('Incoming deep link URL:', url);
      const target = parseDeepLinkUrl(url);
      if (target && isAuthenticated) {
        navigate(target.name, target.params);
      }
    };

    Linking.getInitialURL().then(handleIncomingUrl);

    const sub = Linking.addEventListener('url', ({ url }) => {
      handleIncomingUrl(url);
    });

    return () => sub.remove();
  }, [isAuthenticated]);


  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      theme={navigationTheme}
    >
      <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{ headerShown: false }}>
        <Stack.Screen name='SplashScreen' component={SplashScreen} options={{ gestureEnabled: false }} />
        <Stack.Screen name='OrgnizationalSwitch' component={OrgnizationalSwitch} options={{ animation: 'fade', statusBarStyle: 'dark' }} />
        <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ animation: 'fade', statusBarStyle: 'dark' }} />
        <Stack.Screen name='ForgetPasswordScreen' component={ForgetPasswordScreen} options={{ animation: 'fade', statusBarStyle: 'dark' }} />
        <Stack.Screen name='JobDetailScreen' component={JobDetailScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name='UserBottomTab' component={UserBottomTab} options={{ animation: 'fade', statusBarStyle: 'dark', gestureEnabled: false }} />
        <Stack.Screen name='ApplicantDetails' component={ApplicantDetails} options={{ animation: 'fade' }} />
        <Stack.Screen name='Comments' component={CommentsScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name='GetStartedScreen' component={GetStartedScreen} options={{
          animation: 'fade',
          headerShown: false,
          statusBarStyle: 'light',
          statusBarTranslucent: true,
        }} />
        <Stack.Screen name='ContactUsScreen' component={ContactUsScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name='CheckMailScreen' component={CheckMailScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name='CreateNewPasswordScreen' component={CreateNewPasswordScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="ApplicationOverviewDetails" component={ApplicationOverviewDetails} />
        <Stack.Screen name='AccountInfo' component={AccountInfo} options={{ animation: 'fade', statusBarStyle: 'dark' }} />
        <Stack.Screen name='CompanyInfo' component={CompanyInfo} options={{ animation: 'fade', statusBarStyle: 'dark' }} />
        <Stack.Screen name='Users' component={Users} options={{ animation: 'fade', statusBarStyle: 'dark' }} />
        <Stack.Screen name='BrandingScreen' component={BrandingScreen} options={{ animation: 'fade', statusBarStyle: 'dark' }} />
        <Stack.Screen name='AssessmentScreen' component={AssessmentScreen} options={{ animation: 'fade', statusBarStyle: 'dark' }} />
        <Stack.Screen name='VideoInterviewScreen' component={VideoInterviewScreen} options={{ animation: 'fade', statusBarStyle: 'dark' }} />
        <Stack.Screen name="OldAssessmentList" component={OldAssessmentList}/>
         <Stack.Screen name="AssessmentTestList" component={AssessmentTestList}/>
         <Stack.Screen name="AssessmentList" component={AssessmentList}/>
         <Stack.Screen name="AssessmentOverView" component={AssessmentOverView}/>
        <Stack.Screen name="CandidateAssignmentsDeatilsTable" component={CandidateAssignmentsDeatilsTable}/>
        <Stack.Screen name="TalentSearchScreen" component={TalentSearchScreen} options={{ animation: 'fade', statusBarStyle: 'dark' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation