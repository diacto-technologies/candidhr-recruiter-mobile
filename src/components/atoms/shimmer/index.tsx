import React, { useRef, useEffect } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ShimmerProps } from './shimmer.d';
import { useStyles } from './styles';

const Shimmer: React.FC<ShimmerProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const shimmerAnimated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerLoop = Animated.loop(
      Animated.timing(shimmerAnimated, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    );
    shimmerLoop.start();

    return () => {
      shimmerLoop.stop();
    };
  }, [shimmerAnimated]);

  const translateX = shimmerAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const styles = useStyles(width, height, borderRadius);

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.animatedContainer, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={['#E0E0E0', '#F5F5F5', '#E0E0E0']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

export default Shimmer;

