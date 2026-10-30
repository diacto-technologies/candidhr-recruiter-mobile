import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import Typography from '../../../../components/atoms/typography';
import { SvgXml } from 'react-native-svg';
import { colors } from '../../../../theme/colors';
import { useBrandTheme } from '../../../../hooks/useBrandTheme';
import { sparkles } from '../../../../assets/svg/sparkles';
import { modalCloseIcon, closeIconSm } from '../../../../assets/svg/closeicon';
import { trashIcon } from '../../../../assets/svg/trash';
import {
  clockOutlineIcon,
  plusIconSvg,
  chatSparkleIcon,
} from './talentSearchIcons';
import { CopilotSessionItem } from '../../../../features/copilot/types';
import { useStyles, DRAWER_WIDTH } from './TalentSearchDrawer.styles';

interface TalentSearchDrawerProps {
  visible: boolean;
  onClose: () => void;
  historyList?: string[];
  sessions?: CopilotSessionItem[];
  onSelectHistory: (query: string, sessionId?: string) => void;
  onRemoveHistoryItem: (query: string, sessionId?: string) => void;
  onClearAllHistory: () => void;
  onNewSearch: () => void;
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
}) => {
  const { brandColors } = useBrandTheme();
  const styles = useStyles(brandColors);
  const animVal = useRef(new Animated.Value(0)).current;
  const [isMounted, setIsMounted] = useState(visible);

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

        {/* Section Label */}
        <Typography
          variant="semiBoldTxtxs"
          color={colors.gray[400]}
          style={styles.sectionLabel}
        >
          RECENT SEARCHES
        </Typography>

        {/* History List */}
        <ScrollView
          style={styles.historyScroll}
          contentContainerStyle={styles.historyScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {sessions.length === 0 && historyList.length === 0 ? (
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
            sessions.map((sess, index) => {
              const title = (sess.title || sess.query || sess.name || 'Untitled Search').trim();
              const sessionId = String(sess.id);
              return (
                <Pressable
                  key={sessionId || `drawer-sess-${index}`}
                  style={styles.historyItem}
                  onPress={() => {
                    onSelectHistory(title, sessionId);
                    onClose();
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={title}
                >
                  <View style={styles.historyIconBox}>
                    <SvgXml xml={chatSparkleIcon(colors.gray[400])} width={16} height={16} />
                  </View>

                  <View style={styles.historyTextContainer}>
                    <Typography
                      variant="regularTxtsm"
                      color={colors.gray[800]}
                      numberOfLines={1}
                    >
                      {title}
                    </Typography>
                  </View>

                  <Pressable
                    style={styles.deleteItemButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      onRemoveHistoryItem(title, sessionId);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${title}`}
                  >
                    <SvgXml xml={closeIconSm(colors.gray[400])} width={12} height={12} />
                  </Pressable>
                </Pressable>
              );
            })
          ) : (
            historyList.map((item, index) => (
              <Pressable
                key={`drawer-item-${index}`}
                style={styles.historyItem}
                onPress={() => {
                  onSelectHistory(item);
                  onClose();
                }}
                accessibilityRole="button"
                accessibilityLabel={item}
              >
                <View style={styles.historyIconBox}>
                  <SvgXml xml={chatSparkleIcon(colors.gray[400])} width={16} height={16} />
                </View>

                <View style={styles.historyTextContainer}>
                  <Typography
                    variant="regularTxtsm"
                    color={colors.gray[800]}
                    numberOfLines={1}
                  >
                    {item}
                  </Typography>
                </View>

                <Pressable
                  style={styles.deleteItemButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    onRemoveHistoryItem(item);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${item}`}
                >
                  <SvgXml xml={closeIconSm(colors.gray[400])} width={12} height={12} />
                </Pressable>
              </Pressable>
            ))
          )}
        </ScrollView>

        {/* Drawer Footer */}
        {(sessions.length > 0 || historyList.length > 0) && (
          <View style={styles.drawerFooter}>
            <Pressable
              style={styles.clearAllButton}
              onPress={onClearAllHistory}
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
    </>
  );
};

export default TalentSearchDrawer;
