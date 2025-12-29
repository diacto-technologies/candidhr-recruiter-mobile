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

  // ✅ Static calculation (no animation)
  const strokeDashoffset =
    circumference - (percent / 100) * circumference;

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
          strokeDashoffset={strokeDashoffset}
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
