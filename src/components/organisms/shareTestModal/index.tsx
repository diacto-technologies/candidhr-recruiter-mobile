import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Modal,
  View,
  Pressable,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Typography from '../../atoms/typography';
import { colors } from '../../../theme/colors';
import FooterButtons from '../../molecules/footerbuttons';
import Card from '../../atoms/card';
import { SvgXml } from 'react-native-svg';
import { closeIcon } from '../../../assets/svg/closeicon';
import CommonDropdown from '../commondropdown';
import { getUsersRequestAction } from '../../../features/profile/users/actions';
import {
  selectUsersListItems,
  selectUsersListNext,
  selectUsersListPage,
  selectUsersListLoading,
} from '../../../features/profile/users/selectors';
import { useAppSelector } from '../../../hooks/useAppSelector';
import type { UsersListItem } from '../../../features/profile/users/types';
import type { AssessmentSharedUser } from '../../../features/assessments/types';
import {
  shareAssessmentTestRequest,
  shareBlueprintRequest,
} from '../../../features/assessments/slice';
import {
  selectShareAssessmentTestLoading,
  selectShareAssessmentTestError,
  selectShareAssessmentTestTargetId,
  selectShareBlueprintLoading,
  selectShareBlueprintError,
  selectShareBlueprintTargetId,
} from '../../../features/assessments/selectors';

export interface TeamMemberOption {
  id: string;
  name: string;
  email: string;
  role: string;
  profile_pic?: string | null;
}

export interface ShareTestModalProps {
  visible: boolean;
  onClose: () => void;
  /** Test library: POST `.../tests/{id}/share/`. Omit when `blueprintId` is set. */
  testId?: string;
  /** Company assessment blueprint: POST `.../blueprints/{id}/share/`. Omit when `testId` is set. */
  blueprintId?: string;
  testTitle: string;
  /** Header label (e.g. "Share Test" vs "Share assessment"). */
  modalHeadline?: string;
  /** User ids already shared (from `users_shared_with`). */
  initialSharedMemberIds?: string[];
  /** Full objects from list/detail so the Shared Members list renders before dropdown options load. */
  initialSharedMembers?: AssessmentSharedUser[];
}

const mapUserToOption = (u: UsersListItem): TeamMemberOption => ({
  id: u.id,
  name: u.name ?? '',
  email: u.email ?? '',
  role: u.role?.name ?? 'Participant',
  profile_pic: u.profile_pic ?? null,
});

/**
 * When the list/detail payload embeds `email` and `role` on `users_shared_with`, we show them
 * (same as `/core/users/options/`). Otherwise those fields are filled after paginated options load.
 */
const mapAssessmentSharedUserToOption = (u: AssessmentSharedUser): TeamMemberOption => ({
  id: u.id,
  name: u.name?.trim() || 'Team member',
  email: (u.email ?? '').trim(),
  role: (u.role?.name ?? '').trim(),
  profile_pic: u.profile_pic ?? null,
});

