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

export interface featureData {
    resume_screening: {
        total_resumes_parsed: number;
        completed_distinct_count: number;
        total_retries: number;
    };
    assessment: {
        total_count: number;
        completed_count: number;
    };
    video_interview: {
        total_count: number;
        completed_count: number;
    };
}

export interface FeatureConsumptionChartProps {
    featureData: FeatureData | null;
    loading: boolean;
}