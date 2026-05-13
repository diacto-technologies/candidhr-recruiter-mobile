export interface ApplicationContext  {
    expected_ctc?: number | null;
    current_ctc?: number | null;
    notice_period_in_months?: number | null;
    relevant_experience_in_months?: number | null;
};

export interface Person  {
    contact?: string | number | null;
    email?: string | null;
    introduction_video?: string | null;
    notice_period_in_months?: number | null;
};

export interface OverviewApplication  {
    applicant?: Person;
    candidate?: Person;
    application_context?: ApplicationContext;
    resume?: { introduction_video?: string | null; relevant_experience_in_months?: number | null } | null;
    current_ctc?: number | null;
    expected_ctc?: number | null;
};