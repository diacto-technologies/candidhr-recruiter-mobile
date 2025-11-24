import React, { Fragment, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SortingAndFilter, Header, JobCardList, BottomSheet, FilterSheetContent } from '../../../components';
import { filtersOption } from '../../../utils/dummaydata';
import { Svg, SvgXml } from 'react-native-svg';
import { pluscircle } from '../../../assets/svg/pluscircle';
import { Illustrations } from '../../../assets/svg/illustrations';
import { colors } from '../../../theme/colors';

const JobsScreen = () => {
  const [filterSheet, setFilterSheet] = useState(false);
  return (
    <Fragment>
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


        </View>
      </View>
    </Fragment>
  );
};

export default JobsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutrals.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
  },
  text: { fontSize: 22, fontWeight: '600' }
});
