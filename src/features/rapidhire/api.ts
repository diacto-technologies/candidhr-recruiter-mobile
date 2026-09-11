import { apiClient } from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';
import {
  GetRapidhireCandidatesParams,
  RapidhireCandidatesResponse,
  RapidlyInterviewReportResponse,
  SendInterviewLinkResponse,
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

  sendInterviewLink: async (applicationId: string): Promise<SendInterviewLinkResponse> => {
    const endpoint = API_ENDPOINTS.RAPIDHIRE.SEND_INTERVIEW_LINK(applicationId);
    console.log('[rapidhireApi.sendInterviewLink] Request -> POST', endpoint);
    try {
      const res = await apiClient.post(endpoint);
      console.log('[rapidhireApi.sendInterviewLink] Response ->', JSON.stringify(res?.data ?? res, null, 2));
      return res?.data ?? res;
    } catch (error: any) {
      console.log(
        '[rapidhireApi.sendInterviewLink] Error ->',
        error?.response?.status,
        error?.response?.data || error?.message || error
      );
      throw error;
    }
  },
};
