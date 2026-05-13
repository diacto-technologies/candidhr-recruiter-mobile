import React, { useMemo, useRef, useState } from "react";
import { View, FlatList, Pressable, TouchableOpacity } from "react-native";
import { SvgXml } from "react-native-svg";
import { Typography } from "../../../atoms";
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
import { horizontalThreedotIcon } from "../../../../assets/svg/horizontalthreedoticon";
import { heartIcon } from "../../../../assets/svg/heart";
import { DropdownMenu } from "../../../molecules/dropdownmenu";
import { copyIcon } from "../../../../assets/svg/copy";
import Clipboard from "@react-native-clipboard/clipboard";
import { showToastMessage } from "../../../../utils/toast";
import { organizationalOrigin } from "../../../../features/auth";
import { store } from "../../../../store";
import { shareIcon } from "../../../../assets/svg/share";
import ShareJobModal from "../../shareJobModal";
import { PERMISSIONS } from '../../../../utils/permission.constants';
import { usePermission } from '../../../../hooks/usePermission';

export interface JobCardListProps {
    tabs: string[];
    activeTab: string;
    jobsList: Job[];
    loading: boolean;
    isTabLoading: boolean;
    publishedCount: number;
    unpublishedCount: number;
    favouritesCount: number;
    isConnected: boolean;
    onChangeTab: (label: string) => void;
    onLoadMore: () => void;
    onJobPress: (jobId: string) => void;
    favouriteJobIds?: string[];
    onToggleFavourite?: (jobId: string) => void;
    hasMore?: boolean;
}

interface JobCardRowProps {
    item: Job;
    cardStyles: ReturnType<typeof useStyles>;
    onJobPress: (jobId: string) => void;
    favouriteJobIds: string[];
    onToggleFavourite?: (jobId: string) => void;
}

const JobCardRow: React.FC<JobCardRowProps> = ({
    item,
    cardStyles,
    onJobPress,
    favouriteJobIds,
    onToggleFavourite,
}) => {
    const { can } = usePermission();
    const [menuVisible, setMenuVisible] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ left: 0, top: 0 });
    const [shareModalVisible, setShareModalVisible] = useState(false);
    const menuTriggerRef = useRef<View | null>(null);
    const initialSharedMemberIds = useMemo(
        () => (item.users_shared_with ?? []).map((u) => u.id).filter(Boolean),
        [item.users_shared_with]
    );

    const handleOpenMenu = () => {
        if (menuTriggerRef.current && "measureInWindow" in menuTriggerRef.current) {
            (menuTriggerRef.current as any).measureInWindow(
                (x: number, y: number, width: number, height: number) => {
                    setDropdownPosition({
                        left: Math.max(8, x + width - 160),
                        top: y + height - 5,
                    });
                    setMenuVisible(true);
                }
            );
        } else {
            setMenuVisible(true);
        }
    };

    const handleCopyJobFormUrl = () => {
        if (!item?.encrypted) {
            showToastMessage("Job Form URL not available", "error");
            return;
        }
        const url = `${organizationalOrigin(store.getState())}/app/candidate/${item.encrypted}/`;
        Clipboard.setString(url);
        showToastMessage("Job Form URL copied to clipboard", "success");
    };

    return (
        <View style={cardStyles.card}>
            <View collapsable={false} style={{ width: "100%" }}>
                <View style={cardStyles.rowBetween}>
                    <Pressable style={{ flex: 1, paddingRight: 8 }} onPress={() => onJobPress(item.id)}>
                        <Typography variant="semiBoldTxtmd">{item.title ?? ""}</Typography>
                    </Pressable>
                    <View
                        ref={(el) => {
                            menuTriggerRef.current = el;
                        }}
                        collapsable={false}
                    >
                        <Pressable onPress={handleOpenMenu} hitSlop={8}>
                            <SvgXml xml={horizontalThreedotIcon} height={20} width={20} />
                        </Pressable>
                    </View>
                </View>

                <Pressable onPress={() => onJobPress(item.id)}>
                    <View style={cardStyles.row}>
                        <Typography variant="regularTxtsm" color={colors.gray[500]}>
                            Open until : {""}
                        </Typography>
                        <Typography variant="mediumTxtsm" color={colors.gray[600]}>
                            {formatMonDDYYYY(item.close_date ?? 0)}
                        </Typography>
                    </View>
                    <TouchableOpacity
                        onPress={() => onToggleFavourite?.(item.id)}
                        style={{ alignSelf: "flex-end" }}
                    >
                        <SvgXml
                            xml={heartIcon}
                            height={20}
                            width={20}
                            color={
                                favouriteJobIds?.includes?.(item.id)
                                    ? colors.warning[400]
                                    : colors.gray[300]
                            }
                            fill={
                                favouriteJobIds?.includes?.(item.id)
                                    ? colors.warning[400]
                                    : colors.gray[300]
                            }
                        />
                    </TouchableOpacity>
                    <View style={{ marginVertical: 4 }}>
                        <Divider
                            height={1.2}
                            marginVertical={8}
                            color={colors.mainColors.borderColor}
                        />
                    </View>

                    <View style={cardStyles.rowBetween}>
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

            <ShareJobModal
                visible={shareModalVisible}
                onClose={() => setShareModalVisible(false)}
                jobId={item.id}
                initialSharedMemberIds={initialSharedMemberIds}
            />

            <DropdownMenu
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
                position={dropdownPosition}
                iconColor={colors?.gray[400]}
                width={160}
                iconStyle={{
                    marginRight: 12,
                }}
                iconHight={20}
                iconWidth={20}
                items={[
                    {
                        label: "View",
                        icon: eyeVisibleIcon,
                        onPress: () => onJobPress(item.id),
                    },
                    {
                        label: "Copy URL",
                        icon: copyIcon,
                        onPress: handleCopyJobFormUrl,
                    },
                    ...(can(PERMISSIONS.SHARE_JOB)
                        ? [
                              {
                                  label: "Share",
                                  icon: shareIcon,
                                  onPress: () => {
                                      setMenuVisible(false);
                                      setShareModalVisible(true);
                                  },
                              },
                          ]
                        : []),
                ]}
            />
        </View>
    );
};

