import { WORKFLOWS_ACTION_TYPES } from "./constants";

export interface GetWorkflowsRequestPayload {
  page: number;
  pageSize?: number;
  /** Query param `name__icontains` */
  nameIcontains?: string;
}

export const getWorkflowsRequestAction = (payload: GetWorkflowsRequestPayload) => ({
  type: WORKFLOWS_ACTION_TYPES.GET_WORKFLOWS_REQUEST,
  payload: {
    page: payload.page,
    pageSize: payload.pageSize ?? 10,
    nameIcontains: payload.nameIcontains ?? "",
  },
});
