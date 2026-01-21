import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header, Button, StatusBar, StatCard, ApplicationStageChart, FeatureConsumptionChart, ApplicationStageOverview, SortingAndFilter, BottomSheet } from '../../../components';
import { colors } from '../../../theme/colors';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStyles } from './styles';
import { selectRefreshToken, selectToken, tenant } from '../../../features/auth/selectors';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { getProfileRequestAction } from '../../../features/profile/actions';
import { getAnalyticsRequestAction, getFeatureConsumptionRequestAction, getStageGraphOverviewRequestAction, getStageGraphRequestAction, getWeeklyGraphRequestAction } from '../../../features/dashbaord/actions';
import { selectAnalyticsData, selectAnalyticsLoaded } from '../../../features/dashbaord/selectors';
import { selectProfileLoading } from '../../../features/profile';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
// ✅ jobs module (job-names-list API)
import {
  getJobNameListRequestAction,
  selectJobNameList,
  selectJobNameListLoading,
  selectJobNameListNext,
  selectSelectedJob,
  setSelectedJobAction,
} from '../../../features/jobs';

const Dashboard = () => {
    const dispatch = useAppDispatch();
    const styles = useStyles();
    const profileLoaded = useAppSelector(selectProfileLoading);
    const analyticsData = useAppSelector(selectAnalyticsData)
    const analyticsLoaded = useAppSelector(selectAnalyticsLoaded)

    // ✅ Job search state
    const [openSearch, setOpenSearch] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    
    // ✅ Ref to prevent double API calls when clearing
    const isClearingRef = useRef(false);

    // ✅ jobs redux state
    const jobNameList = useAppSelector(selectJobNameList);
    const jobNameListNext = useAppSelector(selectJobNameListNext);
    const jobNameListLoading = useAppSelector(selectJobNameListLoading);
    const selectedJob = useAppSelector(selectSelectedJob);

    // ✅ Initial data load
    // Note: Using analyticsLoaded check means if user selects job and navigates away/back,
    // analytics won't refresh if analyticsLoaded is still true.
    // Optional: Use useFocusEffect from @react-navigation/native to always refresh on focus
    useEffect(() => {
        if (!profileLoaded) {
            dispatch(getProfileRequestAction());
        }
        if (!analyticsLoaded) {
            dispatch(getAnalyticsRequestAction());
            dispatch(getStageGraphRequestAction());
            dispatch(getFeatureConsumptionRequestAction());
            // dispatch(getWeeklyGraphRequestAction());
            dispatch(getStageGraphOverviewRequestAction());
        }
    }, [profileLoaded, analyticsLoaded])

    // ✅ fetch first page when opening search
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

    // ✅ Show selectedJob title in input when opening search
    // Only set when search first opens, not when user is typing/clearing
    const prevOpenSearchRef = useRef(false);
    useEffect(() => {
        // Only set when search transitions from closed to open (not on every render)
        if (openSearch && !prevOpenSearchRef.current && selectedJob?.title) {
            // Only set if text is empty (don't override user input)
            if (searchText === '') {
                setSearchText(selectedJob.title);
            }
        }
        prevOpenSearchRef.current = openSearch;
    }, [openSearch, selectedJob]);
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

    const handleLoadMore = useCallback(() => {
        if (!jobNameListNext) return; // no next page
        if (jobNameListLoading) return;

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

    // ✅ on job select
    const handleSelectJob = useCallback(
        (item: any) => {
            console.log(item, "itemitemitemitemitemitem")
            // item should be { id, title }
            dispatch(setSelectedJobAction(item)); // store selected job in jobs slice

            // ✅ Ensure the selected job title is visible in search bar
            if (item?.title) {
                setSearchText(item.title);
            }

            // ✅ refresh dashboard analytics based on selected job
            dispatch(getAnalyticsRequestAction(item.id));
            dispatch(getStageGraphRequestAction(item.id));
            dispatch(getFeatureConsumptionRequestAction(item.id));
            dispatch(getStageGraphOverviewRequestAction(item.id));

            // Close search immediately
            setOpenSearch(false);
        },
        [dispatch]
    );

    // ✅ handle search clear
    const handleSearchClear = useCallback(() => {
        isClearingRef.current = true;

        setSearchText('');
        setPage(1);
        setOpenSearch(false);
        // Clear selected job and reload default analytics
        dispatch(setSelectedJobAction(null));
        dispatch(getAnalyticsRequestAction());
        dispatch(getStageGraphRequestAction());
        dispatch(getFeatureConsumptionRequestAction());
        dispatch(getStageGraphOverviewRequestAction());

        setTimeout(() => {
            isClearingRef.current = false;
        }, 300);
    }, [dispatch]);

    //   );
    return (
        <Fragment>
            <CustomSafeAreaView>
                <Header 
                    title='Dashboard' 
                    enableJobSearch={true}
                    jobNameList={jobNameList}
                    jobNameListLoading={jobNameListLoading}
                    jobNameListNext={jobNameListNext}
                    searchText={searchText}
                    onSearchTextChange={setSearchText}
                    openSearch={openSearch}
                    onSearchToggle={setOpenSearch}
                    onLoadMore={handleLoadMore}
                    onJobSelect={handleSelectJob}
                    onSearchClear={handleSearchClear}
                    selectedJob={selectedJob}
                />
                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
                    <View style={styles.listContainer}>
                        <View style={styles.statGrid}>
                            <View style={styles.statItem}>
                                <StatCard
                                    title="Appliacnts"
                                    value={String(analyticsData?.total_applicants ?? 0)}
                                    percentage="2.5%"
                                    subText="Greater than last month"
                                    tooltipText="Total number of applicants"
                                />
                            </View>

                            <View style={styles.statItem}>
                                <StatCard
                                    title="Total Jobs"
                                    value={String(analyticsData?.total_jobs ?? 0)}
                                    percentage="2.5%"
                                    subText="Greater than last month"
                                    onPressInfo={() => console.log("Info clicked")}
                                    tooltipText="Total number of job postings currently on the platform."
                                />
                            </View>

                            <View style={styles.statItem}>
                                <StatCard
                                    title="Applicant to Assessment Ratio"
                                    value={String(analyticsData?.assessment_ratio ?? 0)}
                                    percentage="2.5%"
                                    subText="Greater than last month"
                                    onPressInfo={() => console.log("Info clicked")}
                                    tooltipText="How many applicants proceed from application to assessment."
                                />
                            </View>

                            <View style={styles.statItem}>
                                <StatCard
                                    title="Applicant to Interview Ratio"
                                    value={String(analyticsData?.personality_screening_ratio ?? 0)}
                                    percentage="2.5%"
                                    subText="Greater than last month"
                                    onPressInfo={() => console.log("Info clicked")}
                                    tooltipText="Percentage of applicants who reached the interview stage."
                                />
                            </View>

                            <View style={styles.statItem}>
                                <StatCard
                                    title="Days to Fill"
                                    value={String(analyticsData?.close_fill ?? 0)}
                                    percentage="2.5%"
                                    subText="Greater than last month"
                                    onPressInfo={() => console.log("Info clicked")}
                                    tooltipText="Average days taken to close a job after it was posted."
                                />
                            </View>

                            <View style={styles.statItem}>
                                <StatCard
                                    title="Job Views"
                                    value={String(analyticsData?.job_views ?? 0)}
                                    percentage="2.5%"
                                    subText="Greater than last month"
                                    onPressInfo={() => console.log("Info clicked")}
                                    tooltipText="Total number of views."
                                />
                            </View>

                            <View style={styles.statItem}>
                                <StatCard
                                    title="Active Candidates"
                                    value={String(analyticsData?.active_applications ?? 0)}
                                    percentage="2.5%"
                                    subText="Greater than last month"
                                    onPressInfo={() => console.log("Info clicked")}
                                    tooltipText="Candidates who are actively in the hiring process pipeline (Not rejected or hired yet)."
                                />
                            </View>

                            <View style={styles.statItem}>
                                <StatCard
                                    title="Drop-off Rate"
                                    value={String(analyticsData?.drop_off_rate ?? "0")}
                                    percentage="2.5%"
                                    subText="Greater than last month"
                                   tooltipText="Percentage of candidates who started but did not complete the application or assessment process."               
                                />
                            </View>
                        </View>
                        <ApplicationStageChart
                        />
                        <FeatureConsumptionChart />
                        <ApplicationStageOverview />
                    </View>
                </ScrollView>
            </CustomSafeAreaView>
            {/* </SafeAreaView> */}
        </Fragment>
    );
};

export default Dashboard;

