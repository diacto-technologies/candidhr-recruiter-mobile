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
} from "../../../../../../features/rapidhire/selectors";
import {
  getRapidhireCandidatesRequestAction,
  resetRapidhireCandidatesAction,
} from "../../../../../../features/rapidhire/actions";

const SKELETON_ROWS = 6;
export const AI_RECOMMENDATION_SORT = "-resume_score";
export const DEFAULT_SORT = "-last_updated";

export type ApplicationListItem = any | { __skeleton: true; __id: string };

export const useApplicantsTabController = () => {
  const dispatch = useAppDispatch();
  const [aiEnabled, setAiEnabled] = useState(false);
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

  const loading = isRapidhire ? rapidhireLoading : appsLoading;
  const hasMore = isRapidhire ? rapidhireHasMore : appsHasMore;
  const currentPage = isRapidhire ? rapidhirePagination.page : appsPagination.page;
  const filteredRapidhireCandidates = useMemo(() => {
    if (!isRapidhire || !rapidhireCandidates) return [];

    let result = [...rapidhireCandidates];

    // 1. Name / Search filter
    const nameSearch = (filters.name || '').trim().toLowerCase();
    if (nameSearch) {
      result = result.filter(item => {
        const name = (item.candidate_name || item.name || item.candidate?.name || '').toLowerCase();
        const email = (item.candidate_email || item.email || item.candidate?.email || '').toLowerCase();
        return name.includes(nameSearch) || email.includes(nameSearch);
      });
    }

    // 2. Email filter
    if (filters.email?.trim()) {
      const emailVal = filters.email.trim().toLowerCase();
      result = result.filter(item => {
        const email = (item.candidate_email || item.email || item.candidate?.email || '').toLowerCase();
        return email.includes(emailVal);
      });
    }

    // 3. Applied For filter (job title)
    if (filters.appliedFor?.trim()) {
      const appliedForVal = filters.appliedFor.trim().toLowerCase();
      result = result.filter(item => {
        const jobTitle = (item.job?.title || '').toLowerCase();
        return jobTitle.includes(appliedForVal);
      });
    }

    // 4. Source filter
    if (filters.source?.trim()) {
      const sourceVal = filters.source.trim().toLowerCase();
      result = result.filter(item => {
        const source = (item.source || '').toLowerCase();
        return source === sourceVal || source.includes(sourceVal);
      });
    }

    // 5. Source Channel filter
    if (filters.sourceChannel?.trim()) {
      const channelVal = filters.sourceChannel.trim().toLowerCase();
      result = result.filter(item => {
        const channel = (item.source_channel || item.sourceChannel || '').toLowerCase();
        return channel === channelVal || channel.includes(channelVal);
      });
    }

    // 6. Status filter
    if (filters.status?.trim()) {
      const statusVal = filters.status.trim().toLowerCase();
      result = result.filter(item => {
        const appStatus = (item.application_status || item.status || item.status_label || '').toLowerCase();
        return (
          appStatus === statusVal ||
          appStatus.includes(statusVal) ||
          appStatus.replace(/\s+/g, '_') === statusVal
        );
      });
    }

    // 7. Stage filter (matches interview_status or stage_name)
    if (filters.latestStageName?.trim()) {
      const stageVal = filters.latestStageName.trim().toLowerCase();
      result = result.filter(item => {
        const interviewStatus = (item.interview_status || '').toLowerCase();
        const stageName = (item.latest_stage?.stage_name || '').toLowerCase();
        return (
          interviewStatus === stageVal ||
          stageName === stageVal ||
          interviewStatus.includes(stageVal) ||
          stageName.includes(stageVal) ||
          interviewStatus.replace(/\s+/g, '_') === stageVal
        );
      });
    }

    // 8. Approved filter
    if (filters.latestStageStatus?.trim()) {
      const approvedVal = filters.latestStageStatus.trim().toLowerCase();
      result = result.filter(item => {
        const stageStatus = (item.latest_stage_status || item.approval_status || item.status || '').toLowerCase();
        return (
          stageStatus === approvedVal ||
          stageStatus.includes(approvedVal) ||
          stageStatus.replace(/\s+/g, '_') === approvedVal
        );
      });
    }

    // 9. Sorting
    const sortBy = filters.sortBy;
    const sortDir = filters.sortDir || 'desc';

    if (sortBy === 'Applicant name') {
      result.sort((a, b) => {
        const nameA = (a.candidate_name || a.name || a.candidate?.name || '').toLowerCase();
        const nameB = (b.candidate_name || b.name || b.candidate?.name || '').toLowerCase();
        return sortDir === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      });
    } else if (sortBy === 'Resume Score') {
      result.sort((a, b) => {
        const scoreA = typeof a.resume_score === 'number' ? a.resume_score : -1;
        const scoreB = typeof b.resume_score === 'number' ? b.resume_score : -1;
        return sortDir === 'asc' ? scoreA - scoreB : scoreB - scoreA;
      });
    } else if (sortBy === 'Applied' || sortBy === 'Last Update') {
      result.sort((a, b) => {
        const dateA = a.applied_at || a.last_updated;
        const dateB = b.applied_at || b.last_updated;
        const timeA = dateA ? new Date(dateA).getTime() : 0;
        const timeB = dateB ? new Date(dateB).getTime() : 0;
        return sortDir === 'asc' ? timeA - timeB : timeB - timeA;
      });
    }

    return result;
  }, [isRapidhire, rapidhireCandidates, filters]);

  const listData = isRapidhire ? filteredRapidhireCandidates : applications;

  const debouncedSearch = useDebouncedValue(filters.name, 400);

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
      sourceChannel: filters.sourceChannel || undefined,
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
        }));
      } else {
        dispatch(getApplicationsRequestAction({
          ...getApiPayload(1, undefined, searchVal),
          reset: true,
        }));
      }
    }, [jobId, isRapidhire, getApiPayload, dispatch])
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
      }));
    } else {
      dispatch(getApplicationsRequestAction({
        ...getApiPayload(1, undefined, searchVal),
        reset: true,
      }));
    }
  }, [debouncedSearch, aiEnabled, jobId, isRapidhire]);

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore || !jobId) return;
    const searchVal = filters.name.trim() || undefined;
    if (isRapidhire) {
      dispatch(getRapidhireCandidatesRequestAction({
        jobId,
        page: currentPage + 1,
        append: true,
        search: searchVal,
      }));
    } else {
      dispatch(getApplicationsRequestAction({
        ...getApiPayload(currentPage + 1, undefined, searchVal),
        append: true,
      }));
    }
  }, [loading, hasMore, jobId, isRapidhire, currentPage, filters.name, getApiPayload, dispatch]);

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
    
    // Data
    dataSource,
    
    // Handlers
    handleLoadMore,
    handleSearch,
    handleExport,
    handleMomentumScrollBegin,
    handleEndReached,
    
    // Selectors
    filters,
  };
};

