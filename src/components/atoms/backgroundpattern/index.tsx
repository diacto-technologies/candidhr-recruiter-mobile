import React from 'react';
import { View, StyleSheet, Image, ImageBackground } from 'react-native';

type Props = {
  children: React.ReactNode;
};

const BackgroundPattern: React.FC<Props> = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* Background Image */}
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={styles.bg}
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
