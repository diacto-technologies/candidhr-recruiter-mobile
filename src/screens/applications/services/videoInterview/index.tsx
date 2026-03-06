import React, { useState, useCallback } from "react";
import { View, FlatList, Image, TouchableOpacity } from "react-native";
import CustomSafeAreaView from "../../../../components/atoms/customsafeareaview";
import {
  BottomSheet,
  Header,
  SortingAndFilter,
  FilterSheetContent,
  Button,
  Typography,
} from "../../../../components";
import { goBack, navigate } from "../../../../utils/navigationUtils";
import { useStyles } from "./styles";
import Card from "../../../../components/atoms/card";
import Shimmer from "../../../../components/atoms/shimmer";
import { useRNSafeAreaInsets } from "../../../../hooks/useRNSafeAreaInsets";
import { colors } from "../../../../theme/colors";
import Divider from "../../../../components/atoms/divider";
import { getStatusColor } from "../../../../components/organisms/applicantlist/helper";
import { horizontalThreedotIcon } from "../../../../assets/svg/horizontalthreedoticon";
import { SvgXml } from "react-native-svg";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import {
  getPersonalityScreeningListRequestAction,
} from "../../../../features/personalityScreening/actions";
import {
  selectPersonalityScreeningList,
  selectPersonalityScreeningLoading,
  selectPersonalityScreeningHasMore,
  selectPersonalityScreeningFilters,
  selectPersonalityScreeningPagination,
} from "../../../../features/personalityScreening/selectors";
import { clearFilters } from "../../../../features/personalityScreening/slice";
import { formatMonDDYYYY } from "../../../../utils/dateformatter";
import type { PersonalityScreeningItem } from "../../../../features/personalityScreening/types";

const FILTER_OPTIONS = [
  "Applicant",
  "Email",
  "Status",
  "Job Name",
  "Assigned By",
];

const VIDEO_INTERVIEW_SHIMMER_COUNT = 5;
const VIDEO_INTERVIEW_FOOTER_SHIMMER_COUNT = 2;

const VideoInterviewCardShimmer: React.FC = () => {
  const styles = useStyles();
  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <Shimmer width={40} height={40} borderRadius={20} />
        <View style={{ flex: 1 }}>
          <Shimmer width="70%" height={16} borderRadius={6} style={{ marginBottom: 8 }} />
          <Shimmer width="50%" height={12} borderRadius={6} />
        </View>
        <Shimmer width={20} height={20} borderRadius={10} />
      </View>
      <Shimmer width="55%" height={14} borderRadius={6} style={{ marginBottom: 8 }} />
      <Shimmer width="65%" height={14} borderRadius={6} style={{ marginBottom: 8 }} />
      <Shimmer width="45%" height={14} borderRadius={6} style={{ marginBottom: 12 }} />
      <Divider />
      <View style={styles.bottomRow}>
        <Shimmer width="40%" height={14} borderRadius={6} />
        <View style={styles.statusBadge}>
          <Shimmer width={8} height={8} borderRadius={4} style={{ marginRight: 6 }} />
          <Shimmer width={60} height={14} borderRadius={6} />
        </View>
      </View>
    </Card>
  );
};

