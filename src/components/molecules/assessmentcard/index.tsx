import { Image, View, Pressable, Text } from 'react-native';
import Typography from '../../atoms/typography';
import Card from '../../atoms/card';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStyles } from './styels';
import { colors } from '../../../theme/colors';
import { Fonts } from '../../../theme/fonts';
import Divider from '../../atoms/divider';
import { getStatusColor } from '../../organisms/applicantlist/helper';
import { horizontalThreedotIcon } from '../../../assets/svg/horizontalthreedoticon';
import { SvgXml } from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navigate } from '../../../utils/navigationUtils';
import type {
  Assessment,
} from '../../../features/assessments/types';
import { capitalizeFirstLetter } from '../../../utils/stringUtils';
import { DropdownMenu } from '../dropdownmenu';
import { editIcon } from '../../../assets/svg/edit';
import { copyIcon } from '../../../assets/svg/copy';
import { shareIcon } from '../../../assets/svg/share';
import { archiveIcon } from '../../../assets/svg/archive';
import { deleteIcon } from '../../../assets/svg/deleteicon';
import { showToastMessage } from '../../../utils/toast';
import ConfirmModal from '../../organisms/confirmmodal';
import ShareTestModal from '../../organisms/shareTestModal';
import {
  deleteAssessmentTestRequest,
  duplicateAssessmentTestRequest,
  archiveAssessmentTestRequest,
} from '../../../features/assessments/slice';
import {
  selectDeleteAssessmentTestLoading,
  selectDeleteAssessmentTestError,
  selectDeleteAssessmentTestTargetId,
  selectDuplicateAssessmentTestLoading,
  selectDuplicateAssessmentTestError,
  selectDuplicateAssessmentTestTargetId,
  selectArchiveAssessmentTestLoading,
  selectArchiveAssessmentTestError,
  selectArchiveAssessmentTestTargetId,
} from '../../../features/assessments/selectors';

const formatDuration = (seconds: number): string => {
  const n = Number(seconds);
  if (Number.isNaN(n) || n < 0) return '—';

  if (n < 60) return `${n}s`;

  const minutes = Math.floor(n / 60);
  const remainingSeconds = n % 60;

  return remainingSeconds
    ? `${minutes}m ${remainingSeconds}s`
    : `${minutes}m`;
};

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

interface AssessmentCardProps {
  item: Assessment;
}

const ASSESSMENT_MENU_WIDTH = 176;
const MENU_ICON_SLATE = colors.gray[700];

