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
  APPLICANTS: "Applicants",
  RAPIDLY_APPLICANTS: "Rapidly Applicants",
} as const;

export type TabName = string;

export const useJobDetailsController = () => {
  const route = useRoute();
  const { jobId, org } = route.params as { jobId: string; org?: string };
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const { can } = usePermission();

  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('Name');

  const filters = useAppSelector(selectApplicationsFilters);
  const selectedJob = useAppSelector(selectSelectedJob);
  const jobsLoading = useAppSelector(selectJobsLoading);
  const origin = useAppSelector(organizationalOrigin);
  const pagination = useAppSelector(selectApplicationsPagination); 

  const isRapidhire = Boolean(selectedJob?.rapidhire_enabled);
  const applicantsTabName = isRapidhire ? TABS.RAPIDLY_APPLICANTS : TABS.APPLICANTS;
  const tabOptions = [TABS.OVERVIEW, applicantsTabName];

  const applicantCount = selectedJob?.applicants_count ?? pagination?.total ?? 0;
  const tabCounts: Record<string, number> = {
    [TABS.APPLICANTS]: applicantCount,
    [TABS.RAPIDLY_APPLICANTS]: applicantCount,
  };

  const [activeTab, setActiveTab] = useState<string>(TABS.OVERVIEW);

  const canPublish = can(PERMISSIONS.PUBLISH_JOB);
  const isPublished = Boolean(selectedJob?.published);

  useEffect(() => {
    if (jobId && org) {
      console.log('Deep link data:', jobId, org);
      // TODO: pass org to your API if needed, e.g. fetchJobDetails(jobId, org)
    }
  }, [jobId, org]);

  useEffect(() => {
    if (!jobId) return;
    dispatch(getJobDetailRequestAction(jobId));
  }, [jobId, dispatch]);

  useEffect(() => {
    if (activeTab !== TABS.OVERVIEW && activeTab !== applicantsTabName) {
      setActiveTab(applicantsTabName);
    }
  }, [applicantsTabName, activeTab]);

  useEffect(() => {
    if (isFocused && activeTab !== TABS.OVERVIEW) {
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
    if (!jobId) {
      showToastMessage('Job Form URL not available', 'error');
      return;
    }

    const url = `${origin}/apply/${jobId}`;
    Clipboard.setString(url);
    showToastMessage('Job Form URL copied to clipboard', 'success');
  }, [jobId, origin]);

  const handlePublishToggle = useCallback(() => {
    if (!jobId || !selectedJob || !canPublish || jobsLoading) return;
    dispatch(updateJobRequestAction({ id: jobId, published: !selectedJob.published }));
  }, [dispatch, jobId, selectedJob, canPublish, jobsLoading]);

  return {
    // State
    activeTab,
    setActiveTab,
    tabOptions,
    tabCounts,
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
