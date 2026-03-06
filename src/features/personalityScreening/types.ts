/**
 * Personality Screening (Video Interview) feature types.
 * Matches API: GET /personality-screening/filter/
 */

export interface PersonalityScreeningJob {
  id: string;
  title: string;
}

export interface PersonalityScreeningCandidate {
  id: string;
  name: string;
  email: string;
  contact: string | null;
  profile_pic: string | null;
  location?: { city?: string; state?: string };
}

export interface PersonalityScreeningApplication {
  id: string;
  name: string;
  job: PersonalityScreeningJob;
  candidate: PersonalityScreeningCandidate;
}

export interface PersonalityScreeningAssignedBy {
  name: string;
  email: string;
  profile_pic: string | null;
}

export interface PersonalityScreeningItem {
  id: string;
  questions: number;
  job: PersonalityScreeningJob;
  application: PersonalityScreeningApplication;
  assigned_by: PersonalityScreeningAssignedBy;
  screening_link: string;
  status_text: string;
  expired_at: string | null;
  assigned_at: string;
  completed: boolean;
  completed_at: string | null;
  link_opened: boolean;
  key: string;
}

export interface PersonalityScreeningListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PersonalityScreeningItem[];
}

/** Query params for /personality-screening/filter/ */
export interface PersonalityScreeningFilterParams {
  page?: number;
  applicant_name__icontains?: string;
  candidate_email__icontains?: string;
  job__title__icontains?: string;
  assigned_by__name__icontains?: string;
  status_text?: string;
  /** Ordering, e.g. "-expired_at" */
  o?: string;
}

export type PersonalityScreeningFilters = Omit<
  PersonalityScreeningFilterParams,
  "page" | "o"
>;

export interface GetPersonalityScreeningListPayload
  extends PersonalityScreeningFilterParams {
  append?: boolean;
}

export interface PersonalityScreeningState {
  list: PersonalityScreeningItem[];
  loading: boolean;
  error: string | null;
  filters: PersonalityScreeningFilters;
  pagination: {
    page: number;
    total: number;
    next: string | null;
    previous: string | null;
  };
  hasMore: boolean;
}
