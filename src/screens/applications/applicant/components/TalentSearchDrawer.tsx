import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import Typography from '../../../../components/atoms/typography';
import { SvgXml } from 'react-native-svg';
import { colors } from '../../../../theme/colors';
import { useBrandTheme } from '../../../../hooks/useBrandTheme';
import { useRNSafeAreaInsets } from '../../../../hooks/useRNSafeAreaInsets';
import { modalCloseIcon, closeIconSm } from '../../../../assets/svg/closeicon';
import { trashIcon } from '../../../../assets/svg/trash';
import { horizontalThreedotIcon } from '../../../../assets/svg/horizontalthreedoticon';
import { DropdownMenu, DropdownMenuItem } from '../../../../components/molecules/dropdownmenu';
import ConfirmModal from '../../../../components/organisms/confirmmodal';
import {
  clockOutlineIcon,
  plusIconSvg,
  chatSparkleIcon,
  searchIconSvg,
  pencilEditIcon,
  bookmarkPinIcon,
  trashOutlineIcon,
  checkOutlineIcon,
} from './talentSearchIcons';
import { CopilotSessionItem } from '../../../../features/copilot/types';
import { useStyles, DRAWER_WIDTH } from './TalentSearchDrawer.styles';
import { deleteIcon, deleteRedIcon } from '../../../../assets/svg/deleteicon';

interface TalentSearchDrawerProps {
  visible: boolean;
  onClose: () => void;
  historyList?: string[];
  sessions?: CopilotSessionItem[];
  onSelectHistory: (query: string, sessionId?: string) => void;
  onRemoveHistoryItem: (query: string, sessionId?: string) => void;
  onClearAllHistory: () => void;
  onNewSearch: () => void;
  onRenameSession?: (newTitle: string, sessionId?: string, oldTitle?: string) => void;
  onTogglePinSession?: (sessionId?: string, isPinned?: boolean, title?: string) => void;
}

interface ActiveItemContext {
  title: string;
  sessionId?: string;
  itemKey: string;
}

