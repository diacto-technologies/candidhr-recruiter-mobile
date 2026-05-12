import { apiClient } from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';
import type {
  QuestionSet,
  QuestionSetListResponse,
  ScreenQuestion,
  SetQuestionsListResponse,
} from './types';

export const questionSetsApi = {
  create: async (body: { name: string; created_by: string }): Promise<QuestionSet> => {
    return apiClient.post(API_ENDPOINTS.QUESTIONNAIRE.QUESTION_SETS, body);
  },

  /** POST /questionnaire/questions/ — body matches screening wizard. */
  createQuestion: async (body: {
    text: string;
    time_limit: number;
    type: 'text' | 'audio';
    created_by: string;
    question_set: string;
  }): Promise<ScreenQuestion> => {
    return apiClient.post(API_ENDPOINTS.QUESTIONNAIRE.QUESTIONS, body);
  },

  list: async (page: number = 1): Promise<QuestionSetListResponse> => {
    const q = new URLSearchParams();
    q.set('page', String(page));
    return apiClient.get(
      `${API_ENDPOINTS.QUESTIONNAIRE.QUESTION_SETS}?${q.toString()}`
    );
  },

  /** GET ?question_type=text,audio&question_set_id=&page= — matches questionnaire list filter. */
  /** PATCH — soft delete (body `{ is_deleted: true }`). */
  softDeleteQuestion: async (questionId: string): Promise<ScreenQuestion> => {
    return apiClient.patch(
      API_ENDPOINTS.QUESTIONNAIRE.QUESTION_DETAIL(questionId),
      { is_deleted: true }
    );
  },

  listQuestions: async (
    questionSetId: string,
    page: number = 1
  ): Promise<SetQuestionsListResponse> => {
    const params = new URLSearchParams({
      question_type: 'text,audio',
      question_set_id: questionSetId,
      page: String(page),
    });
    return apiClient.get(
      `${API_ENDPOINTS.QUESTIONNAIRE.QUESTIONS}?${params.toString()}`
    );
  },
};
