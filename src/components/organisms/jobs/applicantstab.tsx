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
} from "../../../features/applications/selectors";

import { getApplicationsRequestAction } from "../../../features/applications/actions";

const SKELETON_ROWS = 6;

const ApplicantsTab = () => {
  const [search, setSearch] = useState("");
  const [aiEnabled, setAiEnabled] = useState(false);

  const dispatch = useAppDispatch();
  const applications = useAppSelector(selectApplications);
  const loading = useAppSelector(selectApplicationsLoading);
  const pagination = useAppSelector(selectApplicationsPagination);
  const hasMore = useAppSelector(selectApplicationsHasMore);

  const jobId = useAppSelector((state) => state.jobs.selectedJob?.id);

  const onEndReachedCalledRef = useRef(false);

  /** 🔥 Debounced Search + AI sort + jobId */
  useEffect(() => {
    // 1️⃣ Clear existing list so skeleton shows
    dispatch(
      getApplicationsRequestAction({
        reset: true,
        page: 1,
        limit: pagination.limit,
      })
    );
  
    // 2️⃣ Fetch new results
    const timeout = setTimeout(() => {
      dispatch(
        getApplicationsRequestAction({
          page: 1,
          limit: pagination.limit,
          applicantName: search.trim() || undefined,
          jobId,
          sort: aiEnabled
            ? "-resume__resume_score__overall_score"
            : "-last_updated",
        })
      );
    }, 400);
  
    return () => clearTimeout(timeout);
  }, [search, aiEnabled, jobId]);
  

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) return;

    dispatch(
      getApplicationsRequestAction({
        page: pagination.page + 1,
        limit: pagination.limit,
        append: true,
        applicantName: search.trim() || undefined,
        jobId,
        sort: aiEnabled
          ? "-resume__resume_score__overall_score"
          : "-last_updated",
      })
    );
  }, [loading, hasMore, pagination.page, pagination.limit, search, jobId, aiEnabled]);

  const dataSource = useMemo(() => {
    if (loading && applications.length === 0) {
      return Array.from({ length: SKELETON_ROWS }).map((_, i) => ({
        __skeleton: true,
        __id: `skeleton-${i}`,
      }));
    }
    return applications;
  }, [loading, applications,aiEnabled]);

  return (
    <View style={{ flex: 1 }}>
      {/* 🔍Top Search + Switch */}
      <View style={{ paddingHorizontal: 16, gap: 4, paddingVertical: 16 }}>
        <SearchBar
          value={search}
          placeholder="Jacob Johns"
          onChangeText={setSearch}
        />

        <View style={styles.switchContainer}>
          <CustomSwitch value={aiEnabled} onValueChange={setAiEnabled} />
          <Typography variant="H4" color={colors.mainColors.carbonGray}>
            AI recommendation
          </Typography>
        </View>
      </View>

      <Divider />

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
