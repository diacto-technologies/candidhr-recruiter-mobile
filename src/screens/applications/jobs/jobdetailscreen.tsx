import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Text,
  Platform,
  ToastAndroid,
} from "react-native";

import OverviewTab from "../../../components/organisms/jobs/overviewtab";
import ApplicantsTab from "../../../components/organisms/jobs/applicantstab";
import Header from "../../../components/organisms/header";
import { goBack } from "../../../utils/navigationUtils";
import SortingAndFilter from "../../../components/organisms/sortingandfilter";
import { applicantFiltersOption} from "../../../utils/dummaydata";
import { BottomSheet, FilterSheetContent, StatusBar, Typography } from "../../../components";
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
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CustomSafeAreaView from "../../../components/atoms/customsafeareaview";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { selectJobsLoading, selectSelectedJob } from "../../../features/jobs/selectors";
import { getJobDetailRequestAction } from "../../../features/jobs/actions";
import { setApplicationsFilters, setSort } from "../../../features/applications/slice";
import { getApplicationsRequestAction } from "../../../features/applications/actions";
import { selectApplicationsFilters, selectApplicationsPagination } from "../../../features/applications/selectors";
import Clipboard from "@react-native-clipboard/clipboard";
import { showToastMessage } from "../../../utils/toast";
import { organizationalOrigin } from "../../../features/auth";
import { store } from "../../../store";

const tabs: string[] = ["Overview", "Applicants"];

const JobDetailScreen: React.FC = () => {
  const route = useRoute();
  const { jobId } = route.params as { jobId: string };
  const styles = useStyles();
  const [filterSheet, setFilterSheet] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState('Name');
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const dispatch = useAppDispatch();
  const pagination = useAppSelector(selectApplicationsPagination);
  const isFocused = useIsFocused();
  const filters = useAppSelector(selectApplicationsFilters);
  const jobs = useAppSelector(selectSelectedJob);

  useEffect(() => {
    if (!jobId) return;
    dispatch(getJobDetailRequestAction(jobId));
  }, [jobId]);

  useEffect(() => {
    if (isFocused && activeTab === 'Applicants') {
      dispatch(setApplicationsFilters({
        name: "",
        email: "",
        appliedFor: "", // Fixed: was "AppliedFor" (wrong case)
        contact: ""
      }));
    }
  }, [isFocused, activeTab]);

  const handleApplyFilters = () => {
    setFilterSheet(false);
  }
  
  const handleSort = (item: string) => {
    const isSortable = item === 'Applied' || item === 'Last Update';
  
    if (isSortable) {
      const isSameField = filters.sortBy === item;
  
      dispatch(setSort({
        sortBy: item,
        sortDir: isSameField
          ? (filters.sortDir === 'desc' ? 'asc' : 'desc')   
          : 'desc',                                         
      }));
    } else {
      setSelectedTab(item);
      setFilterSheet(true)
    }
  };
  
  const renderTabScreen = () => {
    switch (activeTab) {
      case "Overview":
        return <OverviewTab />;
      case "Applicants":
        return <ApplicantsTab />;
      default:
        return null;
    }
  };
  const handleClearAllFilters = () => {
    dispatch(setApplicationsFilters({ name: "", email: "", appliedFor: "", contact: "" })); // Fixed: was "AppliedFor"
    setFilterSheet(false);
  }

  const handleCopyUrl = () => {
    if (!jobs?.encrypted) {
      showToastMessage('Job Form URL not available', 'error');
      return;
    }
  
    const url = `${organizationalOrigin(store.getState())}/app/candidate/${jobs.encrypted}/`;
  
    Clipboard.setString(url);
  
    showToastMessage('Job Form URL copied to clipboard', 'success');
  };

  return (
    <CustomSafeAreaView>
      <Header backNavigation={true} onBack={goBack}/>
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
        options={applicantFiltersOption}
        onPressFilter={() => setFilterSheet(true)}
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
         onItemPress={(t)=>{handleSort(t)}}/>

      <BottomSheet
        visible={filterSheet}
        onClose={() => setFilterSheet(false)}
        onClearAll={() => handleClearAllFilters()}
        title="Filter by"
        showHeadline
      >
        <FilterSheetContent
          onCancel={() => setFilterSheet(false)}
          onApply={handleApplyFilters}
          onClearAll={() => setFilterSheet(false)}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          job_Id={""}
          filtersConfig={applicantFiltersOption} 
          mode={"applicant"}       
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
            borderColor: colors.error[300],
            borderRadius: styles.leftButton.borderRadius,
            borderWidth: 1,
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
            borderWidth: 1,
            borderRadius: styles.rightButton.borderRadius,
            onPress:handleCopyUrl,
            startIcon: <SvgXml xml={copyIcon} />,
          }}
        />
      </View>
    </CustomSafeAreaView>
  );
};

export default JobDetailScreen;
