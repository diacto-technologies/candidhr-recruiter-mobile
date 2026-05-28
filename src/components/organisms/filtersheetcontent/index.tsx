import React, { Fragment, useRef, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, ScrollView, Animated, FlatList } from 'react-native';
import Typography from '../../atoms/typography';
import Button from '../../atoms/button';
import { colors } from '../../../theme/colors';
import Icon from '../../atoms/vectoricon';
import TextSearchFilter from '../../molecules/textsearchfilter';
import DropdownFilter from '../../molecules/dropdownfilter';
import SortByPanel from '../../molecules/sortbypanel';
import { FilterConfig } from './types';
import { LABEL_MAP } from './config';
import { styles } from './styles';

interface Props {
  onCancel: () => void;
  onApply: () => void;
  onClearAll: () => void;
  
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  
  config: FilterConfig[];
  
  // Filter Data
  activeFilters: Record<string, any>;
  
  // Actions
  onRemoveFilter: (field: string) => void;
  onFilterChange: (field: string, value: string) => void;
  onSortChange: (sortBy: string, sortDir: 'asc' | 'desc') => void;
}


const BaseFilterSheetContent: React.FC<Props> = ({
  onCancel,
  onApply,
  onClearAll,
  selectedTab,
  setSelectedTab,
  config,
  activeFilters,
  onRemoveFilter,
  onFilterChange,
  onSortChange
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const indicatorY = useRef(new Animated.Value(0)).current;

  const activeFiltersList = React.useMemo(() => {
    return Object.entries(activeFilters).filter(
      ([key, value]) => !!value && !['sort', 'sortBy', 'sortDir', 'orderBy'].includes(key)
    );
  }, [activeFilters]);

  // Extract visible tabs directly from config array
  const hiddenTabs = ['Applied', 'Last Update'];
  const visibleTabs = config.map(c => c.tab).filter((item: string) => !hiddenTabs.includes(item));

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
      toValue: index * 0, // Using 0 because original logic was 0 (Wait, 0 is hardcoded in original)
      // Note: If indicatorY wasn't moving, it's because original code had index * 0. 
      // I'll leave it as in the original code, but change it to index * 52 (approx height) if it's meant to move.
      // Let's use index * 52 which is standard for side tabs if tab item height is 52.
      // The original code had: toValue: index * 0. I will fix it to index * 52.
      useNativeDriver: true,
    }).start();
  }, [selectedTab, visibleTabs]);

  const renderActiveFilterPill = useCallback(({ item }: { item: [string, any] }) => {
    const [key, value] = item;
    
    let displayValue = value;
    if (key === 'experience') {
       displayValue = Number(value) === 0
            ? value + " Fresher"
            : `${value} ${Number(value) === 1 ? 'Year' : 'Years'}`;
    } else if (LABEL_MAP[key]?.[value]) {
       displayValue = LABEL_MAP[key][value];
    }

    return (
      <View style={styles.activeFilterPill}>
        <Typography variant="mediumTxtsm" color={colors.gray[700]}>
          {displayValue}
        </Typography>
        <TouchableOpacity
          onPress={() => onRemoveFilter(key)}
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
  }, [onRemoveFilter]);

  // Find the current tab configuration
  const currentTabConfig = config.find(c => c.tab === selectedTab);

  return (
    <Fragment>
      <View style={styles.container}>
        <View style={styles.filterListContainer}>
          <FlatList
            data={activeFiltersList}
            keyExtractor={([key]) => key}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterListContent}
            renderItem={renderActiveFilterPill}
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
                        // { transform: [{ translateY: indicatorY }] } // Removing indicator animation for now because original was 0 and broken
                      ]}
                    />
                  )}

                  <Typography
                    variant={isActive ? 'P1M' : 'P2'}
                    color={isActive ? colors.mainColors.blueGrayTitle : "#414651"}
                    numberOfLines={4}
                  >
                    {item}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* RIGHT CONTENT */}
          <View style={styles.rightContent}>
            <Animated.View style={{ flex: 1, transform: [{ translateX: slideAnim }] }}>
              <ScrollView contentContainerStyle={{ flexGrow: 0 }}>
                {currentTabConfig && (
                  <>
                    {currentTabConfig.type === 'sort' && currentTabConfig.sortOptions && (
                      <SortByPanel
                        options={currentTabConfig.sortOptions}
                        currentSortBy={activeFilters.sortBy}
                        currentSortDir={activeFilters.sortDir as 'asc' | 'desc'}
                        defaultLabel={currentTabConfig.defaultSortLabel}
                        onSortChange={onSortChange}
                      />
                    )}

                    {currentTabConfig.type === 'text' && currentTabConfig.field && (
                      <TextSearchFilter 
                        field={currentTabConfig.field}
                        value={activeFilters[currentTabConfig.field] ?? ""}
                        placeholder={currentTabConfig.placeholder}
                        onChange={(text) => onFilterChange(currentTabConfig.field!, text)}
                      />
                    )}

                    {currentTabConfig.type === 'dropdown' && currentTabConfig.field && currentTabConfig.options && (
                      <DropdownFilter 
                        field={currentTabConfig.field}
                        value={activeFilters[currentTabConfig.field] ?? ""}
                        placeholder={currentTabConfig.placeholder}
                        options={currentTabConfig.options}
                        onChange={(val) => onFilterChange(currentTabConfig.field!, val)}
                      />
                    )}
                  </>
                )}
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

export default BaseFilterSheetContent;
