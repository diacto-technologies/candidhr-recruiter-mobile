import React, { useEffect, useRef } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import CustomTabBar from './customtabbar';
import Dashboard from '../screens/applications/dashboard';
import JobsScreen from '../screens/applications/jobs';
import ApplicantScreen from '../screens/applications/applicant';
import Profile from '../screens/applications/profile';
import { PERMISSIONS } from '../utils/permission.constants';
import { usePermission } from '../hooks/usePermission';
const Tab = createBottomTabNavigator();

const UserBottomTab: React.FC = () => {
  const { can } = usePermission();
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true
      }}
    >
      {/* {can(PERMISSIONS.VIEW_DASHBOARD) && ( */}
        <Tab.Screen name="Dashboard" component={Dashboard} />
      {/* )} */}
      <Tab.Screen name="JobsScreen" component={JobsScreen} />
      <Tab.Screen name="ApplicantScreen" component={ApplicantScreen} />
      <Tab.Screen name="Profile" component={Profile} options={{ tabBarStyle: { display: 'none' } }} />
    </Tab.Navigator>
  )
}

export default UserBottomTab