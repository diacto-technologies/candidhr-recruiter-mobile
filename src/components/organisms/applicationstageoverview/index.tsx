import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  View,
  Animated,
  TouchableOpacity,
  LayoutChangeEvent,
  FlatList,
  ScrollView,
} from "react-native";
import { colors } from "../../../theme/colors";
import Typography from "../../atoms/typography";
import { windowWidth } from "../../../utils/devicelayout";
import { SvgXml } from "react-native-svg";
import { useStyles } from "./styles";
import { expandarrowsIcon } from "../../../assets/svg/expandarrows";
import Shimmer from "../../atoms/shimmer";
import { ApplicationStageOverviewProps, TableRow } from "./applicationstage";
import { APPLICATION_STAGE_OVERVIEW_COLUMNS, SHIMMER_ROWS, TRACK_WIDTH } from "./config";

const ApplicationStageOverviewShimmer = () => {
  const styles = useStyles();
  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
        <Shimmer width={220} height={22} borderRadius={6} />
        <Shimmer width={24} height={24} borderRadius={6} />
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.leftFixedWrapper}>
          <View style={styles.headerRow}>
            <Shimmer width="80%" height={14} borderRadius={6} />
          </View>
          {Array.from({ length: SHIMMER_ROWS }).map((_, i) => (
            <View key={`left-${i}`} style={[styles.leftFixedColumn, { backgroundColor: i % 2 === 1 ? colors.neutrals.lightGray : "#FFF" }]}>
              <Shimmer width="85%" height={14} borderRadius={6} />
            </View>
          ))}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
          <View>
            <View style={styles.headerRow}>
              {Array.from({ length: 9 }).map((_, i) => (
                <Shimmer key={i} width={72} height={14} borderRadius={6} style={styles.cell} />
              ))}
            </View>
            {Array.from({ length: SHIMMER_ROWS }).map((_, rowIndex) => (
              <View
                key={`right-${rowIndex}`}
                style={[styles.row, { backgroundColor: rowIndex % 2 === 1 ? colors.neutrals.lightGray : "#FFF" }]}
              >
                {Array.from({ length: 9 }).map((_, cellIndex) => (
                  <Shimmer key={cellIndex} width={48} height={14} borderRadius={6} style={styles.cell} />
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
      <View style={styles.paginationContainer}>
        <Shimmer width={80} height={16} borderRadius={6} />
      </View>
    </View>
  );
};

const ApplicationStageOverview: React.FC<ApplicationStageOverviewProps> = ({
  overview,
  loading,
  onViewMore,
}) => {
  const styles = useStyles();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(windowWidth - 40);
  const data: TableRow[] = overview?.results ?? [];


  const shadowOpacity = useRef(new Animated.Value(0)).current;

  // show/hide shadow based on scrollX
  useEffect(() => {
    const id = scrollX.addListener(({ value }) => {
      Animated.timing(shadowOpacity, {
        toValue: value > 0 ? 1 : 0,
        duration: 180,
        useNativeDriver: false,
      }).start();
    });
  
    return () => {
      scrollX.removeListener(id);
    };
  }, [scrollX, shadowOpacity]);

  const onContainerLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const visibleWidth = containerWidth - 140;
  const scrollRange = Math.max(contentWidth - visibleWidth, 0);

  const THUMB_WIDTH =
    scrollRange > 0
      ? Math.max((visibleWidth / contentWidth) * TRACK_WIDTH, 40)
      : TRACK_WIDTH - 20;

  const translateX = scrollX.interpolate({
    inputRange: [0, scrollRange],
    outputRange: [0, TRACK_WIDTH - THUMB_WIDTH],
    extrapolate: "clamp",
  });

  /** LEFT FIXED COLUMN */
  const renderLeftColumn = ({ item, index }: { item: TableRow; index: number }) => {
    const bg = index % 2 === 1 ? colors.neutrals.lightGray : "#FFF";

    return (
      <View style={[styles.leftFixedColumn, { backgroundColor: bg }]}>
        <Typography variant="mediumTxtsm">{item?.job_name}</Typography>
      </View>
    );
  };

  /** RIGHT SCROLLABLE CELLS */
  const renderRightRow = ({ item, index }: { item: TableRow; index: number }) => {
    const bg = index % 2 === 1 ? colors.neutrals.lightGray : "#FFF";

    return (
      <View style={[styles.row, { backgroundColor: bg }]}>
        <Typography style={styles.cell} color={colors.gray[600]}>{item.total_applicants}</Typography>
        <Typography style={styles.cell} color={colors.gray[600]}>{item?.stages?.resume_screening}</Typography>
        <Typography style={styles.cell} color={colors.gray[600]}>{item?.stages?.assessment_test}</Typography>
        <Typography style={styles.cell} color={colors.gray[600]}>{item?.stages?.video_interview}</Typography>
        <Typography style={styles.cell} color={colors.gray[600]}>{item?.stages?.hired}</Typography>
        <Typography style={styles.cell} color={colors.gray[600]}>{item?.stages?.reject}</Typography>
        <Typography style={styles.cell} color={colors.gray[600]}>{item?.stages?.on_hold}</Typography>
        <Typography style={styles.cell} color={colors.gray[600]}>{item?.close_date}</Typography>
        <View style={{ backgroundColor: item?.is_closed ? colors.error[50] : colors.success[50], paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999, alignItems: 'center', borderWidth: 1, borderColor: item?.is_closed ? colors.error[200] : colors.success[200] }}>
          <Typography variant="regularTxtxs" color={item?.is_closed ? colors.error[600] : colors.success[600]}>{item?.is_closed ? "Closed" : "Open"}</Typography>
        </View>
      </View>
    );
  };

  if (loading) {
    return <ApplicationStageOverviewShimmer />;
  }

  return (
    <Fragment>
      <View style={styles.card} onLayout={onContainerLayout}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
          <Typography variant="semiBoldTxtlg">
            Application Stage Overview
          </Typography>
          <TouchableOpacity onPress={onViewMore}>
            <SvgXml xml={expandarrowsIcon} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled 
          bounces={false}
        >
          <View style={{ flexDirection: "row" }}>

            <Animated.View
              style={[
                styles.leftFixedWrapper,
                {
                  shadowColor: "#0A0D12",
                  shadowOffset: { width: 2, height: 0 },
                  shadowOpacity: shadowOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.06],
                  }),
                  shadowRadius: shadowOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 10],
                  }),
                  elevation: shadowOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 6],
                  }),
                },
              ]}
            >
              {/* LEFT COLUMN HEADER */}
              <View style={styles.headerRow}>
                <Typography
                  variant="semiBoldTxtxs"
                  style={styles.headerText}
                  color={colors.gray[500]}
                >
                  Job title
                </Typography>
              </View>

              <FlatList
                data={data.slice(0, 6)}
                renderItem={renderLeftColumn}
                keyExtractor={(_, i) => `left-${i}`}
                scrollEnabled={false}
              />
            </Animated.View>

            <Animated.ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onContentSizeChange={(w) => setContentWidth(w)}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              bounces={false}
            >
              <View>
                <View style={styles.headerRow}>
                  {APPLICATION_STAGE_OVERVIEW_COLUMNS.map((title, index) => (
                    <Typography
                      key={index}
                      variant="semiBoldTxtxs"
                      style={styles.headerText}
                      color={colors.gray[500]}
                    >
                      {title}
                    </Typography>
                  ))}
                </View>

                <FlatList
                  data={data.slice(0, 6)}
                  renderItem={renderRightRow}
                  keyExtractor={(_, i) => `right-${i}`}
                  scrollEnabled={false}
                />
              </View>
            </Animated.ScrollView>
          </View>
        </ScrollView>
        <View style={styles.paginationContainer}>
          <TouchableOpacity onPress={onViewMore}>
            <Typography variant="semiBoldTxtsm" color={colors.brand[700]}>
              View more
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </Fragment>
  );
};

export default ApplicationStageOverview;
