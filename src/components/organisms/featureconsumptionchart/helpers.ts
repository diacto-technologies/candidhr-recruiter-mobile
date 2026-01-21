import { colors } from "../../../theme/colors"
import { BarItem, featureData } from "./featureconsumptionchart"

export const buildBarData = (
  featureData: featureData | null,
  selectedIndex: number
): BarItem[] => {
  const active = colors.gradients.brand.g600_500;
  const inactive = colors.gradients.brand.g600_500;

  const makeBar = (value: number, label: string, index: number): BarItem => {
    const isActive = selectedIndex === index;

    return {
      value,
      label,
      frontColor: isActive ? active[1] : inactive[0],
      gradientColor: isActive ? active[0] : inactive[1],
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

