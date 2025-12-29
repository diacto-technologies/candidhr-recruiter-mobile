import { stackDataItem } from "react-native-gifted-charts";
import { colors } from "../../../theme/colors";
import { BarItem, stageDataInterface } from "./applicationstagechart";

export const buildBarData = (stageData: stageDataInterface | null): BarItem[] => {
  return [
    {
      value: stageData?.resume_screening ?? 0,
      label: "Resume\nscreening",
      frontColor: colors.brand[500],
      gradientColor: colors.brand[600],
    },
    {
      value: stageData?.assessment_test ?? 0,
      label: "Assessment",
      frontColor: colors.brand[500],
      gradientColor: colors.brand[600],
    },
    {
      value: stageData?.video_interview ?? 0,
      label: "Video\ninterview",
      frontColor: colors.brand[500],
      gradientColor: colors.brand[600],
    },
    {
      value: stageData?.rejected ?? 0,
      label: "Rejected",
      frontColor: colors.gray[100],
      gradientColor: colors.gray[200],
    },
    {
      value: stageData?.on_hold ?? 0,
      label: "On hold",
      frontColor: colors.gray[100],
      gradientColor: colors.gray[200],
    },
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
