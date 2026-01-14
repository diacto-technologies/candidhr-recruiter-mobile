import React, { Fragment, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header, Button, StatCard, ApplicationStageChart, FeatureConsumptionChart, ApplicationStageOverview, SortingAndFilter, BottomSheet } from '../../../components';
import { colors } from '../../../theme/colors';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStyles } from './styles';
import { selectRefreshToken, selectToken, tenant } from '../../../features/auth/selectors';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../states/reduxHook';
import { getProfileRequestAction } from '../../../features/profile/actions';
import { getAnalyticsRequestAction, getFeatureConsumptionRequestAction, getStageGraphOverviewRequestAction, getStageGraphRequestAction, getWeeklyGraphRequestAction } from '../../../features/dashbaord/actions';
import { selectAnalyticsData, selectAnalyticsLoaded } from '../../../features/dashbaord/selectors';
import { selectProfileLoading } from '../../../features/profile';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';

const Dashboard = () => {
    const dispatch = useAppDispatch();
    const styles = useStyles();
    const profileLoaded = useAppSelector(selectProfileLoading);
    const analyticsData = useAppSelector(selectAnalyticsData)
    const analyticsLoaded = useAppSelector(selectAnalyticsLoaded)

    // useFocusEffect(
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
    //   );
    return (
        <Fragment>
            <CustomSafeAreaView>
                <Header title='Dashboard' />
                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
                    <View style={styles.listContainer}>
                        <StatCard
                            title="Total Applications"
                            value={String(analyticsData?.total_applicants ?? 0)}
                            percentage="2.5%"
                            subText="Greater than last month"
                            onPressInfo={() => console.log('Info clicked')}
                        />
                        <StatCard
                            title="Total Jobs"
                            value={String(analyticsData?.total_jobs ?? 0)}
                            percentage="2.5%"
                            subText="Greater than last month"
                            onPressInfo={() => console.log('Info clicked')}
                        />
                        <StatCard
                            title="Applicant to Assessment Ratio"
                            value={String(analyticsData?.assessment_ratio ?? 0)}
                            percentage="2.5%"
                            subText="Greater than last month"
                            onPressInfo={() => console.log('Info clicked')}
                        />
                        //
                        <StatCard
                            title="Applicant to Interview Ratio"
                            value={String(analyticsData?.personality_screening_ratio ?? 0)}
                            percentage="2.5%"
                            subText="Greater than last month"
                            onPressInfo={() => console.log('Info clicked')}
                        />
                        <StatCard
                            title="Days to Fill"
                            value={String(analyticsData?.close_fill ?? 0)}
                            percentage="2.5%"
                            subText="Greater than last month"
                            onPressInfo={() => console.log('Info clicked')}
                        />
                        <StatCard
                            title="Job Views"
                            value={String(analyticsData?.job_views ?? 0)}
                            percentage="2.5%"
                            subText="Greater than last month"
                            onPressInfo={() => console.log('Info clicked')}
                        />
                        <StatCard
                            title="Active Candidates"
                            value={String(analyticsData?.active_applications ?? 0)}
                            percentage="2.5%"
                            subText="Greater than last month"
                            onPressInfo={() => console.log('Info clicked')}
                        />
                        <StatCard
                            title="Drop-off Rate"
                            value={String(analyticsData?.drop_off_rate ?? "0")}
                            percentage="2.5%"
                            subText="Greater than last month"
                            onPressInfo={() => console.log('Info clicked')}
                        />
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

