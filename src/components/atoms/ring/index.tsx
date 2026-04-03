import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Typography from "../typography";
import { colors } from "../../../theme/colors";
import React = require("react");

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface RingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  showText?: boolean;
  rotation?: number;
}

const Ring: React.FC<RingProps> = ({
  percent,
  size = 80,
  strokeWidth = 7,
  showText = false,
  rotation = -90,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withTiming(percent, {
      duration: 1000,
      easing: Easing.out(Easing.ease),
    });
  }, [percent]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset =
      circumference - (progress.value / 100) * circumference;

    return {
      strokeDashoffset,
    };
  });

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Svg width={size} height={size}>
        {/* Background Ring */}
        <Circle
          stroke={colors.gray[200]}
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
        />

        {/* Animated Progress Ring */}
        <AnimatedCircle
          stroke={colors.brand[600]}
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation={rotation}
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>

      {showText && (
        <View
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
            {percent}%
          </Typography>
        </View>
      )}
    </View>
  );
};

export default Ring;