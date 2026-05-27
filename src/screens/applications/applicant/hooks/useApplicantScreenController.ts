import { useState, useCallback, useRef, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useWindowDimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { usePermission } from '../../../../hooks/usePermission';
import { PERMISSIONS } from '../../../../utils/permission.constants';
import { useDebouncedValue } from '../../../../hooks/useDebounce';
import { Application } from '../../../../features/applications/types';

import {
  selectApplications,
  selectApplicationsFilters,
  selectApplicationsHasMore,
  selectApplicationsLoading,
  selectApplicationsPagination,
} from '../../../../features/applications/selectors';
import { 
  exportApplicationsRequestAction, 
  getApplicationsRequestAction 
} from '../../../../features/applications/actions';
import { setApplicationsFilters, setSort } from '../../../../features/applications/slice';

export const SKELETON_ROWS = 10;
export type RowItem = Application | { __skeleton: true; __id: string };

export interface GetApplicationsPayload {
  page: number;
  limit: number;
  append?: boolean;
  applicantName?: string;
  email?: string;
  jobTitle?: string;
  contact?: string;
  sort?: string;
  latestStageStatus?: string;
  source?: string;
  status?: string;
  latestStageName?: string;
}

export const useApplicantScreenController = () => {
  const { can } = usePermission();
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();
  
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Name');
  const [threeDotOpen, setThreeDotOpen] = useState(false);
  
  const applications = useAppSelector(selectApplications);
  const pagination = useAppSelector(selectApplicationsPagination);
  const hasMore = useAppSelector(selectApplicationsHasMore);
  const loading = useAppSelector(selectApplicationsLoading);
  const filters = useAppSelector(selectApplicationsFilters);

  const onEndReachedCalledRef = useRef(false);
  
  // Layout math
  const isTablet = DeviceInfo.isTablet();
  const numColumns = isTablet ? 3 : 1;
  const horizontalPadding = 32;
  const gap = 16;
  const availableWidth = width - horizontalPadding - gap * (numColumns - 1);
  const itemWidth = availableWidth / numColumns;
  
  const debouncedName = useDebouncedValue(filters.name, 400);

  const getApiParams = useCallback((page: number, append = false): GetApplicationsPayload => {
    const params: GetApplicationsPayload = {
      page,
      limit: pagination.limit,
    };
    if (append) params.append = true;
    if (debouncedName) params.applicantName = debouncedName;
    if (filters.email) params.email = filters.email;
    if (filters.appliedFor) params.jobTitle = filters.appliedFor;
    if (filters.contact) params.contact = filters.contact;
    if (filters.sort) params.sort = filters.sort;
    if (filters.latestStageStatus) params.latestStageStatus = filters.latestStageStatus;
    if (filters.source) params.source = filters.source;
    if (filters.status) params.status = filters.status;
    if (filters.latestStageName) params.latestStageName = filters.latestStageName;

    return params;
  }, [debouncedName, filters, pagination.limit]);

  useFocusEffect(
    useCallback(() => {
      dispatch(getApplicationsRequestAction(getApiParams(1)));
    }, [dispatch, getApiParams])
  );

  const handleApplyFilters = useCallback(() => {
    setIsFilterSheetVisible(false);
  }, []);

  const handleClearAllFilters = useCallback(() => {
    dispatch(setApplicationsFilters({
      name: "",
      email: "",
      appliedFor: "",
      contact: "",
      latestStageStatus: "",
      source: "",
      status: "",
      latestStageName: "",
    }));
    setIsFilterSheetVisible(false);
  }, [dispatch]);

  const handleSort = useCallback((item: string) => {
    const isSortable = item === 'Applied' || item === 'Last Update';

    if (isSortable) {
      const isSameField = filters.sortBy === item;
      dispatch(setSort({
        sortBy: item,
        sortDir: isSameField
          ? (filters.sortDir === 'desc' ? 'asc' : 'desc')
          : 'desc',
      }));
    } else {
      setSelectedTab(item);
      setIsFilterSheetVisible(true);
    }
  }, [dispatch, filters.sortBy, filters.sortDir]);

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) return;
    dispatch(getApplicationsRequestAction(getApiParams(pagination.page + 1, true)));
  }, [loading, hasMore, pagination.page, getApiParams, dispatch]);

  const dataSource: RowItem[] = useMemo(() => {
    if (loading && (!applications || applications.length === 0)) {
      return Array.from({ length: SKELETON_ROWS }).map((_, i) => ({
        __skeleton: true,
        __id: `skeleton-${i}`,
      }));
    }
    return applications as RowItem[];
  }, [loading, applications]);

  const threeDotMenuItems = useMemo(() => [
    {
      name: 'Export to CSV',
      onPress: () => {
        dispatch(exportApplicationsRequestAction({ 
          params: getApiParams(1, false), 
          mode: 'download' 
        }));
      },
    },
  ], [dispatch, getApiParams]);

  const handleEndReached = useCallback(() => {
    if (!onEndReachedCalledRef.current) {
      handleLoadMore();
      onEndReachedCalledRef.current = true;
    }
  }, [handleLoadMore]);

  const handleMomentumScrollBegin = useCallback(() => {
    onEndReachedCalledRef.current = false;
  }, []);

  const canExport = can(PERMISSIONS.EXPORT_APPLICATIONS);

  return {
    // State
    isFilterSheetVisible,
    setIsFilterSheetVisible,
    selectedTab,
    setSelectedTab,
    threeDotOpen,
    setThreeDotOpen,
    
    // Derived Layout & Auth Data
    numColumns,
    isTablet,
    itemWidth,
    canExport,
    loading,
    applications,
    dataSource,
    threeDotMenuItems,
    
    // Handlers
    handleApplyFilters,
    handleClearAllFilters,
    handleSort,
    handleEndReached,
    handleMomentumScrollBegin,
  };
};
