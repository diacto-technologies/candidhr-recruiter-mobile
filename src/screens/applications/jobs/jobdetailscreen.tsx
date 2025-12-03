import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
} from "react-native";

import OverviewTab from "../../../components/organisms/jobs/overviewtab";
import ApplicantsTab from "../../../components/organisms/jobs/applicantstab";
import Header from "../../../components/organisms/header";
import { goBack } from "../../../utils/navigationUtils";
import SortingAndFilter from "../../../components/organisms/sortingandfilter";
import { filtersOption } from "../../../utils/dummaydata";
import { BottomSheet, FilterSheetContent, Typography } from "../../../components";
import ImportCandidatesTab from "../../../components/organisms/jobs/ importcandidatestab";
import JobHeader from "../../../components/organisms/jobs/jobheader/jobheader";
import { colors } from "../../../theme/colors";
import FooterButtons from "../../../components/molecules/footerbuttons";
import { SvgXml } from "react-native-svg";
import { pluscircle } from "../../../assets/svg/pluscircle";
import { copyIcon } from "../../../assets/svg/copy";
import Icon from "../../../components/atoms/vectoricon";
import SlideAnimatedTab from "../../../components/molecules/slideanimatedtab";
import { useStyles } from "./jobdetailscreen.styles";

const tabs: string[] = ["Overview", "Applicants", "Import candidates"];

const JobDetailScreen: React.FC = () => {
  const styles = useStyles();
  const [filterSheet, setFilterSheet] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const fadeAnim = useRef(new Animated.Value(1)).current;
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
      <Header backNavigation={true} onBack={goBack} />
      {activeTab !== "Applicants" && <JobHeader />}
      <View style={styles.tabContainer}>
        <SlideAnimatedTab
          tabs={tabs}
          activeTab={activeTab}
          onChangeTab={(label) => setActiveTab(label)}
        />

        <View style={styles.bottomBorder} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
            {renderTabScreen()}
          </Animated.View>
        </View>
      </View>
      <SortingAndFilter
        title="Filters"
        options={filtersOption}
        onPressFilter={() => setFilterSheet(true)}
      />
      <BottomSheet
        visible={filterSheet}
        onClose={() => setFilterSheet(false)}
        title="Filter by"
        showHeadline
      >
        <FilterSheetContent
          onCancel={() => setFilterSheet(false)}
          onApply={() => setFilterSheet(false)}
          onClearAll={() => console.log("Clear all")}
        />
      </BottomSheet>
      <View>
        <FooterButtons
          leftButtonProps={{
            children: "Unpublish",
            variant: "contain",
            size: 44,
            buttonColor: styles.leftButton.backgroundColor,
            textColor: styles.leftButtonText.color,
            borderColor: styles.leftButton.borderColor,
            borderRadius: styles.leftButton.borderRadius,
            onPress: () => console.log("Unpublish"),
            startIcon: (
              <Icon
                size={20}
                name={"close"}
                iconFamily={"AntDesign"}
                color={styles.iconRed.color}
              />
            ),
          }}
          rightButtonProps={{
            children: "Copy URL",
            variant: "contain",
            size: 44,
            buttonColor: styles.rightButton.backgroundColor,
            textColor: styles.rightButtonText.color,
            borderColor: styles.rightButton.borderColor,
            borderRadius: styles.rightButton.borderRadius,
            onPress: () => console.log("Copy"),
            startIcon: <SvgXml xml={copyIcon} />,
          }}
        />
      </View>
    </View>
  );
};

export default JobDetailScreen;
