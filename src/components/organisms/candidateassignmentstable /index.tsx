import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
    View,
    Animated,
    TouchableOpacity,
    LayoutChangeEvent,
    FlatList,
    ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { colors } from "../../../theme/colors";
import Typography from "../../atoms/typography";
import { screenHeight, windowWidth } from "../../../utils/devicelayout";
import { SvgXml } from "react-native-svg";
import { useStyles } from "./styles";
import { expandarrowsIcon } from "../../../assets/svg/expandarrows";
import Shimmer from "../../atoms/shimmer";
import { CandidateAssignmentsTableProps, CandidateAssignmentRow } from "./candidateassignmentstable";
import {
    ASSIGNMENTS_STAGE_OVERVIEW_COLUMNS,
    ASSIGNMENT_STATUS_FILTER_OPTIONS,
    SHIMMER_ROWS,
    TRACK_WIDTH,
} from "./config";
import CheckBox from "../../atoms/checkbox";
import { downloadIcon } from "../../../assets/svg/download";
import { filterIcon } from "../../../assets/svg/filter";
import SearchBar from "../../atoms/searchbar";
import BottomSheet from "../bottomsheet";
import SortBottomSheet from "../sortbottomsheet";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import {
    exportBlueprintAssignmentsReportRequestAction,
    fetchBlueprintAssignmentsListRequestAction,
} from "../../../features/assessments/actions";
import {
    setAssignmentsListSearchText,
    setAssignmentTableSelectedForIds,
    toggleAssignmentTableSelectedId,
} from "../../../features/assessments/slice";
import {
    selectAssessmentOverviewBlueprintId,
    selectAssignmentExportLoading,
    selectAssignmentTableSelectedIds,
    selectAssignmentsListSearchText,
    selectBlueprintAssignmentsListLoading,
    selectBlueprintAssignmentsListQuery,
} from "../../../features/assessments/selectors";

