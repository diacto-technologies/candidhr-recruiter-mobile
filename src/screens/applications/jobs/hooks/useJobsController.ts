import { useEffect, useState, useCallback, useRef } from 'react';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { useNetworkConnectivity } from '../../../../hooks/useNetworkConnectivity';
import { usePermission } from '../../../../hooks/usePermission';
import { useDebounce } from '../../../../hooks/useDebounce';
import { useFocusEffect } from '@react-navigation/native';
import { PERMISSIONS } from '../../../../utils/permission.constants';
import { jobFiltersOption } from '../../../../utils/dummaydata';
import { navigate } from '../../../../utils/navigationUtils';
import {
  getJobsRequestAction,
  getPublishedJobsRequestAction,
  getUnpublishedJobsRequestAction
} from '../../../../features/jobs/actions';
import {
  selectJobFilters,
  selectJobsActiveTab,
  selectJobsPagination,
  selectJobs,
  selectJobsHasMore,
  selectJobsListLoading,
  selectIsTabLoading,
  selectPublishedCount,
  selectUnpublishedCount,
  selectFavouritesCount,
  selectFavouriteJobIds,
} from '../../../../features/jobs/selectors';
import { 
  clearFavouriteJobs, 
  clearJobFilters, 
  setJobFilters, 
  setActiveTab, 
  toggleFavouriteJob 
} from '../../../../features/jobs/slice';
import { setApplicationsFilters } from '../../../../features/applications/slice';
import { selectProfile, selectProfileError, selectProfileLoading } from '../../../../features/profile/selectors';
import { selectToken } from '../../../../features/auth/selectors';

