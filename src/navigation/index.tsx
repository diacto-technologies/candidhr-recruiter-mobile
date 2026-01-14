import { View, Text } from 'react-native'
import React, { FC } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { navigationRef } from '../utils/navigationUtils'
import LoginScreen from '../screens/auth/loginscreen'
import SplashScreen from '../screens/auth/splashscreen'
import UserBottomTab from './bottomtabs'
import JobDetailScreen from '../screens/applications/jobs/jobdetailscreen'
import ApplicantDetails from '../screens/applications/applicant/applicantDetails'
import GetStartedScreen from '../screens/applications/onboarding/getstartedscreen'
import ForgetPasswordScreen from '../screens/auth/forgetpassword'
import ContactUsScreen from '../screens/auth/contactus'
import CheckMailScreen from '../screens/auth/checkmail'
import CreateNewPasswordScreen from '../screens/auth/createnewpassword'
import ApplicationOverviewDetails from '../screens/applications/dashboard/ApplicationStageOverviewDetails'
import linking from './linking'
import OrgnizationalSwitch from '../screens/auth/orgnizationalswitch'

const Stack= createNativeStackNavigator()
const Navigation:FC = () => {
  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{ headerShown: false }}>
        <Stack.Screen name='SplashScreen' component={SplashScreen} />
        <Stack.Screen name='OrgnizationalSwitch' component={OrgnizationalSwitch} options={{ animation: 'fade', statusBarStyle: 'dark' }} />
        <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ animation: 'fade', statusBarStyle: 'dark' }} />
        <Stack.Screen name='ForgetPasswordScreen' component={ForgetPasswordScreen} options={{ animation: 'fade', statusBarStyle: 'dark' }} />
        <Stack.Screen name='JobDetailScreen' component={JobDetailScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name='UserBottomTab' component={UserBottomTab} options={{ animation: 'fade', statusBarStyle: 'dark' }} />
        <Stack.Screen name='ApplicantDetails' component={ApplicantDetails} options={{ animation: 'fade' }} />
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
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation