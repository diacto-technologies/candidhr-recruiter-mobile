import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import ApplicantList from "../applicantlist";
import SearchBar from "../../atoms/searchbar";
import CustomSwitch from "../../atoms/switchbutton";
import { Typography } from "../../atoms";
import Divider from "../../atoms/divider";
import { colors } from "../../../theme/colors";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";

import {
  selectApplications,
  selectApplicationsLoading,
  selectApplicationsPagination,
  selectApplicationsHasMore,
  selectApplicationsFilters,
} from "../../../features/applications/selectors";

import { getApplicationsRequestAction } from "../../../features/applications/actions";
import { setApplicationsFilters } from "../../../features/applications/slice";

const SKELETON_ROWS = 6;

const ApplicantsTab = () => {
  const [aiEnabled, setAiEnabled] = useState(false);

  const dispatch = useAppDispatch();
  const applications = useAppSelector(selectApplications);
  const loading = useAppSelector(selectApplicationsLoading);
  const pagination = useAppSelector(selectApplicationsPagination);
  const hasMore = useAppSelector(selectApplicationsHasMore);
  const filters = useAppSelector(selectApplicationsFilters);

  const jobId = useAppSelector((state) => state.jobs.selectedJob?.id);

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
        applicantName: filters.name.trim() || undefined,
        jobId,
        email: filters.email || "",
        jobTitle: filters.appliedFor || "",
        contact: filters.contact || "",
        sort: sortValue,
      })
    );
  }, [
    filters.name,
    filters.email,
    filters.appliedFor,
    filters.contact,
    filters.sort,
    aiEnabled,
    jobId,
    pagination.limit,
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
        applicantName: filters.name.trim() || undefined,
        jobId,
        sort: sortValue, // Use Redux filters.sort when AI is disabled
      })
    );
  }, [loading, hasMore, pagination.page, pagination.limit, filters.name, filters.sort, jobId, aiEnabled, dispatch]);

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

        <View style={styles.switchContainer}>
          <CustomSwitch value={aiEnabled} onValueChange={setAiEnabled} />
          <Typography variant="H4" color={colors.mainColors.carbonGray}>
            AI recommendation
          </Typography>
        </View>
      </View>

      <Divider />
      {!loading && applications.length === 0 && (
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
      )}

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
          backgroundColor: colors.common.slightlygray,
          paddingVertical: 16,
          gap: 16,
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
      />
    </View>
  );
};

export default ApplicantsTab;

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    //backgroundColor: "#fff",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 30,
    marginRight: 12,
  },
  name: { fontSize: 16, fontWeight: "600", color: "#111827" },
  sub: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  status: {
    marginTop: 10,
    padding: 6,
    //backgroundColor: "#EEF2FF",
    color: "#4338CA",
    alignSelf: "flex-start",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "600",
  },
  switchContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    alignItems: 'center'
  }
});
