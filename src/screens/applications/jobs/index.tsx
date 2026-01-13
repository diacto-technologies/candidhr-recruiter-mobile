import React, { Fragment, useEffect, useState, useCallback } from 'react';
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
import { clearJobFilters } from '../../../features/jobs/slice';
import { setApplicationsFilters } from '../../../features/applications/slice';
import { useFocusEffect } from '@react-navigation/native';

const JobsScreen = () => {
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const [filterSheet, setFilterSheet] = useState(false);
  const [selectedTab, setSelectedTab] = useState(jobFiltersOption[0]);
  const pagination = useAppSelector(selectJobsPagination);
  const jobFilters = useAppSelector(selectJobFilters);
  const activeTab = useAppSelector(selectJobsActiveTab);

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

  useEffect(() => {
    dispatch(getPublishedJobsRequestAction(jobFilters));
    dispatch(getUnpublishedJobsRequestAction(jobFilters));
  }, [jobFilters]);

  useEffect(() => {
    dispatch(
      getJobsRequestAction({
        page: 1,
        limit: pagination.limit,
        append: false,
        published: activeTab === "Published",
        ...jobFilters,
      })
    );
  }, [jobFilters, pagination.limit, activeTab]);

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
        <Header title='Jobs' />
        <View style={styles.container}>
          <JobCardList />
          <View style={{ position: 'relative' }}>
            <Pressable
              style={{
                position: 'absolute',
                right: 1,
                bottom: -18,
              }}
            >
              <SvgXml xml={pluscircle} />
            </Pressable>
          </View>
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
        onItemPress={function (item: string): void {
          throw new Error('Function not implemented.');
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
