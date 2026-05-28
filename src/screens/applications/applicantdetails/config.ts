export const STATUS_OPTIONS = [
  { id: "shortlisted", name: "Shortlisted" },
  { id: "rejected", name: "Rejected" },
  { id: "on_hold", name: "On Hold" },
  { id: "interview_scheduled", name: "Interview Scheduled" },
  { id: "final_interview", name: "Final Interview" },
  { id: "hired", name: "Hired" },
  { id: "offer_extended", name: "Offer Extended" },
  { id: "offer_accepted", name: "Offer Accepted" },
  { id: "offer_rejected", name: "Offer Rejected" },
  { id: "not_selected", name: "Not Selected" },
  { id: "withdrawn", name: "Withdrawn" },
  { id: "archived", name: "Archived" },
];

export const STAGE_TAB_MAP: Record<string, string> = {
  resume_screening: 'Resume Screening',
  assessment: 'Assessments',
  assessment_v2: 'Assessment V2',
  automated_video_interview: 'Automated Video Interview',
};