const JobCardList: React.FC<JobCardListProps> = ({
    tabs,
    activeTab,
    jobsList,
    loading,
    isTabLoading,
    publishedCount,
    unpublishedCount,
    favouritesCount,
    isConnected: _isConnected,
    onChangeTab,
    onLoadMore,
    onJobPress,
    favouriteJobIds = [],
    onToggleFavourite,
}) => {
    const isTablet = DeviceInfo.isTablet();
    const styles = useStyles();

    const renderShimmerCard = () => (
        <View style={styles.card}>
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
                <View style={styles.tabContainer}>
                    <SlideAnimatedTab
                        tabs={tabs}
                        activeTab={activeTab}
                        onChangeTab={onChangeTab}
                        counts={{
                            Published: publishedCount,
                            Draft: unpublishedCount,
                            Favourites: favouritesCount,
                        }}
                        countShow={true}
                    />
                    <View style={styles.bottomBorder} />
                </View>

                <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
                    <FlatList
                        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]}
                        keyExtractor={(item) => String(item)}
                        renderItem={() => renderShimmerCard()}
                        numColumns={isTablet ? 2 : 1}
                        key={isTablet ? "tablet-shimmer-2" : "mobile-shimmer-1"}
                        columnWrapperStyle={isTablet ? { justifyContent: "space-between" } : undefined}
                        contentContainerStyle={{ gap: 12 }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </>
        );
    }

    const renderItem = ({ item }: { item: Job }) => (
        <JobCardRow
            item={item}
            cardStyles={styles}
            onJobPress={onJobPress}
            favouriteJobIds={favouriteJobIds}
            onToggleFavourite={onToggleFavourite}
        />
    );

    return (
        <>
            <View style={styles.tabContainer}>
                <SlideAnimatedTab
                    counts={{
                        Published: publishedCount,
                        Draft: unpublishedCount,
                        Favourites: favouritesCount,
                    }}
                    tabs={tabs}
                    activeTab={activeTab}
                    onChangeTab={onChangeTab}
                />
                <View style={styles.bottomBorder} />
            </View>

            <FlatList
                data={jobsList}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    gap: 12,
                    flexGrow: 1,
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
                        <BackgroundPattern
                            bgStyle={{
                                height: "100%",
                                width: "100%",
                                top: -90,
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    alignSelf: "center",
                                    alignContent: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <View
                                    style={{
                                        alignItems: "center",
                                        paddingHorizontal: 16,
                                        zIndex: 10,
                                        marginBottom: 10,
                                    }}
                                >
                                    <SvgXml xml={Illustrations} style={{ zIndex: -1 }} />
                                    <Typography variant="semiBoldTxtmd">No results found</Typography>

                                    <Typography
                                        variant="regularTxtsm"
                                        color={colors.gray[500]}
                                        style={{ textAlign: "center" }}
                                    >
                                        Try adjusting your search or filters
                                    </Typography>
                                </View>
                            </View>
                        </BackgroundPattern>
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