const CandidateAssignmentsTableOverviewShimmer = () => {
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

const CandidateAssignmentsTable: React.FC<CandidateAssignmentsTableProps> = ({
    overview,
    loading,
    onViewMore,
    variant = "preview",
}) => {
    const dispatch = useAppDispatch();
    const blueprintId = useSelector(selectAssessmentOverviewBlueprintId);
    const assignmentsListLoading = useSelector(selectBlueprintAssignmentsListLoading);
    const assignmentsListQuery = useSelector(selectBlueprintAssignmentsListQuery);
    const assignmentsListSearchText = useSelector(selectAssignmentsListSearchText);
    const assignmentTableSelectedIds = useSelector(selectAssignmentTableSelectedIds);
    const assignmentExportLoading = useSelector(selectAssignmentExportLoading);

    const styles = useStyles();
    const scrollX = useRef(new Animated.Value(0)).current;
    const [contentWidth, setContentWidth] = useState(0);
    const [containerWidth, setContainerWidth] = useState(windowWidth - 40);
    const [filterSheetOpen, setFilterSheetOpen] = useState(false);
    const [draftStatusFilter, setDraftStatusFilter] = useState("all");
    const appliedStatusRef = useRef("all");

    const data: CandidateAssignmentRow[] = overview?.results ?? [];
    const visibleRows = variant === "full" ? data : data.slice(0, 6);
    const selectedIdSet = useMemo(
        () => new Set(assignmentTableSelectedIds),
        [assignmentTableSelectedIds]
    );
    const allVisibleSelected =
        visibleRows.length > 0 &&
        visibleRows.every((row) => selectedIdSet.has(row.id));
    const canExport =
        Boolean(blueprintId) &&
        assignmentTableSelectedIds.length > 0 &&
        !assignmentExportLoading;

    useEffect(() => {
        if (!blueprintId || assignmentsListQuery?.blueprintId !== blueprintId) {
            return;
        }
        appliedStatusRef.current =
            assignmentsListQuery.status && assignmentsListQuery.status !== "all"
                ? assignmentsListQuery.status
                : "all";
    }, [blueprintId, assignmentsListQuery?.blueprintId, assignmentsListQuery?.status]);

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

    const openStatusFilterSheet = () => {
        if (!blueprintId) return;
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

    const onToggleHeaderSelection = () => {
        const ids = visibleRows.map((r) => r.id);
        if (ids.length === 0) return;
        dispatch(
            setAssignmentTableSelectedForIds({
                ids,
                selected: !allVisibleSelected,
            })
        );
    };

    const onExportReport = () => {
        if (!blueprintId || assignmentTableSelectedIds.length === 0) return;
        dispatch(
            exportBlueprintAssignmentsReportRequestAction({
                blueprint_id: blueprintId,
                select_all: false,
                assignment_ids: [...assignmentTableSelectedIds],
            })
        );
    };

    /** LEFT FIXED COLUMN */
    const renderLeftColumn = ({ item, index }: { item: CandidateAssignmentRow; index: number }) => {
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
                <View style={{ flex: 1, minWidth: 0 }} pointerEvents="box-none">
                    <Typography variant="mediumTxtsm" numberOfLines={1}>
                        {item.candidate.name ? item.candidate.name : item.candidate.email}
                    </Typography>
                    <Typography variant="mediumTxtxs" numberOfLines={1} color={colors?.gray[500]} ellipsizeMode="tail">
                        {item.candidate.email}
                    </Typography>
                </View>
            </View>
        );
    };

    /** RIGHT SCROLLABLE CELLS */
    const renderRightRow = ({ item, index }: { item: CandidateAssignmentRow; index: number }) => {
        const bg = index % 2 === 1 ? colors.neutrals.lightGray : "#FFF";

        return (
            <View style={[styles.row, { backgroundColor: bg }]}>
                <Typography style={styles.cell}>{item.status.label}</Typography>
                <View style={styles.cell}>
                    <Typography variant="regularTxtxs">
                        From: {item.validity.split(" To ")[0].replace("From ", "")}
                    </Typography>

                    <Typography
                        variant="regularTxtxs"
                        color={colors.gray[500]}
                        style={{ marginTop: 2 }}
                    >
                        To: {item.validity.split(" To ")[1]}
                    </Typography>
                </View>
                <Typography style={styles.cell}>{item.duration}</Typography>
                <Typography style={styles.cell}>{item.passingScore}</Typography>
                <Typography style={styles.cell}>{item.score}</Typography>
                <Typography style={styles.cell}>{item.assigned}</Typography>
                <Typography style={styles.cell}>{item.proctoring.label}</Typography>
                <Typography style={styles.cell}>{item.reminders}</Typography>
            </View>
        );
    };

    if (loading) {
        return <CandidateAssignmentsTableOverviewShimmer />;
    }

    return (
        <Fragment>
            <View style={styles.card} onLayout={onContainerLayout}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
                    <View>
                        <Typography variant="semiBoldTxtlg">
                            Candidate Assignments
                        </Typography>
                        <Typography variant="regularTxtxs" color={colors.gray[500]}>
                            Track status and validity for each candidate.
                        </Typography>
                    </View>
                    <View>
                        <TouchableOpacity onPress={onViewMore}>
                            <SvgXml xml={expandarrowsIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
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
                            style={[styles.filterButton, !blueprintId && { opacity: 0.45 }]}
                            activeOpacity={0.7}
                            accessibilityRole="button"
                            accessibilityLabel="Filter"
                            onPress={openStatusFilterSheet}
                            disabled={!blueprintId}
                        >
                            {assignmentsListLoading ? (
                                <Shimmer width={20} height={20} borderRadius={6} />
                            ) : (
                                <SvgXml xml={filterIcon} width={20} height={20} />
                            )}
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
                            opacity: canExport ? 1 : 0.45,
                        }}
                        onPress={onExportReport}
                        disabled={!canExport}
                    >
                        <SvgXml xml={downloadIcon} height={15} width={15} color={colors.brand[600]} />
                        <Typography variant="mediumTxtxs" color={colors.brand[600]}>
                            {"Export Report"}
                        </Typography>
                    </TouchableOpacity>

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
                            <View style={[styles.headerRow, { paddingLeft: 0 }]}>
                                <View
                                    style={{ width: 44, alignItems: "center", justifyContent: "center" }}
                                    collapsable={false}
                                >
                                    <CheckBox
                                        checked={allVisibleSelected}
                                        onChange={onToggleHeaderSelection}
                                    />
                                </View>
                                <Typography
                                    variant="semiBoldTxtxs"
                                    style={styles.headerText}
                                    color={colors.gray[500]}
                                >
                                    Candidate
                                </Typography>
                            </View>

                            <FlatList
                                data={visibleRows}
                                renderItem={renderLeftColumn}
                                keyExtractor={(item) => `left-${item.id}`}
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
                                    {ASSIGNMENTS_STAGE_OVERVIEW_COLUMNS.map((title, index) => (
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
                                    data={visibleRows}
                                    renderItem={renderRightRow}
                                    keyExtractor={(item) => `right-${item.id}`}
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

            <BottomSheet
                visible={filterSheetOpen}
                onClose={() => setFilterSheetOpen(false)}
                onClearAll={clearAssignmentFilters}
                title="Filter by status"
                showHeadline
                hight={undefined}
            >
                <SortBottomSheet
                    options={[...ASSIGNMENT_STATUS_FILTER_OPTIONS]}
                    selectedValue={draftStatusFilter}
                    onSelect={setDraftStatusFilter}
                    onApply={applyStatusFilter}
                />
            </BottomSheet>
        </Fragment>
    );
};

export default CandidateAssignmentsTable;
