import React from 'react'
import { BackHandler } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import CustomTabBar from './customtabbar';
import Dashboard from '../screens/applications/dashboard';
import JobsScreen from '../screens/applications/jobs';
import ApplicantScreen from '../screens/applications/applicant';
import Profile from '../screens/applications/profile';
import { navigationRef } from '../utils/navigationUtils';

const Tab = createBottomTabNavigator();

const UserBottomTab: React.FC = () => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        const currentRoute = navigationRef.getCurrentRoute()?.name;
        // When on the root tab (Dashboard), exit the app cleanly
        if (!currentRoute || currentRoute === 'Dashboard') {
          BackHandler.exitApp();
          return true;
        }
        // For other tabs (JobsScreen, ApplicantScreen, Profile), allow default backBehavior to return to Dashboard
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  return (
    <Tab.Navigator
      backBehavior="initialRoute"
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true
      }}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="JobsScreen" component={JobsScreen} />
      <Tab.Screen name="ApplicantScreen" component={ApplicantScreen} />
      <Tab.Screen name="Profile" component={Profile} options={{ tabBarStyle: { display: 'none' } }} />
    </Tab.Navigator>
  )
}

export default UserBottomTab