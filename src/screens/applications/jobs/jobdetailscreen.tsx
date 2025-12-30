import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Text,
} from "react-native";

import OverviewTab from "../../../components/organisms/jobs/overviewtab";
import ApplicantsTab from "../../../components/organisms/jobs/applicantstab";
import Header from "../../../components/organisms/header";
import { goBack } from "../../../utils/navigationUtils";
import SortingAndFilter from "../../../components/organisms/sortingandfilter";
import { filtersOption } from "../../../utils/dummaydata";
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
import { useRoute } from "@react-navigation/native";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { selectJobsLoading, selectSelectedJob } from "../../../features/jobs/selectors";
import { getJobDetailRequestAction } from "../../../features/jobs/actions";
import { setApplicationsFilters } from "../../../features/applications/slice";
import { getApplicationsRequestAction } from "../../../features/applications/actions";
import { selectApplicationsPagination } from "../../../features/applications/selectors";

const tabs: string[] = ["Overview", "Applicants", "Import candidates"];

const JobDetailScreen: React.FC = () => {
  const route = useRoute();
  const { jobId } = route.params as { jobId: string };
  const styles = useStyles();
  const [filterSheet, setFilterSheet] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const dispatch = useAppDispatch();
  const pagination = useAppSelector(selectApplicationsPagination);
  const job_Id = useAppSelector((state) => state.jobs.selectedJob?.id);

  useEffect(() => {
    if (!jobId) return;
  
    dispatch(getJobDetailRequestAction(jobId));
  
    dispatch(
      getApplicationsRequestAction({
        reset: true,
        page: 1,
        limit: pagination.limit,
      })
    );
  }, [jobId, dispatch]);
  
  
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
  const handleClearAllFilters = () => {
    dispatch(setApplicationsFilters({ name: "" , email:"" , AppliedFor:"", contact:""}))
    setFilterSheet(false)
  }

  return (
    <CustomSafeAreaView>
      <Header backNavigation={true} onBack={goBack} edit threedot />
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
        onClearAll={handleClearAllFilters}
      >
        <FilterSheetContent
          onCancel={() => setFilterSheet(false)}
          onApply={() => setFilterSheet(false)}
          onClearAll={() => console.log("Clear all")}
          job_Id={job_Id}
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
            onPress: () => console.log("Copy"),
            startIcon: <SvgXml xml={copyIcon} />,
          }}
        />
      </View>
    </CustomSafeAreaView>
  );
};

export default JobDetailScreen;
