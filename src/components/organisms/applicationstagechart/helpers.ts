import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";
import { colors } from "../../../theme/colors";
import { BarItem, stageDataInterface } from "./applicationstagechart";
import { formatCompactNumber } from "../../../utils/formatCompactNumber";

export const getScaleExponent = (maxVal: number): number => {
  if (maxVal <= 50) return 1;
  return Math.max(0.33, 1 - 0.15 * Math.log10(maxVal / 50));
};

export const scaleBarValue = (val: number, maxVal: number): number => {
  if (val <= 0) return 0;
  const p = getScaleExponent(maxVal);
  return Math.pow(val, p);
};

export const buildBarData = (
  stageData: stageDataInterface | null,
  selectedIndex: number,
  topLabelTextStyle?: StyleProp<TextStyle>
): BarItem[] => {
  const defaultFront = colors.gradients.brand.g600_500[1];
  const defaultGradient = colors.gradients.brand.g600_500[0];

  const activeFront = colors.gradients.brand.g600_500[1];
  const activeGradient = colors.gradients.brand.g600_500[0];

  const rawMax = Math.max(
    stageData?.resume_screening ?? 0,
    stageData?.assessment_test ?? 0,
    stageData?.video_interview ?? 0,
    stageData?.scheduled_final_interview ?? 0,
    stageData?.hired ?? 0,
    stageData?.rejected ?? 0,
    stageData?.on_hold ?? 0
  );

  const makeBar = (count: number, label: string, index: number): BarItem => {
    const scaledVal = scaleBarValue(count, rawMax);
    return {
      value: scaledVal,
      actualValue: count,
      label,
      frontColor: selectedIndex === index ? activeFront : defaultFront,
      gradientColor: selectedIndex === index ? activeGradient : defaultGradient,
      barStyle: count === 0 ? { opacity: 0 } : undefined,
      topLabelComponent: () =>
        React.createElement(
          Text,
          { style: topLabelTextStyle },
          formatCompactNumber(count, { threshold: 10000 })
        ),
    };
  };

  return [
    makeBar(stageData?.resume_screening ?? 0, "Resume\nscreening", 0),
    makeBar(stageData?.assessment_test ?? 0, "Assessment", 1),
    makeBar(stageData?.video_interview ?? 0, "Video\ninterview", 2),
    makeBar(stageData?.rejected ?? 0, "Rejected", 3),
    makeBar(stageData?.on_hold ?? 0, "On hold", 4),
    makeBar(stageData?.hired ?? 0, "Hired", 5),
    makeBar(stageData?.scheduled_final_interview ?? 0, "Final\nRound", 6),
  ];
};


export const getMaxValueFromStageData = (stageData: any): number => {
  const maxVal = Math.max(
    stageData?.resume_screening ?? 0,
    stageData?.assessment_test ?? 0,
    stageData?.video_interview ?? 0,
    stageData?.scheduled_final_interview ?? 0,
    stageData?.hired ?? 0,
    stageData?.rejected ?? 0,
    stageData?.on_hold ?? 0
  );

  if (maxVal === 0) return 25;
  const maxScaled = scaleBarValue(maxVal, maxVal);
  return Math.ceil(maxScaled * 1.25);
};
