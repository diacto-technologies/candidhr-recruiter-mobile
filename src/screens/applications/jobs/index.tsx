import React, { Fragment, useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import { SortingAndFilter, Header, JobCardList, BottomSheet, FilterSheetContent, StatusBar } from '../../../components';
import { filtersOption } from '../../../utils/dummaydata';
import { SvgXml } from 'react-native-svg';
import { pluscircle } from '../../../assets/svg/pluscircle';
import { useStyles } from './styles';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import {getPublishedJobsRequestAction, getUnpublishedJobsRequestAction } from '../../../features/jobs/actions';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import {selectJobsPagination } from '../../../features/jobs/selectors';

const JobsScreen = () => {
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const [filterSheet, setFilterSheet] = useState(false);
  const pagination = useAppSelector(selectJobsPagination);

  useEffect(() => {
    dispatch(
      getPublishedJobsRequestAction({
            page: 1,
            limit: pagination.limit,
        })
    );
    dispatch(
      getUnpublishedJobsRequestAction({
          page: 1,
          limit: pagination.limit,
      })
  );
}, []);

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
        options={filtersOption}
        onPressFilter={() => setFilterSheet(true)}
      />
      <BottomSheet
        visible={filterSheet}
        onClose={() => setFilterSheet(false)}
        title="Filter by"
        showHeadline
      >
        <FilterSheetContent
          onCancel={() => setFilterSheet(false)}
          onApply={() => setFilterSheet(false)}
          onClearAll={() => console.log('Clear all')}
        />
      </BottomSheet>
    </Fragment>
  );
};

export default JobsScreen;
