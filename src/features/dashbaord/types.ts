export interface AnalyticsDetails {
  total_applicants: number;
  total_jobs: number;
  active_applications: number;
  assessment_ratio: number;
  personality_screening_ratio: number;
  close_fill: number;
  closed_jobs_count: number;
  opened_jobs_count: number;
  job_views: number;
  drop_off_rate: number;
  month_over_month: any; // You can type this later
}

export interface AnalyticsState {
  data: AnalyticsDetails | null;
  applicantStageGraph: ApplicantsStageGraph | null;
  featureConsumption:FeatureConsumptionResponse|null;
  loading: boolean;
  error: string | null;
  isLoaded: boolean;
  stageGraphLoading: boolean,
  weeklyGraph: WeeklyGraphItem| null,
  weeklyGraphLoading: boolean,
  stageGraphOverviewLoading:boolean,
  stageGraphOverview:ApplicantsStageGraphOverviewResponse | null;
}

export interface ApplicantsStageGraph {
  results: {
    resume_screening: number;
    assessment_test: number;
    video_interview: number;
    rejected: number;
    on_hold: number;
    hired: number;
    scheduled_final_interview: number;
  };
}

export interface FeatureConsumptionResponse {
  results: {
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
  };
}

export interface WeeklyGraphItem {
  weeks: string[];
  data: number[];
  start_dates: string[];
}

export interface WeeklyGraphResponse {
  results: {
    applications_received: WeeklyGraphItem;
    assessments: WeeklyGraphItem;
    video_interviews: WeeklyGraphItem;
  };
}


export interface StageCounts {
  resume_screening: number;
  video_interview: number;
  assessment_test: number;
  hired: number;
  reject: number;
  on_hold: number;
}

export interface ApplicantsStageGraphOverviewItem {
  job_name: string;
  stages: StageCounts;
  total_applicants: number;
  close_date: string;
  is_closed: boolean;
}

export interface ApplicantsStageGraphOverviewResponse {
  results: ApplicantsStageGraphOverviewItem[];
}

export interface TableRow {
  job_name: string;
  total_applicants: number;
  stages: {
    resume_screening: number;
    assessment_test: number;
    video_interview: number;
    hired: number;
    reject: number;
    on_hold: number;
  };
  close_date: string;
  is_closed: boolean;
}
