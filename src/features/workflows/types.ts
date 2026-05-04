export interface WorkflowListItem {
  id: string;
  name: string;
  description?: string;
  enabled?: boolean;
  created_by?: unknown;
  updated_by?: unknown;
  active_workflow_version_information?: {
    id: string;
    version_number: number;
    description?: string | null;
  };
  [key: string]: unknown;
}

export interface PaginatedWorkflowsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: WorkflowListItem[];
}

export interface WorkflowsListSlice {
  items: WorkflowListItem[];
  count: number;
  next: string | null;
  previous: string | null;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

export interface WorkflowsState {
  list: WorkflowsListSlice;
}

/** POST /workflow/assign/:jobId/ */
export interface WorkflowAssignRequestBody {
  workflow_id: string;
  invite_via_email: boolean;
  invite_via_application_form: boolean;
  emails: string[];
}
