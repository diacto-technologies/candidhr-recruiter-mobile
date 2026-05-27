import { useState, useEffect, useCallback } from 'react';
import { useIsFocused, useRoute } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { usePermission } from '../../../../hooks/usePermission';
import { PERMISSIONS } from '../../../../utils/permission.constants';
import { showToastMessage } from '../../../../utils/toast';
import { store } from '../../../../store';
import { organizationalOrigin } from '../../../../features/auth';

import { 
  selectJobsLoading, 
  selectSelectedJob 
} from '../../../../features/jobs/selectors';
import { 
  getJobDetailRequestAction, 
  updateJobRequestAction 
} from '../../../../features/jobs/actions';

import { 
  setApplicationsFilters, 
  setSort 
} from '../../../../features/applications/slice';
import { 
  selectApplicationsFilters, 
  selectApplicationsPagination 
} from '../../../../features/applications/selectors';

const DEFAULT_FILTERS = { 
  name: "", 
  email: "", 
  appliedFor: "", 
  contact: "" 
};

export const TABS = {
  OVERVIEW: "Overview",
  APPLICANTS: "Applicants"
} as const;

export type TabName = typeof TABS[keyof typeof TABS];

export const useJobDetailsController = () => {
  const route = useRoute();
  const { jobId } = route.params as { jobId: string };
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const { can } = usePermission();

  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('Name');
  const [activeTab, setActiveTab] = useState<TabName>(TABS.OVERVIEW);

  const filters = useAppSelector(selectApplicationsFilters);
  const selectedJob = useAppSelector(selectSelectedJob);
  const jobsLoading = useAppSelector(selectJobsLoading);
  // Optional: const pagination = useAppSelector(selectApplicationsPagination); 

  const canPublish = can(PERMISSIONS.PUBLISH_JOB);
  const isPublished = Boolean(selectedJob?.published);

  useEffect(() => {
    if (!jobId) return;
    dispatch(getJobDetailRequestAction(jobId));
  }, [jobId, dispatch]);

  useEffect(() => {
    if (isFocused && activeTab === TABS.APPLICANTS) {
      dispatch(setApplicationsFilters(DEFAULT_FILTERS));
    }
  }, [isFocused, activeTab, dispatch]);

  const handleApplyFilters = useCallback(() => {
    setIsFilterSheetVisible(false);
  }, []);

  const handleClearAllFilters = useCallback(() => {
    dispatch(setApplicationsFilters(DEFAULT_FILTERS));
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

  const handleCopyUrl = useCallback(() => {
    if (!selectedJob?.encrypted) {
      showToastMessage('Job Form URL not available', 'error');
      return;
    }

    const url = `${organizationalOrigin(store.getState())}/app/candidate/${selectedJob.encrypted}/`;
    Clipboard.setString(url);
    showToastMessage('Job Form URL copied to clipboard', 'success');
  }, [selectedJob?.encrypted]);

  const handlePublishToggle = useCallback(() => {
    if (!jobId || !selectedJob || !canPublish || jobsLoading) return;
    dispatch(updateJobRequestAction({ id: jobId, published: !selectedJob.published }));
  }, [dispatch, jobId, selectedJob, canPublish, jobsLoading]);

  return {
    // State
    activeTab,
    setActiveTab,
    selectedTab,
    setSelectedTab,
    isFilterSheetVisible,
    setIsFilterSheetVisible,
    
    // Data
    selectedJob,
    jobsLoading,
    isPublished,
    canPublish,
    
    // Handlers
    handleApplyFilters,
    handleClearAllFilters,
    handleSort,
    handleCopyUrl,
    handlePublishToggle,
  };
};
