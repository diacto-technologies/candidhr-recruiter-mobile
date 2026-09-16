import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

export interface BarItem {
    value: number;
    actualValue: number;
    label: string;
    frontColor: string;
    gradientColor?: string;
    topLabelComponent?: () => ReactNode;
    barStyle?: ViewStyle;
}

export interface stageDataInterface {
    resume_screening: number;
    assessment_test: number;
    video_interview: number;
    rejected: number;
    on_hold: number;
    hired: number;
    scheduled_final_interview: number;
}

export interface ApplicationStageChartProps {
    stageData: stageDataInterface | null;
    loading: boolean;
}
