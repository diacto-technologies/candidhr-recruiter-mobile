import React, { useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
} from "react-native";
import { Typography } from "../../atoms";
import { colors } from "../../../theme/colors";
import { ScrollView } from "react-native-gesture-handler";
import { Props, TabLayout } from "./slideanimatedtab";
import { useStyles } from "./styles";

const getTabKey = (item: any, index: number): string => {
  if (typeof item === 'string') return item;
  return item?.key ?? item?.label ?? String(index);
};

const getTabLabel = (item: any): string => {
  if (typeof item === 'string') return item;
  return item?.label ?? item?.key ?? '';
};

const SlideAnimatedTab: React.FC<Props> = ({
  tabs,
  activeTab,
  onChangeTab,
  counts = {},
}) => {
  const underlineX = useRef(new Animated.Value(0)).current;
  const underlineWidth = useRef(new Animated.Value(0)).current;
  const styles = useStyles();

  const tabLayouts = useRef<TabLayout[]>([]).current;
  const initialized = useRef(false);

  const onTabLayout = (e: LayoutChangeEvent, index: number) => {
    const { x, width } = e.nativeEvent.layout;
    tabLayouts[index] = { x, width };

    const itemKey = getTabKey(tabs[index], index);
    const itemLabel = getTabLabel(tabs[index]);
    // Update underline if this is the active tab
    if (activeTab === itemKey || activeTab === itemLabel) {
      if (!initialized.current) {
        // Initial setup - set immediately without animation
        underlineX.setValue(x);
        underlineWidth.setValue(width);
        initialized.current = true;
      } else {
        // Layout changed (e.g., counts loaded) - animate to new position
        animateToTab(index);
      }
    }
  };

  const animateToTab = (index: number) => {
    const layout = tabLayouts[index];
    if (!layout) return;
    
    const { x, width } = layout;

    Animated.parallel([
      Animated.spring(underlineX, {
        toValue: x,
        useNativeDriver: false,
      }),
      Animated.spring(underlineWidth, {
        toValue: width,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePress = (item: any, index: number) => {
    const key = getTabKey(item, index);
    onChangeTab(key, index);
  };

  useEffect(() => {
    const index = tabs.findIndex(
      (t, idx) => getTabKey(t, idx) === activeTab || getTabLabel(t) === activeTab
    );
    if (index !== -1 && tabLayouts[index]) {
      animateToTab(index);
    }
  }, [activeTab, tabs]);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.tabRow}>
        {tabs.map((item, index) => {
          const itemKey = getTabKey(item, index);
          const itemLabel = getTabLabel(item);
          const isActive = itemKey === activeTab || itemLabel === activeTab;
          const count =
            typeof counts[itemKey] === "number"
              ? counts[itemKey]
              : typeof counts[itemLabel] === "number"
              ? counts[itemLabel]
              : null;

          return (
            <TouchableOpacity
              key={`${itemKey}-${index}`}
              onLayout={(e) => onTabLayout(e, index)}
              onPress={() => handlePress(item, index)}
              style={styles.tabBtn}
            >
              <View style={styles.tabInner}>
                <Typography
                  variant="semiBoldTxtsm"
                  color={isActive ? colors.brand[700] : colors.gray[500]}
                >
                  {itemLabel}
                </Typography>
                {typeof count === "number" && (
                  <View
                    style={[
                      styles.countBadge,
                      isActive ? styles.countActive : styles.countInactive,
                    ]}
                  >
                    <Typography
                      variant="mediumTxtxs"
                      color={isActive ? colors.brand[700] : colors.gray[700]}
                    >
                      {count}
                    </Typography>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* ANIMATED UNDERLINE */}
        <Animated.View
          style={[
            styles.underline,
            {
              transform: [{ translateX: underlineX }],
              width: underlineWidth,
            },
          ]}
        />
      </View>
    </ScrollView>
  );
};

export default SlideAnimatedTab;
