import React, { Fragment, useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, Animated, FlatList } from 'react-native';
import Typography from '../../atoms/typography';
import Button from '../../atoms/button';
import { colors } from '../../../theme/colors';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectApplicationsFilters, selectApplicationsPagination } from '../../../features/applications/selectors';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { getApplicationsRequestAction } from '../../../features/applications/actions';
import { setApplicationsFilters } from '../../../features/applications/slice';
import Icon from '../../atoms/vectoricon';
import ExperienceFilter from './experincefilter';
import DateFilter from './datefilter';
import TextSearchFilter from './textSearchFilter';
import { getJobsRequestAction } from '../../../features/jobs/actions';
import { selectJobFilters, selectJobsActiveTab } from '../../../features/jobs/selectors';
import { setJobFilters } from '../../../features/jobs/slice';

interface Props {
  onCancel: () => void;
  onApply: () => void;
  onClearAll: () => void;
  job_Id: any;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  filtersConfig: string[];
  mode: "job" | "applicant";
}

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

  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectApplicationsFilters);
  const jobFilters = useAppSelector(selectJobFilters);
  const pagination = useAppSelector(selectApplicationsPagination);
  const activeTab = useAppSelector(selectJobsActiveTab);

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
            data={Object.entries(mode === 'job' ? jobFilters : filters).filter(
              ([key, value]) =>
                !!value && !['sort', 'sortBy', 'sortDir'].includes(key)
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
                        ? value +" "+'Fresher'
                        : `${value} ${Number(value) === 1 ? 'Year' : 'Years'}`
                      : value}
                  </Typography>
                  <TouchableOpacity
                    onPress={() => {
                      if (mode === "applicant") {
                        dispatch(
                          setApplicationsFilters({
                            ...filters,
                            [key]: "",
                          })
                        );
                      } else {
                        dispatch(
                          setJobFilters({
                            ...jobFilters,
                            [key]: "",
                          })
                        );
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
          <View style={styles.leftTabsContainer}>
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
          </View>

          {/* RIGHT CONTENT */}
          <View style={{ flex: 1, flexShrink: 1 }}>
            <Animated.View style={{ flex: 1, transform: [{ translateX: slideAnim }] }}>
              <ScrollView contentContainerStyle={{ flexGrow: 0 }}>

                {selectedTab === 'Name' && <TextSearchFilter mode="applicant" field="name" placeholder="Search by 'Name' " />}
                {selectedTab === 'Email' && <TextSearchFilter mode="applicant" field="email" placeholder="Search by 'Email'" />}
                {selectedTab === 'Applied For' && <TextSearchFilter mode="applicant" field="appliedFor" placeholder="Search by 'Applied For'" />}
                {selectedTab === 'Contact' && <TextSearchFilter mode="applicant" field="contact" placeholder="Search by 'Contact'" />}

                {selectedTab === 'Title' && <TextSearchFilter mode="job" field="title" placeholder="Search by 'Title'" />}
                {selectedTab === 'Experience' && <ExperienceFilter />}
                {selectedTab === 'Employment Type' && <TextSearchFilter mode="job" field="employmentType" placeholder="Search by 'Employee Type' " />}
                {selectedTab === 'Location' && <TextSearchFilter mode="job" field="location" placeholder="Search by 'Location' " />}
                {selectedTab === 'Close Date' && <DateFilter />}
                {selectedTab === 'Created By' && <TextSearchFilter mode="job" field="createdBy" placeholder="Search by 'Created By' " />}

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
  }
});

export default FilterSheetContent;
