import React, { memo, useCallback, useRef, useState } from "react";
import { View, FlatList, Pressable, Alert, Clipboard, Dimensions } from "react-native";
import { SvgXml } from "react-native-svg";
import { Button, Typography } from "../../../atoms";
import Divider from "../../../atoms/divider";
import { DropdownMenu, type DropdownMenuItem } from "../../../molecules/dropdownmenu";
import { useStyles } from "./styles";
import { Job } from "../../../../features/jobs";
import { formatMonDDYYYY } from "../../../../utils/dateformatter";
import { eyeVisibleIcon } from "../../../../assets/svg/eyevisible";
import { eyeHiddenIcon } from "../../../../assets/svg/eyehiddenicon";
import { userApplicationIcon } from "../../../../assets/svg/userapplicationicon";
import { copyIcon } from "../../../../assets/svg/copy";
import { editIcon } from "../../../../assets/svg/edit";
import { shareIcon } from "../../../../assets/svg/share";
import { fileIcon } from "../../../../assets/svg/file";
import { assignedUserIcon } from "../../../../assets/svg/assigneduser";
import { trashIcon } from "../../../../assets/svg/trash";
import { colors } from "../../../../theme/colors";
import SlideAnimatedTab from "../../../molecules/slideanimatedtab";
import ShareApplicationModal from "../../shareApplicationModal";
import DuplicateJobModal from "../../duplicateJobModal";
import AssignWorkflowModal from "../../assignWorkflowModal";
import Shimmer from "../../../atoms/shimmer";
import DeviceInfo from "react-native-device-info";
import BackgroundPattern from "../../../atoms/backgroundpattern";
import { Illustrations } from "../../../../assets/svg/illustrations";
import { horizontalThreedotIcon } from "../../../../assets/svg/horizontalthreedoticon";
import { heartIcon } from "../../../../assets/svg/heart";
import { navigate } from "../../../../utils/navigationUtils";
import { showToastMessage } from "../../../../utils/toast";
import { useAppDispatch } from "../../../../store/hooks";
import { store } from "../../../../store";
import { organizationalOrigin } from "../../../../features/auth";
import {
    patchJobPublishedRequestAction,
    softDeleteJobRequestAction,
} from "../../../../features/jobs/actions";

const SCREEN_W = Dimensions.get("window").width;
const JOB_MENU_WIDTH = 170;

export type JobOverflowMenuAction =
    | "view"
    | "copy_url"
    | "edit"
    | "publish"
    | "share"
    | "duplicate"
    | "assign_workflow"
    | "delete";

export interface JobCardListProps {
    tabs: string[];
    activeTab: string;
    jobsList: Job[];
    loading: boolean;
    isTabLoading: boolean;
    publishedCount: number;
    unpublishedCount: number;
    favouritesCount: number;
    isConnected?: boolean;
    hasMore?: boolean;
    onChangeTab: (tab: string) => void;
    onLoadMore?: () => void;
    onJobPress: (jobId: string) => void;
    favouriteJobIds?: string[];
    onToggleFavourite: (jobId: string) => void;
    onJobOverflowAction?: (action: JobOverflowMenuAction, job: Job) => void;
}

type JobCardRowProps = {
    item: Job;
    styles: ReturnType<typeof useStyles>;
    favouriteJobIds: string[];
    onJobPress: (jobId: string) => void;
    onToggleFavourite: (jobId: string) => void;
    menuJob: Job | null;
    setMenuJob: React.Dispatch<React.SetStateAction<Job | null>>;
    buildMenuItems: (job: Job) => DropdownMenuItem[];
};

