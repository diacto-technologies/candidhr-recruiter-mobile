import React, { Fragment, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  LayoutChangeEvent,
} from 'react-native';
import { colors } from '../../../theme/colors';
import Typography from '../../atoms/typography';
import Icon from '../../atoms/vectoricon';
import { windowWidth } from '../../../utils/devicelayout';

interface TableRow {
  jobTitle: string;
  totalApplicants: number;
  reviewed: number;
}

const mockData: TableRow[] = [
  { jobTitle: 'UI/UX Designer', totalApplicants: 2, reviewed: 1 },
  { jobTitle: 'Full stack developer', totalApplicants: 1, reviewed: 34 },
  { jobTitle: 'Data Science', totalApplicants: 4, reviewed: 0 },
  { jobTitle: 'Graphic Designer', totalApplicants: 76, reviewed: 12 },
  { jobTitle: 'Quality Assurance', totalApplicants: 2, reviewed: 0 },
  { jobTitle: 'Product Manager', totalApplicants: 0, reviewed: 8 },
];

const MIN_COL_WIDTH = windowWidth * 0.35; // responsive column width

const ApplicationStageOverview = () => {
  const [page, setPage] = useState(1);
  const scrollX = useRef(new Animated.Value(0)).current;

  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(windowWidth - 40);

  const visibleWidth = containerWidth;
  const scrollRange = Math.max(contentWidth - visibleWidth, 0);

  const TRACK_WIDTH = 320;
  const THUMB_WIDTH =
    scrollRange > 0
      ? Math.max((visibleWidth / contentWidth) * TRACK_WIDTH, 40)
      : TRACK_WIDTH - 20;

  const translateX = scrollX.interpolate({
    inputRange: [0, scrollRange],
    outputRange: [0, TRACK_WIDTH - THUMB_WIDTH],
    extrapolate: 'clamp',
  });

  const onContainerLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  return (
    <Fragment>
      <View style={styles.card} onLayout={onContainerLayout}>

        <Typography variant="H2" style={styles.title} color={colors.mainColors.blueGrayTitle}>
          Application Stage Overview
        </Typography>

        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onContentSizeChange={(w) => setContentWidth(w)}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
        >
          {/* Dynamic Content */}
          <View style={{ flexDirection: 'column' }}>
            {/* Header */}
            <View style={styles.headerRow}>
              <Typography variant="T2" style={styles.headerText} color={colors.grayScale.slateGray}>Job title</Typography>
              <Typography variant="T2" style={styles.headerText} color={colors.grayScale.slateGray}>Total applicants</Typography>
              <Typography variant="T2" style={styles.headerText} color={colors.grayScale.slateGray}>Reviewed</Typography>
              <Typography variant="T2" style={styles.headerText} color={colors.grayScale.slateGray}>Assessment</Typography>
              <Typography variant="T2" style={styles.headerText} color={colors.grayScale.slateGray}>Video interview</Typography>
              <Typography variant="T2" style={styles.headerText} color={colors.grayScale.slateGray}>Hired</Typography>
              <Typography variant="T2" style={styles.headerText} color={colors.grayScale.slateGray}>Rejected</Typography>
              <Typography variant="T2" style={styles.headerText} color={colors.grayScale.slateGray}>On hold</Typography>
              <Typography variant="T2" style={styles.headerText} color={colors.grayScale.slateGray}>Close date</Typography>
              <Typography variant="T2" style={styles.headerText} color={colors.grayScale.slateGray}>Status</Typography>
            </View>

            {/* Rows */}
            {mockData.map((item, index) => {
              const isShaded = index % 2 === 1;

              return (
                <View
                  key={index}
                  style={[
                    styles.row,
                    isShaded && { backgroundColor: colors.neutrals.lightGray },
                  ]}
                >
                  <Typography variant="P1M" style={styles.cell} color={colors.mainColors.blueGrayTitle}>{item.jobTitle}</Typography>
                  <Typography variant="P1" style={styles.cell} color={colors.grayScale.darkGray}>{item.totalApplicants}</Typography>
                  <Typography variant="P1" style={styles.cell} color={colors.grayScale.darkGray}>{item.reviewed}</Typography>

                  {/* Additional columns with placeholder values */}
                  <Typography variant="P1" style={styles.cell} color={colors.grayScale.darkGray}>10</Typography>
                  <Typography variant="P1" style={styles.cell} color={colors.grayScale.darkGray}>10</Typography>
                  <Typography variant="P1" style={styles.cell} color={colors.grayScale.darkGray}>10</Typography>
                  <Typography variant="P1" style={styles.cell} color={colors.grayScale.darkGray}>10</Typography>
                  <Typography variant="P1" style={styles.cell} color={colors.grayScale.darkGray}>3</Typography>
                  <Typography variant="P1" style={styles.cell} color={colors.grayScale.darkGray}>13 AUG, 2025</Typography>
                  <Typography variant="P1" style={styles.cell}>Closed</Typography>
                </View>
              );
            })}
          </View>
        </Animated.ScrollView>

        {/* Animated Scroll Bar */}
        <View style={[styles.scrollTrack, { width: TRACK_WIDTH }]}>
          <Animated.View
            style={[
              styles.scrollThumb,
              { width: THUMB_WIDTH, transform: [{ translateX }] },
            ]}
          />
        </View>

        {/* Pagination */}
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => page > 1 && setPage(page - 1)}
          >
            <Icon size={18} name={'arrow-left'} iconFamily={'FontAwesome6Icons'} color={'#A4A7AE'} />
          </TouchableOpacity>

          <Typography variant="P1M" style={styles.pageText}>
            Page {page} of 10
          </Typography>

          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => page < 10 && setPage(page + 1)}
          >
            <Icon size={18} name={'arrow-right'} iconFamily={'FontAwesome6Icons'} color={'#A4A7AE'} />
          </TouchableOpacity>
        </View>
      </View>
    </Fragment>
  );
};

export default ApplicationStageOverview;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.mainColors.borderColor,
    shadowColor: 'rgba(10, 13, 18, 0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    paddingVertical: 20,
    paddingLeft: 16,
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.mainColors.borderColor,
    paddingLeft: 20,
    backgroundColor:colors.neutrals.lightGray
  },
  headerText: {
    minWidth: MIN_COL_WIDTH,
    marginRight: 16,
  },

  /* Rows */
  row: {
    flexDirection: 'row',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.mainColors.borderColor,
    paddingLeft: 20,
  },
  cell: {
    minWidth: MIN_COL_WIDTH,
    marginRight: 16,
  },

  /* Scroll Bar */
  scrollTrack: {
    // height: 4,
    // borderRadius: 10,
    // backgroundColor: '#E5E5E5',
    // alignSelf: 'center',
    // marginTop: 14,
    // overflow: 'hidden',
    paddingVertical: 6,
  },
  scrollThumb: {
    height: 6,
    backgroundColor: colors.mainColors.scrollBar,
    borderRadius: 10,
  },

  /* Pagination */
  paginationContainer: {
    height: 68,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: colors.mainColors.borderColor,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grayScale.bluetintedgray,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.common.white,
  },
  pageText: {
    color: '#414651',
  },
});
