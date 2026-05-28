import React from 'react';
import { View } from 'react-native';
import { SortingAndFilter, Header, JobCardList, BottomSheet, Typography } from '../../../components';
import JobFilterSheet from '../../../components/organisms/JobFilterSheet';
import { useStyles } from './styles';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import { jobFiltersOption, jobTabs } from './config';
import { colors } from '../../../theme/colors';
import { screenHeight } from '../../../utils/devicelayout';
import { useJobsController } from './hooks/useJobsController';

const JobsScreen = () => {
  const styles = useStyles();
  const ctrl = useJobsController();

  return (
    <CustomSafeAreaView>
      <Header
        title="Jobs"
        enableJobSearch
        simpleSearch
        simpleSearchPlaceholder="Search by title"
        openSearch={ctrl.openSearch}
        onSearchToggle={ctrl.setOpenSearch}
        searchText={ctrl.jobFilters?.title || ''}
        onSimpleSearch={ctrl.handleSearch}
        onSimpleClear={ctrl.handleClearSearch}
      />
      {ctrl.hasPermission ? (
        <View style={styles.container}>
          <JobCardList
            tabs={jobTabs}
            activeTab={ctrl.activeTab}
            jobsList={ctrl.jobsList}
            loading={ctrl.loading}
            isTabLoading={ctrl.isTabLoading}
            hasMore={ctrl.hasMore}
            publishedCount={ctrl.publishedCount}
            unpublishedCount={ctrl.unpublishedCount}
            favouritesCount={ctrl.favouritesCount}
            isConnected={ctrl.isConnected ?? true}
            onChangeTab={ctrl.handleChangeTab}
            onLoadMore={ctrl.handleLoadMore}
            onJobPress={ctrl.handleJobPress}
            favouriteJobIds={ctrl.favouriteJobIds}
            onToggleFavourite={ctrl.handleToggleFavourite}
          />
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
          <Typography
            variant="semiBoldTxtsm"
            color={colors.gray[600]}
            style={{ textAlign: 'center' }}
          >
            You don't have access to view this resource.
          </Typography>
        </View>
      )}

      <SortingAndFilter
        title="Filters"
        options={jobFiltersOption}
        onPressFilter={() => ctrl.setFilterSheet(true)}
        setSelectedTab={ctrl.setSelectedTab}
        selectedTab={ctrl.selectedTab}
        onItemPress={(item) => {
          ctrl.setSelectedTab(item);
          ctrl.setFilterSheet(true);
        }}
      />

      <BottomSheet
        visible={ctrl.filterSheet}
        onClose={() => ctrl.setFilterSheet(false)}
        title="Filter by"
        showHeadline
        onClearAll={ctrl.handleClearFilters}
        hight={screenHeight * 0.8}
      >
        <JobFilterSheet
          onCancel={() => ctrl.setFilterSheet(false)}
          onApply={ctrl.handleApplyFilters}
          selectedTab={ctrl.selectedTab}
          setSelectedTab={ctrl.setSelectedTab}
          onClearAll={ctrl.handleClearFilters}
        />
      </BottomSheet>
    </CustomSafeAreaView>
  );
};

export default JobsScreen;
