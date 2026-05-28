import React, { Fragment } from 'react';
import { View, ScrollView, FlatList, Text, Pressable } from 'react-native';
import { AppHeader, StatCard, ApplicationStageChart, FeatureConsumptionChart, ApplicationStageOverview, Typography } from '../../../components';
import SearchBar from '../../../components/atoms/searchbar';
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
                                    <View style={{ flex: 1, marginVertical: 12 }}>
                                        <SearchBar
                                            value={searchText}
                                            onChangeText={handleSearchTextChange}
                                            placeholder="Select a job"
                                            dropdown={true}
                                            externalDropdown={true}
                                            data={jobNameList || []}
                                            onSelect={handleSelectJob}
                                            onEndReached={handleLoadMore}
                                            loading={jobNameListLoading}
                                            onClear={handleSearchClear}
                                            style={{flex:1}}
                                        />
                                    </View>
                                ) : (
                                    <Pressable onPress={() => setOpenSearch(true)}>
                                        <Typography variant="semiBoldTxtxl" numberOfLines={1}>
                                        {"Dashboard"}
                                        </Typography>
                                    </Pressable>
                                )
                            }
                            right={
                                <Pressable onPress={() => setOpenSearch(!openSearch)} style={{ padding: 8, marginRight: -8 }}>
                                    <SvgXml xml={searchIcon} />
                                </Pressable>
                            }
                        />
                        {openSearch && (jobNameList?.length > 0 || jobNameListLoading) && (
                            <View style={{
                                position: 'absolute',
                                top: 60, // Places the dropdown right below the header
                                left: 16,
                                right: 16,
                                backgroundColor: colors.base.white,
                                zIndex: 9999,
                                elevation: 15,
                                borderRadius: 10,
                                maxHeight: 260,
                                borderWidth: 1,
                                borderColor: colors.gray[300],
                                shadowColor: '#0A0D12',
                                shadowOffset: { width: 0, height: 3 },
                                shadowOpacity: 0.08,
                                shadowRadius: 8,
                                overflow: 'hidden'
                            }}>
                                <FlatList
                                    data={jobNameList || []}
                                    keyExtractor={(item) => item.id}
                                    keyboardShouldPersistTaps="handled"
                                    showsVerticalScrollIndicator={true}
                                    renderItem={({ item }) => (
                                        <Pressable 
                                            style={{ paddingVertical: 14, paddingHorizontal: 12 }} 
                                            onPress={() => handleSelectJob(item)}
                                        >
                                            <Text style={{ fontSize: 16, color: colors.gray[900] }}>{item.title}</Text>
                                        </Pressable>
                                    )}
                                    onEndReached={handleLoadMore}
                                    onEndReachedThreshold={0.6}
                                    ListFooterComponent={() =>
                                        jobNameListLoading ? (
                                            <View style={{ padding: 12 }}>
                                                <Text style={{ textAlign: "center", color: colors.gray[500] }}>
                                                    Loading...
                                                </Text>
                                            </View>
                                        ) : null
                                    }
                                />
                            </View>
                        )}
                        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false} scrollEnabled={!openSearch}>
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
