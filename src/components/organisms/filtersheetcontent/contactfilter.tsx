// components/ExperienceFilter.tsx
import React from 'react';
import { View } from 'react-native';
import SearchBar from '../../atoms/searchbar';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { selectApplicationsFilters } from '../../../features/applications/selectors';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { setApplicationsFilters } from '../../../features/applications/slice';

const ContactFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectApplicationsFilters);
  return (
    <View style={{ paddingHorizontal: 10 }}>
      <SearchBar value={filters.contact}
        placeholder="Contact"
        onChangeText={(v) =>
          dispatch(setApplicationsFilters({ contact: v }))
        }
        keyboardType="number-pad"
      />
    </View>
  );
};
export default ContactFilter;