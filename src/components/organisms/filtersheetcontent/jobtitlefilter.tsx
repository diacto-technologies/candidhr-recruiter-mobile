// components/filters/tabs/JobTitleFilter.tsx
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Typography from '../../atoms/typography';
import SearchBar from '../../atoms/searchbar';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectApplicationsFilters } from '../../../features/applications/selectors';
import { setApplicationsFilters } from '../../../features/applications/slice';

const jobTitles = [
  { label: 'Hybrid', count: 23 },
  { label: 'Work from office', count: 3 },
  { label: 'Remote', count: 12 },
];

const JobTitleFilter = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectApplicationsFilters);

  // const toggle = (label: string) => {
  //   setSelected((prev) =>
  //     prev.includes(label)
  //       ? prev.filter((i) => i !== label)
  //       : [...prev, label]
  //   );
  // };

  return (
    <View style={{ paddingHorizontal: 10 }}>
      <SearchBar value={filters.name}
        placeholder="Search"
        onChangeText={(v) =>
          dispatch(setApplicationsFilters({ name: v }))
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#6C4BE7',
    borderColor: '#6C4BE7',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
});

export default JobTitleFilter;
