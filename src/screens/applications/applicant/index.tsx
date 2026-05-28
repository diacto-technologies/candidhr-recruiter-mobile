import React, { useCallback } from 'react';
import { View, FlatList } from 'react-native';
import {
  AppHeader,
  SortingAndFilter,
  ApplicantList,
  Shimmer,
  BottomSheet,
  Typography,
  ThreeDotDropdown,
} from '../../../components';
import ApplicantFilterSheet from '../../../components/organisms/ApplicantFilterSheet';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import { applicantFiltersOption } from '../../../utils/dummaydata';
import { colors } from '../../../theme/colors';
import BackgroundPattern from '../../../components/atoms/backgroundpattern';
import { Illustrations } from '../../../assets/svg/illustrations';
import { SvgXml } from 'react-native-svg';
import { screenHeight } from '../../../utils/devicelayout';
import { horizontalThreedotIcon } from '../../../assets/svg/horizontalthreedoticon';
import { useStyles } from './styles';
import { Application } from '../../../features/applications/types';
import { useApplicantScreenController, RowItem } from './hooks/useApplicantScreenController';

const ApplicantEmptyState = ({ styles }: { styles: any }) => (
  <BackgroundPattern bgStyle={styles.emptyStateBg}>
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateContent}>
        <SvgXml xml={Illustrations} />
        <Typography variant="semiBoldTxtmd">
          No results found
        </Typography>
        <Typography
          variant="regularTxtsm"
          color={colors.gray[500]}
          style={styles.emptyStateSubtext}
        >
          Try adjusting your search or filters
        </Typography>
      </View>
    </View>
  </BackgroundPattern>
);

const ApplicantScreen = () => {
  const styles = useStyles();
  const ctrl = useApplicantScreenController();

  const renderItem = useCallback(
    ({ item }: { item: RowItem }) => {
      if ('__skeleton' in item) {
        return <ApplicantList item={undefined} loading cardWidth={ctrl.itemWidth} />;
      }
      return <ApplicantList item={item} cardWidth={ctrl.itemWidth} />;
    },
    [ctrl.itemWidth]
  );

  return (
    <CustomSafeAreaView>
      <AppHeader
        title="Applicants"
        right={
          ctrl.canExport ? (
            <React.Fragment>
              {/* Using a standard Pressable for right side icon */}
              <View style={{ padding: 8, marginRight: -8 }} onTouchEnd={() => ctrl.setThreeDotOpen(true)}>
                <SvgXml xml={horizontalThreedotIcon} />
              </View>
            </React.Fragment>
          ) : null
        }
      />

      <FlatList<RowItem>
        data={ctrl.dataSource}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        onEndReached={ctrl.handleEndReached}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={ctrl.handleMomentumScrollBegin}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={false}
        numColumns={ctrl.numColumns}
        key={ctrl.isTablet ? 'tablet-col-3' : 'mobile-col-1'}
        keyExtractor={(item, index) => {
          if ('__skeleton' in item) return item.__id;
          const id = (item as Application).id ?? 'no-id';
          return `app-${id}-${index}`;
        }}
        ListEmptyComponent={
          !ctrl.loading ? <ApplicantEmptyState styles={styles} /> : null
        }
        ListFooterComponent={
          ctrl.loading && ctrl.applications.length > 0 ? <Shimmer /> : null
        }
      />

      <ThreeDotDropdown
        visible={ctrl.threeDotOpen}
        onClose={() => ctrl.setThreeDotOpen(false)}
        menuItems={ctrl.threeDotMenuItems}
        top={100}
        right={20}
      />

      <SortingAndFilter
        title="Filters"
        options={applicantFiltersOption}
        onPressFilter={() => ctrl.setIsFilterSheetVisible(true)}
        setSelectedTab={ctrl.setSelectedTab}
        selectedTab={ctrl.selectedTab}
        onItemPress={(t) => ctrl.handleSort(t)}
      />

      <BottomSheet
        visible={ctrl.isFilterSheetVisible}
        onClose={() => ctrl.setIsFilterSheetVisible(false)}
        onClearAll={ctrl.handleClearAllFilters}
        title="Filter by"
        showHeadline
        hight={screenHeight * 0.8}
      >
        <ApplicantFilterSheet
          onCancel={() => ctrl.setIsFilterSheetVisible(false)}
          onApply={ctrl.handleApplyFilters}
          onClearAll={() => ctrl.setIsFilterSheetVisible(false)}
          selectedTab={ctrl.selectedTab}
          setSelectedTab={ctrl.setSelectedTab}
        />
      </BottomSheet>
    </CustomSafeAreaView>
  );
};

export default ApplicantScreen;
