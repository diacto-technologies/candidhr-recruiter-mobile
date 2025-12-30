import React, { Fragment, useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import Typography from '../../atoms/typography';
import Button from '../../atoms/button';
import { colors } from '../../../theme/colors';

import JobTitleFilter from './jobtitlefilter';
import EmailFilter from './emailfilter';
import AppliedFor from './locationchip';
import ContactFilter from './contactfilter';

import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectApplicationsFilters, selectApplicationsPagination } from '../../../features/applications/selectors';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { getApplicationsRequestAction } from '../../../features/applications/actions';

const leftTabs = [
  'Name',
  'Email',
  'Applied For',
  'Contact',
  'Applied',
  'Last Update',
];

interface Props {
  onCancel: () => void;
  onApply: () => void;
  onClearAll: () => void;
  job_Id: any;
}

const FilterSheetContent: React.FC<Props> = ({
  onCancel,
  onApply,
  onClearAll,
  job_Id
}) => {
  const [selectedTab, setSelectedTab] = useState(leftTabs[0]);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const indicatorY = useRef(new Animated.Value(0)).current;

  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectApplicationsFilters);
  const pagination = useAppSelector(selectApplicationsPagination);


  useEffect(() => {
    slideAnim.setValue(50);

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [selectedTab]);

  useEffect(() => {
    const index = leftTabs.indexOf(selectedTab);
  
    Animated.spring(indicatorY, {
      toValue: index * 0,   // 52 height + 4 margin
      useNativeDriver: true,
    }).start();
  }, [selectedTab]);

  const handleApplyFilters = () => {
    dispatch(
      getApplicationsRequestAction({
        page: 1,
        limit: pagination.limit,
        applicantName: filters.name.trim() || "",
        email: filters.email || "",
        jobTitle: filters.appliedFor || "",
        contact: filters.contact || "",
        sort: "-applied_at",
        jobId: job_Id || ""
      })
    );
    onCancel()
  }

  return (
    <Fragment>
      <View style={styles.container}>
        <View style={styles.content}>

          {/* LEFT TABS */}
          <View style={styles.leftTabsContainer}>
            {leftTabs.map((item, index) => {
              const isActive = selectedTab === item;

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedTab(item)}
                  style={[
                    styles.tabItem,
                    isActive && styles.activeTabItem,
                  ]}
                >
                  {isActive && <Animated.View
                    style={[
                      styles.activeIndicator,
                      { transform: [{ translateY: indicatorY }] }
                    ]}
                  />}
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

          {/* RIGHT SLIDING CONTENT */}
          <Animated.View
            style={{
              flex: 1,
              transform: [{ translateX: slideAnim }],
            }}
          >
            <ScrollView>

              {selectedTab === 'Name' && <JobTitleFilter />}
              {selectedTab === 'Email' && <EmailFilter />}
              {selectedTab === 'Applied For' && <AppliedFor />}
              {selectedTab === 'Contact' && <ContactFilter />}

              {!['Name', 'Email', 'Applied For', 'Contact'].includes(selectedTab) && (
                <Typography variant="P2" color="#9CA3AF">
                  Filters coming soon...
                </Typography>
              )}

            </ScrollView>
          </Animated.View>

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
              onPress={handleApplyFilters}
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
    height: '85%',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderColor: colors.mainColors.borderColor,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  content: {
    flexDirection: 'row',
    flex: 1,
  },

  // Left Tabs
  leftTabsContainer: {
    width: 124,
    backgroundColor: colors.gray[50],
    gap: 10,
    borderTopRightRadius: 20
  },
  tabItem: {
    paddingVertical: 16,
    height: 52,
    paddingHorizontal: 18,
    marginBottom: 4,
    position: 'relative',
    borderTopRightRadius: 20
  },
  activeTabItem: {
    backgroundColor: '#F5F5F5',
    //borderTopRightRadius:20
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
  activeTabText: {
    color: '#191B23',
  },
  inactiveTabText: {
    color: '#535862',
  },

  // Right Filter Options
  filterOptionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#C8CAD0',
    backgroundColor: '#FFFFFF',
  },
  checkedCheckbox: {
    backgroundColor: '#6C4BE7',
    borderColor: '#6C4BE7',
  },
  countBadge: {
    backgroundColor: '#F2F3F5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
  },

  // Footer
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
  cancelButton: {
    width: '48%',
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  applyButton: {
    width: '48%',
    paddingVertical: 14,
    backgroundColor: '#6C4BE7',
    borderRadius: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
  },
  sortButtonContainer: {
    alignItems: 'center',
    bottom: 0,
    elevation: 5,
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-evenly',
    left: 0,
    paddingBottom: 20 || 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    position: 'absolute',
    right: 0,
    zIndex: 40,
  },
  flexStyle: {
    flex: 1,
  },
});


export default FilterSheetContent;

