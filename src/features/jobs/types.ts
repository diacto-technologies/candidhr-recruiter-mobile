export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: string;
  type?: string;
  status?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface JobsState {
  jobs: Job[];
  selectedJob: Job | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface CreateJobRequest {
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: string;
  type?: string;
}

export interface UpdateJobRequest {
  id: string;
  title?: string;
  description?: string;
  company?: string;
  location?: string;
  salary?: string;
  type?: string;
  status?: string;
}

