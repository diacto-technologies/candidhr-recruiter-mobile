import { FilterConfig } from './types';

export const LABEL_MAP: Record<string, Record<string, string>> = {
  source: {
    application_form: "Form",
    imported_using_bulk_resume_upload: "Bulk Import",
  },
  status: {
    applied: "Applied",
    in_progress: "In Progress",
    shortlisted: "Shortlisted",
    rejected: "Rejected",
    on_hold: "On Hold",
    interview_scheduled: "Interview Scheduled",
    final_interview: "Final Interview",
    hired: "Hired",
    offer_extended: "Offer Extended",
    offer_accepted: "Offer Accepted",
    offer_rejected: "Offer Rejected",
    not_selected: "Not Selected",
    withdrawn: "Withdrawn",
    archived: "Archived",
  },
  latestStageName: {
    resume_screening: "Resume Screening",
    assessment: "Assessment",
    automated_video_interview: "Automated Video Interview",
  },
  latestStageStatus: {
    approved: "Approved",
    not_approved: "Not Approved",
    approval_pending: "Pending",
  },
};


