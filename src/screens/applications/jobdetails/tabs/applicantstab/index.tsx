import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../../../../theme/colors";
import { useAppDispatch } from "../../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../../hooks/useAppSelector";

import {
  selectApplications,
  selectApplicationsLoading,
  selectApplicationsPagination,
  selectApplicationsHasMore,
  selectApplicationsFilters,
} from "../../../../../features/applications/selectors";

import {
  getApplicationsRequestAction,
  exportApplicationsRequestAction,
} from "../../../../../features/applications/actions";
import { setApplicationsFilters } from "../../../../../features/applications/slice";
import { Illustrations } from "../../../../../assets/svg/illustrations";
import { SvgXml } from "react-native-svg";
import { ApplicantList } from "../../../../../components/organisms";
import SearchBar from "../../../../../components/atoms/searchbar";
import { Divider } from "react-native-paper";
import { Typography } from "../../../../../components";
import BackgroundPattern from "../../../../../components/atoms/backgroundpattern";
import CustomSwitch from "../../../../../components/atoms/switchbutton";
import { useStyles } from "./styles";

const SKELETON_ROWS = 6;

const ApplicantsTab = () => {
  const styles = useStyles();
  const [aiEnabled, setAiEnabled] = useState(false);

  const dispatch = useAppDispatch();
  const applications = useAppSelector(selectApplications);
  const loading = useAppSelector(selectApplicationsLoading);
  const pagination = useAppSelector(selectApplicationsPagination);
  const hasMore = useAppSelector(selectApplicationsHasMore);
  const filters = useAppSelector(selectApplicationsFilters);

  const jobId = useAppSelector((state) => state.jobs.selectedJob?.id);
  const exportLoading = useAppSelector((state) => state.applications.loadingExportApplications);

  /** Matches GET /applications/v2/filter/ query keys (filter sheet → Redux → API). */
  const listFilterParams = useMemo(
    () => ({
      applicantName: filters.name.trim() || undefined,
      email: filters.email.trim() || undefined,
      jobTitle: filters.appliedFor.trim() || undefined,
      contact: filters.contact.trim() || undefined,
      source: filters.source.trim() || undefined,
      status: filters.status.trim() || undefined,
      latestStageName: filters.latestStageName.trim() || undefined,
      latestStageStatus: filters.latestStageStatus.trim() || undefined,
    }),
    [
      filters.name,
      filters.email,
      filters.appliedFor,
      filters.contact,
      filters.source,
      filters.status,
      filters.latestStageName,
      filters.latestStageStatus,
    ]
  );

  const onEndReachedCalledRef = useRef(false);
  useEffect(() => {
    if (!jobId) return;

    const sortValue = aiEnabled
      ? "-resume__resume_score__overall_score"
      : (filters.sort || "-last_updated");

    dispatch(
      getApplicationsRequestAction({
        reset: true,
        page: 1,
        limit: pagination.limit,
        jobId,
        sort: sortValue,
        ...listFilterParams,
      })
    );
  }, [
    listFilterParams,
    filters.sort,
    aiEnabled,
    jobId,
    pagination.limit,
    dispatch,
  ]);

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) return;

    // Use AI sort if enabled, otherwise use Redux filters.sort
    const sortValue = aiEnabled
      ? "-resume__resume_score__overall_score"
      : (filters.sort || "-last_updated");

    dispatch(
      getApplicationsRequestAction({
        page: pagination.page + 1,
        limit: pagination.limit,
        append: true,
        jobId,
        sort: sortValue,
        ...listFilterParams,
      })
    );
  }, [
    loading,
    hasMore,
    pagination.page,
    pagination.limit,
    listFilterParams,
    filters.sort,
    jobId,
    aiEnabled,
    dispatch,
  ]);

  const handleExport = useCallback(() => {
    if (!jobId || exportLoading) return;
    const sortForExport = aiEnabled
      ? "-resume_score"
      : filters.sort || "-last_updated";
    dispatch(
      exportApplicationsRequestAction({
        mode: "download",
        params: {
          page: 1,
          jobId,
          sort: sortForExport,
          ...listFilterParams,
        },
      })
    );
  }, [
    jobId,
    exportLoading,
    aiEnabled,
    filters.sort,
    listFilterParams,
    dispatch,
  ]);

  const dataSource = useMemo(() => {
    if (loading && applications.length === 0) {
      return Array.from({ length: SKELETON_ROWS }).map((_, i) => ({
        __skeleton: true,
        __id: `skeleton-${i}`,
      }));
    }
    return applications;
  }, [loading, applications, aiEnabled]);

  return (
    <View style={{ flex: 1 }}>
      {/* 🔍Top Search + Switch */}
      <View style={{ paddingHorizontal: 16, gap: 4, paddingVertical: 16 }}>
        <SearchBar
          value={filters.name}
          placeholder="User search by name"
          onChangeText={(v) =>
            dispatch(setApplicationsFilters({ name: v }))
          }
        />
        <View style={{ flexDirection: 'row', justifyContent: "space-between",alignItems:'center' }}>
          <View style={styles.switchContainer}>
            <CustomSwitch value={aiEnabled} onValueChange={setAiEnabled} />
            <Typography variant="H4" color={colors.mainColors.carbonGray}>
              AI recommendation
            </Typography>
          </View>
          <TouchableOpacity onPress={handleExport} disabled={!jobId || exportLoading}>
            <Typography
              variant="H4"
              color={!jobId || exportLoading ? colors.gray[400] : colors.brand[600]}
            >
              {exportLoading ? "Exporting…" : "+ Export"}
            </Typography>
          </TouchableOpacity>
        </View>
      </View>

      <Divider />
      {/* {!loading && applications.length === 0 && (
        <View
          style={{
            alignItems: "center",
            marginTop: 60,
            backgroundColor:colors.base.white
          }}
        >
          <Typography variant="semiBoldTxtmd">
            No results found
          </Typography>
          <Typography
            variant="regularTxtsm"
            color={colors.gray[500]}
            style={{ marginTop: 6, textAlign: "center" }}
          >
            Try adjusting your search or filters
          </Typography>
        </View>
      )} */}

      {/* 📄List */}
      <FlatList
        data={dataSource}
        keyExtractor={(item: any) =>
          item.__skeleton ? item.__id : String(item.id)
        }
        renderItem={({ item }) =>
          item.__skeleton ? (
            <ApplicantList loading />
          ) : (
            <ApplicantList item={item} />
          )
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 16,
          gap: 16,
          flexGrow: 1, //REQUIRED for vertical centering
          backgroundColor: colors.common.slightlygray,
        }}
        bounces={false}
        onEndReached={() => {
          if (!onEndReachedCalledRef.current) {
            handleLoadMore();
            onEndReachedCalledRef.current = true;
          }
        }}
        onMomentumScrollBegin={() => {
          onEndReachedCalledRef.current = false;
        }}
        onEndReachedThreshold={0.5}

        ListEmptyComponent={
          !loading ? (
            <BackgroundPattern bgStyle={{
              height: '100%',
              width: '100%',
              top: -90,
              //zIndex: 10
            }}>
              <View style={{ flex: 1, alignSelf: 'center', alignContent: 'center', justifyContent: "center", }}>
                <View
                  style={{
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    zIndex: 10,
                    marginBottom: 10,
                  }}
                >
                  <SvgXml xml={Illustrations} style={{ zIndex: -1, }} />
                  <Typography variant="semiBoldTxtmd">
                    No results found
                  </Typography>

                  <Typography
                    variant="regularTxtsm"
                    color={colors.gray[500]}
                    style={{ textAlign: 'center' }}
                  >
                    Try adjusting your search or filters
                  </Typography>
                </View>
                {/* <Button
                  buttonColor={colors.mainColors.slateBlue}
                  textColor={colors.common.white}
                  borderColor={colors.mainColors.borderColor}
                  borderRadius={8}
                  borderWidth={1}
                  size={'Medium'}
                  onPress={() => { }}
                >
                  Add new job
                </Button> */}
              </View>
            </BackgroundPattern >
          ) : null
        }
      />
    </View>
  );
};

export default ApplicantsTab;
