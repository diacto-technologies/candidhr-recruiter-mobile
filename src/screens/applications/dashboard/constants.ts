export const STATS_CONFIG = [
    { title: "Total Applications", dataKey: "total_applicants", isCompact: true, tooltipText: "Total number of applicants" },
    { title: "Total Jobs", dataKey: "total_jobs", isCompact: true, tooltipText: "Total number of job postings currently on the platform." },
    { title: "Applicant to Assessment Ratio", dataKey: "assessment_ratio", isCompact: false, tooltipText: "How many applicants proceed from application to assessment." },
    { title: "Applicant to Interview Ratio", dataKey: "personality_screening_ratio", isCompact: false, tooltipText: "Percentage of applicants who reached the interview stage." },
    { title: "Days to Fill", dataKey: "close_fill", isCompact: false, tooltipText: "Average days taken to close a job after it was posted." },
    { title: "Job Views", dataKey: "job_views", isCompact: true, tooltipText: "Total number of views." },
    { title: "Active Candidates", dataKey: "active_applications", isCompact: true, tooltipText: "Candidates who are actively in the hiring process pipeline (Not rejected or hired yet)." },
    { title: "Drop-off Rate", dataKey: "drop_off_rate", isCompact: false, tooltipText: "Percentage of candidates who started but did not complete the application or assessment process." },
];

export const SEARCH_DEBOUNCE = 400;
