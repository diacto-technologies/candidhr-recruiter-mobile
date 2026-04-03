import { apiClient } from "../../api/client";
import { API_ENDPOINTS } from "../../api/endpoints";
import type { Comment, CreateCommentPayload, GetCommentsParams, UpdateCommentPayload } from "./types";

export const commentsApi = {
  /**
   * GET /comments/v1/comments/?application_id=...&job_id=...
   */
  /**
   * GET /comments/v1/comments/?application_id=... (&job_id=... optional)
   * Response: { count, next, previous, results: Comment[] }
   */
  getList: async (params: GetCommentsParams): Promise<Comment[]> => {
    const search = new URLSearchParams({ application_id: params.application_id });
    if (params.job_id) search.set('job_id', params.job_id);
    const url = `${API_ENDPOINTS.COMMENTS.LIST}?${search.toString()}`;
    const res = await apiClient.get(url);
    const raw = res?.results ?? res?.data ?? res;
    return Array.isArray(raw) ? raw : [];
  },

  /**
   * POST /comments/v1/comments/
   */
  create: async (payload: CreateCommentPayload): Promise<Comment> => {
    const res = await apiClient.post(API_ENDPOINTS.COMMENTS.CREATE, payload);
    return res?.data ?? res;
  },

  /**
   * PATCH /comments/v1/{commentId}/update/
   */
  update: async (payload: UpdateCommentPayload): Promise<{ message: string } | unknown> => {
    const res = await apiClient.patch(API_ENDPOINTS.COMMENTS.UPDATE(payload.id), { text: payload.text });
    return res?.data ?? res;
  },

  /**
   * DELETE /comments/v1/comments/{commentId}/
   */
  delete: async (commentId: string): Promise<unknown> => {
    const res = await apiClient.delete(API_ENDPOINTS.COMMENTS.DELETE(commentId));
    return res?.data ?? res;
  },
};
