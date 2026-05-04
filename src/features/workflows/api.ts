import { apiClient } from "../../api/client";
import { API_ENDPOINTS } from "../../api/endpoints";
import type { PaginatedWorkflowsResponse, WorkflowAssignRequestBody } from "./types";

export const workflowsApi = {
  assign: async (jobId: string, body: WorkflowAssignRequestBody): Promise<unknown> => {
    return apiClient.post(API_ENDPOINTS.WORKFLOW.ASSIGN(jobId), body);
  },
  list: async (params: {
    page: number;
    pageSize: number;
    nameIcontains?: string;
  }): Promise<PaginatedWorkflowsResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("page", String(params.page));
    queryParams.append("page_size", String(params.pageSize));
    queryParams.append("name__icontains", params.nameIcontains ?? "");
    return apiClient.get(
      `${API_ENDPOINTS.WORKFLOW.WORKFLOWS_LIST}?${queryParams.toString()}`
    ) as Promise<PaginatedWorkflowsResponse>;
  },
};
