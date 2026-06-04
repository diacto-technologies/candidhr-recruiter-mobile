import React from 'react';
import { View, ImageBackground } from 'react-native';
import { BackgroundPatternProps } from './backgroundpattern';
import { useStyles } from './styles';

const BackgroundPattern: React.FC<BackgroundPatternProps> = ({
  children,
  bgStyle,
  containerStyle,
}) => {
  const styles = useStyles();

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Background Image */}
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={[styles.bg, bgStyle]}
        resizeMode="none"
      />

      {/* Screen Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

export default BackgroundPattern;

