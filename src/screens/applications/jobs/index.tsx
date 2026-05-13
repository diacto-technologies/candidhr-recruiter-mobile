import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text } from 'react-native';
import { SortingAndFilter, Header, JobCardList, BottomSheet, FilterSheetContent, Typography } from '../../../components';
import { jobFiltersOption } from '../../../utils/dummaydata';
import { useStyles } from './styles';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import {
  getJobsRequestAction,
  getPublishedJobsRequestAction,
  getUnpublishedJobsRequestAction
} from '../../../features/jobs/actions';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
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
} from '../../../features/jobs/selectors';
import { clearFavouriteJobs, clearJobFilters, setJobFilters, setActiveTab, toggleFavouriteJob } from '../../../features/jobs/slice';
import { setApplicationsFilters } from '../../../features/applications/slice';
import { useFocusEffect } from '@react-navigation/native';
import { useNetworkConnectivity } from '../../../hooks/useNetworkConnectivity';
import { navigate } from '../../../utils/navigationUtils';
import { selectToken } from '../../../features/auth/selectors';
import { jobTabs } from './config';
import { usePermission } from '../../../hooks/usePermission';
import { PERMISSIONS } from '../../../utils/permission.constants';
import { selectProfile, selectProfileError, selectProfileLoading } from '../../../features/profile/selectors';
import { screenHeight } from '../../../utils/devicelayout';
import { colors } from '../../../theme/colors';

const JobsScreen = () => {
  const styles = useStyles();
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const { can } = usePermission();
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
  const accessLoading =
  profileLoading || (profile === null && profileError === null);

  useFocusEffect(
    useCallback(() => {
      dispatch(setApplicationsFilters({
        name: "",
        email: "",
        appliedFor: "",
        contact: ""
      }));
    }, [dispatch])
  );

  const prevFiltersRef = useRef(jobFilters);

  useEffect(() => {
    if (!isConnected) return;
    dispatch(getPublishedJobsRequestAction(jobFilters));
    dispatch(getUnpublishedJobsRequestAction(jobFilters));
  }, [token, isConnected, jobFilters]);

  /** Single source for page-1 job list (tab, filters, favourites). Tab handler only updates `activeTab` to avoid double `getJobs` with a debounced effect. */
  useEffect(() => {
    if (!isConnected) return;
    const timer = setTimeout(() => {
      if (activeTab === "Favourites") {
        if (!favouriteJobIds.length) {
          dispatch(clearFavouriteJobs());
          return;
        }
        dispatch(
          getJobsRequestAction({
            page: 1,
            limit: pagination.limit,
            append: false,
            favourites: true,
            idIn: favouriteJobIds.join(","),
            ...jobFilters,
          })
        );
        prevFiltersRef.current = jobFilters;
        return;
      }

      dispatch(
        getJobsRequestAction({
          page: 1,
          limit: pagination.limit,
          append: false,
          published: activeTab === "Published",
          ...jobFilters,
        })
      );
      prevFiltersRef.current = jobFilters;
    }, 400);

    return () => clearTimeout(timer);
  }, [jobFilters, isConnected, pagination.limit, activeTab, favouriteJobIds, dispatch]);

  const handleApplyFilters = () => {
    if (!isConnected) return;

    dispatch(
      getJobsRequestAction({
        page: 1,
        limit: pagination.limit,
        ...(activeTab === "Favourites"
          ? {
            favourites: true,
            idIn: favouriteJobIds.join(","),
          }
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
    if (!isConnected || loading || !hasMore) return;

    dispatch(
      getJobsRequestAction({
        page: pagination.page + 1,
        limit: pagination.limit,
        append: true,
        ...(activeTab === "Favourites"
          ? {
            favourites: true,
            idIn: favouriteJobIds.join(","),
          }
          : { published: activeTab === "Published" }),
        ...jobFilters,
      })
    );
  };
  // if (!can(PERMISSIONS.VIEW_JOB)) {
  //   return (
  //     <CustomSafeAreaView>
  //       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //         <Text>You don't have permission to view Jobs</Text>
  //       </View>
  //     </CustomSafeAreaView>
  //   );
  // }
  return (
    <CustomSafeAreaView>
      <Header
        title="Jobs"
        enableJobSearch
        simpleSearch
        simpleSearchPlaceholder="Search by title"
        openSearch={openSearch}
        onSearchToggle={setOpenSearch}
        searchText={jobFilters?.title || ''}
        onSimpleSearch={(text) => {
          dispatch(setJobFilters({ ...jobFilters, title: text }));
        }}
        onSimpleClear={() => {
          dispatch(setJobFilters({ ...jobFilters, title: '' }));
          setOpenSearch(false);
        }}
      />
      {accessLoading || can(PERMISSIONS.VIEW_JOB) ?
        <View style={styles.container}>
          <JobCardList
            tabs={jobTabs}
            activeTab={activeTab}
            jobsList={jobsList}
            loading={loading}
            isTabLoading={isTabLoading}
            hasMore={hasMore}
            publishedCount={publishedCount}
            unpublishedCount={unpublishedCount}
            favouritesCount={favouritesCount}
            isConnected={isConnected}
            onChangeTab={handleChangeTab}
            onLoadMore={handleLoadMore}
            onJobPress={(jobId) => navigate('JobDetailScreen', { jobId })}
            favouriteJobIds={favouriteJobIds}
            onToggleFavourite={(jobId) => dispatch(toggleFavouriteJob(jobId))}
          />
        </View>
        :
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
          <Typography
            variant="semiBoldTxtsm"
            color={colors.gray[600]}
            style={{ textAlign: 'center' }}
          >
            You don't have access to view this resource.
          </Typography>
        </View>}

      <SortingAndFilter
        title="Filters"
        options={jobFiltersOption}
        onPressFilter={() => setFilterSheet(true)}
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
        onItemPress={(item) => {
          setSelectedTab(item);
          setFilterSheet(true);
        }}
      />

      <BottomSheet
        visible={filterSheet}
        onClose={() => setFilterSheet(false)}
        title="Filter by"
        showHeadline
        onClearAll={() => dispatch(clearJobFilters())} hight={screenHeight * 0.8}>
        <FilterSheetContent
          onCancel={() => setFilterSheet(false)}
          onApply={handleApplyFilters}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          job_Id=""
          filtersConfig={jobFiltersOption}
          mode="job"
          onClearAll={() => dispatch(clearJobFilters())}
        />
      </BottomSheet>
    </CustomSafeAreaView>
  );
};

export default JobsScreen;
