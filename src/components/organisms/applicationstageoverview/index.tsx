import React, { Fragment, useRef, useState } from "react";
import {
  View,
  StyleSheet,
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
import { leftArrowIcon } from "../../../assets/svg/leftarrow";
import { rightArrowIcon } from "../../../assets/svg/rightarrow";
import { useStyles } from "./styles";
import Icon from "../../atoms/vectoricon";
import { goBack, navigate } from "../../../utils/navigationUtils";
import CustomSafeAreaView from "../../atoms/customsafeareaview";
import Header from "../header";
import { expandarrowsIcon } from "../../../assets/svg/expandarrows";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { selectStageGraphOverview } from "../../../features/dashbaord/selectors";

interface TableRow {
  job_name: string;
  total_applicants: number;
  close_date: string;
  is_closed: boolean;

  stages: {
    resume_screening: number;
    assessment_test: number;
    video_interview: number;
    hired: number;
    reject: number;
    on_hold: number;
  };
}


const TRACK_WIDTH = 320;

const ApplicationStageOverview = () => {
  const styles = useStyles();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(windowWidth - 40);
  const OverviewData = useAppSelector(selectStageGraphOverview);
  const data: TableRow[] = OverviewData?.results ?? [];


  const shadowOpacity = useRef(new Animated.Value(0)).current;

  // show/hide shadow based on scrollX
  scrollX.addListener(({ value }) => {
    Animated.timing(shadowOpacity, {
      toValue: value > 0 ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  });

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

  return (
    <Fragment>
      <View style={styles.card} onLayout={onContainerLayout}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
          <Typography variant="semiBoldTxtlg">
            Application Stage Overview
          </Typography>
          <TouchableOpacity onPress={() => navigate('ApplicationOverviewDetails')}>
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
                  {[
                    "Total applicants",
                    "Reviewed",
                    "Assessment",
                    "Video interview",
                    "Hired",
                    "Rejected",
                    "On hold",
                    "Close date",
                    "Status",
                  ].map((title, index) => (
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
          <TouchableOpacity onPress={() => navigate('ApplicationOverviewDetails')}>
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
