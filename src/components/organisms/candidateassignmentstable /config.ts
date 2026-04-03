export const TRACK_WIDTH = 320;
export const SHIMMER_ROWS = 6;

export const ASSIGNMENTS_STAGE_OVERVIEW_COLUMNS = [
    "Status",
    "Validity",
    "Duration",
    "Passing score",
    "Score",
    "Assigned",
    "Proctoring",
    "Reminders",
  ] as const;

/** Matches assessments v2 assignments list `status` query param. */
export const ASSIGNMENT_STATUS_FILTER_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Assigned", value: "assigned" },
  { label: "Completed", value: "completed" },
  { label: "Passed", value: "passed" },
  { label: "Failed", value: "failed" },
  { label: "Disqualified", value: "disqualified" },
  { label: "Expired", value: "expired" },
] as const;

