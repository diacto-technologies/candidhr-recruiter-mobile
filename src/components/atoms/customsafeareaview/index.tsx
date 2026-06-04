import React, { FC } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarBackground from '../statusbar';
import { CustomSafeAreaViewProps } from './customsafeareaview.d';
import { useStyles } from './styles';

const CustomSafeAreaView: FC<CustomSafeAreaViewProps> = ({ children, style }) => {
  const styles = useStyles();

  return (
    <SafeAreaView style={[styles.container, style]} edges={['top']}>
      <StatusBarBackground showWhite />
      <View style={[styles.container, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default CustomSafeAreaView;