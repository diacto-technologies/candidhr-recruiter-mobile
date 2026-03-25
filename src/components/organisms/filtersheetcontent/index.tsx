import React, { Fragment, useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, Animated, FlatList } from 'react-native';
import Typography from '../../atoms/typography';
import Button from '../../atoms/button';
import { colors } from '../../../theme/colors';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectApplicationsFilters, selectApplicationsPagination } from '../../../features/applications/selectors';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { getApplicationsRequestAction } from '../../../features/applications/actions';
import { setApplicationsFilters, setSort } from '../../../features/applications/slice';
import Icon from '../../atoms/vectoricon';
import ExperienceFilter from './experincefilter';
import DateFilter from './datefilter';
import TextSearchFilter from './textSearchFilter';
import { getJobsRequestAction } from '../../../features/jobs/actions';
import { selectJobFilters, selectJobsActiveTab } from '../../../features/jobs/selectors';
import { setJobFilters, setJobSort } from '../../../features/jobs/slice';
import { selectAssignedAssessmentFilters } from '../../../features/assessments/selectors';
import { setAssignedAssessmentFilters } from '../../../features/assessments/slice';
import { selectPersonalityScreeningFilters } from '../../../features/personalityScreening/selectors';
import { setFilters as setPersonalityScreeningFilters, setSort as setPersonalityScreeningSort } from '../../../features/personalityScreening/slice';
import DropdownFilter from './dropdownfilter';

interface Props {
  onCancel: () => void;
  onApply: () => void;
  onClearAll: () => void;
  job_Id: any;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  filtersConfig: string[];
  mode: "job" | "applicant" | "assessments" | 'videoInterview';
}
const sortOptionsCombined: { label: string; sortBy: string; sortDir: 'asc' | 'desc' }[] = [
  { label: 'Applicant Name: A → Z', sortBy: 'Applicant name', sortDir: 'asc' },
  { label: 'Applicant Name: Z → A', sortBy: 'Applicant name', sortDir: 'desc' },
  { label: 'Resume Score: Low → High', sortBy: 'Resume Score', sortDir: 'asc' },
  { label: 'Resume Score: High → Low', sortBy: 'Resume Score', sortDir: 'desc' },
  { label: 'Applied On: Old → New', sortBy: 'Applied', sortDir: 'asc' },
  { label: 'Applied On: New → Old', sortBy: 'Applied', sortDir: 'desc' },
  { label: 'Last Updated: Old → New', sortBy: 'Last Update', sortDir: 'asc' },
  { label: 'Last Updated: New → Old', sortBy: 'Last Update', sortDir: 'desc' },
];

const jobSortOptionsCombined: { label: string; sortBy: string; sortDir: 'asc' | 'desc' }[] = [
  { label: 'Job Title: A → Z', sortBy: 'Job Title', sortDir: 'asc' },
  { label: 'Job Title: Z → A', sortBy: 'Job Title', sortDir: 'desc' },
  { label: 'Location: A → Z', sortBy: 'Location', sortDir: 'asc' },
  { label: 'Location: Z → A', sortBy: 'Location', sortDir: 'desc' },
  { label: 'Close Date: Old → New', sortBy: 'Close Date', sortDir: 'asc' },
  { label: 'Close Date: New → Old', sortBy: 'Close Date', sortDir: 'desc' },
];

const videoInterviewSortOptionsCombined: { label: string; sortBy: string; sortDir: 'asc' | 'desc' }[] = [
  { label: 'Applicant: A → Z', sortBy: 'Applicant', sortDir: 'asc' },
  { label: 'Applicant: Z → A', sortBy: 'Applicant', sortDir: 'desc' },
  { label: 'Email: A → Z', sortBy: 'Email', sortDir: 'asc' },
  { label: 'Email: Z → A', sortBy: 'Email', sortDir: 'desc' },
  { label: 'Assigned On: Old → New', sortBy: 'Assigned On', sortDir: 'asc' },
  { label: 'Assigned On: New → Old', sortBy: 'Assigned On', sortDir: 'desc' },
  { label: 'Expires On: Old → New', sortBy: 'Expires On', sortDir: 'asc' },
  { label: 'Expires On: New → Old', sortBy: 'Expires On', sortDir: 'desc' },
];

