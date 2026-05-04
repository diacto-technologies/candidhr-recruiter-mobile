import React, { Fragment, useEffect, useRef, useState, useCallback, useMemo } from 'react';
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
import { windowWidth, screenHeight } from '../../../../utils/devicelayout';
import SearchBar from '../../../../components/atoms/searchbar';
import Button from '../../../../components/atoms/button';
import { SvgXml } from 'react-native-svg';
import { useRNSafeAreaInsets } from '../../../../hooks/useRNSafeAreaInsets';
import { sortIcon } from '../../../../assets/svg/sort';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import {
  getUsersRequestAction,
  getInvitesRequestAction,
  getRolesRequestAction,
  createUserRequestAction,
  updateUserRequestAction,
  deleteUserRequestAction,
  inviteResendRequestAction,
  inviteRevokeRequestAction,
  selectRolesListItems,
  selectUsersListItems,
  selectUsersListLoading,
  selectUsersListNext,
  selectUsersListPage,
  selectInvitesListItems,
  selectInvitesListLoading,
  selectInvitesListNext,
  selectInvitesListPage,
} from '../../../../features/profile/users';
import { API_ENDPOINTS } from '../../../../api/endpoints';
import { formatDate } from '../../../../utils/constants';
import { capitalizeFirstLetter } from '../../../../utils/stringUtils';
import { useStyles } from './styles';
import { horizontalThreedotIcon } from '../../../../assets/svg/horizontalthreedoticon';
import { AddUserModal, AddUserValues } from './AddUserModal';
import { ConfirmModal, Shimmer } from '../../../../components';
import BottomSheet from '../../../../components/organisms/bottomsheet';
import SortBottomSheet from '../../../../components/organisms/sortbottomsheet';
import {
  UpdateUserRoleModal,
  UpdateUserRoleValues,
  UpdateUserRoleUser,
} from './UpdateUserRoleModal';
import { deleteIcon } from '../../../../assets/svg/deleteicon';
import { editAvatarIcon } from '../../../../assets/svg/editavatar';
import { DropdownMenu } from '../../../../components/molecules/dropdownmenu';
import { selectProfile } from '../../../../features/profile/selectors';
import SlideAnimatedTab from '../../../../components/molecules/slideanimatedtab';
import { Divider } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
interface MemberRow {
  id: string;
  name: string;
  email: string;
  status: string;
  is_active: boolean;
  role: string;
  last_login_label: string;
  date_added: string;
  createdAtMs: number;
  lastLoginMs: number;
}

interface InviteRow {
  id: string;
  name: string;
  email: string;
  role: string;
  invited_by: string;
  status: string;
  expires_on: string;
  sent_on: string;
  createdAtMs: number;
}

type DisplayRow = MemberRow | InviteRow;

const isMemberRow = (r: DisplayRow): r is MemberRow => 'lastLoginMs' in r;

const SORT_OPTIONS = [
  { label: 'Date added (newest)', value: 'date_added_desc' },
  { label: 'Date added (oldest)', value: 'date_added_asc' },
  { label: 'Name (A-Z)', value: 'name_asc' },
  { label: 'Name (Z-A)', value: 'name_desc' },
  { label: 'Last login (recent)', value: 'last_login_recent' },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]['value'];
const DEFAULT_SORT: SortValue = 'date_added_desc';

const TRACK_WIDTH = 320;
const SHIMMER_ROWS = 8;
const tabData = ['Members', 'Invites']
const invitiesTabData = ['All', 'Pending', 'Accepted', 'Expired', 'Revoked']
const memberTabData = ['All Member', 'Admin', 'Editor', 'Participant']

const formatLastLoginLabel = (lastLoginMs: number): string => {
  if (!lastLoginMs) return '—';
  const now = Date.now();
  const diffMs = Math.max(now - lastLoginMs, 0);
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (diffDays <= 0) return 'Today';
  return `${diffDays}d ago`;
};

const getInviteStatusColors = (statusRaw: string | undefined) => {
  const status = String(statusRaw ?? '').trim().toLowerCase();
  switch (status) {
    case 'pending':
      return { bg: colors.warning[50], border: colors.warning[200], text: colors.warning[700] };
    case 'accepted':
      return { bg: colors.success[50], border: colors.success[200], text: colors.success[700] };
    case 'expired':
      return { bg: colors.error[50], border: colors.error[200], text: colors.error[700] };
    case 'revoked':
      return { bg: colors.gray[50], border: colors.gray[200], text: colors.gray[700] };
    default:
      return { bg: colors.gray[50], border: colors.gray[200], text: colors.gray[700] };
  }
};

