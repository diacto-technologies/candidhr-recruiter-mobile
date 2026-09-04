import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch } from "../../../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../../../hooks/useAppSelector";
import { useDebouncedValue } from "../../../../../../hooks/useDebounce";

import {
  selectApplications,
  selectApplicationsLoading,
  selectApplicationsPagination,
  selectApplicationsHasMore,
  selectApplicationsFilters,
} from "../../../../../../features/applications/selectors";

import { 
  exportApplicationsRequestAction, 
  getApplicationsRequestAction 
} from "../../../../../../features/applications/actions";
import { setApplicationsFilters } from "../../../../../../features/applications/slice";

import {
  selectRapidhireCandidates,
  selectRapidhireLoading,
  selectRapidhirePagination,
  selectRapidhireHasMore,
  selectRapidhireSummary,
} from "../../../../../../features/rapidhire/selectors";
import {
  getRapidhireCandidatesRequestAction,
  resetRapidhireCandidatesAction,
} from "../../../../../../features/rapidhire/actions";

const SKELETON_ROWS = 6;
export const AI_RECOMMENDATION_SORT = "-resume_score";
export const DEFAULT_SORT = "-last_updated";

export const RAPIDLY_APPLICANT_TABS = ['All', 'Not started', 'In progress', 'Completed'] as const;
export type RapidlyApplicantTab = (typeof RAPIDLY_APPLICANT_TABS)[number];

const getRapidlyInterviewStatusParam = (tab: string) => {
  switch (tab) {
    case 'Not started':
      return 'not_started';
    case 'In progress':
      return 'in_progress';
    case 'Completed':
      return 'completed';
    case 'All':
    default:
      return undefined;
  }
};

export type ApplicationListItem = any | { __skeleton: true; __id: string };

