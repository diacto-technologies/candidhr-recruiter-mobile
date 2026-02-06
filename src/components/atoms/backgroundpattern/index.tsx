import React from 'react';
import { View, StyleSheet, Image, ImageBackground, ViewStyle } from 'react-native';
type Props = {
  children: React.ReactNode;
  bgStyle?: ViewStyle
  containerStyle?: ViewStyle;
};

const BackgroundPattern: React.FC<Props> = ({ children, bgStyle,
  containerStyle}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {/* Background Image */}
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={[styles.bg, bgStyle]}
        resizeMode="contain"
      />

      {/* Screen Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

export default BackgroundPattern;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '60%',
    zIndex:10
  },
  content: {
    flex: 1,
  },
});
