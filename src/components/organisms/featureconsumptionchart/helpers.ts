import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { colors } from "../../../theme/colors"
import { BarItem, featureData } from "./featureconsumptionchart"
import { formatCompactNumber } from "../../../utils/formatCompactNumber"

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
  featureData: featureData | null,
  selectedIndex: number,
  topLabelTextStyle?: StyleProp<TextStyle>
): BarItem[] => {
  const active = colors.gradients.brand.g600_500;
  const inactive = colors.gradients.brand.g600_500;

  const rawMax = Math.max(
    featureData?.resume_screening?.total_resumes_parsed ?? 0,
    featureData?.assessment?.total_count ?? 0,
    featureData?.video_interview?.total_count ?? 0
  );

  const makeBar = (count: number, label: string, index: number): BarItem => {
    const isActive = selectedIndex === index;
    const scaledVal = scaleBarValue(count, rawMax);

    return {
      value: scaledVal,
      actualValue: count,
      label,
      frontColor: isActive ? active[1] : inactive[0],
      gradientColor: isActive ? active[0] : inactive[1],
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
    makeBar(
      featureData?.resume_screening?.total_resumes_parsed ?? 0,
      'Resume\nscreening',
      0
    ),
    makeBar(featureData?.assessment?.total_count ?? 0, 'Assessment', 1),
    makeBar(
      featureData?.video_interview?.total_count ?? 0,
      'Video\ninterview',
      2
    ),
  ];
};




export const getMaxValueFromStageData = (stageData: any): number => {
  return (
    Math.max(
      stageData?.resume_screening ?? 0,
      stageData?.assessment_test ?? 0,
      stageData?.video_interview ?? 0,
      stageData?.rejected ?? 0,
      stageData?.on_hold ?? 0
    ) + 25
  );
};

