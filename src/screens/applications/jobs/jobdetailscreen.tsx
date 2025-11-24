import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Animated 
} from "react-native";

import OverviewTab from "../../../components/organisms/jobs/overviewtab";
import ApplicantsTab from "../../../components/organisms/jobs/applicantstab";
import Header from "../../../components/organisms/header";
import { goBack } from "../../../utils/navigationUtils";
import ImportCandidatesTab from "../../../components/organisms/jobs/ importcandidatestab";
import JobHeader from "../../../components/organisms/jobs/jobheader";

const tabs = ["Overview", "Applicants", "Import candidates"];

const JobDetailScreen = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const underlineAnim = useRef(new Animated.Value(0)).current;

  const tabWidth = 120; // Adjust based on design

  const animateTab = (index: number) => {
    // Fade effect
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();

    // Underline slider
    Animated.spring(underlineAnim, {
      toValue: index * tabWidth,
      useNativeDriver: false,
    }).start();
  };

  const onTabPress = (item: React.SetStateAction<string>, index: number) => {
    setActiveTab(item);
    animateTab(index);
  };

  const renderTabScreen = () => {
    switch (activeTab) {
      case "Overview":
        return <OverviewTab />;
      case "Applicants":
        return <ApplicantsTab />;
      case "Import candidates":
        return <ImportCandidatesTab />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header backNavigation={true} onBack={() => goBack()} />

      <ScrollView>
        {activeTab !== "Applicants" ? <JobHeader /> : null}

        {/* Tabs */}
        <View style={styles.tabRow}>
          {tabs.map((item, index) => (
            <TouchableOpacity
              key={item}
              onPress={() => onTabPress(item, index)}
              style={[
                styles.tabBtn,
                { width: tabWidth, alignItems: "center" },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === item && styles.activeTabText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Animated underline */}
        <Animated.View
          style={[
            styles.underline,
            { width: tabWidth, transform: [{ translateX: underlineAnim }] },
          ]}
        />

        {/* Fade Animated Screens */}
        <Animated.View style={{ opacity: fadeAnim, }}>
          {renderTabScreen()}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default JobDetailScreen;

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 10,
    position: "relative",
  },
  tabBtn: {
    paddingBottom: 10,
  },
  tabText: {
    //fontSize: 15,
    color: "#6B7280",
  },
  activeTabText: {
    color: "#4F46E5",
    fontWeight: "600",
  },
  underline: {
    height: 2,
    backgroundColor: "#4F46E5",
    marginLeft: 16,
    marginTop: -2,
  },
});
