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

interface TabLayout {
  x: number;
  width: number;
}

interface Props {
  tabs: string[];
  activeTab: string;
  onChangeTab: (label: string, index: number) => void;
}

const SlideAnimatedTab: React.FC<Props> = ({
  tabs,
  activeTab,
  onChangeTab,
}) => {
  const underlineX = useRef(new Animated.Value(0)).current;
  const underlineWidth = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const tabLayouts = useRef<TabLayout[]>([]).current;
  const initialized = useRef(false);

  // For layout capturing
  const onTabLayout = (e: LayoutChangeEvent, index: number) => {
    const { x, width } = e.nativeEvent.layout;
    tabLayouts[index] = { x, width };

    // Set initial underline
    if (activeTab === tabs[index] && !initialized.current) {
      underlineX.setValue(x);
      underlineWidth.setValue(width);
      initialized.current = true;
    }
  };

  const animateToTab = (index: number) => {
    const { x, width } = tabLayouts[index];

    Animated.parallel([
      Animated.spring(underlineX, {
        toValue: x,
        useNativeDriver: false,
      }),
      Animated.spring(underlineWidth, {
        toValue: width,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = (label: string, index: number) => {
    fadeAnim.setValue(0);
    onChangeTab(label, index);
    animateToTab(index);
  };

  // Re-align underline when activeTab changes
  useEffect(() => {
    const index = tabs.indexOf(activeTab);
    if (tabLayouts[index]) {
      animateToTab(index);
    }
  }, [activeTab]);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <View style={styles.tabRow}>
      {tabs.map((item, index) => (
        <TouchableOpacity
          key={index}
          onLayout={(e) => onTabLayout(e, index)}
          onPress={() => handlePress(item, index)}
          style={styles.tabBtn}
        >
          <Typography
            variant="H4"
            color={activeTab === item ? colors.brand[700] :colors.gray[500]}
          >
            {item}
          </Typography>
        </TouchableOpacity>
      ))}

      {/* Animated Underline */}
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

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 12,
    position: "relative",
  },
  tabBtn: {
    paddingBottom: 12,
    paddingHorizontal: 8,
  },
  underline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 3,
    backgroundColor:colors.brand[700],
  },
});