const AssessmentCard = ({ item }: AssessmentCardProps) => {
  const dispatch = useDispatch();
  const styles = useStyles();
  const deleteTestLoading = useSelector(selectDeleteAssessmentTestLoading);
  const deleteTestError = useSelector(selectDeleteAssessmentTestError);
  const deleteTestTargetId = useSelector(selectDeleteAssessmentTestTargetId);
  const duplicateTestLoading = useSelector(selectDuplicateAssessmentTestLoading);
  const duplicateTestError = useSelector(selectDuplicateAssessmentTestError);
  const duplicateTestTargetId = useSelector(selectDuplicateAssessmentTestTargetId);
  const archiveTestLoading = useSelector(selectArchiveAssessmentTestLoading);
  const archiveTestError = useSelector(selectArchiveAssessmentTestError);
  const archiveTestTargetId = useSelector(selectArchiveAssessmentTestTargetId);
  const [menuVisible, setMenuVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  });
  const menuTriggerRef = useRef<View | null>(null);
  const deleteInitiatedForIdRef = useRef<string | null>(null);
  const duplicateInitiatedForIdRef = useRef<string | null>(null);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [duplicateConfirmPending, setDuplicateConfirmPending] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [archiveConfirmPending, setArchiveConfirmPending] = useState(false);
  const archiveInitiatedForIdRef = useRef<string | null>(null);
  const [deleteConfirmPending, setDeleteConfirmPending] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [creatorAvatarImageFailed, setCreatorAvatarImageFailed] = useState(false);
  const status = item.is_published ? 'Published' : 'Draft';
  const type = item.test_type;
  const createdByName = item?.description?.trim() || 'No Description added';
  const durationMinutes =item?.time_duration
  const questionCount =
    typeof item.total_question === 'number' && !Number.isNaN(item.total_question)
      ? item.total_question
      : 0;

   const getInitials = (name?: string) => {
        if (!name) return 'U';
      
        return name
          .trim()
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map(word => word.charAt(0).toUpperCase())
          .join('');
      };

  /** Creator only — do not surface `users_shared_with` on the card (Share is in the menu). */
  const avatarUsers = item.created_by
    ? [
        {
          id: item.created_by.id,
          name: item.created_by.name,
          profile_pic: item.created_by.profile_pic,
        },
      ]
    : [];

  useEffect(() => {
    setCreatorAvatarImageFailed(false);
  }, [item.id, item.created_by?.profile_pic]);

  const navigateToAssessment = () => {
    navigate(
      item?.test_type === 'coding' ? 'CodingTestQuestion' : 'CreateTestQuestion',
      { assessmentId: item?.id },
    );
  };

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

  const closeDuplicateModal = useCallback(() => {
    duplicateInitiatedForIdRef.current = null;
    setDuplicateConfirmPending(false);
    setDuplicateModalOpen(false);
  }, []);

  const confirmDuplicate = useCallback(() => {
    const id = item?.id?.trim();
    if (!id) {
      showToastMessage('Missing test id.', 'info');
      return;
    }
    duplicateInitiatedForIdRef.current = id;
    setDuplicateConfirmPending(true);
    dispatch(duplicateAssessmentTestRequest({ testId: id }));
  }, [dispatch, item?.id]);

  const isThisCardDuplicateInFlight =
    Boolean(
      duplicateTestTargetId &&
        duplicateTestTargetId === item.id &&
        duplicateTestLoading,
    );

  useEffect(() => {
    if (!duplicateConfirmPending) return;
    if (duplicateTestLoading) return;
    if (duplicateInitiatedForIdRef.current !== item.id) return;

    duplicateInitiatedForIdRef.current = null;
    setDuplicateConfirmPending(false);
    if (!duplicateTestError) {
      setDuplicateModalOpen(false);
    }
  }, [
    duplicateConfirmPending,
    duplicateTestLoading,
    duplicateTestError,
    item.id,
  ]);

  const deleteTestTitle = useMemo(
    () => String(item.title ?? 'Untitled').trim() || 'Untitled',
    [item.title],
  );

  const closeDeleteModal = useCallback(() => {
    deleteInitiatedForIdRef.current = null;
    setDeleteConfirmPending(false);
    setDeleteModalOpen(false);
  }, []);

  const confirmDelete = useCallback(() => {
    const id = item?.id?.trim();
    if (!id) {
      showToastMessage('Missing test id.', 'info');
      return;
    }
    deleteInitiatedForIdRef.current = id;
    setDeleteConfirmPending(true);
    dispatch(deleteAssessmentTestRequest({ testId: id }));
  }, [dispatch, item?.id]);

  const isThisCardDeleteInFlight =
    Boolean(deleteTestTargetId && deleteTestTargetId === item.id && deleteTestLoading);

  useEffect(() => {
    if (!deleteConfirmPending) return;
    if (deleteTestLoading) return;
    if (deleteInitiatedForIdRef.current !== item.id) return;

    deleteInitiatedForIdRef.current = null;
    setDeleteConfirmPending(false);
    if (!deleteTestError) {
      setDeleteModalOpen(false);
    }
  }, [deleteConfirmPending, deleteTestLoading, deleteTestError, item.id]);

  const closeArchiveModal = useCallback(() => {
    archiveInitiatedForIdRef.current = null;
    setArchiveConfirmPending(false);
    setArchiveModalOpen(false);
  }, []);

  const confirmArchive = useCallback(() => {
    const id = item?.id?.trim();
    if (!id) {
      showToastMessage('Missing test id.', 'info');
      return;
    }
    archiveInitiatedForIdRef.current = id;
    setArchiveConfirmPending(true);
    dispatch(archiveAssessmentTestRequest({ testId: id }));
  }, [dispatch, item?.id]);

  const isThisCardArchiveInFlight =
    Boolean(
      archiveTestTargetId &&
        archiveTestTargetId === item.id &&
        archiveTestLoading,
    );

  useEffect(() => {
    if (!archiveConfirmPending) return;
    if (archiveTestLoading) return;
    if (archiveInitiatedForIdRef.current !== item.id) return;

    archiveInitiatedForIdRef.current = null;
    setArchiveConfirmPending(false);
    if (!archiveTestError) {
      setArchiveModalOpen(false);
    }
  }, [
    archiveConfirmPending,
    archiveTestLoading,
    archiveTestError,
    item.id,
  ]);

  const duplicateModalMessage = useMemo(
    () => (
      <Typography variant="mediumTxtmd">
      
        This will create a copy named{' '}
        <Typography variant='boldTxtmd'>
          {`"${duplicateCopyTitle}"`}
          </Typography>
        .
      </Typography>
    ),
    [duplicateCopyTitle],
  );

  const deleteModalMessage = useMemo(
    () => (
      <Typography variant="mediumTxtmd">
        Are you sure you want to delete{' '}
        <Typography variant='boldTxtmd'>
          {`"${deleteTestTitle}"`}
        </Typography>
        ? This cannot be undone.
      </Typography>
    ),
    [deleteTestTitle],
  );

  const archiveModalMessage = useMemo(
    () => (
      <Typography variant="mediumTxtmd">
        Are you sure you want to archive{' '}
        <Typography variant='boldTxtmd'>
          {`'${deleteTestTitle}'`}
          </Typography>
        ? Archived tests are kept for reference and will not affect existing candidate assignments or results.
        </Typography>
    ),
    [deleteTestTitle],
  );

  return (
    <Card style={styles.card} onPress={navigateToAssessment}>
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start'}}>
          <Typography variant="semiBoldTxtmd" color={colors.gray[900]} ellipsizeMode='tail' numberOfLines={2} style={{width:'95%'}}>
            {item.title}
          </Typography>
          <View
            ref={(el) => {
              menuTriggerRef.current = el;
            }}
            collapsable={false}
          >
            <Pressable onPress={handleOpenMenu} hitSlop={8}>
              <SvgXml xml={horizontalThreedotIcon} height={20} width={20}/>
            </Pressable>
          </View>
        </View>
        <Typography variant="regularTxtsm" color={colors.gray[500]} ellipsizeMode='tail' numberOfLines={1}>
         {createdByName}
        </Typography>
      </View>

      <View style={styles.metaRow}>
        <Typography variant="regularTxtsm" color={colors.gray[600]}>
          Question :{' '}
        </Typography>
        <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
          {questionCount}
        </Typography>
        <View style={{ marginRight: 10 }} />
        <Typography variant="regularTxtsm" color={colors.gray[600]}>
          Duration :{' '}
        </Typography>
        <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
          {formatDuration(durationMinutes)}
        </Typography>
      </View>

      <Divider />
      <View>
        <View style={styles.rowBetween}>
          <View style={styles.avatarGroup}>
            {avatarUsers.slice(0, 3).map((user, index) => {
              const showImage =
                isDisplayableProfilePic(user.profile_pic) && !creatorAvatarImageFailed;
              if (showImage) {
                return (
                  <Image
                    key={user.id ?? index}
                    source={{ uri: (user.profile_pic as string).trim() }}
                    onError={() => setCreatorAvatarImageFailed(true)}
                    style={[styles.avatar, { marginLeft: index === 0 ? 0 : -12 }]}
                  />
                );
              }
              return (
                <View
                  key={user.id ?? index}
                  style={[styles.avatar, styles.initialAvatar, { marginLeft: index === 0 ? 0 : -12 }]}
                >
                  <Typography variant="semiBoldTxtxs">
                    {getInitials(user.name)}
                  </Typography>
                </View>
              );
            })}
          </View>
          <View style={{flexDirection:'row',alignItems:'center', gap:15}}>
          <View style={styles.statusBadge}>
            <Typography variant="mediumTxtxs">{capitalizeFirstLetter(type)}</Typography>
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
        iconStyle={{ marginRight: 10 }}
        items={[
          {
            label: 'Edit',
            icon: editIcon,
            onPress: () => {
              navigateToAssessment();
            },
          },
          {
            label: 'Duplicate',
            icon: copyIcon,
            onPress: () => {
              setMenuVisible(false);
              setDuplicateModalOpen(true);
            },
          },
          {
            label: 'Share',
            icon: shareIcon,
            onPress: () => {
              setMenuVisible(false);
              setShareModalOpen(true);
            },
          },
          {
            label: 'Archive',
            icon: archiveIcon,
            onPress: () => {
              setMenuVisible(false);
              setArchiveModalOpen(true);
            },
          },
          {
            label: 'Delete',
            icon: deleteIcon,
            iconColor: colors.error[600],
            labelColor: colors.error[600],
            onPress: () => {
              setMenuVisible(false);
              setDeleteModalOpen(true);
            },
          },
        ]}
      />

      <ConfirmModal
        visible={duplicateModalOpen}
        title="Duplicate Test"
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
        title="Delete Test"
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
        title="Archive Test"
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

      <ShareTestModal
        visible={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        testId={item.id}
        testTitle={item.title}
        initialSharedMemberIds={item.users_shared_with?.map((u) => u.id) ?? []}
        initialSharedMembers={item.users_shared_with ?? []}
      />
    </Card>
  );
};

export default AssessmentCard;

