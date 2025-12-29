// screens/ApplicantScreen/index.tsx
import React, { Fragment, useCallback, useEffect, useRef, useMemo } from 'react';
import { View, FlatList, useWindowDimensions } from 'react-native';
import { Header, SortingAndFilter, ApplicantList, Shimmer } from '../../../components';
import { filtersOption } from '../../../utils/dummaydata';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { getApplicationsRequestAction } from '../../../features/applications/actions';
import { useAppSelector } from '../../../hooks/useAppSelector';
import {
  selectApplications,
  selectApplicationsHasMore,
  selectApplicationsLoading,
  selectApplicationsPagination,
} from '../../../features/applications/selectors';
import { Application } from '../../../features/applications/types';

const SKELETON_ROWS = 6;

type RowItem = Application | { __skeleton: true; __id: string };

const ApplicantScreen = () => {
  const inset = useRNSafeAreaInsets();
  const dispatch = useAppDispatch();
  const applications = useAppSelector(selectApplications);
  const pagination = useAppSelector(selectApplicationsPagination);
  const hasMore = useAppSelector(selectApplicationsHasMore);
  const loading = useAppSelector(selectApplicationsLoading);

  const onEndReachedCalledRef = useRef(false);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const numColumns = isTablet ? 3 : 1;
  const horizontalPadding = 32; // 16 left + 16 right from contentContainerStyle
  const gap = 16;

  const availableWidth = width - horizontalPadding - gap * (numColumns - 1);

  const itemWidth = availableWidth / numColumns;

  useEffect(() => {
    dispatch(
      getApplicationsRequestAction({
        page: 1,
        limit: pagination.limit,
      })
    );
  }, [dispatch, pagination.limit]);

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) return;

    dispatch(
      getApplicationsRequestAction({
        page: pagination.page + 1,
        limit: pagination.limit,
        append: true,
      })
    );
  }, [dispatch, loading, hasMore, pagination.page, pagination.limit]);

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
        <ApplicantList item={item as Application} cardWidth={itemWidth}/>
      ),
    []
  );

  return (
    <Fragment>
      <CustomSafeAreaView>
        <Header title="Applicants" />

        <FlatList<RowItem>
          data={dataSource}
          renderItem={renderItem}
          keyExtractor={(item) => ((item as any).__skeleton ? (item as any).__id : String((item as Application).id))}
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
          //numColumns={numColumns}
          //columnWrapperStyle={numColumns > 1 ? { justifyContent: "space-between", gap: 16 } : undefined}
        />
      </CustomSafeAreaView>

      <View>
        <SortingAndFilter title="Filters" options={filtersOption} onPressFilter={() => { }} />
      </View>
    </Fragment>
  );
};

export default ApplicantScreen;
