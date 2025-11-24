import { View, Text } from 'react-native'
import React, { FC } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { navigationRef } from '../utils/navigationUtils'
import LoginScreen from '../screens/auth/loginscreen'
import SplashScreen from '../screens/auth/splashscreen'
import UserBottomTab from './bottomtabs'
import JobDetailScreen from '../screens/applications/jobs/jobdetailscreen'

const Stack= createNativeStackNavigator()
const Navigation:FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName='UserBottomTab' screenOptions={{headerShown:false}}>
            <Stack.Screen  name='SplashScreen' component={SplashScreen}/>
            <Stack.Screen  name='LoginScreen' component={LoginScreen} options={{animation:'fade'}}/>
            <Stack.Screen  name='JobDetailScreen' component={JobDetailScreen} options={{animation:'fade'}}/>
            <Stack.Screen  name='UserBottomTab' component={UserBottomTab} options={{animation:'fade'}}/>
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation