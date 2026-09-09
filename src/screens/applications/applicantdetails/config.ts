export const STATUS_OPTIONS = [
  { id: "applied", name: "Applied" },
  { id: "in_progress", name: "In Progress" },
  { id: "shortlisted", name: "Shortlisted" },
  { id: "rejected", name: "Rejected" },
  { id: "on_hold", name: "On Hold" },
  { id: "hired", name: "Hired" },
  { id: "withdrawn", name: "Withdrawn" },
];

export interface StageTabConfig {
  key: string;
  label: string;
}

export const STAGE_TAB_MAP: Record<string, StageTabConfig> = {
  resume_screening: { key: 'resume_screening', label: 'Resume Screening' },
  assessment: { key: 'assessment', label: 'Assessment' },
  assessment_v2: { key: 'assessment_v2', label: 'Assessment' },
  automated_video_interview: { key: 'automated_video_interview', label: 'Automated Video Interview' },
  rapidhire: { key: 'rapidly_interview', label: 'Rapidly Interview' },
  rapidly_interview: { key: 'rapidly_interview', label: 'Rapidly Interview' },
};
