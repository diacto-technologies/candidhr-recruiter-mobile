import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { ProgressBar } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { SvgXml } from 'react-native-svg';
import { useRoute } from '@react-navigation/native';

import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview';
import Card from '../../../../components/atoms/card';
import { Button, ConfirmModal, Header, Typography } from '../../../../components';
import CommonDropdown from '../../../../components/organisms/commondropdown';
import { fetchDirectoryUsersListRequestAction } from '../../../../features/profile/users/actions';
import {
    selectDirectoryUsersListItems,
    selectDirectoryUsersListLoading,
    selectDirectoryUsersListNext,
    selectDirectoryUsersListPage,
} from '../../../../features/profile/users/selectors';
import type { UsersListItem } from '../../../../features/profile/users/types';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { clearJobUsersSharedSubmitSuccess, patchJobUsersSharedRequestAction } from '../../../../features/jobs';
import {
    selectJobUsersSharedSubmitLoading,
    selectJobUsersSharedSubmitSucceeded,
} from '../../../../features/jobs/selectors';
import { goBack, navigate } from '../../../../utils/navigationUtils';
import { showToastMessage } from '../../../../utils/toast';
import { colors } from '../../../../theme/colors';
import { shadowStyles } from '../../../../theme/shadowcolor';
import { trashIcon } from '../../../../assets/svg/trash';
import { backButtonIcon } from '../../../../assets/svg/backbutton';

const JOB_CREATE_TOTAL_STEPS = 3;
const STEP_INDEX = 3;

const AVATAR_SIZE = 44;
const ALMOST_DONE_ICON = 25;
const ALMOST_DONE_ICON_GAP = 12;

/** Single initial, uppercase — matches profile placeholder design when `profile_pic` is null. */
function profileInitialFromName(name: string): string {
    const t = name.trim();
    if (!t) return '?';
    const ch = Array.from(t)[0];
    return ch.toUpperCase();
}

const mapUserToDropdownOption = (u: UsersListItem) => ({
    id: u.id,
    name: u.name ?? '',
    profile_pic: u.profile_pic ?? null,
    searchLabel: [u.name, u.email].filter(Boolean).join(' ').trim(),
});

type TeamMembersRouteParams = {
    jobId?: string;
};

