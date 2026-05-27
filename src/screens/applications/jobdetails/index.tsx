import React from "react";
import { View, Pressable } from "react-native";
import { AppHeader } from "../../../components";
import { goBack } from "../../../utils/navigationUtils";
import SortingAndFilter from "../../../components/organisms/sortingandfilter";
import { applicantFiltersOption } from "../../../utils/dummaydata";
import { BottomSheet, StatusBar, Typography } from "../../../components";
import ApplicantFilterSheet from "../applicant/components/ApplicantFilterSheet";
import JobHeader from "../../../components/organisms/jobs/jobheader/jobheader";
import { colors } from "../../../theme/colors";
import FooterButtons from "../../../components/molecules/footerbuttons";
import { SvgXml } from "react-native-svg";
import { copyIcon } from "../../../assets/svg/copy";
import { backButtonIcon } from "../../../assets/svg/backbutton";
import Icon from "../../../components/atoms/vectoricon";
import SlideAnimatedTab from "../../../components/molecules/slideanimatedtab";
import { useStyles } from "./styles";
import CustomSafeAreaView from "../../../components/atoms/customsafeareaview";
import ApplicantsTab from "./tabs/applicantstab";
import OverviewTab from "./tabs/overviewtab";
import { screenHeight } from "../../../utils/devicelayout";
import { useJobDetailsController, TABS } from "./hooks/useJobDetailsController";

const TAB_OPTIONS = [TABS.OVERVIEW, TABS.APPLICANTS];

const TAB_SCREENS = {
  [TABS.OVERVIEW]: OverviewTab,
  [TABS.APPLICANTS]: ApplicantsTab,
};

const JobDetailScreen: React.FC = () => {
  const styles = useStyles();
  const ctrl = useJobDetailsController();

  const ActiveTabComponent = TAB_SCREENS[ctrl.activeTab] || null;

  return (
    <CustomSafeAreaView>
      <AppHeader 
        left={
          <Pressable onPress={goBack} style={{ padding: 8, marginLeft: -8 }}>
            <SvgXml xml={backButtonIcon} />
          </Pressable>
        } 
      />
      {ctrl.activeTab !== TABS.APPLICANTS && <JobHeader />}
      
      <View style={styles.tabContainer}>
        <SlideAnimatedTab
          tabs={TAB_OPTIONS}
          activeTab={ctrl.activeTab}
          onChangeTab={(label) => ctrl.setActiveTab(label as typeof TABS[keyof typeof TABS])}
        />
        <View style={styles.bottomBorder} />
      </View>
      
      <View style={{ flex: 1 }}>
        {ActiveTabComponent && <ActiveTabComponent />}
      </View>

      <SortingAndFilter
        title="Filters"
        options={applicantFiltersOption}
        onPressFilter={() => ctrl.setIsFilterSheetVisible(true)}
        setSelectedTab={ctrl.setSelectedTab}
        selectedTab={ctrl.selectedTab}
        onItemPress={ctrl.handleSort} 
      />

      <BottomSheet
        visible={ctrl.isFilterSheetVisible}
        onClose={() => ctrl.setIsFilterSheetVisible(false)}
        onClearAll={ctrl.handleClearAllFilters}
        title="Filter by"
        showHeadline 
        hight={screenHeight * 0.8}
      >
        <ApplicantFilterSheet
          onCancel={() => ctrl.setIsFilterSheetVisible(false)}
          onApply={ctrl.handleApplyFilters}
          onClearAll={ctrl.handleClearAllFilters}
          selectedTab={ctrl.selectedTab}
          setSelectedTab={ctrl.setSelectedTab}
        />
      </BottomSheet>

      <View>
        <FooterButtons
          leftButtonProps={{
            children: ctrl.isPublished ? "Unpublish" : "Publish",
            variant: "contain",
            size: 44,
            buttonColor: ctrl.isPublished ? styles.leftButton.backgroundColor : undefined,
            textColor: ctrl.isPublished ? styles.leftButtonText.color : undefined,
            borderColor: ctrl.isPublished ? colors.error[300] : undefined,
            borderRadius: styles.leftButton.borderRadius,
            borderWidth: ctrl.isPublished ? 1 : 0,
            onPress: ctrl.handlePublishToggle,
            startIcon: (
              <Icon
                size={20}
                name={ctrl.isPublished ? "close" : "check"}
                iconFamily={"AntDesign"}
                color={ctrl.isPublished ? styles.iconRed.color : colors.base.white}
              />
            ),
            disabled: !ctrl.canPublish || ctrl.jobsLoading || !ctrl.selectedJob,
          }}
          rightButtonProps={{
            children: "Copy URL",
            variant: "contain",
            size: 44,
            buttonColor: styles.rightButton.backgroundColor,
            textColor: styles.rightButtonText.color,
            borderColor: styles.rightButton.borderColor,
            borderWidth: 1,
            borderRadius: styles.rightButton.borderRadius,
            onPress: ctrl.handleCopyUrl,
            startIcon: <SvgXml xml={copyIcon} />,
          }}
        />
      </View>
    </CustomSafeAreaView>
  );
};

export default JobDetailScreen;
