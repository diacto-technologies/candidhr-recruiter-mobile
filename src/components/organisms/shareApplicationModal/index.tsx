import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  View,
  Pressable,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Typography from '../../atoms/typography';
import { colors } from '../../../theme/colors';
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
import { Button } from '../../atoms';
import { trashIcon } from '../../../assets/svg/trash';
import { TeamMemberOption, ShareApplicationModalProps } from './shareapplicationmodal.d';
import { useStyles } from './styles';

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
  onSharedMembersChange,
}: ShareApplicationModalProps) => {
  const [sharedMemberIds, setSharedMemberIds] = useState<string[]>([]);
  const [hasRequestedUsers, setHasRequestedUsers] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const styles = useStyles();

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
    if (visible && initialSharedMemberIds.length > 0) {
      setSharedMemberIds(initialSharedMemberIds);
    }
    if (!visible) {
      setSharedMemberIds([]);
      setHasRequestedUsers(false);
      setKeyboardOpen(false);
    }
  }, [visible, initialSharedMemberIds]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

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

      if (applicationId && Array.isArray(usersList)) {
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

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={handleClose} />
          <Card style={styles.card}>
            <View style={styles.submodalCard}>
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <View>
                    <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
                      Share Application
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
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.section}>
                  <Typography variant="semiBoldTxtsm">
                    Share application with Team Members
                  </Typography>
                  <CommonDropdown
                    placeholder="Search or select team members"
                    options={teamMemberOptions}
                    value={sharedMemberIds}
                    onChange={(nextValue) => {
                      const nextIds = Array.isArray(nextValue) ? nextValue : [];
                      setSharedMemberIds(nextIds);

                      if (applicationId && Array.isArray(usersList)) {
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
                    dropdownPosition={Platform.OS === 'android' && keyboardOpen ? 'top' : 'bottom'}
                    multiSelect
                    searchable={true}
                    containerStyle={{ position: 'absolute' }}
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
              <View style={styles.closeButtonContainer}>
                <Button onPress={handleClose}>close</Button>
              </View>
            </View>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ShareApplicationModal;
