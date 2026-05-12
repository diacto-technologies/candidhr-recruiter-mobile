import React, { useState, useEffect, useMemo } from 'react';
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
import { updateApplicationShareRequestAction } from '../../../features/applications/actions';
import { patchJobUsersSharedRequestAction } from '../../../features/jobs/actions';
import { Button } from '../../atoms';
import { trashIcon } from '../../../assets/svg/trash';

export interface TeamMemberOption {
  id: string;
  name: string;
  email: string;
  role: string;
  profile_pic?: string | null;
}

export interface ShareApplicationModalProps {
  visible: boolean;
  onClose: () => void;
  /** Optional: pre-filled shared member ids (e.g. from application.users_shared_with or job.users_shared_with) */
  initialSharedMemberIds?: string[];
  /** Application id: /applications/v1/{id}/share/ */
  applicationId?: string;
  /** Job id: PATCH /job/v1/jobs/:id/ with `users_shared_with_ids` */
  jobId?: string;
  /** Called when user closes after potentially changing shared list (optional, for future API) */
  onSharedMembersChange?: (memberIds: string[]) => void;
}

const mapUserToOption = (u: UsersListItem): TeamMemberOption => ({
  id: u.id,
  name: u.name ?? '',
  email: u.email ?? '',
  role: u.role?.name ?? 'Participant',
  profile_pic: u.profile_pic ?? null,
});

const ShareApplicationModal = ({
  visible,
  onClose,
  initialSharedMemberIds = [],
  applicationId,
  jobId,
  onSharedMembersChange,
}: ShareApplicationModalProps) => {
  const [sharedMemberIds, setSharedMemberIds] = useState<string[]>([]);
  const [hasRequestedUsers, setHasRequestedUsers] = useState(false);

  const dispatch = useDispatch();
  const usersList = useAppSelector(selectUsersListItems);
  const usersNext = useAppSelector(selectUsersListNext);
  const usersPage = useAppSelector(selectUsersListPage);
  const usersLoading = useAppSelector(selectUsersListLoading);

  const teamMemberOptions = useMemo(
    () => (usersList ?? []).map(mapUserToOption),
    [usersList]
  );

  const sharedMembers = useMemo(
    () => teamMemberOptions.filter((o) => sharedMemberIds.includes(o.id)),
    [teamMemberOptions, sharedMemberIds]
  );

  useEffect(() => {
    if (visible) {
      setSharedMemberIds([...(initialSharedMemberIds ?? [])]);
    } else {
      setSharedMemberIds([]);
      setHasRequestedUsers(false);
    }
  }, [visible, initialSharedMemberIds]);

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
    onSharedMembersChange?.(sharedMemberIds);
    setSharedMemberIds([]);
    onClose();
  };

  const handleRemoveSharedMember = (id: string) => {
    setSharedMemberIds((prev) => {
      const nextIds = prev.filter((x) => x !== id);

      if (jobId) {
        dispatch(patchJobUsersSharedRequestAction({ jobId, usersSharedWithIds: nextIds }));
      } else if (applicationId && Array.isArray(usersList)) {
        const remainingUsers = usersList.filter((u) => nextIds.includes(u.id));
        dispatch(
          updateApplicationShareRequestAction({
            applicationId,
            users: remainingUsers,
            isRemoval: true,
          })
        );
      }

      return nextIds;
    });
  };

  const isJobShare = Boolean(jobId);

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
                <View>
                  <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
                    {isJobShare ? 'Share Job' : 'Share Application'}
                  </Typography>
                </View>
              </View>
              <Pressable onPress={handleClose} hitSlop={12}>
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
                <Typography variant="semiBoldTxtsm">
                  {isJobShare
                    ? 'Share job with team members'
                    : 'Share application with Team Members'}
                </Typography>
                <CommonDropdown
                  placeholder="Search or select team members"
                  options={teamMemberOptions}
                  value={sharedMemberIds}
                  onChange={(nextValue) => {
                    const nextIds = Array.isArray(nextValue) ? nextValue : [];
                    setSharedMemberIds(nextIds);

                    if (jobId) {
                      dispatch(
                        patchJobUsersSharedRequestAction({
                          jobId,
                          usersSharedWithIds: nextIds,
                        })
                      );
                    } else if (applicationId && Array.isArray(usersList)) {
                      const selectedUsers = usersList.filter((u) =>
                        nextIds.includes(u.id)
                      );
                      dispatch(
                        updateApplicationShareRequestAction({
                          applicationId,
                          users: selectedUsers,
                        })
                      );
                    }
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
                // searchable
                // searchPlaceholder="Search by name or email"
                // searchField="name"
                />
              </View>

              <View style={styles.section}>
                <Typography variant="semiBoldTxtsm">
                  Shared Members
                </Typography>
                <View style={styles.sharedList}>
                  {sharedMembers.length === 0 ? (
                    <Typography variant="regularTxtsm" color={colors.gray[500]}>
                      No members shared yet. Add team members above.
                    </Typography>
                  ) : (
                    sharedMembers.map((member) => (
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
                          <Typography variant="regularTxtxs" color={colors.gray[500]} numberOfLines={1}>
                            {member.email}
                          </Typography>
                        </View>
                        <View style={styles.rolePill}>
                          <Typography variant="mediumTxtxs" color={colors.brand[700]}>
                            {member.role}
                          </Typography>
                        </View>
                        <Pressable
                          onPress={() => handleRemoveSharedMember(member.id)}
                          hitSlop={8}
                          style={styles.deleteWrap}
                        >
                          <SvgXml xml={trashIcon} />
                        </Pressable>
                      </View>
                    ))
                  )}
                </View>
              </View>
            </ScrollView>
            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
              <Button onPress={handleClose}>close</Button>
            </View>
            {/* <FooterButtons
              leftButtonProps={{
                children: ' ',
                variant: 'outline',
                size: 44,
                buttonColor: 'transparent',
                textColor: 'transparent',
                borderWidth: 0,
                onPress: () => { },
              }}
              rightButtonProps={{
                children: 'Close',
                variant: 'outline',
                size: 44,
                buttonColor: colors.base.white,
                textColor: colors.gray[700],
                borderColor: colors.gray[300],
                borderWidth: 1,
                borderRadius: 8,
                onPress: handleClose,
              }}
            /> */}
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
    flexShrink: 1,
  },
  headerIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand[100],
  },
  scroll: { maxHeight: 400 },
  scrollContent: { padding: 20, paddingBottom: 12 },
  section: {
    gap: 12,
    marginBottom: 20,
  },
  sectionLabel: {
    marginBottom: 4,
  },
  sharedList: {
    gap: 0,
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
    marginRight: 12,
  },
  deleteWrap: {
    padding: 4,
  },
  submodalCard: {
    borderWidth: 2,
    borderRadius: 16,
    borderColor: colors.gray[200],
    overflow: 'hidden',
  },
});

export default ShareApplicationModal;
