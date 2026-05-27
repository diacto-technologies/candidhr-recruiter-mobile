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

    // Update underline if this is the active tab
    if (activeTab === tabs[index]) {
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

  const handlePress = (label: string, index: number) => {
    onChangeTab(label, index);
  };

  useEffect(() => {
    const index = tabs.indexOf(activeTab);
    if (tabLayouts[index]) {
      animateToTab(index);
    }
  }, [activeTab]);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.tabRow}>
        {tabs.map((item, index) => {
          const isActive = item === activeTab;
          const count = typeof counts[item] === "number" ? counts[item] : null;

          return (
            <TouchableOpacity
              key={index}
              onLayout={(e) => onTabLayout(e, index)}
              onPress={() => handlePress(item, index)}
              style={styles.tabBtn}
            >
              <View style={styles.tabInner}>
                <Typography
                  variant="semiBoldTxtsm"
                  color={isActive ? colors.brand[700] : colors.gray[500]}
                >
                  {item}
                </Typography>
                {typeof count === "number" &&(
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
