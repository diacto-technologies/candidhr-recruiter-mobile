export interface ApplicationStageOverviewProps {
    overview: {
        results?: TableRow[];
    } | null;
    loading: boolean;
    onViewMore?: () => void;
}

export interface TableRow {
    job_name: string;
    total_applicants: number;
    close_date: string;
    is_closed: boolean;

    stages: {
        resume_screening: number;
        assessment_test: number;
        video_interview: number;
        hired: number;
        reject: number;
        on_hold: number;
    };
}