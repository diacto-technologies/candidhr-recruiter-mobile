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
import DeviceInfo from "react-native-device-info";
import { useNetworkConnectivity } from "../../../../hooks/useNetworkConnectivity";

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
    const isTablet = DeviceInfo.isTablet();
    const isConnected = useNetworkConnectivity();

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
        if (!isConnected || loading || !hasMore) return;

        dispatch(
            getJobsRequestAction({
                page: pagination.page + 1,
                limit: pagination.limit,
                published: activeTab === "Published",
                append: true,
                ...jobFilters,
            })
        );
    }, [isConnected, loading, hasMore, pagination.page, pagination.limit, activeTab, jobFilters]);


    const renderShimmerCard = () => (
        <View
            style={styles.card}
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
    if (!isConnected && jobsList.length === 0) {
        return (
          <>
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
      
            <View style={{ alignItems: "center", marginTop: 60, paddingHorizontal: 16 }}>
              <Typography variant="semiBoldTxtmd"> No results found</Typography>
            </View>
          </>
        );
      }      
    if (isTabLoading || (jobsList.length === 0)) {
        return (
            <>
                {/* Tabs */}
                <View style={styles.tabContainer}>
                    <SlideAnimatedTab
                        tabs={tabs}
                        activeTab={activeTab}
                        onChangeTab={(label) =>{
                            dispatch(setActiveTab(label === "Published" ? "Published" : "Unpublished"))
                        }
                        }
                        countShow={true}
                    />
                    <View style={styles.bottomBorder} />
                </View>

                {/* Shimmer List */}
                <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
                    <FlatList
                        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12,13,14,15,16,17,18,19,20]}
                        keyExtractor={(item) => String(item)}
                        renderItem={() => renderShimmerCard()}
                        numColumns={isTablet ? 2 : 1}
                        key={isTablet ? "tablet-shimmer-2" : "mobile-shimmer-1"} // ✅ important
                        columnWrapperStyle={isTablet ? { justifyContent: "space-between" } : undefined}
                        contentContainerStyle={{ gap: 12 }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </>
        );
    }

    const renderItem = ({ item }: { item: Job }) => (
        <View style={styles.card}>
            <Pressable onPress={() => navigate("JobDetailScreen", { jobId: item.id })}>
                <View style={styles.rowBetween}>
                    <View style={{ flex: 1, flexDirection:'row', justifyContent:'space-between' }}>
                        <Typography variant="semiBoldTxtmd">{item.title ?? ""}</Typography>
                        <SvgXml xml={horizontalThreedotIcon} height={20} width={20} />
                    </View>
                </View>

                <View style={styles.row}>
                    <Typography variant="regularTxtsm" color={colors.gray[500]}>
                        Open until : {""}
                    </Typography>
                    <Typography variant="mediumTxtsm" color={colors.gray[600]}>
                        {formatMonDDYYYY(item.close_date ?? 0)}
                    </Typography>
                </View>

                <View style={{marginVertical:4}}>
                <Divider
                    height={1.2}
                    marginVertical={8}
                    color={colors.mainColors.borderColor}
                />
                </View>


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
                    paddingVertical: 16,
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
                        <View style={{ paddingHorizontal: 16, paddingVertical: 10}}>
                            <Shimmer width="100%" height={20} borderRadius={8} />
                        </View>
                    ) : null
                }
                numColumns={isTablet ? 2 : 1}
            />
        </>
    );
};

export default JobCardList;
