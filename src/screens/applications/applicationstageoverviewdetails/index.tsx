import React, { Fragment, useRef, useState } from "react";
import {
  View,
  Animated,
  FlatList,
  ScrollView,
  LayoutChangeEvent,
} from "react-native";
import { useStyles } from "./styles";
import { selectStageGraphOverview} from "../../../features/dashbaord/selectors";
import { tabelTitle, TRACK_WIDTH, LEFT_COLUMN_WIDTH } from "./config";
import { TableRow } from "./application";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { windowWidth } from "../../../utils/devicelayout";
import { useNetworkConnectivity } from "../../../hooks/useNetworkConnectivity";
import Typography from "../../../components/atoms/typography";
import { colors } from "../../../theme/colors";
import CustomSafeAreaView from "../../../components/atoms/customsafeareaview";
import Header from "../../../components/organisms/header";
import { goBack } from "../../../utils/navigationUtils";

const ApplicationOverviewDetails = () => {
  const styles = useStyles();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(windowWidth - 40);
  const OverviewData = useAppSelector(selectStageGraphOverview);
  const data: TableRow[] = OverviewData?.results ?? [];
  const shadowOpacity = useRef(new Animated.Value(0)).current;
  
  // Monitor network connectivity
  useNetworkConnectivity();
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

  const visibleWidth = containerWidth - LEFT_COLUMN_WIDTH;
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
        <Typography style={styles.cell}>{item.total_applicants}</Typography>
        <Typography style={styles.cell}>{item?.stages?.resume_screening}</Typography>
        <Typography style={styles.cell}>{item?.stages?.assessment_test}</Typography>
        <Typography style={styles.cell}>{item?.stages?.video_interview}</Typography>
        <Typography style={styles.cell}>{item?.stages?.hired}</Typography>
        <Typography style={styles.cell}>{item?.stages?.reject}</Typography>
        <Typography style={styles.cell}>{item?.stages?.on_hold}</Typography>
        <Typography style={styles.cell}>{item?.close_date}</Typography>
        <View style={{backgroundColor:item?.is_closed?colors.error[50]:colors.success[50],paddingHorizontal:8, paddingVertical:2,borderRadius:9999,alignItems:'center', borderWidth:1 ,borderColor:item?.is_closed?colors.error[200]:colors.success[200]}}>
        <Typography variant="regularTxtxs" color={item?.is_closed?colors.error[600]:colors.success[600]}>{item?.is_closed ? "Closed" : "Open"}</Typography>
        </View>
      </View>
    );
  };


  return (
    <Fragment>
      <CustomSafeAreaView>
        <Header title="Application stage overview" backNavigation showTitle onBack={goBack} />
        <View style={styles.card} onLayout={onContainerLayout}>
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
                <View style={[styles.headerRow, styles.leftHeaderRow]}>
                  <Typography
                    variant="semiBoldTxtxs"
                    style={styles.leftHeaderText}
                    color={colors.gray[500]}
                  >
                    Job title
                  </Typography>
                </View>

                <FlatList
                  data={data}
                  renderItem={renderLeftColumn}
                  keyExtractor={(_, i) => `left-${i}`}
                  scrollEnabled={false}
                />
              </Animated.View>

              <ScrollView
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
                    {tabelTitle.map((title, index) => (
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
                    data={data}
                    renderItem={renderRightRow}
                    keyExtractor={(_, i) => `right-${i}`}
                    scrollEnabled={false}
                  />
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </CustomSafeAreaView>
      <View style={styles.paginationContainer}>
        <View style={[styles.scrollTrack, { width: TRACK_WIDTH - 250 }]}>
          <Animated.View
            style={[
              styles.scrollThumb,
              { width: THUMB_WIDTH, transform: [{ translateX }] },
            ]}
          />
        </View>
      </View>

    </Fragment>
  );
};

export default ApplicationOverviewDetails;