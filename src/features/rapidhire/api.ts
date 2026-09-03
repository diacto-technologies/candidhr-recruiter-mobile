import { apiClient } from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';
import {
  GetRapidhireCandidatesParams,
  RapidhireCandidatesResponse,
  RapidlyInterviewReportResponse,
} from './types';

export const rapidhireApi = {
  getCandidates: async (params: GetRapidhireCandidatesParams): Promise<RapidhireCandidatesResponse> => {
    const { jobId, page = 1, search } = params;
    const query = new URLSearchParams();
    if (page) query.append('page', String(page));
    if (search) query.append('search', search);

    const qs = query.toString();
    const endpoint = API_ENDPOINTS.RAPIDHIRE.LITE_CANDIDATES(jobId);
    const url = qs ? `${endpoint}?${qs}` : endpoint;

    const res = await apiClient.get(url);
    return res?.data ?? res;
  },

  getInterviewReport: async (applicationId: string): Promise<RapidlyInterviewReportResponse> => {
    const endpoint = API_ENDPOINTS.RAPIDHIRE.INTERVIEW_REPORT(applicationId);
    const res = await apiClient.get(endpoint);
    return res?.data ?? res;
  },
};
