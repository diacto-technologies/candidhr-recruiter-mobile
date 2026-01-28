import React, { Fragment, useEffect, useState, useCallback, useRef } from 'react';
import { View, Pressable } from 'react-native';
import { SortingAndFilter, Header, JobCardList, BottomSheet, FilterSheetContent, StatusBar } from '../../../components';
import { jobFiltersOption } from '../../../utils/dummaydata';
import { SvgXml } from 'react-native-svg';
import { pluscircle } from '../../../assets/svg/pluscircle';
import { useStyles } from './styles';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import { getJobsRequestAction, getPublishedJobsRequestAction, getUnpublishedJobsRequestAction } from '../../../features/jobs/actions';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectJobFilters, selectJobsActiveTab, selectJobsPagination } from '../../../features/jobs/selectors';
import { clearJobFilters, setJobFilters } from '../../../features/jobs/slice';
import { setApplicationsFilters } from '../../../features/applications/slice';
import { useFocusEffect } from '@react-navigation/native';
import { useNetworkConnectivity } from '../../../hooks/useNetworkConnectivity';
import { selectToken } from '../../../features/auth/selectors';

const JobsScreen = () => {
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const [filterSheet, setFilterSheet] = useState(false);
  const [selectedTab, setSelectedTab] = useState(jobFiltersOption[0]);
  const [openSearch, setOpenSearch] = useState(false);
  const pagination = useAppSelector(selectJobsPagination);
  const jobFilters = useAppSelector(selectJobFilters);
  const activeTab = useAppSelector(selectJobsActiveTab);
  const token = useAppSelector(selectToken);
  const isConnected = useNetworkConnectivity();

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

  // ✅ Track previous filters to detect title-only changes
  const prevFiltersRef = useRef(jobFilters);
  
  useEffect(() => {
    dispatch(getPublishedJobsRequestAction(jobFilters));
    dispatch(getUnpublishedJobsRequestAction(jobFilters));
  }, [jobFilters, token, isConnected]);

  // ✅ Debounce search by title, immediate for other filters
  useEffect(() => {
    const isTitleOnlyChange = 
      prevFiltersRef.current.title !== jobFilters.title &&
      JSON.stringify({ ...prevFiltersRef.current, title: undefined }) === 
      JSON.stringify({ ...jobFilters, title: undefined });
    if (isTitleOnlyChange) {
      // Title changed, debounce the API call
      const timer = setTimeout(() => {
        dispatch(
          getJobsRequestAction({
            page: 1,
            limit: pagination.limit,
            append: false,
            published: activeTab === "Published",
            ...jobFilters,
          })
        );
      }, 400);

      prevFiltersRef.current = jobFilters;
      return () => clearTimeout(timer);
    } else {
      // Other filters changed, call immediately
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
    }
  }, [jobFilters, activeTab, dispatch]);

  const handleApplyFilters = () => {
    dispatch(
      getJobsRequestAction({
        page: 1,
        limit: pagination.limit,
        published: activeTab === "Published",
        append: false,
        ...jobFilters,
      })
    );
    setFilterSheet(false);
  };

  return (
    <Fragment>
      <CustomSafeAreaView>
        <Header
          title="Jobs"
          enableJobSearch={true}
          simpleSearch={true}
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
        <View style={styles.container}>
          <JobCardList />
          {/* <View style={{ position: 'relative' }}>
            <Pressable
              style={{
                position: 'absolute',
                right: 1,
                bottom: -18,
              }}
            >
              <SvgXml xml={pluscircle} />
            </Pressable>
          </View> */}
          <View>
          </View>
        </View>
      </CustomSafeAreaView>
      <SortingAndFilter
        title="Filters"
        options={jobFiltersOption}
        onPressFilter={() => setFilterSheet(true)}
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
        onItemPress={(item) => {
          setSelectedTab(item);
          setFilterSheet(true)
        }} />
      <BottomSheet
        visible={filterSheet}
        onClose={() => setFilterSheet(false)}
        title="Filter by"
        showHeadline
        onClearAll={() => dispatch(clearJobFilters())}
      >
        <FilterSheetContent
          onCancel={() => setFilterSheet(false)}
          onApply={handleApplyFilters}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          job_Id={""}
          filtersConfig={jobFiltersOption}
          mode="job"
          onClearAll={() => dispatch(clearJobFilters())}
        />

      </BottomSheet>
    </Fragment>
  );
};

export default JobsScreen;