const FilterSheetContent: React.FC<Props> = ({
  onCancel,
  onApply,
  onClearAll,
  job_Id,
  selectedTab,
  setSelectedTab,
  filtersConfig,
  mode
}) => {

  const slideAnim = useRef(new Animated.Value(0)).current;
  const indicatorY = useRef(new Animated.Value(0)).current;
  const [sortExpanded, setSortExpanded] = useState(false);

  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectApplicationsFilters);
  const jobFilters = useAppSelector(selectJobFilters);
  const assessmentFilters = useAppSelector(selectAssignedAssessmentFilters);
  const personalityScreeningFilters = useAppSelector(selectPersonalityScreeningFilters);
  const pagination = useAppSelector(selectApplicationsPagination);
  const activeTab = useAppSelector(selectJobsActiveTab);

 const labelMap: Record<string, Record<string, string>> = {
  source: {
    application_form: "Form",
    imported_using_bulk_resume_upload: "Bulk Import",
  },

  status: {
    applied: "Applied",
    in_progress: "In Progress",
    shortlisted: "Shortlisted",
    rejected: "Rejected",
    on_hold: "On Hold",
    interview_scheduled: "Interview Scheduled",
    final_interview: "Final Interview",
    hired: "Hired",
    offer_extended: "Offer Extended",
    offer_accepted: "Offer Accepted",
    offer_rejected: "Offer Rejected",
    not_selected: "Not Selected",
    withdrawn: "Withdrawn",
    archived: "Archived",
  },

  latestStageName: {
    resume_screening: "Resume Screening",
    assessment: "Assessment",
    automated_video_interview: "Automated Video Interview",
  },

  latestStageStatus: {
    approved: "Approved",
    not_approved: "Not Approved",
    approval_pending: "Pending",
  },
};

  const activeFilters =
    mode === 'job'
      ? jobFilters
      : mode === 'assessments'
        ? assessmentFilters
        : mode === 'videoInterview'
          ? personalityScreeningFilters
          : filters;

  const hiddenTabs = ['Applied', 'Last Update'];

  const visibleTabs = filtersConfig.filter((item: string) => !hiddenTabs.includes(item));

  useEffect(() => {
    slideAnim.setValue(50);

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [selectedTab]);

  useEffect(() => {
    const index = visibleTabs.indexOf(selectedTab);

    Animated.spring(indicatorY, {
      toValue: index * 0,
      useNativeDriver: true,
    }).start();
  }, [selectedTab]);

  return (
    <Fragment>
      <View style={styles.container}>

        <View style={{ marginVertical: 16 }}>
          <FlatList
            data={Object.entries(activeFilters).filter(
              ([key, value]) => !!value && !['sort', 'sortBy', 'sortDir', 'orderBy'].includes(key)
            )}
            keyExtractor={([key]) => key}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            renderItem={({ item }) => {
              const [key, value] = item;

              return (
                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 12,
                    paddingRight: 6,
                    paddingVertical: 2,
                    borderRadius: 8,
                    backgroundColor: colors.gray[50],
                    borderWidth: 1,
                    borderColor: colors.gray[200],
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="mediumTxtsm" color={colors.gray[700]}>
                    {key === 'experience'
                      ? Number(value) === 0
                        ? value + " " + 'Fresher'
                        : `${value} ${Number(value) === 1 ? 'Year' : 'Years'}`
                      : labelMap[key]?.[value] || value}
                  </Typography>
                  <TouchableOpacity
                    onPress={() => {
                      if (mode === "applicant") {
                        dispatch(setApplicationsFilters({ ...filters, [key]: "" }));
                      } else if (mode === "job") {
                        dispatch(setJobFilters({ ...jobFilters, [key]: "" }));
                      } else if (mode === "videoInterview") {
                        dispatch(setPersonalityScreeningFilters({ [key]: "" }));
                      } else {
                        dispatch(setAssignedAssessmentFilters({ [key]: "" }));
                      }
                    }}
                    style={{ marginLeft: 2 }}
                  >
                    <Icon
                      size={16}
                      name={'close'}
                      iconFamily={'Ionicons'}
                      color={colors.gray[400]}
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>

        <View style={styles.content}>

          {/* LEFT TABS */}
          <ScrollView style={styles.leftTabsContainer}>
            {visibleTabs.map((item, index) => {
              const isActive = selectedTab === item;

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedTab(item)}
                  style={[
                    styles.tabItem,
                    index === 0 && styles.firstTabItem,
                    isActive && styles.activeTabItem,
                  ]}
                >
                  {isActive && (
                    <Animated.View
                      style={[
                        styles.activeIndicator,
                        { transform: [{ translateY: indicatorY }] }
                      ]}
                    />
                  )}

                  <Typography
                    variant={isActive ? 'P1M' : 'P2'}
                    color={isActive ? colors.mainColors.blueGrayTitle : "#414651"}
                  >
                    {item}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* RIGHT CONTENT */}
          <View style={{ flex: 1, flexShrink: 1 }}>
            <Animated.View style={{ flex: 1, transform: [{ translateX: slideAnim }] }}>
              <ScrollView contentContainerStyle={{ flexGrow: 0 }}>

                {mode === 'applicant' && (
                  <>
                    {selectedTab === 'Sort' && (
                      <View style={styles.sortByBlock}>
                        <TouchableOpacity
                          style={styles.sortByHeader}
                          onPress={() => setSortExpanded((e) => !e)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.sortBySummaryWrap}>
                            <Typography variant="P1M" color={colors.gray[700]}>
                              Sort by
                            </Typography>
                            <Typography
                              variant="P1M"
                              color={colors.gray[800]}
                              numberOfLines={1}
                              style={styles.sortByLabel}
                            >
                              {sortOptionsCombined.find(
                                (o) => o.sortBy === filters.sortBy && o.sortDir === (filters.sortDir ?? 'desc')
                              )?.label ?? 'Applied On: New → Old'}
                            </Typography>
                          </View>
                          <Icon
                            name={sortExpanded ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={colors.gray[600]}
                            iconFamily="Feather"
                          />
                        </TouchableOpacity>

                        {sortExpanded && (
                          <View style={styles.sortByExpanded}>
                            <Typography variant="P1M" color={colors.gray[700]} style={styles.sortBySectionTitle}>
                              Sort By
                            </Typography>
                            {sortOptionsCombined.map((option) => {
                              const isSelected =
                                filters.sortBy === option.sortBy &&
                                (filters.sortDir ?? 'desc') === option.sortDir;
                              return (
                                <TouchableOpacity
                                  key={`${option.sortBy}-${option.sortDir}`}
                                  onPress={() =>
                                    dispatch(
                                      setSort({
                                        sortBy: option.sortBy,
                                        sortDir: option.sortDir,
                                      })
                                    )
                                  }
                                  style={[styles.radioRow, isSelected && styles.radioRowSelected]}
                                  activeOpacity={0.7}
                                >
                                  <Typography variant="P1M" color={colors.gray[800]}>
                                    {option.label}
                                  </Typography>
                                  <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                                    {isSelected && <View style={styles.radioInner} />}
                                  </View>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        )}
                      </View>
                    )}
                    {selectedTab === 'Name' && <TextSearchFilter mode="applicant" field="name" placeholder="Search by 'Name' " />}
                    {selectedTab === 'Source' && <DropdownFilter
                      mode="applicant"
                      field="source"
                      placeholder="All"
                      options={[
                        { label: "Form", value: "application_form" },
                        { label: "Bulk Import", value: "imported_using_bulk_resume_upload" },
                      ]}
                      labelKey="label"
                      valueKey="value"
                    />}
                    {selectedTab === 'Applied For' && <TextSearchFilter mode="applicant" field="appliedFor" placeholder="Search by 'Applied For'" />}
                    {selectedTab === 'Status' && <DropdownFilter
                      mode="applicant"
                      field="status"
                      placeholder="All"
                      options={[
                        { label: "Applied ", value: "applied" },
                        { label: "In Progress", value: "in_progress" },
                        { label: "Shortlisted", value: "shortlisted" },
                        { label: "Rejected", value: "rejected" },
                        { label: "On Hold", value: "on_hold" },
                        { label: "Interview Scheduled", value: "interview_scheduled" },
                        { label: "Final Interview", value: "final_interview" },
                        { label: "Hired", value: "hired" },
                        { label: "Offer Extended", value: "offer_extended" },
                        { label: "Offer Accepted", value: "offer_accepted" },
                        { label: "Offer Rejected", value: "offer_rejected" },
                        { label: "Not Selected", value: "not_selected" },
                        { label: "Withdrawn", value: "withdrawn" },
                        { label: "Archived", value: "archived" },
                      ]}
                      labelKey="label"
                      valueKey="value"
                    />}
                    {selectedTab === 'Stage' && (
                      <DropdownFilter
                        mode="applicant"
                        field="latestStageName"
                        placeholder="All"
                        options={[
                          { label: "Resume Screening", value: "resume_screening" },
                          { label: "Assessment", value: "assessment" },
                          { label: "Automated Video Interview", value: "automated_video_interview" },
                        ]}
                      />
                    )}

                    {selectedTab === 'Approved' && (
                      <DropdownFilter
                        mode="applicant"
                        field="latestStageStatus"
                        placeholder="All"
                        options={[
                          { label: "Approved", value: "approved" },
                          { label: "Not Approved", value: "not_approved" },
                          { label: "Pending", value: "approval_pending" },
                        ]}
                      />
                    )}
                  </>
                )}

                {mode === 'job' && (
                  <>
                    {selectedTab === 'Sort' && (
                      <View style={styles.sortByBlock}>
                        <TouchableOpacity
                          style={styles.sortByHeader}
                          onPress={() => setSortExpanded((e) => !e)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.sortBySummaryWrap}>
                            <Typography variant="P1M" color={colors.gray[700]}>
                              Sort by
                            </Typography>
                            <Typography
                              variant="P1M"
                              color={colors.gray[800]}
                              numberOfLines={1}
                              style={styles.sortByLabel}
                            >
                              {jobSortOptionsCombined.find(
                                (o) =>
                                  o.sortBy === jobFilters.sortBy &&
                                  (jobFilters.sortDir ?? 'desc') === o.sortDir
                              )?.label ?? 'Close Date: New → Old'}
                            </Typography>
                          </View>
                          <Icon
                            name={sortExpanded ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={colors.gray[600]}
                            iconFamily="Feather"
                          />
                        </TouchableOpacity>

                        {sortExpanded && (
                          <View style={styles.sortByExpanded}>
                            <Typography variant="P1M" color={colors.gray[700]} style={styles.sortBySectionTitle}>
                              Sort By
                            </Typography>
                            {jobSortOptionsCombined.map((option) => {
                              const isSelected =
                                jobFilters.sortBy === option.sortBy &&
                                (jobFilters.sortDir ?? 'desc') === option.sortDir;
                              return (
                                <TouchableOpacity
                                  key={`${option.sortBy}-${option.sortDir}`}
                                  onPress={() =>
                                    dispatch(
                                      setJobSort({
                                        sortBy: option.sortBy,
                                        sortDir: option.sortDir,
                                      })
                                    )
                                  }
                                  style={[styles.radioRow, isSelected && styles.radioRowSelected]}
                                  activeOpacity={0.7}
                                >
                                  <Typography variant="P1M" color={colors.gray[800]}>
                                    {option.label}
                                  </Typography>
                                  <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                                    {isSelected && <View style={styles.radioInner} />}
                                  </View>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        )}
                      </View>
                    )}
                    {selectedTab === 'Title' && <TextSearchFilter mode="job" field="title" placeholder="Search by 'Title'" />}
                    {/* {selectedTab === 'Experience' && <ExperienceFilter />} */}
                    {selectedTab === 'Location' && <TextSearchFilter mode="job" field="location" placeholder="Search by 'Location' " />}
                    {selectedTab === 'Employment Type' && <TextSearchFilter mode="job" field="employmentType" placeholder="Search by 'Employee Type' " />}
                    {/* {selectedTab === 'Close Date' && <DateFilter />} */}
                    {selectedTab === 'Created By' && <TextSearchFilter mode="job" field="createdBy" placeholder="Search by 'Created By' " />}
                  </>
                )}

                {mode === 'assessments' && (
                  <>
                    {selectedTab === 'Applicant' && <TextSearchFilter mode="assessments" field="applicant_name__icontains" placeholder="Search by 'Applicant' " />}
                    {selectedTab === 'Email' && <TextSearchFilter mode="assessments" field="candidate_email__icontains" placeholder="Search by 'Email'" />}
                    {selectedTab === 'Job Title' && <TextSearchFilter mode="assessments" field="job__title__icontains" placeholder="Search by 'Job Title'" />}
                    {selectedTab === 'Avg Percentage' && <TextSearchFilter mode="assessments" field="average_percentage__in" placeholder="Search by 'Avg Percentage'" />}
                    {selectedTab === 'Assigned By' && <TextSearchFilter mode="assessments" field="assigned_by__name__icontains" placeholder="Search by 'Assigned By'" />}
                    {selectedTab === 'Status' && <TextSearchFilter mode="assessments" field="status_text" placeholder="Search by 'Status'" />}
                  </>
                )}

                {mode === 'videoInterview' && (
                  <>
                    {selectedTab === 'Sort' && (
                      <View style={styles.sortByBlock}>
                        <TouchableOpacity
                          style={styles.sortByHeader}
                          onPress={() => setSortExpanded((e) => !e)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.sortBySummaryWrap}>
                            <Typography variant="P1M" color={colors.gray[700]}>
                              Sort by
                            </Typography>
                            <Typography
                              variant="P1M"
                              color={colors.gray[800]}
                              numberOfLines={1}
                              style={styles.sortByLabel}
                            >
                              {videoInterviewSortOptionsCombined.find(
                                (o) =>
                                  o.sortBy === personalityScreeningFilters.sortBy &&
                                  (personalityScreeningFilters.sortDir ?? 'desc') === o.sortDir
                              )?.label ?? 'Assigned On: New → Old'}
                            </Typography>
                          </View>
                          <Icon
                            name={sortExpanded ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={colors.gray[600]}
                            iconFamily="Feather"
                          />
                        </TouchableOpacity>

                        {sortExpanded && (
                          <View style={styles.sortByExpanded}>
                            <Typography variant="P1M" color={colors.gray[700]} style={styles.sortBySectionTitle}>
                              Sort By
                            </Typography>
                            {videoInterviewSortOptionsCombined.map((option) => {
                              const isSelected =
                                personalityScreeningFilters.sortBy === option.sortBy &&
                                (personalityScreeningFilters.sortDir ?? 'desc') === option.sortDir;
                              return (
                                <TouchableOpacity
                                  key={`${option.sortBy}-${option.sortDir}`}
                                  onPress={() =>
                                    dispatch(
                                      setPersonalityScreeningSort({
                                        sortBy: option.sortBy,
                                        sortDir: option.sortDir,
                                      })
                                    )
                                  }
                                  style={[styles.radioRow, isSelected && styles.radioRowSelected]}
                                  activeOpacity={0.7}
                                >
                                  <Typography variant="P1M" color={colors.gray[800]}>
                                    {option.label}
                                  </Typography>
                                  <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                                    {isSelected && <View style={styles.radioInner} />}
                                  </View>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        )}
                      </View>
                    )}
                    {selectedTab === 'Applicant' && (
                      <TextSearchFilter
                        mode="videoInterview"
                        field="applicant_name__icontains"
                        placeholder="Search by 'Applicant'"
                      />
                    )}

                    {selectedTab === 'Email' && (
                      <TextSearchFilter
                        mode="videoInterview"
                        field="candidate_email__icontains"
                        placeholder="Search by 'Email'"
                      />
                    )}

                    {selectedTab === 'Job Name' && (
                      <TextSearchFilter
                        mode="videoInterview"
                        field="job__title__icontains"
                        placeholder="Search by 'Job Title'"
                      />
                    )}

                    {selectedTab === 'Assigned By' && (
                      <TextSearchFilter
                        mode="videoInterview"
                        field="assigned_by__name__icontains"
                        placeholder="Search by 'Assigned By'"
                      />
                    )}

                    {mode === 'videoInterview' && selectedTab === 'Status' && (
                      <DropdownFilter
                        mode="videoInterview"
                        field="status_text"
                        placeholder="All"
                        options={[
                          { label: "All", value: "" },
                          { label: "Assigned", value: "Assigned" },
                          { label: "Link Opened", value: "Link Opened" },
                          { label: "Started", value: "Started" },
                          { label: "Completed", value: "Completed" },
                          { label: "Shortlisted", value: "Shortlisted" },
                          { label: "Hired", value: "Hired" },
                          { label: "Scheduled Final Interview", value: "Scheduled Final Interview" },
                          { label: "Revoked", value: "Revoked" },
                          { label: "Rejected", value: "Rejected" },
                          { label: "On Hold", value: "On Hold" },
                        ]}
                        labelKey="label"
                        valueKey="value"
                      />
                    )}
                  </>
                )}

                {/* 
                {![...filtersConfig].includes(selectedTab) && (
                  <Typography variant="P2" color="#9CA3AF">
                    Filters coming soon...
                  </Typography>
                )} */}

              </ScrollView>
            </Animated.View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={{ flex: 1 }}>
            <Button
              buttonColor={colors.common.white}
              textColor={colors.mainColors.carbonGray}
              borderColor={colors.mainColors.borderColor}
              borderRadius={8}
              borderWidth={1}
              onPress={onCancel}
            >
              Cancel
            </Button>
          </View>

          <View style={{ flex: 1 }}>
            <Button
              buttonColor={colors.mainColors.slateBlue}
              textColor={colors.common.white}
              borderColor={colors.mainColors.borderColor}
              borderRadius={8}
              borderWidth={1}
              onPress={onApply}
            >
              Apply filters
            </Button>
          </View>
        </View>

      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexShrink: 1,
    //maxHeight: '90%',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderColor: colors.mainColors.borderColor,
    marginHorizontal: 5,
    marginBottom: 5,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    flexShrink: 1,
  },
  leftTabsContainer: {
    width: 124,
    flexGrow: 0,
    backgroundColor: colors.gray[50],
    gap: 10,
    borderTopRightRadius: 20,
    // paddingBottom: 50,
  },
  tabItem: {
    paddingVertical: 16,
    height: 52,
    paddingHorizontal: 18,
    marginBottom: 4,
    position: 'relative'
  },
  firstTabItem: {
    borderTopRightRadius: 20,
  },
  activeTabItem: {
    backgroundColor: '#F5F5F5',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#6C4BE7',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  footer: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E5E5E5',
    columnGap: 12,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  sortByBlock: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sortByHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: colors.common.white,
  },
  sortBySummaryWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
  },
  sortBySummary: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  sortByLabel: {
    flexShrink: 1,
  },
  sortByExpanded: {
    marginTop: 16,
    gap: 4,
  },
  sortBySectionTitle: {
    marginTop: 12,
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: colors.common.white,
    marginBottom: 4,
  },
  radioRowSelected: {
    borderColor: colors.brand[400],
    backgroundColor: colors.brand[50],
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.brand[500],
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.brand[500],
  },
});

export default FilterSheetContent;
