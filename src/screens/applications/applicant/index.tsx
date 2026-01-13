import React, { Fragment, useCallback, useEffect, useRef, useMemo, useState } from 'react';
import { View, FlatList, useWindowDimensions } from 'react-native';
import { Header, SortingAndFilter, ApplicantList, Shimmer, BottomSheet, FilterSheetContent, Typography } from '../../../components';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { getApplicationsRequestAction } from '../../../features/applications/actions';
import { useAppSelector } from '../../../hooks/useAppSelector';
import {
  selectApplications,
  selectApplicationsFilters,
  selectApplicationsHasMore,
  selectApplicationsLoading,
  selectApplicationsPagination,
} from '../../../features/applications/selectors';
import { Application } from '../../../features/applications/types';
import { setApplicationsFilters, setSort } from '../../../features/applications/slice';
import { applicantFiltersOption } from '../../../utils/dummaydata';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../../../theme/colors';

const SKELETON_ROWS = 6;

type RowItem = Application | { __skeleton: true; __id: string };

const ApplicantScreen = () => {
  const [filterSheet, setFilterSheet] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Name');
  const inset = useRNSafeAreaInsets();
  const dispatch = useAppDispatch();
  const applications = useAppSelector(selectApplications);
  const pagination = useAppSelector(selectApplicationsPagination);
  const hasMore = useAppSelector(selectApplicationsHasMore);
  const loading = useAppSelector(selectApplicationsLoading);
  const filters = useAppSelector(selectApplicationsFilters);

  const onEndReachedCalledRef = useRef(false);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const numColumns = isTablet ? 3 : 1;
  const horizontalPadding = 32;
  const gap = 16;
  const availableWidth = width - horizontalPadding - gap * (numColumns - 1);
  const itemWidth = availableWidth / numColumns;

  const getApiParams = useCallback((page: number, append: boolean = false) => {
    const params: any = {
      page,
      limit: pagination.limit,
    };

    if (append) {
      params.append = true;
    }

    if (filters.name) params.applicantName = filters.name;
    if (filters.email) params.email = filters.email;
    if (filters.appliedFor) params.jobTitle = filters.appliedFor;
    if (filters.contact) params.contact = filters.contact;
    if (filters.sort) params.sort = filters.sort;

    return params;
  }, [filters, pagination.limit]);

  const skipInitialFetch = useRef(true);

  useEffect(() => {
    dispatch(getApplicationsRequestAction(getApiParams(1, false)));
    skipInitialFetch.current = false;
  }, [dispatch, getApiParams]);

  // // Refetch when filters or sort change (permanent fix - no setTimeout)
  // useEffect(() => {
  //   // Skip initial fetch - useFocusEffect handles that
  //   if (skipInitialFetch.current) {
  //     return;
  //   }
    
  //   // Refetch when any filter or sort changes
  //   dispatch(getApplicationsRequestAction(getApiParams(1, false)));
  // }, [filters.sort, filters.name, filters.email, filters.appliedFor, filters.contact, dispatch, getApiParams]);

  const handleApplyFilters = () => {
    setFilterSheet(false);
  };

  const handleClearAllFilters = () => {
    dispatch(setApplicationsFilters({ name: "", email: "", appliedFor: "", contact: "" }));
    setFilterSheet(false);
  };

  const handleSort = (item: string) => {
    const isSortable = item === 'Applied' || item === 'Last Update';
  
    if (isSortable) {
      const isSameField = filters.sortBy === item;
  
      dispatch(setSort({
        sortBy: item,
        sortDir: isSameField
          ? (filters.sortDir === 'desc' ? 'asc' : 'desc')   
          : 'desc',                                         
      }));
    } else {
      setSelectedTab(item);
      setFilterSheet(true)
    }
  };

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) return;
    dispatch(getApplicationsRequestAction(getApiParams(pagination.page + 1, true)));
  }, [dispatch, loading, hasMore, pagination.page, getApiParams]);


  const dataSource: RowItem[] = useMemo(() => {
    if (loading && (!applications || applications.length === 0)) {
      return Array.from({ length: SKELETON_ROWS }).map((_, i) => ({
        __skeleton: true,
        __id: `skeleton-${i}`,
      }));
    }
    return applications as RowItem[];
  }, [loading, applications]);

  const renderItem = useCallback(
    ({ item }: { item: RowItem }) =>
      (item as any).__skeleton ? (
        <ApplicantList item={undefined} loading cardWidth={itemWidth} />
      ) : (
        <ApplicantList item={item as Application} cardWidth={itemWidth} />
      ),
    []
  );

  return (
    <Fragment>
      <CustomSafeAreaView>
        <Header title="Applicants" />
        {!loading && applications.length === 0 && (
                <View
                    style={{
                        alignItems: "center",
                        marginTop: 60,
                        paddingHorizontal: 16,
                    }}
                >
                    <Typography variant="semiBoldTxtmd">
                        No results found
                    </Typography>
                    <Typography
                        variant="regularTxtsm"
                        color={colors.gray[500]}
                        style={{ marginTop: 6, textAlign: "center" }}
                    >
                        Try adjusting your search or filters
                    </Typography>
                </View>
            )}
        <FlatList<RowItem>
          data={dataSource}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 16, gap: 12 }}
          onEndReached={() => {
            if (!onEndReachedCalledRef.current) {
              handleLoadMore();
              onEndReachedCalledRef.current = true;
            }
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            onEndReachedCalledRef.current = false;
          }}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          ListFooterComponent={
            loading && applications.length > 0
              ? <Shimmer />
              : null
          }
          removeClippedSubviews={false}
          keyExtractor={(item, index) => {
            if ((item as any).__skeleton) return `skeleton-${(item as any).__id ?? index}`;
            const id = (item as Application).id ?? 'no-id';
            return `app-${id}-${index}`;
          }}
        //numColumns={numColumns}
        //columnWrapperStyle={numColumns > 1 ? { justifyContent: "space-between", gap: 16 } : undefined}
        />
      </CustomSafeAreaView>
      <SortingAndFilter
        title="Filters"
        options={applicantFiltersOption}
        onPressFilter={() => setFilterSheet(true)}
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab} 
        onItemPress={(t)=>handleSort(t)}
        />

      <BottomSheet
        visible={filterSheet}
        onClose={() => setFilterSheet(false)}
        onClearAll={() => handleClearAllFilters()}
        title="Filter by"
        showHeadline
      >
        <FilterSheetContent
          onCancel={() => setFilterSheet(false)}
          onApply={()=>handleApplyFilters()}
          onClearAll={() => setFilterSheet(false)}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          job_Id={""}
          filtersConfig={applicantFiltersOption} mode={'applicant'}        />
      </BottomSheet>
    </Fragment>
  );
};

export default ApplicantScreen;
