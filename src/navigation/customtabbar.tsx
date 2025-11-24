import React, { FC, useState } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  Text,
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
import { screenWidth } from "../utils/devicelayout";
import { menuItems } from "../utils/dummaydata";

const CustomTabBar: FC<BottomTabBarProps> = (props) => {
  const bottom = useSafeAreaInsets();
  const { state, navigation } = props;

  // State to control dropdown visibility
  const [dropdownVisible, setDropdownVisible] = useState(false);

  if (state.routes[state.index].name === "Profile") {
    return null;
  }

  const openAssessment = () => {
    setDropdownVisible(false);
    // navigation.navigate("Assessment"); // ← your route here
    console.log("Navigate to Assessment");
  };

  const openVideoInterview = () => {
    setDropdownVisible(false);
    // navigation.navigate("VideoInterview");
    console.log("Navigate to Video Interview");
  };

  return (
    <View
      style={{
        flexDirection: "column",
        backgroundColor: Colors.background,
        height:68,
        paddingBottom: bottom.bottom,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
        paddingVertical: 8,
      }}
    >
      {/* Main Tab Icons */}
      <View
        style={{
          width: screenWidth * 0.75,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: 20,
        }}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            if (!isFocused) navigation.navigate(route.name);
          };

          return (
            <ScalePress
              key={index}
              onPress={onPress}
              styles={{ alignItems: "center" }}
            >
              {route.name === "Dashboard" && <DashboardTabIcon focused={isFocused} />}
              {route.name === "JobsScreen" && <JobsTabIcon focused={isFocused} />}
              {route.name === "ApplicantScreen" && <ApplicantTabIcon focused={isFocused} />}
              {route.name === "Profile" && <ProfileTabIcon focused={isFocused} />}
            </ScalePress>
          );
        })}
      </View>

      {/* Three Dots Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 20,
          top: 22,
          padding: 8,
          zIndex: 10,
        }}
        activeOpacity={0.7}
        onPress={() => setDropdownVisible(true)}
      >
        <SvgXml xml={horizontalThreedotIcon} height={24} width={24} />
      </TouchableOpacity>

      {/* Custom Dropdown Modal */}
      <ThreeDotDropdown
        visible={dropdownVisible}
        onClose={() => setDropdownVisible(false)}
        menuItems={menuItems as []}
        top={660} 
        right={35}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  dropdownContainer: {
    position: "absolute",
    top: 100,           // adjust this if needed (distance from top)
    right: 20,           // same as three-dots button
    backgroundColor: "white",
    borderRadius: 12,
    width: 200,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  dropdownTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  divider: {
    height: 0.5,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
  },
});

export default CustomTabBar;