// components/filters/tabs/JobTitleFilter.tsx
import React from 'react';
import { View } from 'react-native';
import SearchBar from '../../atoms/searchbar';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectApplicationsFilters } from '../../../features/applications/selectors';
import { setApplicationsFilters } from '../../../features/applications/slice';
import { useStyles } from './styles';
import { JobTitleFilterProps } from './jobtitlefilter.d';

const JobTitleFilter: React.FC<JobTitleFilterProps> = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectApplicationsFilters);
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <SearchBar value={filters.name}
        placeholder="Search"
        onChangeText={(v) =>
          dispatch(setApplicationsFilters({ name: v }))
        }
      />
    </View>
  );
};

export default JobTitleFilter;

