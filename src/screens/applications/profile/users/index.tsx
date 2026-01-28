import React, { Fragment, useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Animated,
  FlatList,
  ScrollView,
  Pressable,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import Typography from '../../../../components/atoms/typography';
import { colors } from '../../../../theme/colors';
import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview';
import Header from '../../../../components/organisms/header';
import { goBack } from '../../../../utils/navigationUtils';
import { windowWidth } from '../../../../utils/devicelayout';
import SearchBar from '../../../../components/atoms/searchbar';
import Button from '../../../../components/atoms/button';
import { SvgXml } from 'react-native-svg';
import { useRNSafeAreaInsets } from '../../../../hooks/useRNSafeAreaInsets';
import { sortIcon } from '../../../../assets/svg/sort';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import {
  getUsersRequestAction,
  getRolesRequestAction,
  createUserRequestAction,
  updateUserRequestAction,
  deleteUserRequestAction,
  selectRolesListItems,
  selectUsersListItems,
  selectUsersListLoading,
  selectUsersListNext,
  selectUsersListPage,
} from '../../../../features/profile/users';
import { API_ENDPOINTS } from '../../../../api/endpoints';
import { formatDate } from '../../../../utils/constants';
import { useStyles } from './styles';
import { horizontalThreedotIcon } from '../../../../assets/svg/horizontalthreedoticon';
import { AddUserModal, AddUserValues } from './AddUserModal';
import { ConfirmModal } from '../../../../components';
import {
  UpdateUserRoleModal,
  UpdateUserRoleValues,
  UpdateUserRoleUser,
} from './UpdateUserRoleModal';
import { deleteIcon } from '../../../../assets/svg/deleteicon';
import { editAvatarIcon } from '../../../../assets/svg/editavatar';
interface User {
  id: string;
  name: string;
  email: string;
  invited_on: string;
  role: string;
}

const TRACK_WIDTH = 320;

const Users = () => {
  const insets = useRNSafeAreaInsets();
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const apiUsers = useAppSelector(selectUsersListItems);
  const usersLoading = useAppSelector(selectUsersListLoading);
  const usersNext = useAppSelector(selectUsersListNext);
  const usersPage = useAppSelector(selectUsersListPage);
  const apiRoles = useAppSelector(selectRolesListItems);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(windowWidth - 40);
  const [searchText, setSearchText] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [updateRoleOpen, setUpdateRoleOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UpdateUserRoleUser | null>(null);
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<User | null>(null);
  const shadowOpacity = useRef(new Animated.Value(0)).current;
  const fetchingNextRef = useRef(false);

  useEffect(() => {
    dispatch(getUsersRequestAction(1));
    dispatch(getRolesRequestAction(1));
  }, [dispatch]);

  useEffect(() => {
    if (!usersLoading) fetchingNextRef.current = false;
  }, [usersLoading]);

  const users: User[] = apiUsers.map((u) => ({
    id: u.id,
    name: u.name ?? '-',
    email: u.email ?? '-',
    invited_on: u.created_at ? formatDate(u.created_at) : '-',
    role: u.role?.name ?? '-',
  }));

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  // Show/hide shadow based on scrollX
  useEffect(() => {
    const id = scrollX.addListener(({ value }) => {
      Animated.timing(shadowOpacity, {
        toValue: value > 0 ? 1 : 0,
        duration: 180,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      scrollX.removeListener(id);
    };
  }, [scrollX, shadowOpacity]);

  const onContainerLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const handleVerticalScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!usersNext || usersLoading || fetchingNextRef.current) return;

      const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
      const paddingToBottom = 80;
      if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
        fetchingNextRef.current = true;
        dispatch(getUsersRequestAction((usersPage ?? 1) + 1));
      }
    },
    [dispatch, usersLoading, usersNext, usersPage]
  );

  const visibleWidth = containerWidth - 140;
  const scrollRange = Math.max(contentWidth - visibleWidth, 0);

  const THUMB_WIDTH =
    scrollRange > 0
      ? Math.max((visibleWidth / contentWidth) * TRACK_WIDTH, 40)
      : TRACK_WIDTH - 20;

  const translateX = scrollX.interpolate({
    inputRange: [0, scrollRange],
    outputRange: [0, TRACK_WIDTH - THUMB_WIDTH],
    extrapolate: 'clamp',
  });

  const handleAddUsers = useCallback(() => {
    setAddUserOpen(true);
  }, []);

  const closeAddUser = useCallback((): void => {
    setAddUserOpen(false);
  }, []);

  const submitAddUser = useCallback(
    (values: AddUserValues): void => {
      if (!values.name?.trim() || !values.email?.trim() || !values.role) return;
      dispatch(
        createUserRequestAction({
          data: {
            name: values.name.trim(),
            email: values.email.trim(),
            role_id: values.role,
          },
          refreshPage: 1,
        })
      );
      closeAddUser();
    },
    [closeAddUser, dispatch]
  );

  const handleSort = useCallback(() => {
    // TODO: Implement sort functionality
    console.log('Sort pressed');
  }, []);

  const closeUpdateRole = useCallback((): void => {
    setUpdateRoleOpen(false);
    setSelectedUser(null);
  }, []);

  const submitUpdateRole = useCallback(
    (values: UpdateUserRoleValues): void => {
      const roleId = apiRoles.find((r) => r.name === values.role)?.id;
      if (!values.userId || !roleId) return;

      dispatch(
        updateUserRequestAction({
          endpoint: API_ENDPOINTS.USERS.ASSIGN_ROLE,
          data: { user_id: values.userId, role_id: roleId },
          refreshPage: 1,
        })
      );
      closeUpdateRole();
    },
    [apiRoles, closeUpdateRole, dispatch]
  );

  const closeRemoveConfirm = useCallback(() => {
    setRemoveConfirmOpen(false);
    setRemoveTarget(null);
  }, []);

  const confirmRemove = useCallback(() => {
    if (!removeTarget?.id) return;
    dispatch(
      deleteUserRequestAction({
        endpoint: API_ENDPOINTS.USERS.DELETE(removeTarget.id),
        refreshPage: 1,
      })
    );
    closeRemoveConfirm();
  }, [closeRemoveConfirm, dispatch, removeTarget?.id]);

  /** LEFT FIXED COLUMN - Name */
  const renderLeftColumn = ({ item, index }: { item: User; index: number }) => {
    const bg = index % 2 === 1 ? colors.neutrals.lightGray : '#FFF';

    return (
      <View style={[styles.leftFixedColumn, { backgroundColor: bg }]}>
        <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
          {item.name}
        </Typography>
        <Typography variant="regularTxtxs" color={colors.gray[500]}>
          {item.email}
        </Typography>
      </View>
    );
  };

  /** RIGHT SCROLLABLE CELLS - Invited on, Role */
  const renderRightRow = ({ item, index }: { item: User; index: number }) => {
    const bg = index % 2 === 1 ? colors.neutrals.lightGray : '#FFF';
    const isOpen = activeMenuId === item.id;

    return (
      <View style={[styles.row, { backgroundColor: bg }]}>
        <Typography style={styles.cell} variant="regularTxtsm" color={colors.gray[600]}>
          {item.invited_on}
        </Typography>

        <Typography style={styles.cell} variant="regularTxtsm" color={colors.gray[600]}>
          {item.role}
        </Typography>

        {/* ACTION COLUMN */}
        <View style={styles.actionCell}>
          <Pressable onPress={() => setActiveMenuId(isOpen ? null : item.id)}>
            <SvgXml
              xml={horizontalThreedotIcon}
              width={20}
              height={20}
              style={{ transform: [{ rotate: '90deg' }] }}
            />
          </Pressable>

          {/* DROPDOWN */}
          {isOpen && (
            <View style={styles.dropdown}>
              <Pressable
                style={styles.dropdownItem}
                onPress={() => {
                  setActiveMenuId(null);
                  setRemoveTarget(item);
                  setRemoveConfirmOpen(true);
                }}
              >
                <SvgXml xml={deleteIcon} style={{marginRight:5}} width={16} height={16}/>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>Remove</Typography>
              </Pressable>

              <Pressable
                style={styles.dropdownItem}
                onPress={() => {
                  setActiveMenuId(null);
                  console.log('Update', item.id);
                  setSelectedUser({
                    id: item.id,
                    name: item.name,
                    email: item.email,
                    role: item.role,
                  });
                  setUpdateRoleOpen(true);
                }}
              >
                <SvgXml xml={editAvatarIcon} style={{marginRight:5}} width={16} height={16}/>
                <Typography  variant="semiBoldTxtsm" color={colors.gray[700]}>Update</Typography>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    );
  };



  return (
    <Fragment>
      <CustomSafeAreaView>
        <Header title="Users" backNavigation showTitle onBack={goBack} />

        {/* Search and Sort Row */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search"
              onClear={() => setSearchText('')}
            />
          </View>
          <Pressable style={styles.sortButton} onPress={handleSort}>
            <SvgXml xml={sortIcon} width={20} height={20} />
            <Typography variant="semiBoldTxtsm" color={colors.gray[700]} style={styles.sortText}>
              Sort
            </Typography>
          </Pressable>
        </View>

        {/* Table */}
        <View style={styles.card} onLayout={onContainerLayout}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            bounces={false}
            onScroll={handleVerticalScroll}
            scrollEventThrottle={16}
          >
            <View style={styles.tableContainer}>
              {/* Left Fixed Column */}
              <Animated.View
                style={[
                  styles.leftFixedWrapper,
                  {
                    shadowColor: '#0A0D12',
                    shadowOffset: { width: 2, height: 0 },
                    shadowOpacity: shadowOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 0.06],
                    }),
                    shadowRadius: shadowOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 10],
                    }),
                    elevation: shadowOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 6],
                    }),
                  },
                ]}
              >
                {/* LEFT COLUMN HEADER */}
                <View style={styles.headerRow}>
                  <Typography
                    variant="semiBoldTxtxs"
                    style={styles.headerText}
                    color={colors.gray[500]}
                  >
                    Name
                  </Typography>
                </View>

                <FlatList
                  data={filteredUsers}
                  renderItem={renderLeftColumn}
                  keyExtractor={(item) => `left-${item.id}`}
                  scrollEnabled={false}
                />
              </Animated.View>

              {/* Right Scrollable Columns */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onContentSizeChange={(w) => setContentWidth(w)}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  { useNativeDriver: false }
                )}
                bounces={false}
              >
                <View>
                  <View style={styles.headerRow}>
                    {['Invited on', 'Role', "Action"].map((title, index) => (
                      <Typography
                        key={index}
                        variant="semiBoldTxtxs"
                        style={styles.headerText}
                        color={colors.gray[500]}
                      >
                        {title}
                      </Typography>
                    ))}
                  </View>

                  <FlatList
                    data={filteredUsers}
                    renderItem={renderRightRow}
                    keyExtractor={(item) => `right-${item.id}`}
                    scrollEnabled={false}
                  />
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </View>

        {/* Scroll indicator */}
        <View style={styles.paginationContainer}>
          <View style={[styles.scrollTrack, { width: TRACK_WIDTH - 250 }]}>
            <Animated.View
              style={[
                styles.scrollThumb,
                { width: THUMB_WIDTH, transform: [{ translateX }] },
              ]}
            />
          </View>
        </View>
      </CustomSafeAreaView>

      {/* Add Users Button */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.insetsBottom + 16 }]}>
        <Button onPress={handleAddUsers} style={styles.addButton}>
          Add users
        </Button>
      </View>

      <AddUserModal visible={addUserOpen} onClose={closeAddUser} onSubmit={submitAddUser} />
      <UpdateUserRoleModal
        visible={updateRoleOpen}
        user={selectedUser}
        onClose={closeUpdateRole}
        onSubmit={submitUpdateRole}
        roleOptions={apiRoles.map((r) => r.name)}
      />

      <ConfirmModal
        visible={removeConfirmOpen}
        title="Confirm"
        message={
          removeTarget
            ? `Are you sure you want\nto remove ${removeTarget.name}?`
            : 'Are you sure you want to remove this user?'
        }
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={confirmRemove}
        onCancel={closeRemoveConfirm}
        onClose={closeRemoveConfirm}
      />
    </Fragment>
  );
};

export default Users;
