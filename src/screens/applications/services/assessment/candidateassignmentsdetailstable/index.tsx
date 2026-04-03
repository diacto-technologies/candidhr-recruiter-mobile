import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Animated,
  FlatList,
  ScrollView,
  LayoutChangeEvent,
  TouchableOpacity,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { filterIcon } from "../../../../../assets/svg/filter";
import { useStyles } from "./styles";
import { CandidateAssignmentRow } from "../../../../../components/organisms/candidateassignmentstable /candidateassignmentstable";
import { screenHeight, windowWidth } from "../../../../../utils/devicelayout";
import { LEFT_COLUMN_WIDTH } from "../../../applicationstageoverviewdetails/config";
import {
  ASSIGNMENT_STATUS_FILTER_OPTIONS,
  SHIMMER_ROWS,
  TRACK_WIDTH,
} from "../../../../../components/organisms/candidateassignmentstable /config";
import Shimmer from "../../../../../components/atoms/shimmer";
import Typography from "../../../../../components/atoms/typography";
import { colors } from "../../../../../theme/colors";
import CustomSafeAreaView from "../../../../../components/atoms/customsafeareaview";
import { BottomSheet, Header } from "../../../../../components";
import { goBack } from "../../../../../utils/navigationUtils";
import SearchBar from "../../../../../components/atoms/searchbar";
import CheckBox from "../../../../../components/atoms/checkbox";
import { downloadIcon } from "../../../../../assets/svg/download";
import { useAppDispatch } from "../../../../../hooks/useAppDispatch";
import {
  exportBlueprintAssignmentsReportRequestAction,
  fetchBlueprintAssignmentsListRequestAction,
} from "../../../../../features/assessments/actions";
import {
  setAssignmentsListSearchText,
  setAssignmentTableSelectedForIds,
  toggleAssignmentTableSelectedId,
} from "../../../../../features/assessments/slice";
import {
  selectAssessmentOverviewAssignments,
  selectAssessmentOverviewBlueprintId,
  selectAssignmentExportLoading,
  selectAssignmentTableSelectedIds,
  selectAssignmentsListSearchText,
  selectBlueprintAssignmentsListError,
  selectBlueprintAssignmentsListLoading,
  selectBlueprintAssignmentsListQuery,
} from "../../../../../features/assessments/selectors";
import { mapBlueprintAssignmentsToTableRows } from "../blueprintAssignmentsMapper";
import SortBottomSheet from "../../../../../components/organisms/sortbottomsheet";

const tableTitle = [
  "Status",
  "Validity",
  "Duration",
  "Passing Score",
  "Score",
  "Assigned",
  "Proctoring",
  "Reminders",
];

