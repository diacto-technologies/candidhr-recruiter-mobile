import React from "react";
import { View, FlatList, Pressable} from "react-native";
import { SvgXml } from "react-native-svg";
import { Button, Typography } from "../../../atoms";
import Divider from "../../../atoms/divider";
import { useStyles } from "./styles";
import { Job } from "../../../../features/jobs";
import { formatMonDDYYYY } from "../../../../utils/dateformatter";
import { eyeVisibleIcon } from "../../../../assets/svg/eyevisible";
import { userApplicationIcon } from "../../../../assets/svg/userapplicationicon";
import { colors } from "../../../../theme/colors";
import SlideAnimatedTab from "../../../molecules/slideanimatedtab";
import Shimmer from "../../../atoms/shimmer";
import DeviceInfo from "react-native-device-info";
import BackgroundPattern from "../../../atoms/backgroundpattern";
import { Illustrations } from "../../../../assets/svg/illustrations";
import { JobCardListProps } from "./jobcardlist";

const JobCardList: React.FC<JobCardListProps> = ({
    tabs,
    activeTab,
    jobsList,
    loading,
    isTabLoading,
    publishedCount,
    unpublishedCount,
    isConnected,
    onChangeTab,
    onLoadMore,
    onJobPress,
}) => {
    const isTablet = DeviceInfo.isTablet();
    const styles = useStyles();


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
    // if (!isConnected && jobsList.length === 0) {
    //     return (
    //         <>
    //             <View style={styles.tabContainer}>
    //                 <SlideAnimatedTab
    //                     tabs={tabs}
    //                     activeTab={activeTab}
    //                     onChangeTab={onChangeTab}
    //                     countShow={true}
    //                 />
    //                 <View style={styles.bottomBorder} />
    //             </View>
    //             <BackgroundPattern>
    //                 <View style={{ alignItems: "center", marginTop: 60, paddingHorizontal: 16 }}>
    //                     <Typography variant="semiBoldTxtmd">No results found</Typography>
    //                 </View>
    //             </BackgroundPattern>
    //         </>
    //     );
    // }
    if (isTabLoading || (loading && jobsList.length === 0)) {
        return (
            <>
                {/* Tabs */}
                <View style={styles.tabContainer}>
                    <SlideAnimatedTab
                        tabs={tabs}
                        activeTab={activeTab}
                        onChangeTab={onChangeTab}
                        countShow={true}
                    />
                    <View style={styles.bottomBorder} />
                </View>

                {/* Shimmer List */}
                <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
                    <FlatList
                        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]}
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
            <Pressable onPress={() => onJobPress(item.id)}>
                <View style={styles.rowBetween}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Typography variant="semiBoldTxtmd">{item.title ?? ""}</Typography>
                        {/* <SvgXml xml={horizontalThreedotIcon} height={20} width={20} /> */}
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

                <View style={{ marginVertical: 4 }}>
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
                    onChangeTab={onChangeTab}
                />
                <View style={styles.bottomBorder} />
            </View>
            {/* {!loading && !isTabLoading && jobsList.length === 0 && (
                <BackgroundPattern bgStyle={{
                    height: '100%',
                    width: '100%',
                    top: 90,
                }}>
                    <View
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingHorizontal: 16,
                            zIndex: 999
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
                </BackgroundPattern>
            )} */}

            {/* Job List */}
            <FlatList
                data={jobsList}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    gap: 12,
                    flexGrow: 1, // 👈 VERY IMPORTANT for centering
                }}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                showsVerticalScrollIndicator={false}
                onEndReached={onLoadMore}
                onEndReachedThreshold={0.5}
                numColumns={isTablet ? 2 : 1}

                ListEmptyComponent={
                    !loading && !isTabLoading ? (
                        <BackgroundPattern bgStyle={{
                            height: '100%',
                            width: '100%',
                            top: -90,
                            //zIndex: 10
                        }}>
                            <View style={{flex:1,alignSelf:'center',alignContent:'center',justifyContent:"center",}}>
                                <View
                                    style={{
                                        alignItems: 'center',
                                        paddingHorizontal: 16,
                                        zIndex: 10,
                                        marginBottom:10,
                                    }}
                                >
                                    <SvgXml xml={Illustrations} style={{ zIndex: -1, }} />
                                    <Typography variant="semiBoldTxtmd">
                                        No results found
                                    </Typography>

                                    <Typography
                                        variant="regularTxtsm"
                                        color={colors.gray[500]}
                                        style={{ textAlign: 'center' }}
                                    >
                                        Try adjusting your search or filters
                                    </Typography>
                                </View>
                                {/* <Button
                                    buttonColor={colors.mainColors.slateBlue}
                                    textColor={colors.common.white}
                                    borderColor={colors.mainColors.borderColor}
                                    borderRadius={8}
                                    borderWidth={1}
                                    size={'Medium'}
                                    onPress={() => { }}
                                >
                                    Add new job
                                </Button> */}
                            </View>
                        </BackgroundPattern >
                    ) : null
                }

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
