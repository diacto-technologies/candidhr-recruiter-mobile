import { View, Text, ViewStyle, StyleSheet } from 'react-native'
import React, { FC, ReactNode } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../../theme/colors'
import StatusBarBackground from '../statusbar'

interface CustomSafeAreaViewProps {
  children: ReactNode,
  style?: ViewStyle
}

const CustomSafeAreaView: FC<CustomSafeAreaViewProps> = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.container, style]} edges={['top']}>
      <StatusBarBackground showWhite />
      <View style={[styles.container, style]}>
        {children}
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base.white
  }
})
export default CustomSafeAreaView