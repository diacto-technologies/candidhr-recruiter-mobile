import React from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Typography from "../typography";
import { colors } from "../../../theme/colors";

interface RingProps {
  percent: number;       // 0–100
  size?: number;
  strokeWidth?: number;
  showText?: boolean;
  rotation?: number;     // NEW → Pass rotation
}

const Ring: React.FC<RingProps> = ({
  percent,
  size = 80,
  strokeWidth = 7,
  showText = false,
  rotation = -90,        // default same as before
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (percent / 100) * circumference;

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

        {/* Progress Ring */}
        <Circle
          stroke={colors.brand[600]}
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          rotation={rotation}            // ← rotation passed here
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
          <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>{percent}%</Typography>
        </View>
      )}
    </View>
  );
};

export default Ring;
