/**
 * Comment author (from API).
 */
export interface CommentUser {
  id: string;
  name: string;
  email: string;
  role?: {
    id: number;
    name: string;
    tenant: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
  };
  contact?: string | null;
  state?: string | null;
  country?: string | null;
  user_type?: string | null;
  profile_pic?: string | null;
}

/**
 * Single comment from GET /comments/v1/comments/ or POST response.
 */
export interface Comment {
  id: string;
  user: CommentUser;
  application: string;
  job: string;
  tenant: string;
  content_type: string;
  object_id: string;
  text: string;
  replies: unknown[];
  created_at: string;
  updated_at: string;
}

/**
 * Payload for POST /comments/v1/comments/
 */
export interface CreateCommentPayload {
  application: string;
  job: string;
  content_type: string;
  object_id: string;
  text: string;
}

/**
 * Payload for PATCH /comments/v1/{commentId}/update/
 */
export interface UpdateCommentPayload {
  id: string;
  text: string;
}

export interface DeleteCommentPayload {
  id: string;
}

/**
 * Params for fetching comments list.
 * API supports application_id only; job_id is optional.
 */
export interface GetCommentsParams {
  application_id: string;
  job_id?: string;
}

export interface CommentsState {
  list: Comment[];
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
  updateLoading: boolean;
  updateError: string | null;
  deleteLoading: boolean;
  deleteError: string | null;
}
