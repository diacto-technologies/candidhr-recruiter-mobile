import React, { Fragment, useState } from 'react';
import { View,Pressable} from 'react-native';
import { SortingAndFilter, Header, JobCardList, BottomSheet, FilterSheetContent, StatusBar } from '../../../components';
import { filtersOption } from '../../../utils/dummaydata';
import { SvgXml } from 'react-native-svg';
import { pluscircle } from '../../../assets/svg/pluscircle';
import { useStyles } from './styles';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';
import { colors } from '../../../theme/colors';

const JobsScreen = () => {
  const styles = useStyles();
  const { insetsBottom, insetsTop } = useRNSafeAreaInsets();
  const [filterSheet, setFilterSheet] = useState(false);
  return (
    <Fragment>
       <View style={{paddingTop: insetsTop, flex:1,backgroundColor: colors.neutrals.lightGray,}}>
       <StatusBar showWhite />
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
      </View>
    </Fragment>
  );
};

export default JobsScreen;
