import { colors } from "../../../theme/colors"
import { BarItem, featureData } from "./featureconsumptionchart"

export const buildBarData = (featureData: featureData | null): BarItem[] => {
    return[
    {
        value: featureData?.resume_screening?.total_resumes_parsed ?? 0,
        label: 'Resume\nscreening',
        frontColor: colors.gray[100],
        gradientColor: colors.gray[200],
    },
    {
        value: featureData?.assessment?.total_count ?? 0,
        label: 'Assessment',
        frontColor: colors.brand[500],
        gradientColor: colors.brand[600],
    },
    {
        value: featureData?.video_interview?.total_count ?? 0,
        label: 'Video\ninterview',
        frontColor: colors.gray[100],
        gradientColor: colors.gray[200],
    },
]
}

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

