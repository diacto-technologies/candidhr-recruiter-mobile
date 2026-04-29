import { Image, View, Pressable } from 'react-native';
import Typography from '../../atoms/typography';
import Card from '../../atoms/card';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStyles } from './styels';
import { colors } from '../../../theme/colors';
import Divider from '../../atoms/divider';
import { getStatusColor } from '../../organisms/applicantlist/helper';
import { horizontalThreedotIcon } from '../../../assets/svg/horizontalthreedoticon';
import { SvgXml } from 'react-native-svg';
import { navigate } from '../../../utils/navigationUtils';
import type { Assessment } from '../../../features/assessments/types';
import {
    duplicateBlueprintRequest,
    deleteBlueprintRequest,
    archiveBlueprintRequest,
} from '../../../features/assessments/slice';
import {
    selectDuplicateBlueprintLoading,
    selectDuplicateBlueprintError,
    selectDuplicateBlueprintTargetId,
    selectDeleteBlueprintLoading,
    selectDeleteBlueprintError,
    selectDeleteBlueprintTargetId,
    selectArchiveBlueprintLoading,
    selectArchiveBlueprintError,
    selectArchiveBlueprintTargetId,
} from '../../../features/assessments/selectors';
import { DropdownMenu } from '../dropdownmenu';
import { editIcon } from '../../../assets/svg/edit';
import { copyIcon } from '../../../assets/svg/copy';
import { shareIcon } from '../../../assets/svg/share';
import { archiveIcon } from '../../../assets/svg/archive';
import { deleteIcon } from '../../../assets/svg/deleteicon';
import { showToastMessage } from '../../../utils/toast';
import ConfirmModal from '../../organisms/confirmmodal';
import ShareTestModal from '../../organisms/shareTestModal';
import Ionicons from 'react-native-vector-icons/Ionicons';

const formatDuration = (minutes: number): string => {
    const n = Number(minutes);
    if (Number.isNaN(n) || n < 0) return '—';
    return `${n.toFixed(2)} min`;
};

/** Non-empty, loadable image URLs only — otherwise we show name initials. */
const isDisplayableProfilePic = (pic: string | null | undefined): boolean => {
    if (typeof pic !== 'string') return false;
    const t = pic.trim();
    if (!t) return false;
    return (
        t.startsWith('http://') ||
        t.startsWith('https://') ||
        t.startsWith('file://') ||
        t.startsWith('data:')
    );
};

type ListCardAvatarUser = { id: string; name: string; profile_pic: string | null };

const getInitialsFromName = (name?: string) => {
    if (!name) return 'U';
    return name
        .trim()
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word.charAt(0).toUpperCase())
        .join('');
};

const ListCardAvatar = ({
    user,
    index,
    styles,
    getInitials,
}: {
    user: ListCardAvatarUser;
    index: number;
    styles: {
        avatar: object;
        initialAvatar: object;
        avatarMarginFirst: object;
        avatarMarginOverlap: object;
    };
    getInitials: (name?: string) => string;
}) => {
    const [imageFailed, setImageFailed] = useState(false);
    const showImage =
        isDisplayableProfilePic(user.profile_pic) && !imageFailed;
    const margin = index === 0 ? styles.avatarMarginFirst : styles.avatarMarginOverlap;
    if (showImage) {
        return (
            <Image
                source={{ uri: (user.profile_pic as string).trim() }}
                onError={() => setImageFailed(true)}
                style={[styles.avatar, margin]}
            />
        );
    }
    return (
        <View style={[styles.avatar, styles.initialAvatar, margin]}>
            <Typography variant="semiBoldTxtxs">{getInitials(user.name)}</Typography>
        </View>
    );
};

const ASSESSMENT_MENU_WIDTH = 176;
const MENU_ICON_SLATE = colors.gray[700];

interface AssessmentListCardProps {
    item: Assessment;
}

