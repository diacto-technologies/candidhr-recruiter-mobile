import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { navigate, resetAndNavigate } from '../../../utils/navigationUtils'

const SplashScreen = () => {
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate('UserBottomTab')
    }, 3000)
    return () => clearInterval(timeoutId)
  })

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text>SplashScreen</Text>
    </View>
  )
}

export default SplashScreen