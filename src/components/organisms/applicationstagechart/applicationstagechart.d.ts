export interface BarItem {
    value: number;
    label: string;
    frontColor: string;
    gradientColor?: string;
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