import React, { FC } from 'react';
import { View, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import Typography from '../../atoms/typography';
import { colors } from '../../../theme/colors';
import { SvgXml } from 'react-native-svg';
import { filterIcon } from '../../../assets/svg/filter';
import { useStyles } from './styles';
import { useBrandTheme } from '../../../hooks/useBrandTheme';

import { SortingAndFilterProps } from './sortingandfilter.d';

const SortingAndFilter: FC<SortingAndFilterProps> = ({
  title,
  options,
  onPressFilter,
  selectedTab,
  onItemPress,
  containerStyle,
  filterButtonStyle,
  chipStyle,
  activeChipStyle,
}) => {
  const { brandColors } = useBrandTheme();
  const styles = useStyles();

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Filter Button */}
      <Pressable onPress={onPressFilter} style={[styles.filterButton, filterButtonStyle]}>
        <View style={styles.iconWrapper}>
          <SvgXml xml={filterIcon} color={brandColors[500]} />
          <View style={[styles.notificationDot, { backgroundColor: brandColors[500] }]} />
        </View>

        <Typography variant="H4" style={styles.titleText}>
          {title}
        </Typography>
      </Pressable>

      {/* Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options?.map((item) => {
          const isActive = item === selectedTab;

          return (
            <TouchableOpacity
              key={item}
              onPress={() => onItemPress(item)}
              style={[
                styles.chip,
                isActive ? [styles.chipActive, { borderColor: brandColors[200], backgroundColor: brandColors[50] }] : styles.chipInactive,
                chipStyle,
                isActive && activeChipStyle,
              ]}
            >
              <Typography
                variant="P1M"
                color={isActive ? brandColors[700] : colors.gray[700]}
              >
                {item}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SortingAndFilter;
