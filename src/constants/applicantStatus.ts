import { colors } from "../theme/colors";

export const getStatusLabel = (status: string) => {
  const normalized = status ? status.toLowerCase().trim() : '';
  switch (normalized) {
    case 'approved':
      return 'Approved';
    case 'hired':
      return 'Hired';
    case 'shortlisted':
      return 'Shortlisted';
    case 'approval_pending':
    case 'approval pending':
      return 'Approval Pending';
    case 'not_approved':
    case 'not approved':
      return 'Not Approved';
    case 'assigned':
      return 'Assigned';
    case 'started':
      return 'Started';
    case 'on_hold':
    case 'on hold':
      return 'On Hold';
    case 'rejected':
      return 'Rejected';
    case 'stage_completed':
    case 'stage completed':
    case 'completed':
      return 'Completed';
    case 'abandoned':
      return 'Abandoned';
    default:
      return status
        ? status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        : 'Not Approved';
  }
};

export const getStatusColor = (status: string) => {
  const normalized = status ? status.toLowerCase().trim() : '';
  switch (normalized) {
    case 'applied':
      return colors.gray[400];
    case 'in progress':
    case 'in_progress':
      return '#EAAA08';
    case 'approved':
    case 'hired':
    case 'shortlisted':
    case 'offer accepted':
    case 'offer extended':
    case 'stage_completed':
    case 'stage completed':
    case 'completed':
      return colors.success[500];
    case 'approval_pending':
    case 'approval pending':
    case 'assigned':
    case 'started':
    case 'pending':
      return colors.warning[500];
    case 'not_approved':
    case 'not approved':
    case 'rejected':
    case 'not selected':
    case 'offer rejected':
    case 'abandoned':
      return colors.error[500];
    case 'on hold':
    case 'on_hold':
      return colors.orange[500];
    case 'withdrawn':
      return colors.gray[600];
    default:
      return colors.gray[500];
  }
};