export const useJobsController = () => {
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const { can } = usePermission();
  const { debounce } = useDebounce();
  
  const [filterSheet, setFilterSheet] = useState(false);
  const [selectedTab, setSelectedTab] = useState(jobFiltersOption[0]);
  const [openSearch, setOpenSearch] = useState(false);
  
  const pagination = useAppSelector(selectJobsPagination);
  const jobFilters = useAppSelector(selectJobFilters);
  const activeTab = useAppSelector(selectJobsActiveTab);
  const jobsList = useAppSelector(selectJobs);
  const loading = useAppSelector(selectJobsListLoading);
  const isTabLoading = useAppSelector(selectIsTabLoading);
  const hasMore = useAppSelector(selectJobsHasMore);
  const publishedCount = useAppSelector(selectPublishedCount);
  const unpublishedCount = useAppSelector(selectUnpublishedCount);
  const favouritesCount = useAppSelector(selectFavouritesCount);
  const favouriteJobIds = useAppSelector(selectFavouriteJobIds);
  const token = useAppSelector(selectToken);
  
  const isConnected = useNetworkConnectivity();
  const profileLoading = useAppSelector(selectProfileLoading);
  const profileError = useAppSelector(selectProfileError);
  
  const accessLoading = profileLoading || (profile === null && profileError === null);
  const hasPermission = accessLoading || can(PERMISSIONS.VIEW_JOB);

  useFocusEffect(
    useCallback(() => {
      dispatch(setApplicationsFilters({
        name: "", email: "", appliedFor: "", contact: "",
        latestStageStatus: "", source: "", status: "", latestStageName: "",
      }));
    }, [dispatch])
  );

  const prevFiltersRef = useRef(jobFilters);
  const favouriteJobIdsRef = useRef(favouriteJobIds);
  
  useEffect(() => {
    favouriteJobIdsRef.current = favouriteJobIds;
  }, [favouriteJobIds]);

  useEffect(() => {
    if (!isConnected) return;
    dispatch(getPublishedJobsRequestAction(jobFilters));
    dispatch(getUnpublishedJobsRequestAction(jobFilters));
  }, [token, isConnected, jobFilters, dispatch]);

  const lastTabRef = useRef(activeTab);

  // Debounced fetch for filter updates (e.g. typing search queries)
  const debouncedFetchJobs = useCallback(
    debounce((tab: string, filters: any, limit: number) => {
      if (tab === "Favourites") {
        const ids = favouriteJobIdsRef.current;
        if (!ids.length || !ids.join(",")) {
          dispatch(clearFavouriteJobs());
          return;
        }
        dispatch(getJobsRequestAction({
          page: 1, limit, append: false, favourites: true, idIn: ids.join(","), ...filters,
        }));
      } else {
        dispatch(getJobsRequestAction({
          page: 1, limit, append: false, published: tab === "Published", ...filters,
        }));
      }
      prevFiltersRef.current = filters;
    }, 400),
    [dispatch]
  );

  // Immediate fetch for instant actions like tab switching
  const immediateFetchJobs = useCallback(
    (tab: string, filters: any, limit: number) => {
      if (tab === "Favourites") {
        const ids = favouriteJobIdsRef.current;
        if (!ids.length || !ids.join(",")) {
          dispatch(clearFavouriteJobs());
          return;
        }
        dispatch(getJobsRequestAction({
          page: 1, limit, append: false, favourites: true, idIn: ids.join(","), ...filters,
        }));
      } else {
        dispatch(getJobsRequestAction({
          page: 1, limit, append: false, published: tab === "Published", ...filters,
        }));
      }
      prevFiltersRef.current = filters;
    },
    [dispatch]
  );

  useEffect(() => {
    if (!isConnected) return;
    
    if (activeTab !== lastTabRef.current) {
      lastTabRef.current = activeTab;
      immediateFetchJobs(activeTab, jobFilters, pagination.limit);
    } else {
      debouncedFetchJobs(activeTab, jobFilters, pagination.limit);
    }
  }, [jobFilters, isConnected, pagination.limit, activeTab, immediateFetchJobs, debouncedFetchJobs]);

  const handleApplyFilters = () => {
    if (!isConnected) {
      setFilterSheet(false);
      return;
    }
    
    dispatch(
      getJobsRequestAction({
        page: 1,
        limit: pagination.limit,
        ...(activeTab === "Favourites"
          ? { favourites: true, idIn: favouriteJobIdsRef.current.join(",") }
          : { published: activeTab === "Published" }),
        append: false,
        ...jobFilters,
      })
    );
    dispatch(getPublishedJobsRequestAction(jobFilters));
    dispatch(getUnpublishedJobsRequestAction(jobFilters));
    setFilterSheet(false);
  };

  const handleChangeTab = (label: string) => {
    const tab = label as "Published" | "Draft" | "Favourites";
    dispatch(setActiveTab(tab));
  };

  const handleLoadMore = () => {
    if (!isConnected || loading || !hasMore || jobsList.length === 0) return;
    dispatch(
      getJobsRequestAction({
        page: pagination.page + 1,
        limit: pagination.limit,
        append: true,
        ...(activeTab === "Favourites"
          ? { favourites: true, idIn: favouriteJobIdsRef.current.join(",") }
          : { published: activeTab === "Published" }),
        ...jobFilters,
      })
    );
  };

  const handleSearch = (text: string) => {
    dispatch(setJobFilters({ ...jobFilters, title: text }));
  };

  const handleClearSearch = () => {
    dispatch(setJobFilters({ ...jobFilters, title: '' }));
    setOpenSearch(false);
  };

  const handleClearFilters = () => dispatch(clearJobFilters());
  const handleToggleFavourite = (jobId: string) => dispatch(toggleFavouriteJob(jobId));
  const handleJobPress = (jobId: string) => navigate('JobDetailScreen', { jobId });

  return {
    hasPermission,
    filterSheet,
    setFilterSheet,
    selectedTab,
    setSelectedTab,
    openSearch,
    setOpenSearch,
    jobFilters,
    activeTab,
    jobsList,
    loading,
    isTabLoading,
    hasMore,
    publishedCount,
    unpublishedCount,
    favouritesCount,
    favouriteJobIds,
    isConnected,
    accessLoading,
    handleApplyFilters,
    handleChangeTab,
    handleLoadMore,
    handleSearch,
    handleClearSearch,
    handleClearFilters,
    handleToggleFavourite,
    handleJobPress,
  };
};
