import { View, Text, Linking } from 'react-native'
import React, { FC, useEffect } from 'react'
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { navigationRef } from '../utils/navigationUtils'
import LoginScreen from '../screens/auth/loginscreen'
import SplashScreen from '../screens/auth/splashscreen'
import UserBottomTab from './bottomtabs'
import ApplicantDetails from '../screens/applications/applicantdetails'
import GetStartedScreen from '../screens/applications/onboarding/getstartedscreen'
import ForgetPasswordScreen from '../screens/auth/forgetpassword'
import ContactUsScreen from '../screens/auth/contactus'
import CheckMailScreen from '../screens/auth/checkmail'
import CreateNewPasswordScreen from '../screens/auth/createnewpassword'
import AccountInfo from '../screens/applications/profile/accountinfo'
import CompanyInfo from '../screens/applications/profile/companyinfo'
import Users from '../screens/applications/profile/users'
import linking from './linking'
import OrgnizationalSwitch from '../screens/auth/orgnizationalswitch'
import { useTheme } from '../hooks/useTheme'
import JobDetailScreen from '../screens/applications/jobdetails'
import ApplicationStageOverview from '../components/organisms/applicationstageoverview'
import ApplicationOverviewDetails from '../screens/applications/applicationstageoverviewdetails'
import AssessmentScreen from '../screens/applications/services/assessment'
import VideoInterviewScreen from '../screens/applications/services/videoInterview'
import CommentsScreen from '../screens/applications/comments'
import OldAssessmentList from '../screens/applications/services/assessment/oldassessmentList'
import AssessmentTestList from '../screens/applications/services/assessment/assessmentTestList'
import AssessmentList from '../screens/applications/services/assessment/assessmentList'
import AssessmentOverView from '../screens/applications/services/assessment/assessmentoverview'
import CandidateAssignmentsDeatilsTable from '../screens/applications/services/assessment/candidateassignmentsdetailstable'
import CreateAssessmentTest from '../screens/applications/services/assessment/createassessmenttest'
import CreateTestWith from '../screens/applications/services/assessment/createtestwith'
import CreateTestType from '../screens/applications/services/assessment/createtesttype'
import CreateTestQuestion from '../screens/applications/services/assessment/createtestquestion'
import CodingTestQuestion from '../screens/applications/services/assessment/codingtestquestion'
import AiTestQuestion from '../screens/applications/services/assessment/aitestquestion'
import ExcelTestUpload from '../screens/applications/services/assessment/exceltestupload'
import TestDetails from '../screens/applications/services/assessment/testdetails'
import AiCodingTestQuestion from '../screens/applications/services/assessment/aicodingtestquestion'
import BasicInfo from '../screens/applications/services/assessment/createassessment/basicinfo'
import Section from '../screens/applications/services/assessment/createassessment/section'
import Instruction from '../screens/applications/services/assessment/createassessment/instruction'
import Proctoring from '../screens/applications/services/assessment/createassessment/proctoring'
import jobdetails from '../screens/applications/jobs/ jobCreate/jobdetails'
import ApplicationForm from '../screens/applications/jobs/ jobCreate/applicationform'
import TeamMembers from '../screens/applications/jobs/ jobCreate/TeamMembers'

const Stack = createNativeStackNavigator()
const Navigation: FC = () => {
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

  useEffect(() => {
    Linking.getInitialURL().then(url => {
      console.log('Initial URL:', url);
    });

    const sub = Linking.addEventListener('url', ({ url }) => {
      console.log('Incoming URL:', url);
    });

    return () => sub.remove();
  }, []);


  return (
    <NavigationContainer ref={navigationRef} linking={linking} theme={navigationTheme}>
      <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{ headerShown: false }}>
        <Stack.Screen name='SplashScreen' component={SplashScreen} />
        <Stack.Screen name='OrgnizationalSwitch' component={OrgnizationalSwitch} options={{ animation: 'fade', statusBarStyle: 'dark' }} />
        <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ animation: 'fade', statusBarStyle: 'dark' }} />
        <Stack.Screen name='ForgetPasswordScreen' component={ForgetPasswordScreen} options={{ animation: 'fade', statusBarStyle: 'dark' }} />
        <Stack.Screen name='JobDetailScreen' component={JobDetailScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name='UserBottomTab' component={UserBottomTab} options={{ animation: 'fade', statusBarStyle: 'dark' }} />
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
        <Stack.Screen name='AssessmentScreen' component={AssessmentScreen} options={{ animation: 'fade', statusBarStyle: 'dark' }} />
        <Stack.Screen name='VideoInterviewScreen' component={VideoInterviewScreen} options={{ animation: 'fade', statusBarStyle: 'dark' }} />
        <Stack.Screen name="OldAssessmentList" component={OldAssessmentList}/>
         <Stack.Screen name="AssessmentTestList" component={AssessmentTestList} />
         <Stack.Screen name="AssessmentList" component={AssessmentList}/>
         <Stack.Screen name="AssessmentOverView" component={AssessmentOverView}/>
        <Stack.Screen name="CandidateAssignmentsDeatilsTable" component={CandidateAssignmentsDeatilsTable}/>
        <Stack.Screen name="CreateAssessmentTest" component={CreateAssessmentTest}/>
        <Stack.Screen name="CreateTestType" component={CreateTestType}  options={{ animation: 'none', statusBarStyle: 'dark' }}/>
        <Stack.Screen name="CreateTestWith" component={CreateTestWith}  options={{ animation: 'none', statusBarStyle: 'dark' }}/>
        <Stack.Screen name="CreateTestQuestion" component={CreateTestQuestion}/>
        <Stack.Screen name="CodingTestQuestion" component={CodingTestQuestion}/>
        <Stack.Screen name="AiTestQuestion" component={AiTestQuestion}/>
        <Stack.Screen name="ExcelTestUpload" component={ExcelTestUpload}/>
        <Stack.Screen name="TestDetails" component={TestDetails}/>
        <Stack.Screen name="AiCodingTestQuestion" component={AiCodingTestQuestion}/>
        <Stack.Screen name="BasicInfo" component={BasicInfo}/>
        <Stack.Screen name="Section" component={Section}/>
        <Stack.Screen name="Instruction" component={Instruction}/>
        <Stack.Screen name="Proctoring" component={Proctoring}/>
        <Stack.Screen name="jobdetails" component={jobdetails}/>
        <Stack.Screen name="ApplicationForm" component={ApplicationForm} />
        <Stack.Screen name="TeamMembers" component={TeamMembers} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation