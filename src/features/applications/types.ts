export interface Application {
  id: string;
  jobId: string;
  jobTitle?: string;
  applicantName: string;
  applicantEmail: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  resume?: string;
  coverLetter?: string;
  appliedAt?: string;
  [key: string]: any;
}

export interface ApplicationsState {
  applications: Application[];
  selectedApplication: Application | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface CreateApplicationRequest {
  jobId: string;
  applicantName: string;
  applicantEmail: string;
  resume?: string;
  coverLetter?: string;
}

export interface UpdateApplicationStatusRequest {
  id: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
}