const TeamMembersScreen = () => {
    const route = useRoute();
    const jobId = (route.params as TeamMembersRouteParams | undefined)?.jobId ?? '';

    const dispatch = useDispatch();
    const [memberIds, setMemberIds] = useState<string[]>([]);
    const [successModalVisible, setSuccessModalVisible] = useState(false);

    const usersList = useAppSelector(selectDirectoryUsersListItems);
    const usersNext = useAppSelector(selectDirectoryUsersListNext);
    const usersPage = useAppSelector(selectDirectoryUsersListPage);
    const usersLoading = useAppSelector(selectDirectoryUsersListLoading);
    const jobUsersSharedSubmitLoading = useAppSelector(selectJobUsersSharedSubmitLoading);
    const jobUsersSharedSubmitSucceeded = useAppSelector(selectJobUsersSharedSubmitSucceeded);

    useEffect(() => {
        dispatch(fetchDirectoryUsersListRequestAction(1));
    }, [dispatch]);

    useEffect(() => {
        if (jobUsersSharedSubmitSucceeded) {
            setSuccessModalVisible(true);
        }
    }, [jobUsersSharedSubmitSucceeded]);

    const dismissSuccessModal = useCallback(() => {
        setSuccessModalVisible(false);
        dispatch(clearJobUsersSharedSubmitSuccess());
    }, [dispatch]);

    const onSuccessViewJobDetails = useCallback(() => {
        dismissSuccessModal();
        navigate('JobDetailScreen', { jobId });
    }, [dismissSuccessModal, jobId]);

    const onSuccessCreateAnotherJob = useCallback(() => {
        dismissSuccessModal();
        navigate('jobdetails');
    }, [dismissSuccessModal]);

    const onSuccessGoToJobsList = useCallback(() => {
        dismissSuccessModal();
        navigate('UserBottomTab', { screen: 'JobsScreen' });
    }, [dismissSuccessModal]);

    const handleComplete = useCallback(() => {
        if (!jobId || String(jobId).trim() === '') {
            showToastMessage('Missing job. Go back and complete the application form step first.', 'error');
            return;
        }
        dispatch(
            patchJobUsersSharedRequestAction({
                jobId: String(jobId).trim(),
                usersSharedWithIds: memberIds,
            })
        );
    }, [dispatch, jobId, memberIds]);

    const options = useMemo(
        () => (usersList ?? []).map(mapUserToDropdownOption),
        [usersList]
    );

    const selectedMembers = useMemo(() => {
        const byId = new Map((usersList ?? []).map((u) => [u.id, u]));
        return memberIds
            .map((id) => byId.get(id))
            .filter((u): u is UsersListItem => u != null);
    }, [memberIds, usersList]);

    const handleLoadMore = () => {
        if (usersNext && !usersLoading && usersPage != null) {
            dispatch(fetchDirectoryUsersListRequestAction(usersPage + 1));
        }
    };

    const removeMember = (id: string) => {
        setMemberIds((prev) => prev.filter((x) => x !== id));
    };

    const count = selectedMembers.length;

    return (
        <CustomSafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Header
                    title="Invite team"
                    backNavigation
                    centerTitle
                    onBack={goBack}
                    rightComponent={
                        <Typography variant="mediumTxtmd" color={colors.gray[500]}>
                            {`${STEP_INDEX}/${JOB_CREATE_TOTAL_STEPS}`}
                        </Typography>
                    }
                />
                <ProgressBar
                    progress={STEP_INDEX / JOB_CREATE_TOTAL_STEPS}
                    color={colors.brand[500]}
                    style={styles.progress}
                />

                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Typography variant="H2" color={colors.gray[900]} style={styles.title}>
                        Add other members
                    </Typography>
                    <Typography variant="regularTxtsm" color={colors.gray[600]} style={styles.subtitle}>
                        You can add team members or invite others to collaborate on this job.
                    </Typography>

                    <View style={styles.fieldBlock}>
                        <Typography variant="semiBoldTxtsm" color={colors.gray[800]} style={styles.labelRow}>
                            Invite team members
                            <Typography color={colors.mainColors.main} variant="semiBoldTxtsm">
                                {' '}
                                *
                            </Typography>
                        </Typography>

                        <View style={styles.dropdownRow}>
                            <Ionicons
                                name="search-outline"
                                size={20}
                                color={colors.gray[500]}
                                style={styles.searchIcon}
                            />
                            <View style={styles.dropdownFlex}>
                                <CommonDropdown
                                    placeholder="Add member"
                                    options={options}
                                    value={memberIds}
                                    onChange={(next) => {
                                        setMemberIds(Array.isArray(next) ? next : []);
                                    }}
                                    labelKey="name"
                                    valueKey="id"
                                    multiSelect
                                    searchable
                                    searchPlaceholder="Add member"
                                    searchField="label"
                                    mode="default"
                                    dropdownPosition="bottom"
                                    containerStyle={styles.dropdownInner}
                                    onLoadMore={handleLoadMore}
                                />
                            </View>
                        </View>
                    </View>

                    <Card style={styles.teamCard}>
                        <View style={styles.teamCardHeader}>
                            <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                                {`Team Members (${count})`}
                            </Typography>
                        </View>
                        {selectedMembers.length === 0 ? (
                            <Typography variant="regularTxtsm" color={colors.gray[500]} style={styles.emptyInCard}>
                                Selected members will appear here.
                            </Typography>
                        ) : (
                            <View style={styles.teamList}>
                                {selectedMembers.map((member, index) => (
                                    <View
                                        key={member.id}
                                        style={[
                                            styles.memberRow,
                                            index === selectedMembers.length - 1 && styles.memberRowLast,
                                        ]}
                                    >
                                        <View style={styles.memberRowMain}>
                                            {member.profile_pic ? (
                                                <View style={styles.avatarRing}>
                                                    <Image
                                                        source={{ uri: member.profile_pic }}
                                                        style={styles.avatarImage}
                                                        resizeMode="cover"
                                                    />
                                                </View>
                                            ) : (
                                                <View style={styles.avatarPlaceholder}>
                                                    <Typography variant="semiBoldTxtlg" color={colors.gray[800]}>
                                                        {profileInitialFromName(member.name ?? '')}
                                                    </Typography>
                                                </View>
                                            )}
                                            <View style={styles.memberTextCol}>
                                                <Typography
                                                    variant="semiBoldTxtsm"
                                                    color={colors.gray[900]}
                                                    numberOfLines={1}
                                                    ellipsizeMode="tail"
                                                >
                                                    {member.name ?? '—'}
                                                </Typography>
                                                <View style={styles.emailRow}>
                                                    <Ionicons
                                                        name="mail-outline"
                                                        size={14}
                                                        color={colors.gray[500]}
                                                        style={styles.emailIcon}
                                                    />
                                                    <Typography
                                                        variant="regularTxtsm"
                                                        color={colors.gray[500]}
                                                        numberOfLines={1}
                                                        ellipsizeMode="tail"
                                                        style={styles.emailText}
                                                    >
                                                        {member.email ?? ''}
                                                    </Typography>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.memberRowTrail}>
                                            {member.role?.name ? (
                                                <View style={styles.rolePill}>
                                                    <Typography
                                                        variant="regularTxtxs"
                                                        color={colors.gray[700]}
                                                        numberOfLines={1}
                                                    >
                                                        {member.role.name}
                                                    </Typography>
                                                </View>
                                            ) : null}
                                            <Pressable
                                                hitSlop={10}
                                                accessibilityRole="button"
                                                accessibilityLabel={`Remove ${member.name}`}
                                                onPress={() => removeMember(member.id)}
                                                style={styles.trashHit}
                                            >
                                                <SvgXml xml={trashIcon} color={colors.gray[500]} />
                                            </Pressable>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </Card>

                    <View style={styles.almostDoneBox} accessibilityRole="summary">
                        <View style={styles.almostDoneHeaderRow}>
                            <View style={styles.almostDoneIconCircle}>
                                <Ionicons name="checkmark" size={16} color={colors.success[700]} />
                            </View>
                            <Typography
                                variant="semiBoldTxtsm"
                                color={colors.success[700]}
                                style={styles.almostDoneTitle}
                            >
                                Almost done!
                            </Typography>
                        </View>
                        <Typography
                            variant="regularTxtsm"
                            color={colors.success[700]}
                            style={styles.almostDoneBody}
                        >
                            Review your team selection and click &quot;Complete&quot; to finish creating your job
                            posting. You can always add or remove team members later.
                        </Typography>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <View style={styles.footerHalf}>
                        <Button
                            size={48}
                            variant="outline"
                            borderColor={colors.gray[200]}
                            buttonColor={colors.base.white}
                            textColor={colors.gray[900]}
                            borderWidth={1}
                            borderRadius={10}
                            onPress={goBack}
                        >
                            Back
                        </Button>
                    </View>
                    <View style={styles.footerHalf}>
                        <Button
                            size={48}
                            buttonColor={colors.brand[600]}
                            textColor={colors.base.white}
                            borderRadius={10}
                            onPress={handleComplete}
                            isLoading={jobUsersSharedSubmitLoading}
                            disabled={jobUsersSharedSubmitLoading}
                        >
                            Complete
                        </Button>
                    </View>
                </View>
                <ConfirmModal
                    visible={successModalVisible}
                    title="Job Updated Successfully!"
                    message={
                        <View style={styles.successModalMessage}>
                            <Typography variant="regularTxtsm" color={colors.gray[600]} style={styles.successModalMessageText}>
                                Your job posting is now ready. You can view it, share the application link, or create
                                another job.
                            </Typography>
                            <Pressable
                                onPress={onSuccessGoToJobsList}
                                style={styles.successModalLinkHit}
                                accessibilityRole="button"
                                accessibilityLabel="Go to jobs list"
                            >
                                <Typography variant="mediumTxtsm" color={colors.gray[500]}>
                                    Go to Jobs List
                                </Typography>
                            </Pressable>
                        </View>
                    }
                    confirmText="View Job Details"
                    cancelText="Create Another Job"
                    onConfirm={onSuccessViewJobDetails}
                    onCancel={onSuccessCreateAnotherJob}
                    onClose={dismissSuccessModal}
                    dismissOnBackdropPress
                    cancelFirst
                    headerIcon={
                        <View style={styles.successModalHeaderIcon}>
                            <Ionicons name="checkmark" size={22} color={colors.base.white} />
                        </View>
                    }
                    confirmButtonProps={{
                        buttonColor: colors.brand[600],
                        textColor: colors.base.white,
                        borderRadius: 10,
                        startIcon: <Ionicons name="briefcase-outline" size={20} color={colors.base.white} />,
                    }}
                    cancelButtonProps={{
                        variant: 'outline',
                        borderColor: colors.gray[300],
                        buttonColor: colors.base.white,
                        textColor: colors.gray[900],
                        borderWidth: 1,
                        borderRadius: 10,
                    }}
                />
            </KeyboardAvoidingView>
        </CustomSafeAreaView>
    );
};

export default TeamMembersScreen;

const styles = StyleSheet.create({
    safe: { flex: 1 },
    flex: { flex: 1 },
    progress: {
        height: 4,
        backgroundColor: colors.gray[100],
    },
    scroll: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 24,
        gap: 20,
    },
    title: {
        marginBottom: 4,
    },
    subtitle: {
        lineHeight: 22,
    },
    fieldBlock: {
        gap: 8,
    },
    labelRow: {},
    dropdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 52,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.gray[300],
        backgroundColor: colors.common.white,
        paddingRight: 4,
        ...shadowStyles.shadow_xs,
    },
    searchIcon: {
        marginLeft: 12,
        marginRight: 4,
    },
    dropdownFlex: {
        flex: 1,
        minWidth: 0,
    },
    dropdownInner: {
        borderWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        backgroundColor: 'transparent',
        borderRadius: 0,
    },
    teamCard: {
        padding: 16,
        backgroundColor: colors.base.white,
        gap: 0,
    },
    teamCardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 6,
    },
    teamCardHint: {
        flex: 1,
        textAlign: 'right',
        maxWidth: '48%',
    },
    emptyInCard: {
        paddingVertical: 16,
    },
    teamList: {
        marginTop: 4,
    },
    /**
     * In-card rows (first screenshot): divider between rows.
     * Typography + meta line pattern matches application form criteria rows (second screenshot).
     */
    memberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[200],
    },
    memberRowLast: {
        borderBottomWidth: 0,
    },
    memberRowMain: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        minWidth: 0,
        marginRight: 8,
    },
    /** Shared ring for photo + letter placeholder (light fill, subtle border, circle). */
    avatarRing: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        borderWidth: 1,
        borderColor: colors.gray[200],
        backgroundColor: colors.gray[50],
        overflow: 'hidden',
    },
    avatarImage: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        backgroundColor: colors.gray[100],
    },
    avatarPlaceholder: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        borderWidth: 1,
        borderColor: colors.gray[200],
        backgroundColor: colors.gray[50],
        alignItems: 'center',
        justifyContent: 'center',
    },
    memberTextCol: {
        flex: 1,
        marginLeft: 12,
        gap: 4,
        minWidth: 0,
    },
    emailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 0,
    },
    emailIcon: {
        marginRight: 4,
    },
    emailText: {
        flex: 1,
        minWidth: 0,
    },
    memberRowTrail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
    },
    rolePill: {
        maxWidth: 120,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: colors.gray[100],
    },
    trashHit: {
        padding: 4,
    },
    /** Success callout — same structure as risk/alert cards: tinted fill, matching border + type. */
    almostDoneBox: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.success[600],
        backgroundColor: colors.success[50],
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    almostDoneHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    almostDoneIconCircle: {
        width: ALMOST_DONE_ICON,
        height: ALMOST_DONE_ICON,
        borderRadius: ALMOST_DONE_ICON / 2,
        borderWidth: 1,
        borderColor: colors.success[600],
        backgroundColor: colors.base.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    almostDoneTitle: {
        flex: 1,
        lineHeight: 24,
    },
    almostDoneBody: {
        marginLeft: ALMOST_DONE_ICON + ALMOST_DONE_ICON_GAP,
        lineHeight: 22,
    },
    footer: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingBottom: 24,
    },
    footerHalf: { flex: 1 },
    successModalHeaderIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.success[600],
        alignItems: 'center',
        justifyContent: 'center',
    },
    successModalMessage: {
        gap: 12,
        alignSelf: 'stretch',
    },
    successModalMessageText: {
        textAlign: 'center',
        lineHeight: 22,
    },
    successModalLinkHit: {
        paddingVertical: 4,
        alignSelf: 'center',
    },
});
