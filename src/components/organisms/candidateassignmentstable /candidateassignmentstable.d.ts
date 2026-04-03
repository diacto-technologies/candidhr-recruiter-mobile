export type CandidateAssignmentsVariant = 'preview' | 'full';

export interface CandidateAssignmentsTableProps {
  overview: {
    results?: CandidateAssignmentRow[];
  } | null;
  loading: boolean;
  /** preview: first 6 rows + View more. full: all rows, no footer expand. */
  variant?: CandidateAssignmentsVariant;
  onViewMore?: () => void;
}

export interface CandidateAssignmentRow {
  id: string;

  candidate: {
    id: string;
    name: string;
    email: string;
    profile_pic: string;
    initials: string;
  };

  status: {
    label: string;
    tone: 'error' | 'success' | 'info' | 'warning';
  };

  validity: string;
  duration: string;
  passingScore: string;
  score: string;

  assigned: string;

  proctoring: {
    label: string;
    tone: 'error' | 'info' | 'success' | 'warning';
    icon?: string;
  };

  reminders: string;
}
