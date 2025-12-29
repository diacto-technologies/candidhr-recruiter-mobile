import React, { FC, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ProfileTabIcon,
  ApplicantTabIcon,
  DashboardTabIcon,
  JobsTabIcon,
} from "./TabIcon";
import { ScalePress, ThreeDotDropdown } from "../components";
import { Colors } from "../utils/constants";
import { SvgXml } from "react-native-svg";
import { horizontalThreedotIcon } from "../assets/svg/horizontalthreedoticon";
import { menuItems } from "../utils/dummaydata";

const CustomTabBar: FC<BottomTabBarProps> = (props) => {
  const bottom = useSafeAreaInsets();
  const { state, navigation } = props;

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  // hide on profile
  if (state.routes[state.index].name === "Profile") {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: bottom.bottom > 0 ? bottom.bottom : 10 }
      ]}
    >
      {/* Tab Icons */}
      <View style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            if (!isFocused) navigation.navigate(route.name);
          };

          return (
            <ScalePress key={index} onPress={onPress} styles={styles.iconWrapper}>
              {route.name === "Dashboard" && <DashboardTabIcon focused={isFocused} />}
              {route.name === "JobsScreen" && <JobsTabIcon focused={isFocused} />}
              {route.name === "ApplicantScreen" && <ApplicantTabIcon focused={isFocused} />}
              {route.name === "Profile" && <ProfileTabIcon focused={isFocused} />}
            </ScalePress>
          );
        })}

        {/* Three-dot */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setDropdownVisible(true)}
        >
          <SvgXml xml={horizontalThreedotIcon} height={24} width={24} />
        </TouchableOpacity>
      </View>

      {/* Dropdown */}
      <ThreeDotDropdown
        visible={dropdownVisible}
        onClose={() => setDropdownVisible(false)}
        menuItems={menuItems as []}
        top={bottom.top +600}
        right={40}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: '#0A0D12',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 10,
    elevation: 6,
  },

  tabRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around", // <-- responsive spacing
    alignItems: "center",
  },

  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CustomTabBar;
