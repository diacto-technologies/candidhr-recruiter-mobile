import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, Pressable } from "react-native";
import { SvgXml } from "react-native-svg";
import { Typography } from "../../../atoms";
import Divider from "../../../atoms/divider";
import { navigate } from "../../../../utils/navigationUtils";
import { useStyles } from "./styles";
import { Job } from "../../../../features/jobs";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import {
    selectJobs,
    selectJobsLoading,
    selectJobsPagination,
    selectJobsHasMore,
    selectPublishedCount,
    selectUnpublishedCount,
    selectJobFilters,
    selectJobsActiveTab,
    selectIsTabLoading,
} from "../../../../features/jobs/selectors";
import { getJobsRequestAction } from "../../../../features/jobs/actions";
import { formatMonDDYYYY } from "../../../../utils/dateformatter";
import { eyeVisibleIcon } from "../../../../assets/svg/eyevisible";
import { userApplicationIcon } from "../../../../assets/svg/userapplicationicon";
import { horizontalThreedotIcon } from "../../../../assets/svg/horizontalthreedoticon";
import { colors } from "../../../../theme/colors";
import SlideAnimatedTab from "../../../molecules/slideanimatedtab";
import Shimmer from "../../../atoms/shimmer";
import { setActiveTab } from "../../../../features/jobs/slice";

const JobCardList = () => {
    const tabs = ["Published", "Unpublished"];
    const activeTab = useAppSelector(selectJobsActiveTab);

    const jobsList = useAppSelector(selectJobs);
    const loading = useAppSelector(selectJobsLoading);
    const pagination = useAppSelector(selectJobsPagination);
    const hasMore = useAppSelector(selectJobsHasMore);
    const publishedCount = useAppSelector(selectPublishedCount);
    const unpublishedCount = useAppSelector(selectUnpublishedCount);
    const jobFilters = useAppSelector(selectJobFilters);
    const isTabLoading = useAppSelector(selectIsTabLoading);

    const styles = useStyles();
    const dispatch = useAppDispatch();

    // useEffect(() => {
    //     dispatch(
    //         getJobsRequestAction({
    //             page: 1,
    //             limit: pagination.limit,
    //             published: activeTab === 'Published',
    //             append: false,
    //             ...jobFilters
    //         })
    //     );
    // }, [activeTab]);

    const handleLoadMore = useCallback(() => {
        if (loading || !hasMore) return;

        dispatch(
            getJobsRequestAction({
                page: pagination.page + 1,
                limit: pagination.limit,
                published: activeTab === "Published",
                append: true,
                ...jobFilters,
            })
        );
    }, [loading, hasMore, pagination, activeTab]);


    const renderShimmerCard = () => (
        <View
            style={{
                backgroundColor: colors.common.white,
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: "#E5E7EB",
            }}
        >
            <Shimmer width="70%" height={18} style={{ marginBottom: 12 }} />
            <Shimmer width="50%" height={14} style={{ marginBottom: 16 }} />

            <View
                style={{
                    height: 1,
                    backgroundColor: colors.mainColors.borderColor,
                    marginVertical: 8,
                }}
            />

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Shimmer width="40%" height={14} />
                <Shimmer width="30%" height={14} />
            </View>
        </View>
    );

    if (isTabLoading || (loading && jobsList.length === 0)) {
        return (
            <>
                {/* Tabs */}
                <View style={styles.tabContainer}>
                    <SlideAnimatedTab
                        tabs={tabs}
                        activeTab={activeTab}
                        onChangeTab={(label) =>
                            dispatch(setActiveTab(label === "Published" ? "Published" : "Unpublished"))
                        }
                        countShow={true}
                    />
                    <View style={styles.bottomBorder} />
                </View>

                {/* Shimmer List */}
                <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
                    {[1, 2, 3, 4, 5].map((_, i) => (
                        <View key={i}>{renderShimmerCard()}</View>
                    ))}
                </View>
            </>
        );
    }

    const renderItem = ({ item }: { item: Job }) => (
        <View style={styles.card}>
            <Pressable onPress={() => navigate("JobDetailScreen", { jobId: item.id })}>
                <View style={styles.rowBetween}>
                    <View style={{ flex: 1 }}>
                        <Typography variant="semiBoldTxtmd">{item.title ?? ""}</Typography>
                    </View>
                    <SvgXml xml={horizontalThreedotIcon} />
                </View>

                <View style={styles.row}>
                    <Typography variant="regularTxtsm" color={colors.gray[500]}>
                        Open until : {""}
                    </Typography>
                    <Typography variant="mediumTxtsm" color={colors.gray[600]}>
                        {formatMonDDYYYY(item.close_date ?? 0)}
                    </Typography>
                </View>

                <Divider
                    height={2}
                    marginVertical={8}
                    color={colors.mainColors.borderColor}
                />

                <View style={styles.rowBetween}>
                    <View style={{ flexDirection: "row", gap: 12 }}>
                        <View style={{ flexDirection: "row", gap: 4 }}>
                            <SvgXml xml={eyeVisibleIcon} width={20} height={20} />
                            <Typography variant="mediumTxtsm" color={colors.gray[600]}>
                                {item.views_count ?? ""}
                            </Typography>
                        </View>

                        <View style={{ flexDirection: "row", gap: 4 }}>
                            <SvgXml xml={userApplicationIcon} width={20} height={20} />
                            <Typography variant="mediumTxtsm" color={colors.gray[600]}>
                                {item.applicants_count ?? ""}
                            </Typography>
                        </View>
                    </View>

                    <Typography variant="regularTxtsm" color={colors.gray[500]}>
                        {item.owner?.name ?? ""}
                    </Typography>
                </View>
            </Pressable>
        </View>
    );

    return (
        <>
            {/* Tabs */}
            <View style={styles.tabContainer}>
                <SlideAnimatedTab
                    counts={{
                        Published: publishedCount,
                        Unpublished: unpublishedCount,
                    }}

                    tabs={tabs}
                    activeTab={activeTab}
                    onChangeTab={(label) =>
                        dispatch(setActiveTab(label === "Published" ? "Published" : "Unpublished"))
                    }
                />
                <View style={styles.bottomBorder} />
            </View>
            {!loading && !isTabLoading && jobsList.length === 0 && (
                <View
                    style={{
                        alignItems: "center",
                        marginTop: 60,
                        paddingHorizontal: 16,
                    }}
                >
                    <Typography variant="semiBoldTxtmd">
                        No results found
                    </Typography>
                    <Typography
                        variant="regularTxtsm"
                        color={colors.gray[500]}
                        style={{ marginTop: 6, textAlign: "center" }}
                    >
                        Try adjusting your search or filters
                    </Typography>
                </View>
            )}
            {/* Job List */}
            <FlatList
                data={jobsList}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingVertical: 20,
                    gap: 12,
                }}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loading && jobsList.length > 0 ? (
                        <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
                            <Shimmer width="100%" height={20} borderRadius={8} />
                        </View>
                    ) : null
                }
            />
        </>
    );
};

export default JobCardList;
