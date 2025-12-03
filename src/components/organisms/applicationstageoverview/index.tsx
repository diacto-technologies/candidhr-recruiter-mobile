import React, { Fragment, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  LayoutChangeEvent,
  FlatList,
} from "react-native";
import { colors } from "../../../theme/colors";
import Typography from "../../atoms/typography";
import { windowWidth } from "../../../utils/devicelayout";
import { SvgXml } from "react-native-svg";
import { leftArrowIcon } from "../../../assets/svg/leftarrow";
import { rightArrowIcon } from "../../../assets/svg/rightarrow";
import { useStyles } from "./styles";
import Icon from "../../atoms/vectoricon";

interface TableRow {
  jobTitle: string;
  totalApplicants: number;
  reviewed: number;
}

const mockData: TableRow[] = [
  { jobTitle: "UI/UX Designer", totalApplicants: 2, reviewed: 1 },
  { jobTitle: "Full stack developer", totalApplicants: 1, reviewed: 34 },
  { jobTitle: "Data Science", totalApplicants: 4, reviewed: 0 },
  { jobTitle: "Graphic Designer", totalApplicants: 76, reviewed: 12 },
  { jobTitle: "Quality Assurance", totalApplicants: 2, reviewed: 0 },
  { jobTitle: "Product Manager", totalApplicants: 0, reviewed: 8 },
  { jobTitle: "Product Manager", totalApplicants: 0, reviewed: 8 },
  { jobTitle: "Product Manager", totalApplicants: 0, reviewed: 8 },
  { jobTitle: "Product Manager", totalApplicants: 0, reviewed: 8 },
  { jobTitle: "Product Manager", totalApplicants: 0, reviewed: 8 },
];

const TRACK_WIDTH = 320;

const ApplicationStageOverview = () => {
  const styles = useStyles();
  const [page, setPage] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const scrollX = useRef(new Animated.Value(0)).current;

  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(windowWidth - 40);

  const visibleWidth = containerWidth;
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

  const onContainerLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  // ----------- Render Row -----------
  const renderRow = ({ item, index }: { item: TableRow; index: number }) => {
    const isShaded = index % 2 === 1;

    return (
      <View
        style={[
          styles.row,
          isShaded && { backgroundColor: colors.neutrals.lightGray },
        ]}
      >
        <Typography variant="mediumTxtsm" style={styles.cell}>
          {item.jobTitle}
        </Typography>

        <Typography variant="regularTxtsm" style={styles.cell}>
          {item.totalApplicants}
        </Typography>

        <Typography variant="regularTxtsm" style={styles.cell}>
          {item.reviewed}
        </Typography>

        {/* PLACEHOLDERS */}
        <Typography variant="regularTxtsm" style={styles.cell}>
          10
        </Typography>
        <Typography variant="regularTxtsm" style={styles.cell}>
          10
        </Typography>
        <Typography variant="regularTxtsm" style={styles.cell}>
          10
        </Typography>
        <Typography variant="regularTxtsm" style={styles.cell}>
          10
        </Typography>
        <Typography variant="regularTxtsm" style={styles.cell}>
          3
        </Typography>
        <Typography variant="regularTxtsm" style={styles.cell}>
          13 AUG, 2025
        </Typography>
        <Typography variant="regularTxtsm" style={styles.cell}>
          Closed
        </Typography>
      </View>
    );
  };

  return (
    <Fragment>
      <View style={styles.card} onLayout={onContainerLayout}>
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:16}}>
        <Typography variant="semiBoldTxtlg" style={styles.title}>
          Application Stage Overview
        </Typography>
        <TouchableOpacity>
        <Icon size={18} name={"maximize-2"} iconFamily={"Feather"} color={colors.gray[600]}/> 
        </TouchableOpacity>
        </View>

        {/* Horizontal FlatList Container */}
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
          <View style={{ flexDirection: "column" }}>
            {/* TABLE HEADER */}
            <View style={styles.headerRow}>
              {[
                "Job title",
                "Total applicants",
                "Reviewed",
                "Assessment",
                "Video interview",
                "Hired",
                "Rejected",
                "On hold",
                "Close date",
                "Status",
              ].map((heading, index) => (
                <Typography
                  key={index}
                  variant="semiBoldTxtxs"
                  style={styles.headerText}
                  color={colors.gray[500]}
                >
                  {heading}
                </Typography>
              ))}
            </View>

            {/* TABLE ROWS VIA FLATLIST */}
            <FlatList
              data={mockData.slice(0, 6)}
              renderItem={renderRow}
              keyExtractor={(_, index) => index.toString()}
              scrollEnabled={false} // Fix scrolling only horizontally
            />
          </View>
        </Animated.ScrollView>

        {/* CUSTOM SCROLLBAR */}
        {/* <View style={[styles.scrollTrack, { width: TRACK_WIDTH }]}>
          <Animated.View
            style={[
              styles.scrollThumb,
              { width: THUMB_WIDTH, transform: [{ translateX }] },
            ]}
          />
        </View> */}

        {/* PAGINATION */}
        <View style={styles.paginationContainer}>
          {/* <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => page > 1 && setPage(page - 1)}
          >
            <SvgXml xml={leftArrowIcon} />
          </TouchableOpacity>

          <Typography variant="P1M" style={styles.pageText}>
            Page {page} of 10
          </Typography>

          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => page < 10 && setPage(page + 1)}
          >
            <SvgXml xml={rightArrowIcon} />
          </TouchableOpacity> */}
           <Typography variant="semiBoldTxtsm" color={colors.brand[700]}>
            View more
          </Typography>

        </View>
      </View>
    </Fragment>
  );
};

export default ApplicationStageOverview;