const AssessmentListCard = ({ item }: AssessmentListCardProps) => {
    const dispatch = useDispatch();
    const duplicateBlueprintLoading = useSelector(selectDuplicateBlueprintLoading);
    const duplicateBlueprintError = useSelector(selectDuplicateBlueprintError);
    const duplicateBlueprintTargetId = useSelector(selectDuplicateBlueprintTargetId);
    const deleteBlueprintLoading = useSelector(selectDeleteBlueprintLoading);
    const deleteBlueprintError = useSelector(selectDeleteBlueprintError);
    const deleteBlueprintTargetId = useSelector(selectDeleteBlueprintTargetId);
    const archiveBlueprintLoading = useSelector(selectArchiveBlueprintLoading);
    const archiveBlueprintError = useSelector(selectArchiveBlueprintError);
    const archiveBlueprintTargetId = useSelector(selectArchiveBlueprintTargetId);
    const styles = useStyles();
    const [menuVisible, setMenuVisible] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<{ left: number; top: number }>({
        left: 0,
        top: 0,
    });
    const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [archiveModalOpen, setArchiveModalOpen] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [duplicateConfirmPending, setDuplicateConfirmPending] = useState(false);
    const [deleteConfirmPending, setDeleteConfirmPending] = useState(false);
    const [archiveConfirmPending, setArchiveConfirmPending] = useState(false);
    const duplicateInitiatedForIdRef = useRef<string | null>(null);
    const deleteInitiatedForIdRef = useRef<string | null>(null);
    const archiveInitiatedForIdRef = useRef<string | null>(null);
    const menuTriggerRef = useRef<View | null>(null);

    const status = item.is_published ? 'Published' : 'Draft';
    /** Creator only — do not show `users_shared_with` on the card; Share is in the menu. */
    const avatarUserList = useMemo((): ListCardAvatarUser[] => {
        if (!item.created_by?.id) return [];
        return [
            {
                id: item.created_by.id,
                name: item.created_by.name,
                profile_pic: item.created_by.profile_pic,
            },
        ];
    }, [item.created_by]);
    const durationMinutes =
        typeof item.time_duration_in_minutes === 'number' &&
        !Number.isNaN(item.time_duration_in_minutes)
            ? item.time_duration_in_minutes
            : 0;
    const questionCount =
        typeof item.total_question === 'number' && !Number.isNaN(item.total_question)
            ? item.total_question
            : 0;

    const navigateToOverview = useCallback(() => {
        navigate('AssessmentOverView', { blueprintId: item.id });
    }, [item.id]);

    const navigateToEdit = useCallback(() => {
        navigate('BasicInfo', {
            blueprintId: item.id,
            step: 1,
            TOTAL_STEPS: 4,
        });
    }, [item.id]);

    const handleOpenMenu = () => {
        if (menuTriggerRef.current && 'measureInWindow' in menuTriggerRef.current) {
            (menuTriggerRef.current as View).measureInWindow((x, y, width, height) => {
                setDropdownPosition({
                    left: x + width - ASSESSMENT_MENU_WIDTH,
                    top: y + height + 6,
                });
                setMenuVisible(true);
            });
        } else {
            setMenuVisible(true);
        }
    };

    const duplicateCopyTitle = useMemo(() => {
        const base = String(item.title ?? 'Untitled').trim() || 'Untitled';
        return `${base} (Copy)`;
    }, [item.title]);

    const actionTitle = useMemo(
        () => String(item.title ?? 'Untitled').trim() || 'Untitled',
        [item.title],
    );

    const duplicateModalMessage = useMemo(
        () => (
            <Typography variant="mediumTxtmd">
                This will create a copy named{' '}
                <Typography variant="boldTxtmd">{`"${duplicateCopyTitle}"`}</Typography>.
            </Typography>
        ),
        [duplicateCopyTitle],
    );

    const deleteModalMessage = useMemo(
        () => (
            <Typography variant="mediumTxtmd">
                Are you sure you want to delete <Typography variant="boldTxtmd">{`"${actionTitle}"`}</Typography>?
                This cannot be undone.
            </Typography>
        ),
        [actionTitle],
    );

    const archiveModalMessage = useMemo(
        () => (
            <Typography variant="mediumTxtmd">
                Are you sure you want to archive <Typography variant="boldTxtmd">{`"${actionTitle}"`}</Typography>?
                Archived templates are kept for reference.
            </Typography>
        ),
        [actionTitle],
    );

    const closeDuplicateModal = useCallback(() => {
        duplicateInitiatedForIdRef.current = null;
        setDuplicateConfirmPending(false);
        setDuplicateModalOpen(false);
    }, []);

    const confirmDuplicate = useCallback(() => {
        const id = item?.id?.trim();
        if (!id) {
            showToastMessage('Missing assessment id.', 'info');
            return;
        }
        duplicateInitiatedForIdRef.current = id;
        setDuplicateConfirmPending(true);
        dispatch(duplicateBlueprintRequest({ blueprintId: id }));
    }, [dispatch, item?.id]);

    const isThisCardDuplicateInFlight =
        Boolean(
            duplicateBlueprintTargetId &&
                duplicateBlueprintTargetId === item.id &&
                duplicateBlueprintLoading,
        );

    useEffect(() => {
        if (!duplicateConfirmPending) return;
        if (duplicateBlueprintLoading) return;
        if (duplicateInitiatedForIdRef.current !== item.id) return;

        duplicateInitiatedForIdRef.current = null;
        setDuplicateConfirmPending(false);
        if (!duplicateBlueprintError) {
            setDuplicateModalOpen(false);
        }
    }, [
        duplicateConfirmPending,
        duplicateBlueprintLoading,
        duplicateBlueprintError,
        item.id,
    ]);

    const closeDeleteModal = useCallback(() => {
        deleteInitiatedForIdRef.current = null;
        setDeleteConfirmPending(false);
        setDeleteModalOpen(false);
    }, []);

    const confirmDelete = useCallback(() => {
        const id = item?.id?.trim();
        if (!id) {
            showToastMessage('Missing assessment id.', 'info');
            return;
        }
        deleteInitiatedForIdRef.current = id;
        setDeleteConfirmPending(true);
        dispatch(deleteBlueprintRequest({ blueprintId: id }));
    }, [dispatch, item?.id]);

    const isThisCardDeleteInFlight =
        Boolean(
            deleteBlueprintTargetId &&
                deleteBlueprintTargetId === item.id &&
                deleteBlueprintLoading,
        );

    useEffect(() => {
        if (!deleteConfirmPending) return;
        if (deleteBlueprintLoading) return;
        if (deleteInitiatedForIdRef.current !== item.id) return;

        deleteInitiatedForIdRef.current = null;
        setDeleteConfirmPending(false);
        if (!deleteBlueprintError) {
            setDeleteModalOpen(false);
        }
    }, [
        deleteConfirmPending,
        deleteBlueprintLoading,
        deleteBlueprintError,
        item.id,
    ]);

    const closeArchiveModal = useCallback(() => {
        archiveInitiatedForIdRef.current = null;
        setArchiveConfirmPending(false);
        setArchiveModalOpen(false);
    }, []);

    const confirmArchive = useCallback(() => {
        const id = item?.id?.trim();
        if (!id) {
            showToastMessage('Missing assessment id.', 'info');
            return;
        }
        archiveInitiatedForIdRef.current = id;
        setArchiveConfirmPending(true);
        dispatch(archiveBlueprintRequest({ blueprintId: id }));
    }, [dispatch, item?.id]);

    const isThisCardArchiveInFlight =
        Boolean(
            archiveBlueprintTargetId &&
                archiveBlueprintTargetId === item.id &&
                archiveBlueprintLoading,
        );

    useEffect(() => {
        if (!archiveConfirmPending) return;
        if (archiveBlueprintLoading) return;
        if (archiveInitiatedForIdRef.current !== item.id) return;

        archiveInitiatedForIdRef.current = null;
        setArchiveConfirmPending(false);
        if (!archiveBlueprintError) {
            setArchiveModalOpen(false);
        }
    }, [
        archiveConfirmPending,
        archiveBlueprintLoading,
        archiveBlueprintError,
        item.id,
    ]);

    return (
        <Card style={styles.card} onPress={navigateToOverview}>
            <View>
                <View style={styles.listCardTitleRow}>
                    <Typography
                        variant="semiBoldTxtmd"
                        color={colors.gray[900]}
                        ellipsizeMode="tail"
                        numberOfLines={2}
                        style={styles.listCardTitleText}
                    >
                        {item.title}
                    </Typography>
                    <View
                        ref={el => {
                            menuTriggerRef.current = el;
                        }}
                        collapsable={false}
                    >
                        <Pressable onPress={handleOpenMenu} hitSlop={8}>
                            <SvgXml xml={horizontalThreedotIcon} height={20} width={20} />
                        </Pressable>
                    </View>
                </View>
            </View>

            <View style={styles.metaRow}>
                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                    Sections :{' '}
                </Typography>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                    {item?.total_sections}
                </Typography>
                <View style={styles.metaSpacer} />
                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                    Total Questions :{' '}
                </Typography>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                    {questionCount}
                </Typography>
            </View>

            <View style={styles.metaRow}>
                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                    Duration:{' '}
                </Typography>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                    {formatDuration(durationMinutes)}
                </Typography>
                <View style={styles.metaSpacer} />
                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                    Passing Score :{' '}
                </Typography>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                    {item?.default_passing_score}%
                </Typography>
            </View>

            <Divider />
            <View>
                <View style={styles.rowBetween}>
                    <View style={styles.avatarGroup}>
                        {avatarUserList.map((user, index) => (
                            <ListCardAvatar
                                key={user.id}
                                user={user}
                                index={index}
                                styles={styles}
                                getInitials={getInitialsFromName}
                            />
                        ))}
                    </View>
                    <View style={styles.listCardStatusRow}>
                        <View style={styles.statusBadge}>
                            <Typography variant="mediumTxtxs">Proctored</Typography>
                        </View>
                        <View style={styles.statusBadge}>
                            <View
                                style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]}
                            />
                            <Typography variant="mediumTxtxs">{status}</Typography>
                        </View>
                    </View>
                </View>
            </View>

            <DropdownMenu
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
                position={dropdownPosition}
                width={ASSESSMENT_MENU_WIDTH}
                iconWidth={18}
                iconHight={18}
                iconColor={MENU_ICON_SLATE}
                iconStyle={styles.dropdownMenuItemIcon}
                items={[
                    {
                        label: 'Edit',
                        icon: editIcon,
                        onPress: () => {
                            navigateToEdit();
                        },
                    },
                    {
                        label: 'Duplicate',
                        icon: copyIcon,
                        onPress: () => {
                            setDuplicateModalOpen(true);
                        },
                    },
                    {
                        label: 'Share',
                        icon: shareIcon,
                        onPress: () => {
                            setShareModalOpen(true);
                        },
                    },
                    {
                        label: 'Archive',
                        icon: archiveIcon,
                        onPress: () => {
                            setArchiveModalOpen(true);
                        },
                    },
                    {
                        label: 'Delete',
                        icon: deleteIcon,
                        iconColor: colors.error[600],
                        labelColor: colors.error[600],
                        onPress: () => {
                            setDeleteModalOpen(true);
                        },
                    },
                ]}
            />

            <ShareTestModal
                visible={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                blueprintId={item.id}
                testTitle={item.title ?? ''}
                modalHeadline="Share Test"
                initialSharedMemberIds={item.users_shared_with?.map((u) => u.id) ?? []}
                initialSharedMembers={item.users_shared_with ?? []}
            />

            <ConfirmModal
                visible={duplicateModalOpen}
                title="Duplicate assessment"
                message={duplicateModalMessage}
                headerIcon={
                    <View style={styles.duplicateModalIconWrap}>
                        <Ionicons name="copy-outline" size={22} color={colors.brand[700]} />
                    </View>
                }
                cancelFirst
                confirmText="Duplicate"
                cancelText="Cancel"
                dismissOnBackdropPress={!isThisCardDuplicateInFlight}
                onConfirm={confirmDuplicate}
                onCancel={closeDuplicateModal}
                onClose={closeDuplicateModal}
                confirmButtonProps={{
                    buttonColor: colors.brand[600],
                    textColor: colors.base.white,
                    startIcon: null,
                    isLoading: isThisCardDuplicateInFlight,
                    disabled: isThisCardDuplicateInFlight,
                }}
                cancelButtonProps={{
                    disabled: isThisCardDuplicateInFlight,
                }}
            />

            <ConfirmModal
                visible={deleteModalOpen}
                title="Delete assessment"
                message={deleteModalMessage}
                headerIcon={
                    <View style={styles.deleteModalIconWrap}>
                        <Ionicons name="trash-outline" size={22} color={colors.error[600]} />
                    </View>
                }
                cancelFirst
                confirmText="Delete"
                cancelText="Cancel"
                dismissOnBackdropPress={!isThisCardDeleteInFlight}
                onConfirm={confirmDelete}
                onCancel={closeDeleteModal}
                onClose={closeDeleteModal}
                confirmButtonProps={{
                    isLoading: isThisCardDeleteInFlight,
                    disabled: isThisCardDeleteInFlight,
                }}
                cancelButtonProps={{
                    disabled: isThisCardDeleteInFlight,
                }}
            />

            <ConfirmModal
                visible={archiveModalOpen}
                title="Archive assessment"
                message={archiveModalMessage}
                headerIcon={
                    <View style={styles.archiveModalIconWrap}>
                        <Ionicons name="archive-outline" size={22} color={colors.brand[700]} />
                    </View>
                }
                cancelFirst
                confirmText="Archive"
                cancelText="Cancel"
                dismissOnBackdropPress={!isThisCardArchiveInFlight}
                onConfirm={confirmArchive}
                onCancel={closeArchiveModal}
                onClose={closeArchiveModal}
                confirmButtonProps={{
                    buttonColor: colors.brand[600],
                    textColor: colors.base.white,
                    startIcon: null,
                    isLoading: isThisCardArchiveInFlight,
                    disabled: isThisCardArchiveInFlight,
                }}
                cancelButtonProps={{
                    disabled: isThisCardArchiveInFlight,
                }}
            />
        </Card>
    );
};

export default AssessmentListCard;
