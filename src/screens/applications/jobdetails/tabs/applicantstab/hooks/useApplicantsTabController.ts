import { useState, useCallback, useMemo, useRef } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch } from "../../../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../../../hooks/useAppSelector";

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

const SKELETON_ROWS = 6;
export const AI_RECOMMENDATION_SORT = "-resume_score";
export const DEFAULT_SORT = "-last_updated";

export type ApplicationListItem = any | { __skeleton: true; __id: string }; // We use 'any' as a fallback for Application since its type is not exported here, but we explicitly add the skeleton type

export const useApplicantsTabController = () => {
  const dispatch = useAppDispatch();
  const [aiEnabled, setAiEnabled] = useState(false);
  const onEndReachedCalledRef = useRef(false);

  const applications = useAppSelector(selectApplications);
  const loading = useAppSelector(selectApplicationsLoading);
  const pagination = useAppSelector(selectApplicationsPagination);
  const hasMore = useAppSelector(selectApplicationsHasMore);
  const filters = useAppSelector(selectApplicationsFilters);
  const jobId = useAppSelector((state) => state.jobs.selectedJob?.id);

  const getApiPayload = useCallback((page: number, overrideSort?: string) => {
    return {
      page,
      limit: pagination.limit,
      applicantName: filters.name.trim() || undefined,
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
  }, [filters, aiEnabled, jobId, pagination.limit]);

  useFocusEffect(
    useCallback(() => {
      if (!jobId) return;
      dispatch(getApplicationsRequestAction({
        ...getApiPayload(1),
        reset: true,
      }));
    }, [jobId, getApiPayload, dispatch])
  );

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) return;
    dispatch(getApplicationsRequestAction({
      ...getApiPayload(pagination.page + 1),
      append: true,
    }));
  }, [loading, hasMore, pagination.page, getApiPayload, dispatch]);

  const handleSearch = useCallback((text: string) => {
    dispatch(setApplicationsFilters({ name: text }));
  }, [dispatch]);

  const handleExport = useCallback(() => {
    if (!jobId) return;
    // The export API throws a 500 error if sorted by -resume_score.
    // We fallback to standard sort for exports to prevent crashes.
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
    if (loading && applications.length === 0) {
      return Array.from({ length: SKELETON_ROWS }).map((_, i) => ({
        __skeleton: true,
        __id: `skeleton-${i}`,
      }));
    }
    return applications;
  }, [loading, applications]);

  return {
    // State
    aiEnabled,
    setAiEnabled,
    loading,
    
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
