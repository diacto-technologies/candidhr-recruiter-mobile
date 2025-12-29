export interface BarItem {
    value: number;
    label: string;
    frontColor: string;
    gradientColor?: string;
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