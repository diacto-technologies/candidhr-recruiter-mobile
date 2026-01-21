import { stackDataItem } from "react-native-gifted-charts";
import { colors } from "../../../theme/colors";
import { BarItem, stageDataInterface } from "./applicationstagechart";

export const buildBarData = (
  stageData: stageDataInterface | null,
  selectedIndex: number
): BarItem[] => {
  const defaultFront = colors.gradients.brand.g600_500[1];
  const defaultGradient = colors.gradients.brand.g600_500[0];

  const activeFront =  colors.gradients.brand.g600_500[1];
  const activeGradient = colors.gradients.brand.g600_500[0];

  const makeBar = (value: number, label: string, index: number): BarItem => ({
    value,
    label,
    frontColor: selectedIndex === index ? activeFront : defaultFront,
    gradientColor: selectedIndex === index ? activeGradient : defaultGradient,
  });

  return [
    makeBar(stageData?.resume_screening ?? 0, "Resume\nscreening", 0),
    makeBar(stageData?.assessment_test ?? 0, "Assessment", 1),
    makeBar(stageData?.video_interview ?? 0, "Video\ninterview", 2),
    makeBar(stageData?.rejected ?? 0, "Rejected", 3),
    makeBar(stageData?.on_hold ?? 0, "On hold", 4),
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