const AssignmentsListTableShimmer = () => {
  const styles = useStyles();
  return (
    <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled bounces={false}>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.leftFixedWrapper}>
          <View style={styles.headerRow}>
            <View style={{ paddingHorizontal: 10 }}>
              <Shimmer width={18} height={18} borderRadius={4} />
            </View>
            <Shimmer width={100} height={14} borderRadius={6} />
          </View>
          {Array.from({ length: SHIMMER_ROWS }).map((_, i) => (
            <View
              key={`shimmer-left-${i}`}
              style={[
                styles.leftFixedColumn,
                { backgroundColor: i % 2 === 1 ? colors.neutrals.lightGray : "#FFF" },
              ]}
            >
              <View style={{ paddingHorizontal: 10 }}>
                <Shimmer width={18} height={18} borderRadius={4} />
              </View>
              <View style={{ flex: 1, gap: 6 }}>
                <Shimmer width="90%" height={14} borderRadius={6} />
                <Shimmer width="75%" height={12} borderRadius={6} />
              </View>
            </View>
          ))}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
          <View>
            <View style={styles.headerRow}>
              {tableTitle.map((_, i) => (
                <View key={i} style={[styles.cell, { paddingLeft: 16 }]}>
                  <Shimmer width={72} height={14} borderRadius={6} />
                </View>
              ))}
            </View>
            {Array.from({ length: SHIMMER_ROWS }).map((_, rowIndex) => (
              <View
                key={`shimmer-row-${rowIndex}`}
                style={[
                  styles.row,
                  { backgroundColor: rowIndex % 2 === 1 ? colors.neutrals.lightGray : "#FFF" },
                ]}
              >
                {tableTitle.map((_, colIndex) => (
                  <View key={colIndex} style={[styles.cell, { paddingLeft: 16 }]}>
                    {colIndex === 0 ? (
                      <Shimmer width={76} height={26} borderRadius={999} />
                    ) : colIndex === 1 ? (
                      <View>
                        <Shimmer width={108} height={12} borderRadius={4} />
                        <Shimmer width={88} height={12} borderRadius={4} style={{ marginTop: 4 }} />
                      </View>
                    ) : (
                      <Shimmer width={56} height={14} borderRadius={6} />
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export type CandidateAssignmentsDetailsTableParams = {
  blueprintId?: string;
  overview?: { results?: CandidateAssignmentRow[] } | null;
};

const CandidateAssignmentsDeatilsTable = () => {
  const dispatch = useAppDispatch();
  const styles = useStyles();
  const route = useRoute();
  const params = (route.params || {}) as CandidateAssignmentsDetailsTableParams;
  const blueprintId = params.blueprintId;

  const assignmentResults = useSelector(selectAssessmentOverviewAssignments);
  const assignmentsListLoading = useSelector(selectBlueprintAssignmentsListLoading);
  const assignmentsListError = useSelector(selectBlueprintAssignmentsListError);
  const assignmentsListQuery = useSelector(selectBlueprintAssignmentsListQuery);
  const assignmentsListSearchText = useSelector(selectAssignmentsListSearchText);
  const assignmentTableSelectedIds = useSelector(selectAssignmentTableSelectedIds);
  const assignmentExportLoading = useSelector(selectAssignmentExportLoading);
  const overviewBlueprintId = useSelector(selectAssessmentOverviewBlueprintId);

  const rowsFromRedux = useMemo(
    () => mapBlueprintAssignmentsToTableRows(assignmentResults),
    [assignmentResults]
  );

  const data: CandidateAssignmentRow[] = useMemo(() => {
    if (blueprintId) {
      return rowsFromRedux;
    }
    return params.overview?.results ?? [];
  }, [blueprintId, rowsFromRedux, params.overview?.results]);

  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [draftStatusFilter, setDraftStatusFilter] = useState<string>("all");
  const appliedStatusRef = useRef<string>("all");

  useEffect(() => {
    if (!blueprintId || assignmentsListQuery?.blueprintId !== blueprintId) {
      return;
    }
    appliedStatusRef.current =
      assignmentsListQuery.status && assignmentsListQuery.status !== "all"
        ? assignmentsListQuery.status
        : "all";
  }, [
    blueprintId,
    assignmentsListQuery?.blueprintId,
    assignmentsListQuery?.status,
  ]);

  useEffect(() => {
    if (!blueprintId) return;
    const id = setTimeout(() => {
      const q = assignmentsListSearchText.trim();
      const status =
        appliedStatusRef.current !== "all" ? appliedStatusRef.current : undefined;
      dispatch(
        fetchBlueprintAssignmentsListRequestAction({
          blueprintId,
          candidate_name: q || undefined,
          candidate_email: q || undefined,
          status,
          o: "-created_at",
        })
      );
    }, 400);
    return () => clearTimeout(id);
  }, [blueprintId, assignmentsListSearchText, dispatch]);

  const displayData = useMemo(() => {
    if (blueprintId) {
      return data;
    }
    const q = assignmentsListSearchText.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (row) =>
        row.candidate.name.toLowerCase().includes(q) ||
        row.candidate.email.toLowerCase().includes(q) ||
        row.status.label.toLowerCase().includes(q)
    );
  }, [blueprintId, data, assignmentsListSearchText]);

  const exportBlueprintId = blueprintId ?? overviewBlueprintId ?? null;
  const selectedIdSet = useMemo(
    () => new Set(assignmentTableSelectedIds),
    [assignmentTableSelectedIds]
  );
  const allVisibleSelected =
    displayData.length > 0 &&
    displayData.every((row) => selectedIdSet.has(row.id));
  const canExport =
    Boolean(exportBlueprintId) &&
    assignmentTableSelectedIds.length > 0 &&
    !assignmentExportLoading;

  const onToggleHeaderSelection = useCallback(() => {
    const ids = displayData.map((r) => r.id);
    if (ids.length === 0) return;
    dispatch(
      setAssignmentTableSelectedForIds({
        ids,
        selected: !allVisibleSelected,
      })
    );
  }, [allVisibleSelected, dispatch, displayData]);

  const onExportReport = useCallback(() => {
    if (!exportBlueprintId || assignmentTableSelectedIds.length === 0) return;
    dispatch(
      exportBlueprintAssignmentsReportRequestAction({
        blueprint_id: exportBlueprintId,
        select_all: false,
        assignment_ids: [...assignmentTableSelectedIds],
      })
    );
  }, [assignmentTableSelectedIds, dispatch, exportBlueprintId]);

  const scrollX = useRef(new Animated.Value(0)).current;
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(windowWidth - 40);

  const shadowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const id = scrollX.addListener(({ value }) => {
      Animated.timing(shadowOpacity, {
        toValue: value > 0 ? 1 : 0,
        duration: 180,
        useNativeDriver: false,
      }).start();
    });
    return () => scrollX.removeListener(id);
  }, [scrollX, shadowOpacity]);

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
    outputRange: [0, Math.max(TRACK_WIDTH - THUMB_WIDTH, 0)],
    extrapolate: "clamp",
  });

  const renderLeftColumn = ({
    item,
    index,
  }: {
    item: CandidateAssignmentRow;
    index: number;
  }) => {
    const bg = index % 2 === 1 ? colors.neutrals.lightGray : "#FFF";

    return (
      <View style={[styles.leftFixedColumn, { backgroundColor: bg }]}>
        <View
          style={{ width: 44, alignItems: "center", justifyContent: "center" }}
          collapsable={false}
        >
          <CheckBox
            checked={selectedIdSet.has(item.id)}
            onChange={() => dispatch(toggleAssignmentTableSelectedId(item.id))}
          />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Typography variant="mediumTxtsm">
            {item.candidate.name ? item.candidate.name : item.candidate.email}
          </Typography>
          <Typography variant="mediumTxtxs" numberOfLines={1} color={colors?.gray[500]} ellipsizeMode="tail">
            {item.candidate.email}
          </Typography>
        </View>
      </View>
    );
  };

  const openStatusFilterSheet = () => {
    const q = assignmentsListQuery;
    const fromQuery =
      q != null &&
        q.blueprintId === blueprintId &&
        q.status &&
        q.status !== "all"
        ? q.status
        : appliedStatusRef.current;
    setDraftStatusFilter(fromQuery);
    setFilterSheetOpen(true);
  };

  const applyStatusFilter = () => {
    if (!blueprintId) return;
    appliedStatusRef.current = draftStatusFilter;
    setFilterSheetOpen(false);
    const q = assignmentsListSearchText.trim();
    dispatch(
      fetchBlueprintAssignmentsListRequestAction({
        blueprintId,
        candidate_name: q || undefined,
        candidate_email: q || undefined,
        status: draftStatusFilter !== "all" ? draftStatusFilter : undefined,
        o: "-created_at",
      })
    );
  };

  const clearAssignmentFilters = () => {
    setDraftStatusFilter("all");
    appliedStatusRef.current = "all";
    setFilterSheetOpen(false);
    const hadSearch = assignmentsListSearchText.trim().length > 0;
    dispatch(setAssignmentsListSearchText(""));
    if (blueprintId && !hadSearch) {
      dispatch(
        fetchBlueprintAssignmentsListRequestAction({
          blueprintId,
          o: "-created_at",
        })
      );
    }
  };

  const renderRightRow = ({
    item,
    index,
  }: {
    item: CandidateAssignmentRow;
    index: number;
  }) => {
    const bg = index % 2 === 1 ? colors.neutrals.lightGray : "#FFF";

    return (
      <View style={[styles.row, { backgroundColor: bg }]}>

        {/* <View style={styles.cell}>
          <Typography>{item.status.label}</Typography>
        </View> */}
        <View style={styles.cell}>
          <View style={[{ backgroundColor: item.status.label ? colors.gray[50] : colors.success[50], paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999, alignItems: 'center', borderWidth: 1, borderColor: item.status.label ? colors.gray[200] : colors.success[200], marginRight: 12, justifyContent: "center" }]}>
            <Typography variant="regularTxtxs" color={item.status.label ? colors.gray[600] : colors.success[600]}>{item.status.label}</Typography>
          </View>
        </View>

        <View style={styles.cell}>
          <Typography>
            From: {item.validity.split(" To ")[0].replace("From ", "")}
          </Typography>
          <Typography color={colors.gray[500]}>
            To: {item.validity.split(" To ")[1]}
          </Typography>
        </View>

        <View style={styles.cell}>
          <Typography>{item.duration}</Typography>
        </View>

        <View style={styles.cell}>
          <Typography>{item.passingScore}</Typography>
        </View>

        <View style={styles.cell}>
          <Typography>{item.score}</Typography>
        </View>

        <View style={styles.cell}>
          <Typography>{item.assigned}</Typography>
        </View>

        <View style={[styles.cell, { marginLeft: 8 }]}>
          <Typography>{item.proctoring.label}</Typography>
        </View>

        <View style={styles.cell}>
          <Typography>{item.reminders}</Typography>
        </View>

      </View>
    );
  };

  const trackInnerWidth = Math.max(TRACK_WIDTH - 250, 72);

  return (
    <Fragment>
      <CustomSafeAreaView style={styles.container}>
        <Header
          title="Candidate Assignments"
          backNavigation
          showTitle
          onBack={goBack}
        />
        <View style={styles.toolbar}>
          <View style={styles.searchBarWrap}>
            <SearchBar
              value={assignmentsListSearchText}
              onChangeText={(text) => dispatch(setAssignmentsListSearchText(text))}
              placeholder="Search"
              onClear={() => dispatch(setAssignmentsListSearchText(""))}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Filter"
            onPress={openStatusFilterSheet}
          >
            <SvgXml xml={filterIcon} width={20} height={20} />
            <Typography variant="mediumTxtsm" color={colors.gray[900]}>
              Filter
            </Typography>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: 'flex-end',
            paddingRight: 10,
            paddingBottom: 5,
            gap: 4,
            //opacity: canExport ? 1 : 0.5,
          }}
          onPress={() => { }}
          disabled={false}
        >
          <SvgXml xml={downloadIcon} height={15} width={15} color={colors.brand[600]} />
          <Typography variant="mediumTxtxs" color={colors.brand[600]}>
            {"Export Report"}
          </Typography>
        </TouchableOpacity>

        <View style={styles.card} onLayout={onContainerLayout}>
          {assignmentsListError && blueprintId ? (
            <View style={{ padding: 16 }}>
              <Typography variant="mediumTxtsm" color={colors.error[600]}>
                {assignmentsListError}
              </Typography>
            </View>
          ) : assignmentsListLoading && blueprintId ? (
            <AssignmentsListTableShimmer />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled bounces={false}>
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
                  <View style={styles.headerRow}>
                    <View style={{ paddingHorizontal: 10 }}>
                      <CheckBox />
                    </View>
                    <Typography variant="semiBoldTxtxs" color={colors.gray[500]}>
                      Candidate
                    </Typography>
                  </View>
                  <ScrollView nestedScrollEnabled horizontal >
                    <FlatList
                      data={displayData}
                      renderItem={renderLeftColumn}
                      keyExtractor={(item) => item.id}
                      scrollEnabled={false}
                      bounces={false}
                    />
                  </ScrollView>
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
                      {tableTitle.map((title, i) => (
                        <View key={i} style={[styles.cell, { paddingLeft: 16 }]}>
                          <Typography variant="semiBoldTxtxs" color={colors.gray[500]}>
                            {title}
                          </Typography>
                        </View>
                      ))}
                    </View>

                    <FlatList
                      data={displayData}
                      renderItem={renderRightRow}
                      keyExtractor={(item) => item.id}
                      scrollEnabled={false}
                      bounces={false}
                    />
                  </View>
                </ScrollView>
              </View>
            </ScrollView>
          )}
        </View>
      </CustomSafeAreaView>
      <BottomSheet
        visible={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        onClearAll={clearAssignmentFilters}
        title="Filter by status"
        showHeadline
        hight={screenHeight * 0.55}
        sheetHeightRatio={0}
      >
        <SortBottomSheet
          options={[...ASSIGNMENT_STATUS_FILTER_OPTIONS]}
          selectedValue={draftStatusFilter}
          onSelect={setDraftStatusFilter}
          onApply={applyStatusFilter}
        />
      </BottomSheet>
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

export default CandidateAssignmentsDeatilsTable;