const TalentSearchDrawer: React.FC<TalentSearchDrawerProps> = ({
  visible,
  onClose,
  historyList = [],
  sessions = [],
  onSelectHistory,
  onRemoveHistoryItem,
  onClearAllHistory,
  onNewSearch,
  onRenameSession,
  onTogglePinSession,
}) => {
  const { brandColors } = useBrandTheme();
  const styles = useStyles(brandColors);
  const { insetsTop, insetsBottom } = useRNSafeAreaInsets();
  const animVal = useRef(new Animated.Value(0)).current;
  const [isMounted, setIsMounted] = useState(visible);

  // Search filter state for chat history
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchHistoryText, setSearchHistoryText] = useState('');

  // ThreeDot Dropdown state
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ left: number; top: number }>({
    left: 100,
    top: 100,
  });
  const [activeItem, setActiveItem] = useState<ActiveItemContext | null>(null);
  const triggerRefs = useRef<Record<string, View | null>>({});

  // Pinned chats state
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());

  // Renamed chats local map
  const [renamedTitles, setRenamedTitles] = useState<Record<string, string>>({});

  // Active item targeted for rename (persists across dropdown dismissal)
  const [renameTargetItem, setRenameTargetItem] = useState<ActiveItemContext | null>(null);

  // Delete confirmation state for three-dot menu
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Clear chat history confirmation modal state
  const [isClearConfirmVisible, setIsClearConfirmVisible] = useState(false);
  const sessionCount = sessions && sessions.length > 0 ? sessions.length : historyList.length;

  // Rename modal state
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [renameInputText, setRenameInputText] = useState('');

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      Animated.timing(animVal, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      setDropdownVisible(false);
      setActiveItem(null);
      setIsConfirmingDelete(false);
      setIsSearchOpen(false);
      setSearchHistoryText('');
      Animated.timing(animVal, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setIsMounted(false);
      });
    }
  }, [visible, animVal]);

  const handleOpenItemMenu = (
    itemTitle: string,
    sessionId: string | undefined,
    itemKey: string
  ) => {
    setIsConfirmingDelete(false);
    setActiveItem({ title: itemTitle, sessionId, itemKey });
    const triggerNode = triggerRefs.current[itemKey];

    if (triggerNode && 'measureInWindow' in triggerNode) {
      (triggerNode as any).measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          const { height: windowHeight, width: windowWidth } = Dimensions.get('window');
          const DROPDOWN_MENU_HEIGHT = 145;
          const DROPDOWN_WIDTH = 160;

          const spaceBelow = windowHeight - insetsBottom - (y + height + 4);
          const shouldOpenAbove = spaceBelow < DROPDOWN_MENU_HEIGHT + 16;

          const top = shouldOpenAbove
            ? Math.max(insetsTop + 8, y - DROPDOWN_MENU_HEIGHT - 4)
            : y + height + 4;

          const left = Math.min(
            Math.max(8, x + width - DROPDOWN_WIDTH),
            windowWidth - DROPDOWN_WIDTH - 8
          );

          setDropdownPosition({ left, top });
          setDropdownVisible(true);
        }
      );
    } else {
      setDropdownPosition({ left: 120, top: 180 });
      setDropdownVisible(true);
    }
  };

  const handleTogglePin = (item: ActiveItemContext) => {
    const key = item.sessionId || item.title;
    let nextPinned = false;
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        nextPinned = false;
      } else {
        next.add(key);
        nextPinned = true;
      }
      return next;
    });
    setDropdownVisible(false);

    if (onTogglePinSession) {
      onTogglePinSession(item.sessionId, nextPinned, item.title);
    }
  };

  const handleStartRename = (item: ActiveItemContext) => {
    setRenameTargetItem(item);
    setDropdownVisible(false);
    setRenameInputText(renamedTitles[item.itemKey] || item.title);
    setRenameModalVisible(true);
  };

  const handleCancelRename = () => {
    setRenameModalVisible(false);
    setRenameTargetItem(null);
  };

  const handleSaveRename = () => {
    const trimmed = renameInputText.trim();
    const target = renameTargetItem || activeItem;
    console.log('[TalentSearchDrawer.handleSaveRename] Saving rename:', {
      trimmed,
      target,
    });
    if (trimmed && target) {
      setRenamedTitles((prev) => ({
        ...prev,
        [target.itemKey]: trimmed,
      }));
      if (onRenameSession) {
        onRenameSession(trimmed, target.sessionId, target.title);
      }
    }
    setRenameModalVisible(false);
    setRenameTargetItem(null);
  };

  const menuItems: DropdownMenuItem[] = useMemo(() => {
    if (!activeItem) return [];
    const isPinned = pinnedIds.has(activeItem.sessionId || activeItem.title);

    const deleteMenuItem: DropdownMenuItem = isConfirmingDelete
      ? {
        label: 'Confirm delete',
        icon: checkOutlineIcon(colors.error[600]),
        textColor: colors.error[600],
        showDividerAbove: true,
        closeOnPress: true,
        onPress: () => {
          const toDelete = activeItem;
          setIsConfirmingDelete(false);
          setDropdownVisible(false);
          setActiveItem(null);
          if (toDelete) {
            onRemoveHistoryItem(toDelete.title, toDelete.sessionId);
          }
        },
      }
      : {
        label: 'Delete',
        icon: trashOutlineIcon(colors.error[600]),
        textColor: colors.error[600],
        showDividerAbove: true,
        closeOnPress: false,
        onPress: () => {
          setIsConfirmingDelete(true);
        },
      };

    return [
      {
        label: 'Rename',
        icon: pencilEditIcon(colors.gray[700]),
        closeOnPress: false,
        onPress: () => {
          handleStartRename(activeItem);
        },
      },
      {
        label: isPinned ? 'Unpin chat' : 'Pin chat',
        icon: bookmarkPinIcon(isPinned ? (brandColors[600] || '#4F46E5') : colors.gray[700]),
        onPress: () => {
          handleTogglePin(activeItem);
        },
      },
      deleteMenuItem,
    ];
  }, [activeItem, pinnedIds, brandColors, isConfirmingDelete, onRemoveHistoryItem]);

  // Process and sort sessions list (pinned first, then filtered)
  const processedSessions = useMemo(() => {
    const query = searchHistoryText.trim().toLowerCase();
    const mapped = sessions.map((sess, index) => {
      const sessionId = String(sess.id);
      const itemKey = sessionId || `drawer-sess-${index}`;
      const defaultTitle = (sess.title || sess.query || sess.name || 'Untitled Search').trim();
      const displayTitle = renamedTitles[itemKey] || defaultTitle;
      const isPinned =
        Boolean(sess.is_pinned ?? sess.pinned) ||
        pinnedIds.has(sessionId) ||
        pinnedIds.has(displayTitle);

      return {
        sessionId,
        itemKey,
        title: displayTitle,
        isPinned,
      };
    });

    const filtered = query
      ? mapped.filter((item) => item.title.toLowerCase().includes(query))
      : mapped;

    return [...filtered].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [sessions, renamedTitles, pinnedIds, searchHistoryText]);

  // Process historyList fallback
  const processedHistoryList = useMemo(() => {
    const query = searchHistoryText.trim().toLowerCase();
    const mapped = historyList.map((item, index) => {
      const itemKey = `drawer-hist-${index}`;
      const displayTitle = renamedTitles[itemKey] || item;
      const isPinned = pinnedIds.has(displayTitle);

      return {
        itemKey,
        title: displayTitle,
        isPinned,
      };
    });

    const filtered = query
      ? mapped.filter((item) => item.title.toLowerCase().includes(query))
      : mapped;

    return [...filtered].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [historyList, renamedTitles, pinnedIds, searchHistoryText]);

  if (!isMounted && !visible) {
    return null;
  }

  const translateX = animVal.interpolate({
    inputRange: [0, 1],
    outputRange: [-DRAWER_WIDTH, 0],
  });

  const backdropOpacity = animVal.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const hasItems = sessions.length > 0 || historyList.length > 0;

  return (
    <>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close navigation drawer"
        />
      </Animated.View>

      {/* Drawer Panel */}
      <Animated.View
        style={[
          styles.drawerContainer,
          { transform: [{ translateX }] },
        ]}
      >
        {/* Drawer Header */}
        <View style={styles.drawerHeader}>
          <View style={styles.headerTitleRow}>
            <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
              Talent Search
            </Typography>
          </View>

          <Pressable
            onPress={onClose}
            style={styles.closeButton}
            accessibilityRole="button"
            accessibilityLabel="Close drawer"
          >
            <SvgXml xml={modalCloseIcon(colors.gray[500])} width={20} height={20} />
          </Pressable>
        </View>

        {/* New Search Action */}
        <Pressable
          style={styles.newSearchButton}
          onPress={() => {
            onNewSearch();
            onClose();
          }}
          accessibilityRole="button"
          accessibilityLabel="Start a new search"
        >
          <SvgXml xml={plusIconSvg(brandColors[600] || colors.brand[600])} width={18} height={18} />
          <Typography
            variant="semiBoldTxtsm"
            color={brandColors[700] || colors.brand[700]}
            style={styles.newSearchText}
          >
            New Search
          </Typography>
        </Pressable>

        {/* Section Header: CHAT HISTORY with Search Icon */}
        <View style={styles.chatHistoryHeaderRow}>
          <Typography
            variant="semiBoldTxtxs"
            color={colors.gray[400]}
            style={styles.chatHistoryTitle}
          >
            CHAT HISTORY
          </Typography>

          {hasItems && (
            <Pressable
              onPress={() => {
                setIsSearchOpen((prev) => !prev);
                if (isSearchOpen) {
                  setSearchHistoryText('');
                }
              }}
              style={styles.searchIconButton}
              accessibilityRole="button"
              accessibilityLabel="Search chat history"
            >
              <SvgXml
                xml={searchIconSvg(isSearchOpen ? (brandColors[600] || '#4F46E5') : colors.gray[400])}
                width={16}
                height={16}
              />
            </Pressable>
          )}
        </View>

        {/* Search Input Box (Collapsible) */}
        {isSearchOpen && (
          <View style={styles.searchBoxContainer}>
            <TextInput
              value={searchHistoryText}
              onChangeText={setSearchHistoryText}
              placeholder="Search chats..."
              placeholderTextColor={colors.gray[400]}
              style={styles.searchInput}
              autoFocus
            />
            {searchHistoryText.length > 0 && (
              <Pressable onPress={() => setSearchHistoryText('')}>
                <SvgXml xml={closeIconSm(colors.gray[400])} width={14} height={14} />
              </Pressable>
            )}
          </View>
        )}

        {/* History List */}
        <ScrollView
          style={styles.historyScroll}
          contentContainerStyle={styles.historyScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {!hasItems ? (
            <View style={styles.emptyStateContainer}>
              <SvgXml xml={clockOutlineIcon(colors.gray[300])} width={36} height={36} />
              <Typography
                variant="mediumTxtsm"
                color={colors.gray[600]}
                style={styles.emptyStateText}
              >
                No search history
              </Typography>
              <Typography
                variant="regularTxtxs"
                color={colors.gray[400]}
                style={styles.emptyStateSubtext}
              >
                Your talent search queries will appear here
              </Typography>
            </View>
          ) : sessions.length > 0 ? (
            processedSessions.map((sess) => {
              const isSelected = activeItem?.itemKey === sess.itemKey && dropdownVisible;

              return (
                <Pressable
                  key={sess.itemKey}
                  style={[
                    styles.historyItem,
                    isSelected && styles.historyItemActive,
                  ]}
                  onPress={() => {
                    onSelectHistory(sess.title, sess.sessionId);
                    onClose();
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={sess.title}
                >
                  <View style={styles.historyIconBox}>
                    <SvgXml
                      xml={sess.isPinned ? bookmarkPinIcon(brandColors[600] || '#4F46E5') : chatSparkleIcon(colors.gray[400])}
                      width={16}
                      height={16}
                    />
                  </View>

                  <View style={styles.historyTextContainer}>
                    <Typography
                      variant="regularTxtsm"
                      color={colors.gray[800]}
                      numberOfLines={1}
                      style={styles.historyText}
                    >
                      {sess.title}
                    </Typography>
                  </View>

                  {/* Three-dot Trigger Button */}
                  <Pressable
                    ref={(node) => {
                      triggerRefs.current[sess.itemKey] = node;
                    }}
                    style={[
                      styles.threeDotButton,
                      isSelected && styles.threeDotButtonActive,
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleOpenItemMenu(sess.title, sess.sessionId, sess.itemKey);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Options for ${sess.title}`}
                  >
                    <SvgXml
                      xml={horizontalThreedotIcon}
                      width={20}
                      height={20}
                    />
                  </Pressable>
                </Pressable>
              );
            })
          ) : (
            processedHistoryList.map((item) => {
              const isSelected = activeItem?.itemKey === item.itemKey && dropdownVisible;

              return (
                <Pressable
                  key={item.itemKey}
                  style={[
                    styles.historyItem,
                    isSelected && styles.historyItemActive,
                  ]}
                  onPress={() => {
                    onSelectHistory(item.title);
                    onClose();
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={item.title}
                >
                  <View style={styles.historyIconBox}>
                    <SvgXml
                      xml={item.isPinned ? bookmarkPinIcon(brandColors[600] || '#4F46E5') : chatSparkleIcon(colors.gray[400])}
                      width={16}
                      height={16}
                    />
                  </View>

                  <View style={styles.historyTextContainer}>
                    <Typography
                      variant="regularTxtsm"
                      color={colors.gray[800]}
                      numberOfLines={1}
                      style={styles.historyText}
                    >
                      {item.title}
                    </Typography>
                  </View>

                  {/* Three-dot Trigger Button */}
                  <Pressable
                    ref={(node) => {
                      triggerRefs.current[item.itemKey] = node;
                    }}
                    style={[
                      styles.threeDotButton,
                      isSelected && styles.threeDotButtonActive,
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleOpenItemMenu(item.title, undefined, item.itemKey);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Options for ${item.title}`}
                  >
                    <SvgXml
                      xml={horizontalThreedotIcon}
                      width={20}
                      height={20}
                    />
                  </Pressable>
                </Pressable>
              );
            })
          )}
        </ScrollView>

        {/* Drawer Footer */}
        {hasItems && (
          <View style={styles.drawerFooter}>
            <Pressable
              style={styles.clearAllButton}
              onPress={() => setIsClearConfirmVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Clear all search history"
            >
              <SvgXml xml={trashIcon} width={16} height={16} />
              <Typography variant="mediumTxtxs" color={colors.error[600]}>
                Clear All History
              </Typography>
            </Pressable>
          </View>
        )}
      </Animated.View>

      {/* ThreeDot Dropdown Menu */}
      <DropdownMenu
        visible={dropdownVisible}
        onClose={() => {
          setDropdownVisible(false);
          setActiveItem(null);
          setIsConfirmingDelete(false);
        }}
        position={dropdownPosition}
        items={menuItems}
        width={160}
        iconWidth={18}
        iconHight={18}
        dropdownStyle={styles.dropdownMenuCard}
      />

      {/* Rename Chat Modal */}
      <Modal
        transparent
        visible={renameModalVisible}
        animationType="fade"
        onRequestClose={handleCancelRename}
      >
        <Pressable
          style={styles.renameModalOverlay}
          onPress={handleCancelRename}
        >
          <Pressable
            style={styles.renameModalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <Typography
              variant="semiBoldTxtmd"
              color={colors.gray[900]}
              style={styles.renameModalTitle}
            >
              Rename chat
            </Typography>

            <TextInput
              value={renameInputText}
              onChangeText={setRenameInputText}
              placeholder="Enter new chat title..."
              placeholderTextColor={colors.gray[400]}
              style={styles.renameModalInput}
              autoFocus
              selectTextOnFocus
              returnKeyType="done"
              onSubmitEditing={handleSaveRename}
            />

            <View style={styles.renameModalButtonsRow}>
              <Pressable
                style={styles.renameModalCancelButton}
                onPress={handleCancelRename}
              >
                <Typography variant="mediumTxtsm" color={colors.gray[700]}>
                  Cancel
                </Typography>
              </Pressable>

              <Pressable
                style={styles.renameModalSaveButton}
                onPress={handleSaveRename}
              >
                <Typography variant="semiBoldTxtsm" color={colors.base.white}>
                  Save
                </Typography>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Clear Chat History Confirmation Modal */}
      <ConfirmModal
        visible={isClearConfirmVisible}
        title="Clear chat history"
        customHeaderIcon={<SvgXml xml={deleteRedIcon} width={20} height={20}/>}
        headerIconBgColor={colors.base.white}
        message={`Are you sure you want to clear all ${sessionCount} ${sessionCount === 1 ? 'chat' : 'chats'}? This action cannot be undone.`}
        confirmText="Clear history"
        cancelText="Cancel"
        reverseButtonOrder
        confirmButtonProps={{ startIcon: undefined }}
        onConfirm={() => {
          setIsClearConfirmVisible(false);
          onClearAllHistory();
        }}
        onCancel={() => setIsClearConfirmVisible(false)}
        onClose={() => setIsClearConfirmVisible(false)}
      />
    </>
  );
};

export default TalentSearchDrawer;

