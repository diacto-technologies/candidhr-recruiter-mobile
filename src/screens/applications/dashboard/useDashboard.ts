import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { getProfileRequestAction } from '../../../features/profile/actions';
import { getAnalyticsRequestAction, getFeatureConsumptionRequestAction, getStageGraphOverviewRequestAction, getStageGraphRequestAction } from '../../../features/dashbaord/actions';
import { selectAnalyticsData, selectAnalyticsLoaded, selectApplicantStageGraphLoading, selectApplicantStageGraphResults, selectFeatureConsumption, selectFeatureConsumptionLoading, selectStageGraphOverview, selectStageGraphOverviewLoading } from '../../../features/dashbaord/selectors';
import { selectProfile, selectProfileError, selectProfileLoading } from '../../../features/profile';
import { getJobNameListRequestAction, selectJobNameList, selectJobNameListLoading, selectJobNameListNext, selectSelectedJob, setSelectedJobAction } from '../../../features/jobs';
import { usePermission } from '../../../hooks/usePermission';
import { PERMISSIONS } from '../../../utils/permission.constants';

export const useDashboard = () => {
    const dispatch = useAppDispatch();
    
    // Selectors
    const profile = useAppSelector(selectProfile);
    const profileLoading = useAppSelector(selectProfileLoading);
    const profileError = useAppSelector(selectProfileError);
    
    const analyticsData = useAppSelector(selectAnalyticsData);
    const analyticsLoaded = useAppSelector(selectAnalyticsLoaded);
    const stageData = useAppSelector(selectApplicantStageGraphResults);
    const stageDataLoading = useAppSelector(selectApplicantStageGraphLoading);
    const featureData = useAppSelector(selectFeatureConsumption);
    const featureLoading = useAppSelector(selectFeatureConsumptionLoading);
    const stageGraphOverview = useAppSelector(selectStageGraphOverview);
    const stageGraphOverviewLoading = useAppSelector(selectStageGraphOverviewLoading);

    const jobNameList = useAppSelector(selectJobNameList);
    const jobNameListNext = useAppSelector(selectJobNameListNext);
    const jobNameListLoading = useAppSelector(selectJobNameListLoading);
    const selectedJob = useAppSelector(selectSelectedJob);

    const { can } = usePermission();

    // Local State
    const [openSearch, setOpenSearch] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);

    /** Until profile exists (or fetch failed), `can()` is unreliable — don’t show “no access” yet. */
    const dashboardAccessLoading = profileLoading || (profile === null && profileError === null);
    const hasDashboardAccess = can(PERMISSIONS.VIEW_DASHBOARD);

    // Data Fetching Helper
    const fetchDashboardData = useCallback((jobId?: string) => {
        dispatch(getAnalyticsRequestAction(jobId));
        dispatch(getStageGraphRequestAction(jobId));
        dispatch(getFeatureConsumptionRequestAction(jobId));
        dispatch(getStageGraphOverviewRequestAction(jobId));
    }, [dispatch]);

    // Initial Fetch Effect
    useEffect(() => {
        // Prevent infinite loop by checking if profile actually exists or has an error
        if (!profile && !profileLoading && !profileError) {
            dispatch(getProfileRequestAction());
        }
        
        if (!analyticsLoaded) {
            fetchDashboardData();
        }
    }, [profile, profileLoading, profileError, analyticsLoaded, dispatch, fetchDashboardData]);

    // Search Toggle Effect
    useEffect(() => {
        if (openSearch) {
            setPage(1);
            dispatch(
                getJobNameListRequestAction({
                    page: 1,
                    search: '',
                    append: false,
                })
            );
        }
    }, [openSearch, dispatch]);

    const prevOpenSearchRef = useRef(false);
    useEffect(() => {
        if (openSearch && !prevOpenSearchRef.current && selectedJob?.title) {
            if (searchText === '') {
                setSearchText(selectedJob.title);
            }
        }
        prevOpenSearchRef.current = openSearch;
    }, [openSearch, selectedJob, searchText]);

    // Debounced Search Effect
    useEffect(() => {
        if (!openSearch) return;

        const timer = setTimeout(() => {
            setPage(1);
            dispatch(
                getJobNameListRequestAction({
                    page: 1,
                    search: searchText,
                    append: false,
                })
            );
        }, 400);

        return () => clearTimeout(timer);
    }, [searchText, openSearch, dispatch]);

    // Handlers
    const handleLoadMore = useCallback(() => {
        if (!jobNameListNext || jobNameListLoading) return;

        const nextPage = page + 1;
        setPage(nextPage);

        dispatch(
            getJobNameListRequestAction({
                page: nextPage,
                search: searchText,
                append: true,
            })
        );
    }, [jobNameListNext, jobNameListLoading, page, searchText, dispatch]);

    const handleSelectJob = useCallback((item: any) => {
        dispatch(setSelectedJobAction(item));
        if (item?.title) {
            setSearchText(item.title);
        }
        fetchDashboardData(item.id);
        setOpenSearch(false);
    }, [dispatch, fetchDashboardData]);

    const handleSearchClear = useCallback(() => {
        setSearchText('');
        setPage(1);
        setOpenSearch(false);
        dispatch(setSelectedJobAction(null));
        fetchDashboardData();
    }, [dispatch, fetchDashboardData]);

    const handleSearchTextChange = useCallback((text: string) => {
        if (text === '') {
            handleSearchClear();
            return;
        }
        setSearchText(text);
    }, [handleSearchClear]);

    return {
        dashboardAccessLoading,
        hasDashboardAccess,
        analyticsData,
        stageData,
        stageDataLoading,
        featureData,
        featureLoading,
        stageGraphOverview,
        stageGraphOverviewLoading,
        jobNameList,
        jobNameListLoading,
        jobNameListNext,
        selectedJob,
        openSearch,
        searchText,
        setOpenSearch,
        handleLoadMore,
        handleSelectJob,
        handleSearchClear,
        handleSearchTextChange,
    };
};
