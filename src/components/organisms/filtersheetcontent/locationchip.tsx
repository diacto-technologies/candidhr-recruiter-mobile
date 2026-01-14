import React from 'react';
import { View } from 'react-native';
import SearchBar from '../../atoms/searchbar';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { selectApplicationsFilters } from '../../../features/applications/selectors';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { setApplicationsFilters } from '../../../features/applications/slice';

const AppliedFor: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectApplicationsFilters);
  return (
    <View style={{ paddingHorizontal: 10 }}>
      <SearchBar value={filters.appliedFor}
        placeholder="Applied For"
        onChangeText={(v) =>
          dispatch(setApplicationsFilters({ appliedFor: v }))
        }
      />
    </View>
  );
};
export default AppliedFor;