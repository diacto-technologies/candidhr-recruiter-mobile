import { apiClient } from "../../api/client";
import { API_ENDPOINTS } from "../../api/endpoints";
import {
  PersonalityScreeningListResponse,
  PersonalityScreeningFilterParams,
} from "./types";

/**
 * Builds query string from filter params, excluding empty/undefined values.
 */
function buildQueryParams(
  params: PersonalityScreeningFilterParams
): Record<string, string> {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== ""
  );
  return Object.fromEntries(entries) as Record<string, string>;
}

export const personalityScreeningApi = {
  getList: async (
    params: PersonalityScreeningFilterParams
  ): Promise<PersonalityScreeningListResponse> => {
    const cleanParams = buildQueryParams(params);
    const query = new URLSearchParams(cleanParams).toString();
    const baseUrl = API_ENDPOINTS.PERSONALITY_SCREENING.FILTER;
    const url = query ? `${baseUrl}?${query}` : baseUrl;

    const res = await apiClient.get(url);
    return res?.data ?? res;
  },
};