export const useApplicantsTabController = () => {
  const dispatch = useAppDispatch();
  const [aiEnabled, setAiEnabled] = useState(false);
  const [rapidlyActiveTab, setRapidlyActiveTab] = useState<string>('All');
  const onEndReachedCalledRef = useRef(false);
  const isInitialMount = useRef(true);

  const selectedJob = useAppSelector((state) => state.jobs.selectedJob);
  const isRapidhire = Boolean(selectedJob?.rapidhire_enabled);
  const jobId = selectedJob?.id;

  // Applications feature state
  const applications = useAppSelector(selectApplications);
  const appsLoading = useAppSelector(selectApplicationsLoading);
  const appsPagination = useAppSelector(selectApplicationsPagination);
  const appsHasMore = useAppSelector(selectApplicationsHasMore);
  const filters = useAppSelector(selectApplicationsFilters);

  // Rapidhire feature state
  const rapidhireCandidates = useAppSelector(selectRapidhireCandidates);
  const rapidhireLoading = useAppSelector(selectRapidhireLoading);
  const rapidhirePagination = useAppSelector(selectRapidhirePagination);
  const rapidhireHasMore = useAppSelector(selectRapidhireHasMore);
  const rapidhireSummary = useAppSelector(selectRapidhireSummary);

  const loading = isRapidhire ? rapidhireLoading : appsLoading;
  const hasMore = isRapidhire ? rapidhireHasMore : appsHasMore;
  const currentPage = isRapidhire ? rapidhirePagination.page : appsPagination.page;
  const listData = isRapidhire ? rapidhireCandidates : applications;

  const debouncedSearch = useDebouncedValue(filters.name, 400);

  const rapidhireTabCounts: Record<string, number> = useMemo(() => ({
    All: rapidhireSummary?.counts?.total ?? 0,
    'Not started': rapidhireSummary?.counts?.not_started ?? 0,
    'In progress': rapidhireSummary?.counts?.in_progress ?? 0,
    Completed: rapidhireSummary?.counts?.completed ?? 0,
  }), [rapidhireSummary]);

  const getApiPayload = useCallback((page: number, overrideSort?: string, searchParam?: string) => {
    const currentSearch = searchParam !== undefined ? searchParam : filters.name.trim();
    return {
      page,
      limit: appsPagination.limit,
      search: currentSearch || undefined,
      jobId,
      email: filters.email || "",
      jobTitle: filters.appliedFor || "",
      contact: filters.contact || "",
      latestStageStatus: filters.latestStageStatus || undefined,
      source: filters.source || undefined,
      status: filters.status || undefined,
      latestStageName: filters.latestStageName || undefined,
      sort: overrideSort ?? (aiEnabled ? AI_RECOMMENDATION_SORT : (filters.sort || DEFAULT_SORT)),
    };
  }, [filters, aiEnabled, jobId, appsPagination.limit]);

  // Initial focus fetch
  useFocusEffect(
    useCallback(() => {
      if (!jobId) return;
      const searchVal = filters.name.trim() || undefined;
      if (isRapidhire) {
        dispatch(getRapidhireCandidatesRequestAction({
          jobId,
          page: 1,
          reset: true,
          search: searchVal,
          interview_status: getRapidlyInterviewStatusParam(rapidlyActiveTab),
        }));
      } else {
        dispatch(getApplicationsRequestAction({
          ...getApiPayload(1, undefined, searchVal),
          reset: true,
        }));
      }
    }, [jobId, isRapidhire, rapidlyActiveTab, getApiPayload, dispatch])
  );

  // Trigger search on debounced text change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!jobId) return;

    const searchVal = debouncedSearch.trim() || undefined;
    if (isRapidhire) {
      dispatch(getRapidhireCandidatesRequestAction({
        jobId,
        page: 1,
        reset: true,
        search: searchVal,
        interview_status: getRapidlyInterviewStatusParam(rapidlyActiveTab),
      }));
    } else {
      dispatch(getApplicationsRequestAction({
        ...getApiPayload(1, undefined, searchVal),
        reset: true,
      }));
    }
  }, [debouncedSearch, aiEnabled, jobId, isRapidhire, rapidlyActiveTab]);

  const handleChangeRapidlyTab = useCallback((tab: string) => {
    setRapidlyActiveTab(tab);
    if (!jobId) return;
    const searchVal = filters.name.trim() || undefined;
    dispatch(getRapidhireCandidatesRequestAction({
      jobId,
      page: 1,
      reset: true,
      search: searchVal,
      interview_status: getRapidlyInterviewStatusParam(tab),
    }));
  }, [jobId, filters.name, dispatch]);

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore || !jobId) return;
    const searchVal = filters.name.trim() || undefined;
    if (isRapidhire) {
      dispatch(getRapidhireCandidatesRequestAction({
        jobId,
        page: currentPage + 1,
        append: true,
        search: searchVal,
        interview_status: getRapidlyInterviewStatusParam(rapidlyActiveTab),
      }));
    } else {
      dispatch(getApplicationsRequestAction({
        ...getApiPayload(currentPage + 1, undefined, searchVal),
        append: true,
      }));
    }
  }, [loading, hasMore, jobId, isRapidhire, currentPage, filters.name, rapidlyActiveTab, getApiPayload, dispatch]);

  const handleSearch = useCallback((text: string) => {
    dispatch(setApplicationsFilters({ name: text }));
  }, [dispatch]);

  const handleExport = useCallback(() => {
    if (!jobId) return;
    const exportSortValue = filters.sort || DEFAULT_SORT;
    
    dispatch(exportApplicationsRequestAction({
      mode: 'download',
      params: {
        ...getApiPayload(1, exportSortValue),
      },
    }));
  }, [jobId, filters.sort, getApiPayload, dispatch]);

  const handleMomentumScrollBegin = useCallback(() => {
    onEndReachedCalledRef.current = false;
  }, []);

  const handleEndReached = useCallback(() => {
    if (!onEndReachedCalledRef.current) {
      handleLoadMore();
      onEndReachedCalledRef.current = true;
    }
  }, [handleLoadMore]);

  const dataSource: ApplicationListItem[] = useMemo(() => {
    if (loading && listData.length === 0) {
      return Array.from({ length: SKELETON_ROWS }).map((_, i) => ({
        __skeleton: true,
        __id: `skeleton-${i}`,
      }));
    }
    return listData;
  }, [loading, listData]);

  return {
    // State
    aiEnabled,
    setAiEnabled,
    loading,
    isRapidhire,
    rapidlyTabs: RAPIDLY_APPLICANT_TABS,
    rapidlyActiveTab,
    rapidhireTabCounts,
    
    // Data
    dataSource,
    
    // Handlers
    handleChangeRapidlyTab,
    handleLoadMore,
    handleSearch,
    handleExport,
    handleMomentumScrollBegin,
    handleEndReached,
    
    // Selectors
    filters,
  };
};