const VideoInterviewScreen = () => {
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>("Applicant");
  const insets = useRNSafeAreaInsets();

  const list = useAppSelector(selectPersonalityScreeningList);
  const loading = useAppSelector(selectPersonalityScreeningLoading);
  const hasMore = useAppSelector(selectPersonalityScreeningHasMore);
  const filters = useAppSelector(selectPersonalityScreeningFilters);
  const pagination = useAppSelector(selectPersonalityScreeningPagination);

  const fetchList = useCallback(
    (page: number = 1, append: boolean = false) => {
      dispatch(
        getPersonalityScreeningListRequestAction({
          ...filters,
          page,
          append,
        })
      );
    },
    [dispatch, filters]
  );

  React.useEffect(() => {
    fetchList(1, false);
  }, []);

  const handleApplyFilters = useCallback(() => {
    setFilterSheetOpen(false);
    fetchList(1, false);
  }, [fetchList]);

  const handleClearAllFilters = useCallback(() => {
    setSelectedFilter(null);
    dispatch(clearFilters());
    dispatch(
      getPersonalityScreeningListRequestAction({
        page: 1,
        append: false,
      })
    );
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) return;
    const nextPage = pagination.page + 1;
    fetchList(nextPage, true);
  }, [loading, hasMore, pagination.page, fetchList]);

  const renderCard = useCallback(
    ({ item }: { item: PersonalityScreeningItem }) => {
      const name = item.application?.name ?? item.application?.candidate?.name ?? "";
      const email = item.application?.candidate?.email ?? "";
      const jobTitle = item.job?.title ?? item.application?.job?.title ?? "";
      const assignedByName = item.assigned_by?.name ?? "";
      const validity = item.expired_at
        ? formatMonDDYYYY(item.expired_at)
        : "—";
      const assignedAt = item.assigned_at
        ? formatMonDDYYYY(item.assigned_at)
        : "—";
      const profilePic = item.application?.candidate?.profile_pic;
      const initial = (name?.trim()?.[0] ?? "?").toUpperCase();

      return (
        <Card style={styles.card} onPress={() =>  navigate('ApplicantDetails', {
              application_id:item?.application?.id,
              tab:'Automated Video Interview'
            })}>
          <View style={styles.headerRow}>
            {profilePic ? (
              <Image
                source={{ uri: profilePic }}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: colors.gray[200],
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Typography variant="semiBoldTxtlg" color={colors?.gray[700]}>
                  {initial}
                </Typography>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Typography variant="semiBoldTxtmd">{name}</Typography>
              <Typography variant="regularTxtsm" color={colors?.gray[600]}>
                {email}
              </Typography>
            </View>
            <TouchableOpacity>
              <SvgXml xml={horizontalThreedotIcon} height={20} width={20} />
            </TouchableOpacity>
          </View>

          <Typography variant="regularTxtsm" color={colors?.gray[600]}>
            Job : <Typography variant="semiBoldTxtsm">{jobTitle}</Typography>
          </Typography>
          <Typography variant="regularTxtsm" color={colors?.gray[600]}>
            Assigned by :{" "}
            <Typography variant="semiBoldTxtsm">{assignedByName}</Typography>
          </Typography>
          <Typography variant="regularTxtsm" color={colors?.gray[600]}>
            Validity :{" "}
            <Typography variant="semiBoldTxtsm">{validity}</Typography>
          </Typography>

          <Divider />

          <View style={styles.bottomRow}>
            <Typography variant="regularTxtsm" color={colors?.gray[600]}>
              Assigned : {assignedAt}
            </Typography>
            <View style={styles.statusBadge}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      getStatusColor(item.status_text) ||
                      colors.gray[500],
                  },
                ]}
              />
              <Typography variant="mediumTxtxs" color={colors.gray[700]}>
                {item.status_text}
              </Typography>
            </View>
          </View>
        </Card>
      );
    },
    [styles]
  );

  const keyExtractor = useCallback((item: PersonalityScreeningItem) => item.id, []);

  const listFooter =
    loading && list.length > 0 ? (
      <View style={{ gap: 16, paddingVertical: 8 }}>
        {Array.from({ length: VIDEO_INTERVIEW_FOOTER_SHIMMER_COUNT }, (_, i) => (
          <VideoInterviewCardShimmer key={`footer-shimmer-${i}`} />
        ))}
      </View>
    ) : null;

  const listEmptyComponent =
    loading && list.length === 0 ? (
      <View style={{ gap: 16 }}>
        {Array.from({ length: VIDEO_INTERVIEW_SHIMMER_COUNT }, (_, i) => (
          <VideoInterviewCardShimmer key={`empty-shimmer-${i}`} />
        ))}
      </View>
    ) : null;

  return (
    <CustomSafeAreaView>
      <Header
        title="Video interview"
        backNavigation
        enableJobSearch
        onBack={goBack}
      />

      <FlatList
        data={list}
        renderItem={renderCard}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ padding: 16, paddingBottom: 10 }}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={listEmptyComponent}
        ListFooterComponent={listFooter}
      />

      <View style={styles.assignContainer}>
        <Button variant="contain">+ Assign video interview</Button>
      </View>

      <View
        style={[
          styles.filterContainer,
          { marginBottom: insets.insetsBottom - 10 },
        ]}
      >
        <SortingAndFilter
          title="Filters"
          options={FILTER_OPTIONS}
          selectedTab={selectedFilter ?? ""}
          onItemPress={(tab) => {
            setSelectedFilter(tab);
            setFilterSheetOpen(true);
          }}
          setSelectedTab={(tab) => {
            setSelectedFilter(tab);
            setFilterSheetOpen(true);
          }}
          onPressFilter={() => setFilterSheetOpen(true)}
        />

        <BottomSheet
          visible={filterSheetOpen}
          onClose={() => setFilterSheetOpen(false)}
          title="Filter by"
          showHeadline
        >
          <FilterSheetContent
            selectedTab={selectedFilter ?? ""}
            setSelectedTab={(tab) => setSelectedFilter(tab)}
            filtersConfig={FILTER_OPTIONS}
            onCancel={() => setFilterSheetOpen(false)}
            onApply={handleApplyFilters}
            onClearAll={handleClearAllFilters}
            job_Id={undefined}
            mode="videoInterview"
          />
        </BottomSheet>
      </View>
    </CustomSafeAreaView>
  );
};

export default VideoInterviewScreen;
