// components/filters/FilterSheetContent.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Typography from '../../atoms/typography';
import Button from '../../atoms/button';
import { colors } from '../../../theme/colors';

import JobTitleFilter from './jobtitlefilter';
import ExperienceFilter from './experiencefilter';
import LocationChip from './locationchip';
import { SvgXml } from 'react-native-svg';
import { fileIcon } from '../../../assets/svg/file';
import { telePhoneIcon } from '../../../assets/svg/telephone';
import FooterButtons from '../../molecules/footerbuttons';
// import LocationFilter from './tabs/LocationFilter';
// import WorkModeFilter from './tabs/WorkModeFilter';

const leftTabs = [
  'Job title',
  'Experience',
  'Location',
  'Work mode',
  'By date',
  'Job status',
  'Created by',
];

interface Props {
  onCancel: () => void;
  onApply: () => void;
  onClearAll: () => void;
}

const FilterSheetContent: React.FC<Props> = ({
  onCancel,
  onApply,
  onClearAll,
}) => {
  const [selectedTab, setSelectedTab] = useState('Job title');

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Left Tabs */}
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
                {isActive && <View style={styles.activeIndicator} />}
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

        {/* Right Content */}
        <ScrollView>
          {selectedTab === 'Job title' && <JobTitleFilter />}

          {selectedTab === 'Experience' && <ExperienceFilter value={5} onValueChange={()=>{}}/>}

          {selectedTab === 'Location' && <LocationChip/>}

          {selectedTab === 'Work mode' && ""}

          {selectedTab === 'By date' && ""}

          {selectedTab === 'Job status' && ""}

          {selectedTab === 'Created by' && ""}

          {/* Placeholder */}
          {!['Job title', 'Experience', 'Location', 'Work mode'].includes(selectedTab) && (
            <Typography variant="P2" color="#9CA3AF">
              Filters coming soon...
            </Typography>
          )}
        </ScrollView>
      </View>

      <View style={styles.footer}>
      <View>
        <Button
          buttonColor={colors.common.white}
          textColor={colors.mainColors.carbonGray}
          borderColor={colors.mainColors.borderColor}
          borderRadius={8}
          borderWidth={1}
        >
          Cancel
        </Button>
        </View>
        <View style={{ flex: 1,}}>
        <Button
          buttonColor={colors.mainColors.slateBlue}
          textColor={colors.common.white}
          borderColor={colors.mainColors.borderColor}
          borderRadius={8}
          borderWidth={1}
        >
          Apply filters
        </Button>
        </View>
        </View>
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '90%',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderColor: colors.mainColors.borderColor,
    marginHorizontal: 5,
  },
  content: {
    flexDirection: 'row',
    flex: 1,
  },

  // Left Tabs
  leftTabsContainer: {
    width: 124,
    backgroundColor: colors.common.white,
    gap: 10,
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