const JobCardRow = memo(function JobCardRow({
    item,
    styles,
    favouriteJobIds,
    onJobPress,
    onToggleFavourite,
    menuJob,
    setMenuJob,
    buildMenuItems,
}: JobCardRowProps) {
    const triggerRef = useRef<View>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ left: 0, top: 0 });
    const menuVisible = menuJob?.id === item.id;

    const openMenu = () => {
        if (menuJob?.id === item.id) {
            setMenuJob(null);
            return;
        }
        triggerRef.current?.measureInWindow((x, y, w, h) => {
            let left = x + w - JOB_MENU_WIDTH;
            left = Math.max(8, Math.min(left, SCREEN_W - JOB_MENU_WIDTH - 8));
            const top = y + h + 4;
            setDropdownPosition({ left, top });
            setMenuJob(item);
        });
    };

    return (
        <View style={styles.card}>
            <View style={styles.rowBetween}>
                <Pressable
                    style={styles.titlePressable}
                    onPress={() => onJobPress(item.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Open job ${item.title ?? ""}`}
                >
                    <Typography variant="semiBoldTxtmd" numberOfLines={2}>
                        {item.title ?? ""}
                    </Typography>
                </Pressable>
                <View ref={triggerRef} collapsable={false}>
                    <Pressable
                        hitSlop={10}
                        onPress={openMenu}
                        accessibilityRole="button"
                        accessibilityLabel="More job actions"
                        style={styles.threeDotHit}
                    >
                        <SvgXml xml={horizontalThreedotIcon} height={20} width={20} />
                    </Pressable>
                </View>
            </View>

            <Pressable onPress={() => onJobPress(item.id)} accessibilityRole="button">
                <View style={styles.row}>
                    <Typography variant="regularTxtsm" color={colors.gray[500]}>
                        Open until : {""}
                    </Typography>
                    <Typography variant="mediumTxtsm" color={colors.gray[600]}>
                        {formatMonDDYYYY(item.close_date ?? 0)}
                    </Typography>
                </View>
                <Pressable
                    onPress={(e) => {
                        e?.stopPropagation?.();
                        onToggleFavourite(item.id);
                    }}
                    style={{ alignSelf: "flex-end" }}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Toggle favourite"
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
                </Pressable>
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

            <DropdownMenu
                visible={menuVisible}
                onClose={() => setMenuJob(null)}
                position={dropdownPosition}
                iconColor={colors.gray[400]}
                width={JOB_MENU_WIDTH}
                iconWidth={20}
                iconHight={20}
                iconStyle={{ marginRight: 12 }}
                items={buildMenuItems(item)}
            />
        </View>
    );
});

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
    onJobOverflowAction,
}) => {
    const isTablet = DeviceInfo.isTablet();
    const styles = useStyles();
    const dispatch = useAppDispatch();
    const [menuJob, setMenuJob] = useState<Job | null>(null);
    const [shareModalJob, setShareModalJob] = useState<Job | null>(null);
    const [duplicateModalJob, setDuplicateModalJob] = useState<Job | null>(null);
    const [assignWorkflowJob, setAssignWorkflowJob] = useState<Job | null>(null);

    const closeMenu = useCallback(() => setMenuJob(null), []);

    const runDefaultOverflowAction = useCallback(
        (action: JobOverflowMenuAction, job: Job) => {
            switch (action) {
                case "view":
                    onJobPress(job.id);
                    break;
                case "copy_url": {
                    if (!job.encrypted) {
                        showToastMessage("Job Form URL not available", "error");
                        return;
                    }
                    const candidateUrl = `${organizationalOrigin(store.getState())}/app/candidate/${job.encrypted}/`;
                    Clipboard.setString(candidateUrl);
                    showToastMessage("Job Form URL copied to clipboard", "success");
                    break;
                }
                case "edit":
                    navigate("jobdetails", { jobId: job.id });
                    break;
                case "publish":
                    dispatch(
                        patchJobPublishedRequestAction({
                            jobId: job.id,
                            published: !job.published,
                        })
                    );
                    break;
                case "share":
                    setMenuJob(null);
                    setShareModalJob(job);
                    break;
                case "duplicate":
                    setMenuJob(null);
                    setDuplicateModalJob(job);
                    break;
                case "assign_workflow":
                    setMenuJob(null);
                    setAssignWorkflowJob(job);
                    break;
                case "delete":
                    Alert.alert(
                        "Delete job?",
                        `Remove "${job.title ?? "this job"}"? This cannot be undone from the app.`,
                        [
                            { text: "Cancel", style: "cancel" },
                            {
                                text: "Delete",
                                style: "destructive",
                                onPress: () =>
                                    dispatch(softDeleteJobRequestAction({ jobId: job.id })),
                            },
                        ]
                    );
                    break;
                default:
                    break;
            }
        },
        [onJobPress, dispatch]
    );

    const handleOverflowPress = useCallback(
        (action: JobOverflowMenuAction, job: Job) => {
            if (onJobOverflowAction) {
                onJobOverflowAction(action, job);
                return;
            }
            runDefaultOverflowAction(action, job);
        },
        [onJobOverflowAction, runDefaultOverflowAction]
    );

    const buildMenuItems = useCallback(
        (job: Job): DropdownMenuItem[] => {
            const fire = (action: JobOverflowMenuAction) => () => handleOverflowPress(action, job);
            const danger = colors.error[600];
            return [
                { label: "View", icon: eyeVisibleIcon, onPress: fire("view") },
                { label: "Copy URL", icon: copyIcon, onPress: fire("copy_url") },
                { label: "Edit", icon: editIcon, onPress: fire("edit") },
                {
                    label: job.published ? "Unpublish" : "Publish",
                    icon: job.published ? eyeHiddenIcon : eyeVisibleIcon,
                    onPress: fire("publish"),
                },
                { label: "Share", icon: shareIcon, onPress: fire("share") },
                { label: "Create A Copy", icon: fileIcon, onPress: fire("duplicate") },
                { label: "Assign Workflow", icon: assignedUserIcon, onPress: fire("assign_workflow") },
                {
                    label: "Delete",
                    icon: trashIcon,
                    onPress: fire("delete"),
                    labelColor: danger,
                    iconColor: danger,
                },
            ];
        },
        [handleOverflowPress]
    );

    const renderItem = useCallback(
        ({ item }: { item: Job }) => (
            <JobCardRow
                item={item}
                styles={styles}
                favouriteJobIds={favouriteJobIds}
                onJobPress={onJobPress}
                onToggleFavourite={onToggleFavourite}
                menuJob={menuJob}
                setMenuJob={setMenuJob}
                buildMenuItems={buildMenuItems}
            />
        ),
        [styles, favouriteJobIds, onJobPress, onToggleFavourite, menuJob, buildMenuItems]
    );

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
                onScrollBeginDrag={closeMenu}
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
                                <Button
                                    buttonColor={colors.mainColors.slateBlue}
                                    textColor={colors.common.white}
                                    borderColor={colors.mainColors.borderColor}
                                    borderRadius={8}
                                    borderWidth={1}
                                    size={"Medium"}
                                    onPress={() => {}}
                                >
                                    Add new job
                                </Button>
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
            {shareModalJob != null ? (
                <ShareApplicationModal
                    visible
                    onClose={() => setShareModalJob(null)}
                    jobId={shareModalJob.id}
                    initialSharedMemberIds={
                        shareModalJob.users_shared_with?.map((u) => String(u.id)).filter(Boolean) ??
                        []
                    }
                />
            ) : null}
            <DuplicateJobModal
                visible={duplicateModalJob != null}
                onClose={() => setDuplicateModalJob(null)}
                sourceJob={duplicateModalJob}
            />
            <AssignWorkflowModal
                visible={assignWorkflowJob != null}
                onClose={() => setAssignWorkflowJob(null)}
                job={assignWorkflowJob}
            />
        </>
    );
};

export default JobCardList;