const ShareTestModal = ({
  visible,
  onClose,
  testId,
  blueprintId,
  testTitle,
  modalHeadline = 'Share Test',
  initialSharedMemberIds = [],
  initialSharedMembers = [],
}: ShareTestModalProps) => {
  const [sharedMemberIds, setSharedMemberIds] = useState<string[]>([]);
  const [hasRequestedUsers, setHasRequestedUsers] = useState(false);
  const shareSubmittedRef = useRef(false);

  const dispatch = useDispatch();
  const usersList = useAppSelector(selectUsersListItems);
  const usersNext = useAppSelector(selectUsersListNext);
  const usersPage = useAppSelector(selectUsersListPage);
  const usersLoading = useAppSelector(selectUsersListLoading);
  const shareTestLoading = useAppSelector(selectShareAssessmentTestLoading);
  const shareTestError = useAppSelector(selectShareAssessmentTestError);
  const shareTestTargetId = useAppSelector(selectShareAssessmentTestTargetId);
  const shareBlueprintLoading = useAppSelector(selectShareBlueprintLoading);
  const shareBlueprintError = useAppSelector(selectShareBlueprintError);
  const shareBlueprintTargetId = useAppSelector(selectShareBlueprintTargetId);

  const isBlueprint = Boolean(blueprintId?.trim());
  const shareLoading = isBlueprint ? shareBlueprintLoading : shareTestLoading;
  const shareError = isBlueprint ? shareBlueprintError : shareTestError;
  const shareTargetId = isBlueprint ? shareBlueprintTargetId : shareTestTargetId;

  /**
   * `/core/users/options/` is paginated. If someone is in `users_shared_with` but not on the
   * currently loaded page(s), merge them in so the dropdown and the Shared Members list can
   * still resolve their row (and once a later page loads, API data wins for role + email).
   */
  const teamMemberOptions = useMemo(() => {
    const fromApi = (usersList ?? []).map(mapUserToOption);
    const byId = new Map<string, TeamMemberOption>(
      fromApi.map((o) => [o.id, o])
    );
    for (const u of initialSharedMembers ?? []) {
      if (!u?.id?.trim()) continue;
      if (!byId.has(u.id)) {
        byId.set(u.id, mapAssessmentSharedUserToOption(u));
      }
    }
    return Array.from(byId.values());
  }, [usersList, initialSharedMembers]);

  /** Prefer `/core/users/options/` rows when loaded; fall back to test `users_shared_with` for names/avatars. */
  const sharedMembersList = useMemo(() => {
    return sharedMemberIds.map((id) => {
      const fromOptions = teamMemberOptions.find((o) => o.id === id);
      if (fromOptions) return fromOptions;
      const fromInitial = initialSharedMembers.find((u) => u.id === id);
      if (fromInitial) return mapAssessmentSharedUserToOption(fromInitial);
      return {
        id,
        name: 'Team member',
        email: '',
        role: '',
        profile_pic: null,
      } satisfies TeamMemberOption;
    });
  }, [sharedMemberIds, teamMemberOptions, initialSharedMembers]);

  const displayTitle = testTitle?.trim() || 'this test';

  useEffect(() => {
    if (!visible) {
      setSharedMemberIds([]);
      setHasRequestedUsers(false);
      shareSubmittedRef.current = false;
      return;
    }
    setSharedMemberIds(
      (initialSharedMemberIds ?? []).map((id) => String(id).trim()).filter(Boolean),
    );
    shareSubmittedRef.current = false;
  }, [visible, initialSharedMemberIds]);

  /** Reuse `/core/users/options/` from profile store; only fetch when list is still empty. */
  useEffect(() => {
    if (!visible) return;
    if ((usersList?.length ?? 0) > 0 || usersLoading) return;
    dispatch(getUsersRequestAction(1));
    setHasRequestedUsers(true);
  }, [visible, usersList?.length, usersLoading, dispatch]);

  /**
   * `users_shared_with` only has id/name/avatar. Email and org role (Admin, etc.) come from the
   * options API, which is paginated — so a shared user can be on page 2+ while Ajeet is on page 1.
   * Page forward until every id in the Shared Members list is in `usersList`, or pagination ends.
   */
  useEffect(() => {
    if (!visible) return;
    const needIds = sharedMemberIds.filter((id) => id?.trim());
    if (needIds.length === 0) return;
    const haveIds = new Set((usersList ?? []).map((u) => u.id));
    const anyMissing = needIds.some((id) => !haveIds.has(id));
    if (!anyMissing) return;
    if (usersLoading) return;
    if (!usersNext) return;
    const nextPage = (usersPage ?? 1) + 1;
    dispatch(getUsersRequestAction(nextPage));
  }, [
    visible,
    sharedMemberIds,
    usersList,
    usersNext,
    usersLoading,
    usersPage,
    dispatch,
  ]);

  const resourceId = (blueprintId?.trim() || testId?.trim() || '').trim();

  useEffect(() => {
    if (!shareSubmittedRef.current) return;
    if (shareLoading) return;
    if (!resourceId || shareTargetId !== resourceId) return;
    shareSubmittedRef.current = false;
    if (!shareError) {
      onClose();
    }
  }, [shareLoading, shareError, shareTargetId, resourceId, onClose]);

  const handleDropdownOpen = () => {
    if (!hasRequestedUsers && (usersList?.length ?? 0) === 0) {
      dispatch(getUsersRequestAction(1));
      setHasRequestedUsers(true);
    }
  };

  const handleLoadMore = () => {
    if (usersNext && !usersLoading && usersPage != null) {
      dispatch(getUsersRequestAction(usersPage + 1));
    }
  };

  const handleClose = () => {
    if (shareLoading && resourceId && shareTargetId === resourceId) return;
    onClose();
  };

  const handleShare = () => {
    const bId = blueprintId?.trim();
    const tId = testId?.trim();
    if (bId) {
      shareSubmittedRef.current = true;
      dispatch(
        shareBlueprintRequest({
          blueprintId: bId,
          users_shared_with: [...sharedMemberIds],
        }),
      );
      return;
    }
    if (tId) {
      shareSubmittedRef.current = true;
      dispatch(
        shareAssessmentTestRequest({
          testId: tId,
          users_shared_with: [...sharedMemberIds],
        }),
      );
    }
  };

  const isThisResourceSharing = Boolean(
    shareLoading && resourceId && shareTargetId === resourceId
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={StyleSheet.absoluteFillObject} onPress={handleClose} />
        <Card style={styles.card}>
          <View style={styles.submodalCard}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.headerIconWrap}>
                  <Ionicons name="people-outline" size={20} color={colors.brand[700]} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
                    {modalHeadline}
                  </Typography>
                </View>
              </View>
              <Pressable
                onPress={handleClose}
                hitSlop={12}
                disabled={isThisResourceSharing}
              >
                <SvgXml xml={closeIcon} fill={colors.gray[400]} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.section}>
                <Typography variant="regularTxtsm" color={colors.gray[700]} style={{ marginBottom: 12 }}>
                  Share{' '}
                  <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
                    {displayTitle}
                  </Typography>{' '}
                  with your Team Members
                </Typography>
                <CommonDropdown
                  placeholder="Select team members..."
                  options={teamMemberOptions}
                  value={sharedMemberIds}
                  onChange={(nextValue) => {
                    const nextIds = Array.isArray(nextValue) ? nextValue : [];
                    setSharedMemberIds(nextIds);
                  }}
                  onOpen={handleDropdownOpen}
                  onLoadMore={handleLoadMore}
                  labelKey="name"
                  valueKey="id"
                  usernameKey="email"
                  showIndexAndTotal={false}
                  mode="default"
                  dropdownPosition="bottom"
                  multiSelect
                />
              </View>

              <View style={styles.section}>
                <Typography variant="semiBoldTxtsm" color={colors.gray[900]} style={{ marginBottom: 4 }}>
                  Shared Members
                </Typography>
                <View style={styles.sharedList}>
                  {sharedMemberIds.length === 0 ? (
                    <View style={styles.emptyShared}>
                      <Ionicons name="person-add-outline" size={40} color={colors.gray[300]} />
                      <Typography variant="semiBoldTxtsm" color={colors.gray[700]} style={{ marginTop: 8 }}>
                        No team members selected yet
                      </Typography>
                      <Typography variant="regularTxtsm" color={colors.gray[500]} style={{ marginTop: 4, textAlign: 'center' }}>
                        Choose from Drop-down to add team members
                      </Typography>
                    </View>
                  ) : (
                    sharedMembersList.map((member) => (
                      <View key={member.id} style={styles.sharedRow}>
                        <View style={styles.avatarWrap}>
                          {member.profile_pic ? (
                            <Image
                              source={{ uri: member.profile_pic }}
                              style={styles.avatar}
                              resizeMode="cover"
                            />
                          ) : (
                            <View style={styles.avatarPlaceholder}>
                              <Ionicons name="person" size={20} color={colors.gray[500]} />
                            </View>
                          )}
                        </View>
                        <View style={styles.sharedInfo}>
                          <Typography variant="semiBoldTxtsm" color={colors.gray[900]} numberOfLines={1}>
                            {member.name}
                          </Typography>
                          {member.email ? (
                            <Typography variant="regularTxtxs" color={colors.gray[500]} numberOfLines={1}>
                              {member.email}
                            </Typography>
                          ) : null}
                        </View>
                        {member.role?.trim() ? (
                          <View style={styles.rolePill}>
                            <Typography variant="mediumTxtxs" color={colors.brand[700]}>
                              {member.role}
                            </Typography>
                          </View>
                        ) : null}
                      </View>
                    ))
                  )}
                </View>
              </View>
            </ScrollView>

            <FooterButtons
              leftButtonProps={{
                children: 'Cancel',
                variant: 'contain',
                buttonColor: colors.base.white,
                textColor: colors.gray[700],
                borderColor: colors.gray[300],
                borderWidth: 1,
                borderRadius: 8,
                disabled: isThisResourceSharing,
                onPress: handleClose,
              }}
              rightButtonProps={{
                children: isThisResourceSharing ? 'Sharing…' : 'Share',
                variant: 'contain',
                buttonColor: colors.brand[600],
                textColor: colors.base.white,
                borderRadius: 8,
                onPress: handleShare,
                disabled: isThisResourceSharing,
                isLoading: isThisResourceSharing,
              }}
            />
          </View>
        </Card>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 13, 18, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    backgroundColor: colors.base.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray[200],
    overflow: 'hidden',
    padding: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  headerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand[50],
  },
  scroll: { maxHeight: 400 },
  scrollContent: { padding: 20, paddingBottom: 12 },
  section: {
    gap: 12,
    marginBottom: 20,
  },
  sharedList: {
    gap: 0,
  },
  emptyShared: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  sharedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  avatarWrap: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    borderWidth: 1,
    borderColor: colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sharedInfo: {
    flex: 1,
    minWidth: 0,
  },
  rolePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.brand[200],
    backgroundColor: colors.brand[50],
    marginLeft: 8,
  },
  submodalCard: {
    borderWidth: 2,
    borderRadius: 16,
    borderColor: colors.gray[200],
    overflow: 'hidden',
  },
});

export default ShareTestModal;
