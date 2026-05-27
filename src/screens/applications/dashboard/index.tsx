import React, { Fragment } from 'react';
import { View, ScrollView } from 'react-native';
import { AppHeader, StatCard, ApplicationStageChart, FeatureConsumptionChart, ApplicationStageOverview, Typography } from '../../../components';
import SearchBar from '../../../components/atoms/searchbar';
import { Pressable } from 'react-native';
import { searchIcon } from '../../../assets/svg/search';
import { useStyles } from './styles';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import { navigate } from '../../../utils/navigationUtils';
import { colors } from '../../../theme/colors';
import { SvgXml } from 'react-native-svg';
import { permissionDeniedIcon } from '../../../assets/svg/permissionDenied';
import { STATS_CONFIG } from './constants';
import { useDashboardAccess } from './hooks/useDashboardAccess';
import { useDashboardData } from './hooks/useDashboardData';
import { useJobSearch } from './hooks/useJobSearch';

const Dashboard = () => {
    const styles = useStyles();

    const { dashboardAccessLoading, hasDashboardAccess } = useDashboardAccess();
    
    const {
        analyticsData,
        analyticsLoading,
        stageData,
        stageDataLoading,
        featureData,
        featureLoading,
        stageGraphOverview,
        stageGraphOverviewLoading,
        fetchDashboardData,
    } = useDashboardData();

    const {
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
    } = useJobSearch(fetchDashboardData);

    return (
        <Fragment>
            <CustomSafeAreaView>
                {dashboardAccessLoading || hasDashboardAccess ? (
                    <>
                        <AppHeader
                            title={
                                openSearch ? (
                                    <View style={{ flex: 1, marginRight: 16 }}>
                                        <SearchBar
                                            value={searchText}
                                            onChangeText={handleSearchTextChange}
                                            placeholder="Select a job"
                                            dropdown={true}
                                            data={jobNameList || []}
                                            onSelect={handleSelectJob}
                                            onEndReached={handleLoadMore}
                                            loading={jobNameListLoading}
                                            onClear={handleSearchClear}
                                        />
                                    </View>
                                ) : (
                                    selectedJob?.title || "Dashboard"
                                )
                            }
                            right={
                                <Pressable onPress={() => setOpenSearch(!openSearch)} style={{ padding: 8, marginRight: -8 }}>
                                    <SvgXml xml={searchIcon} />
                                </Pressable>
                            }
                        />
                        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
                            <View style={styles.listContainer}>
                                <View style={styles.statGrid}>
                                    {STATS_CONFIG.map((stat) => (
                                        <View key={stat.title} style={styles.statItem}>
                                            <StatCard
                                                title={stat.title}
                                                value={String(analyticsData?.[stat.dataKey as keyof typeof analyticsData] ?? 0)}
                                                isCompact={stat.isCompact}
                                                loading={analyticsLoading}
                                                percentage=""
                                                subText=""
                                                tooltipText={stat.tooltipText}
                                            />
                                        </View>
                                    ))}
                                </View>
                                <ApplicationStageChart
                                    stageData={stageData}
                                    loading={stageDataLoading}
                                />
                                <FeatureConsumptionChart
                                    featureData={featureData}
                                    loading={featureLoading}
                                />
                                <ApplicationStageOverview
                                    overview={stageGraphOverview}
                                    loading={stageGraphOverviewLoading}
                                    onViewMore={() => navigate('ApplicationOverviewDetails')}
                                />
                            </View>
                        </ScrollView>
                    </>
                ) : (
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <SvgXml xml={permissionDeniedIcon} color={colors.brand[600]} />
                        <Typography
                            variant="semiBoldTxtsm"
                            color={colors.gray[600]}
                            style={{ textAlign: 'center' }}
                        >
                            No access to view Dashboard.
                        </Typography>
                    </View>
                )}
            </CustomSafeAreaView>
        </Fragment>
    );
};

export default Dashboard;