const Users = () => {
  const insets = useRNSafeAreaInsets();
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const apiUsers = useAppSelector(selectUsersListItems);
  const usersLoading = useAppSelector(selectUsersListLoading);
  const usersNext = useAppSelector(selectUsersListNext);
  const usersPage = useAppSelector(selectUsersListPage);
  const apiInvites = useAppSelector(selectInvitesListItems);
  const invitesLoading = useAppSelector(selectInvitesListLoading);
  const invitesNext = useAppSelector(selectInvitesListNext);
  const invitesPage = useAppSelector(selectInvitesListPage);
  const apiRoles = useAppSelector(selectRolesListItems) ?? [];
  const scrollX = useRef(new Animated.Value(0)).current;
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(windowWidth - 40);
  const [searchText, setSearchText] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [updateRoleOpen, setUpdateRoleOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UpdateUserRoleUser | null>(null);
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<MemberRow | null>(null);
  const [inviteConfirm, setInviteConfirm] = useState<{
    kind: 'resend' | 'revoke';
    id: string;
    email: string;
  } | null>(null);
  const [sortSheetOpen, setSortSheetOpen] = useState(false);
  const [draftSortBy, setDraftSortBy] = useState<SortValue>(DEFAULT_SORT);
  const [appliedSortBy, setAppliedSortBy] = useState<SortValue>(DEFAULT_SORT);
  const [tabs, setTabs] = useState(tabData[0]);
  const [subTab, setSubTab] = useState(memberTabData[0]);
  const [dropdownLayout, setDropdownLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const rowTriggerRefs = useRef<Record<string, React.ComponentRef<typeof View> | null>>({});
  const shadowOpacity = useRef(new Animated.Value(0)).current;
  const fetchingNextRef = useRef(false);
  const userPermission = useAppSelector(selectProfile);
  useEffect(() => {
    dispatch(getRolesRequestAction(1));
  }, [dispatch]);

  useEffect(() => {
    if (tabs === 'Members') {
      dispatch(getUsersRequestAction(1));
    } else {
      dispatch(getInvitesRequestAction(1));
    }
  }, [dispatch, tabs]);

  useEffect(() => {
    setActiveMenuId(null);
  }, [tabs]);

  useEffect(() => {
    const loading = tabs === 'Invites' ? invitesLoading : usersLoading;
    if (!loading) fetchingNextRef.current = false;
  }, [tabs, usersLoading, invitesLoading]);

  useEffect(() => {
    if (!activeMenuId) {
      setDropdownLayout(null);
      return;
    }
    const measure = () => {
      const trigger = rowTriggerRefs.current[activeMenuId];
      if (
        trigger &&
        'measureInWindow' in trigger &&
        typeof trigger.measureInWindow === 'function'
      ) {
        trigger.measureInWindow((x: number, y: number, w: number, h: number) => {
          setDropdownLayout({ x, y, width: w, height: h });
        });
      }
    };
    const t = setTimeout(measure, 50);
    return () => clearTimeout(t);
  }, [activeMenuId]);

  const memberRows: MemberRow[] = useMemo(
    () =>
      apiUsers.map((u) => ({
        id: u.id,
        name: u.name ?? '-',
        email: u.email ?? '-',
        status: u.is_active ? 'Active' : 'Inactive',
        is_active: !!u.is_active,
        role: u.role?.name ?? '-',
        last_login_label: u.last_login ? formatLastLoginLabel(Date.parse(String(u.last_login))) : '—',
        date_added: u.created_at ? formatDate(u.created_at) : '—',
        createdAtMs: u.created_at ? Date.parse(u.created_at) : 0,
        lastLoginMs: u.last_login ? Date.parse(String(u.last_login)) : 0,
      })),
    [apiUsers]
  );

  const inviteRows: InviteRow[] = useMemo(
    () =>
      apiInvites.map((inv) => ({
        id: inv.id,
        name: inv.name ?? '-',
        email: inv.email ?? '-',
        role: inv.role?.name ?? '-',
        invited_by: inv.invited_by?.name ?? '-',
        status: inv.status ?? '-',
        expires_on: inv.expires_at ? formatDate(inv.expires_at) : '-',
        sent_on: inv.created_at ? formatDate(inv.created_at) : '-',
        createdAtMs: inv.created_at ? Date.parse(inv.created_at) : 0,
      })),
    [apiInvites]
  );

  /** Avoid filtering with the wrong sub-tab for one frame after switching main tabs. */
  const effectiveSubTab = useMemo(() => {
    if (tabs === 'Invites') {
      return invitiesTabData.includes(subTab) ? subTab : invitiesTabData[0];
    }
    return memberTabData.includes(subTab) ? subTab : memberTabData[0];
  }, [tabs, subTab]);

  const tableData: DisplayRow[] = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    const base: DisplayRow[] = tabs === 'Members' ? [...memberRows] : [...inviteRows];

    let rows = base.filter(
      (row) =>
        row.name.toLowerCase().includes(q) || row.email.toLowerCase().includes(q)
    );

    if (tabs === 'Members' && effectiveSubTab !== memberTabData[0]) {
      rows = rows.filter((r) => isMemberRow(r) && r.role === effectiveSubTab);
    }

    if (tabs === 'Invites' && effectiveSubTab !== invitiesTabData[0]) {
      const st = effectiveSubTab.toLowerCase();
      rows = rows.filter(
        (r) => !isMemberRow(r) && r.status.toLowerCase() === st
      );
    }

    const next = [...rows] as DisplayRow[];
    const sortLastRecent = (a: DisplayRow, b: DisplayRow) => {
      // On invites, we don't have "last login"; use sent date for "recent".
      const aMs = isMemberRow(a) ? a.lastLoginMs : a.createdAtMs;
      const bMs = isMemberRow(b) ? b.lastLoginMs : b.createdAtMs;
      return bMs - aMs;
    };

    switch (appliedSortBy) {
      case 'date_added_desc':
        next.sort((a, b) => b.createdAtMs - a.createdAtMs);
        break;
      case 'date_added_asc':
        next.sort((a, b) => a.createdAtMs - b.createdAtMs);
        break;
      case 'name_asc':
        next.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );
        break;
      case 'name_desc':
        next.sort((a, b) =>
          b.name.localeCompare(a.name, undefined, { sensitivity: 'base' })
        );
        break;
      case 'last_login_recent':
        next.sort(sortLastRecent);
        break;
      default:
        break;
    }
    return next;
  }, [tabs, memberRows, inviteRows, searchText, appliedSortBy, effectiveSubTab]);

  const showInitialShimmer =
    (tabs === 'Members' && usersLoading && apiUsers.length === 0) ||
    (tabs === 'Invites' && invitesLoading && apiInvites.length === 0);

  const rightHeaderTitles = useMemo(() => {
    if (tabs === 'Invites') {
      return ['Role', 'Invited by', 'Status', 'Expires', 'Sent on', 'Action'];
    }
    return [
      'Status',
      'Role',
      'Last login',
      'Date added',
      ...(userPermission?.is_admin ? ['Action'] : []),
    ];
  }, [tabs, userPermission?.is_admin]);

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

  useEffect(() => {
    if (tabs === 'Invites') {
      setSubTab(invitiesTabData[0]);
    } else {
      setSubTab(memberTabData[0]);
    }
  }, [tabs]);

  const onContainerLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const handleVerticalScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const isInvites = tabs === 'Invites';
      const nextUrl = isInvites ? invitesNext : usersNext;
      const loading = isInvites ? invitesLoading : usersLoading;
      const page = isInvites ? invitesPage : usersPage;

      if (!nextUrl || loading || fetchingNextRef.current) return;

      const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
      const paddingToBottom = 80;
      if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
        fetchingNextRef.current = true;
        const nextPage = (page ?? 1) + 1;
        if (isInvites) {
          dispatch(getInvitesRequestAction(nextPage));
        } else {
          dispatch(getUsersRequestAction(nextPage));
        }
      }
    },
    [
      dispatch,
      tabs,
      usersLoading,
      usersNext,
      usersPage,
      invitesLoading,
      invitesNext,
      invitesPage,
    ]
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
    setDraftSortBy(appliedSortBy);
    setSortSheetOpen(true);
  }, [appliedSortBy]);

  const onApplySort = useCallback(() => {
    setAppliedSortBy(draftSortBy);
    setSortSheetOpen(false);
  }, [draftSortBy]);

  const sortSheetHeight = Math.min(358, Math.round(screenHeight * 0.52));

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
          endpoint: API_ENDPOINTS.USERS.V2_DETAIL(values.userId),
          data: { is_active: values.is_active, role_id: roleId },
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

  const closeInviteConfirm = useCallback(() => {
    setInviteConfirm(null);
  }, []);

  const confirmInviteAction = useCallback(() => {
    if (!inviteConfirm) return;
    if (inviteConfirm.kind === 'resend') {
      dispatch(inviteResendRequestAction(inviteConfirm.id));
    } else {
      dispatch(inviteRevokeRequestAction(inviteConfirm.id));
    }
    setInviteConfirm(null);
  }, [dispatch, inviteConfirm]);

  /** LEFT FIXED COLUMN - Name */
  const renderLeftColumn = ({ item, index }: { item: DisplayRow; index: number }) => {
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

  /** Shimmer for initial load - mimics table layout */
  const renderUsersTableShimmer = () => {
    const shimmerHeaders =
      tabs === 'Invites'
        ? (['Role', 'Invited by', 'Status', 'Expires', 'Sent on', 'Action'] as const)
        : userPermission?.is_admin
          ? (['Status', 'Role', 'Last login', 'Date added', 'Action'] as const)
          : (['Status', 'Role', 'Last login', 'Date added'] as const);

    return (
      <View style={styles.tableContainer}>
        <View style={styles.leftFixedWrapper}>
          <View style={styles.headerRow}>
            <Typography
              variant="semiBoldTxtxs"
              style={styles.headerText}
              color={colors.gray[500]}
            >
              Name
            </Typography>
          </View>
          {Array.from({ length: SHIMMER_ROWS }).map((_, i) => (
            <View
              key={`shimmer-left-${i}`}
              style={[
                styles.leftFixedColumn,
                { backgroundColor: i % 2 === 1 ? colors.neutrals.lightGray : '#FFF' },
              ]}
            >
              <Shimmer width="70%" height={14} borderRadius={6} style={{ marginBottom: 8 }} />
              <Shimmer width="55%" height={12} borderRadius={6} />
            </View>
          ))}
        </View>
        <View>
          <View style={styles.headerRow}>
            {shimmerHeaders.map((title, idx) => (
              <Typography
                key={idx}
                variant="semiBoldTxtxs"
                style={styles.headerText}
                color={colors.gray[500]}
              >
                {title}
              </Typography>
            ))}
          </View>
          {Array.from({ length: SHIMMER_ROWS }).map((_, i) => (
            <View
              key={`shimmer-right-${i}`}
              style={[
                styles.row,
                { backgroundColor: i % 2 === 1 ? colors.neutrals.lightGray : '#FFF' },
              ]}
            >
              {shimmerHeaders.map((h, cellIdx) => (
                <View
                  key={`${h}-${cellIdx}`}
                  style={h === 'Action' ? styles.actionCell : styles.cell}
                >
                  <Shimmer height={14} width="80%" borderRadius={6} />
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  };

  /** RIGHT SCROLLABLE CELLS */
  const renderRightRow = ({ item, index }: { item: DisplayRow; index: number }) => {
    const bg = index % 2 === 1 ? colors.neutrals.lightGray : '#FFF';
    const isOpen = activeMenuId === item.id;

    return (
      <View style={[styles.row, { backgroundColor: bg }]}>
        {tabs === 'Invites' ? (
          <>
            <Typography style={styles.cell} variant="regularTxtsm" color={colors.gray[600]}>
              {!isMemberRow(item) ? item.role : '-'}
            </Typography>
            <Typography style={styles.cell} variant="regularTxtsm" color={colors.gray[600]}>
              {!isMemberRow(item) ? item.invited_by : '-'}
            </Typography>
            {(() => {
              const status = !isMemberRow(item) ? item.status : '';
              const c = getInviteStatusColors(status);
              return (
                <View style={styles.cell}>
                  <View
                    style={{
                      alignSelf: 'flex-start',
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: c.border,
                      backgroundColor: c.bg,
                    }}
                  >
                    <Typography variant="mediumTxtxs" color={c.text}>
                      {status ? capitalizeFirstLetter(status.trim()) : '—'}
                    </Typography>
                  </View>
                </View>
              );
            })()}
            <Typography style={styles.cell} variant="regularTxtsm" color={colors.gray[600]}>
              {!isMemberRow(item) ? item.expires_on : '-'}
            </Typography>
            <Typography style={styles.cell} variant="regularTxtsm" color={colors.gray[600]}>
              {!isMemberRow(item) ? item.sent_on : '-'}
            </Typography>
            <View style={[styles.actionCell, styles.inviteActionCell]}>
              {!isMemberRow(item) && item.status?.toLowerCase() === 'pending' ? (
                <>
                  <Pressable
                    style={[styles.inviteActionBtn, { backgroundColor: colors.brand[50] }]}
                    onPress={() =>
                      !isMemberRow(item) &&
                      setInviteConfirm({ kind: 'resend', id: item.id, email: item.email })
                    }
                  >
                    <Typography variant="semiBoldTxtxs" color={colors.brand[700]}>
                      Resend
                    </Typography>
                  </Pressable>
                  <Pressable
                    style={[styles.inviteActionBtn, { backgroundColor: colors.error[50] }]}
                    onPress={() =>
                      !isMemberRow(item) &&
                      setInviteConfirm({ kind: 'revoke', id: item.id, email: item.email })
                    }
                  >
                    <Typography variant="semiBoldTxtxs" color={colors.error[700]}>
                      Revoke
                    </Typography>
                  </Pressable>
                </>
              ) : !isMemberRow(item) && item.status?.toLowerCase() === 'expired' ? (
                <Pressable
                  style={[styles.inviteActionBtn, { backgroundColor: colors.brand[50] }]}
                  onPress={() =>
                    !isMemberRow(item) &&
                    setInviteConfirm({ kind: 'resend', id: item.id, email: item.email })
                  }
                >
                  <Typography variant="semiBoldTxtxs" color={colors.brand[700]}>
                    Resend
                  </Typography>
                </Pressable>
              ) : (
                <Typography variant="regularTxtsm" color={colors.gray[400]}>
                  —
                </Typography>
              )}
            </View>
          </>
        ) : (
          <>
            <View style={styles.cell}>
              <View style={[styles.statusPill, {
                backgroundColor: item.status === 'Active' ?  colors.success[50]:colors.gray[50],
                borderColor:item.status === 'Active' ? colors.success[200]:colors.gray[200],
              }]}>
                <Typography variant='mediumTxtxs' color={item.status === 'Active' ? colors.success[700] : colors.gray[700]}>
                  {isMemberRow(item) ? capitalizeFirstLetter(item.status) : '—'}
                </Typography>
              </View>
            </View>

            <Typography style={styles.cell} variant="regularTxtsm" color={colors.gray[600]}>
              {isMemberRow(item) ? item.role : '—'}
            </Typography>

            <Typography style={styles.cell} variant="regularTxtsm" color={colors.gray[600]}>
              {isMemberRow(item) ? item.last_login_label : '—'}
            </Typography>

            <Typography style={styles.cell} variant="regularTxtsm" color={colors.gray[600]}>
              {isMemberRow(item) ? item.date_added : '—'}
            </Typography>

            {userPermission?.is_admin ? (
              <View
                ref={(r) => {
                  rowTriggerRefs.current[item.id] = r;
                }}
                style={styles.actionCell}
                collapsable={false}
              >
                {isMemberRow(item) ? (
                  <Pressable onPress={() => setActiveMenuId(isOpen ? null : item.id)}>
                    <SvgXml
                      xml={horizontalThreedotIcon}
                      width={20}
                      height={20}
                      style={{ transform: [{ rotate: '90deg' }] }}
                    />
                  </Pressable>
                ) : null}
              </View>
            ) : null}
          </>
        )}
      </View>
    );
  };



  return (
    <Fragment>
      <CustomSafeAreaView>
        <Header title="Users" backNavigation showTitle onBack={goBack} />
        <View>
          <SlideAnimatedTab
            tabs={tabData}
            activeTab={tabs}
            onChangeTab={(t) => setTabs(t)}
            countShow={true}
          />
          <Divider />
          <SlideAnimatedTab
            tabs={tabs === 'Invites' ? invitiesTabData : memberTabData}
            activeTab={subTab}
            onChangeTab={(t) => setSubTab(t)}
            countShow={true}
          />
          <Divider />
        </View>
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
            {showInitialShimmer ? (
              renderUsersTableShimmer()
            ) : (
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
                    data={tableData}
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
                  contentContainerStyle={{ overflow: 'visible' }}
                >
                  <View>
                    <View style={styles.headerRow}>
                      {rightHeaderTitles.map((title, index) => (
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
                      data={tableData}
                      renderItem={renderRightRow}
                      keyExtractor={(item) => `right-${item.id}`}
                      scrollEnabled={false}
                    />
                  </View>
                </ScrollView>
              </View>
            )}
          </ScrollView>
        </View>
        {/* Scroll indicator - hide when showing shimmer */}
        {/* {!(usersLoading && apiUsers.length === 0) && (
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
        )} */}
      </CustomSafeAreaView>

      {/* Add Users Button */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.insetsBottom }]}>
        {userPermission?.is_admin &&
          <Button onPress={handleAddUsers} style={styles.addButton}>
            Add users
          </Button>
        }
      </View>

      <AddUserModal visible={addUserOpen} onClose={closeAddUser} onSubmit={submitAddUser} />

      <UpdateUserRoleModal
        visible={updateRoleOpen}
        user={selectedUser}
        onClose={closeUpdateRole}
        onSubmit={submitUpdateRole}
        roleOptions={apiRoles.map((r) => r.name)}
      />

      <DropdownMenu
        visible={!!activeMenuId}
        onClose={() => setActiveMenuId(null)}
        iconWidth={20}
        iconHight={20}
        position={
          dropdownLayout
            ? {
              left: dropdownLayout.x + dropdownLayout.width - 140,
              top: dropdownLayout.y + dropdownLayout.height - 5,
            }
            : { left: 0, top: 0 }
        }
        items={(() => {
          const found = tableData.find((u) => u.id === activeMenuId);
          const row = found && isMemberRow(found) ? found : undefined;
          if (!row) return [];
          return [
            {
              label: 'Remove',
              icon: deleteIcon,
              onPress: () => {
                setActiveMenuId(null);
                setRemoveTarget(row);
                setRemoveConfirmOpen(true);
              },
            },
            {
              label: 'Update',
              icon: editAvatarIcon,
              onPress: () => {
                setActiveMenuId(null);
                setSelectedUser({
                  id: row.id,
                  name: row.name,
                  email: row.email,
                  role: row.role,
                  is_active: row.is_active,
                });
                setUpdateRoleOpen(true);
              },
            },
          ];
        })()}
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

      <ConfirmModal
        visible={!!inviteConfirm}
        title={inviteConfirm?.kind === 'resend' ? 'Resend invite' : 'Revoke invite'}
        subtitle={
          inviteConfirm?.kind === 'resend'
            ? 'Sends a fresh invite with a new 7-day expiry.'
            : 'The invite link will stop working immediately.'
        }
        bodyAlign="left"
        headerIcon={
          inviteConfirm ? (
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
                  inviteConfirm.kind === 'resend' ? colors.brand[50] : colors.error[50],
              }}
            >
              <Ionicons
                name={inviteConfirm.kind === 'resend' ? 'refresh' : 'ban'}
                size={22}
                color={inviteConfirm.kind === 'resend' ? colors.brand[600] : colors.error[600]}
              />
            </View>
          ) : undefined
        }
        message={
          inviteConfirm ? (
            inviteConfirm.kind === 'resend' ? (
              <Typography variant="regularTxtsm" color={colors.gray[700]} style={{ textAlign: 'left', lineHeight: 22 }}>
                Resend invite to{' '}
                <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
                  {inviteConfirm.email}
                </Typography>
                ? The previous link will be invalidated.
              </Typography>
            ) : (
              <Typography variant="regularTxtsm" color={colors.gray[700]} style={{ textAlign: 'left', lineHeight: 22 }}>
                Are you sure you want to revoke the invite for{' '}
                <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
                  {inviteConfirm.email}
                </Typography>
                ? This cannot be undone.
              </Typography>
            )
          ) : null
        }
        confirmText={inviteConfirm?.kind === 'resend' ? 'Resend invite' : 'Revoke invite'}
        cancelText="Cancel"
        cancelFirst
        confirmStartIcon={false}
        confirmButtonProps={{
          buttonColor: inviteConfirm?.kind === 'resend' ? colors.brand[600] : colors.error[600],
          textColor: colors.base.white,
        }}
        onConfirm={confirmInviteAction}
        onCancel={closeInviteConfirm}
        onClose={closeInviteConfirm}
      />

      <BottomSheet
        visible={sortSheetOpen}
        onClose={() => setSortSheetOpen(false)}
        title="Sort"
        onClearAll={() => setDraftSortBy(DEFAULT_SORT)}
        hight={sortSheetHeight}
      >
        <SortBottomSheet
          options={[...SORT_OPTIONS]}
          selectedValue={draftSortBy}
          onSelect={(v) => setDraftSortBy(v as SortValue)}
          onApply={onApplySort}
        />
      </BottomSheet>
    </Fragment>
  );
};

export default Users;
