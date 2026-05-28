import React from 'react';
import BaseFilterSheetContent from './index';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { selectJobFilters } from '../../../features/jobs/selectors';
import { setJobFilters, setJobSort } from '../../../features/jobs/slice';
import { jobConfig } from './config';

interface Props {
  onCancel: () => void;
  onApply: () => void;
  onClearAll: () => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}


const JobFilterSheet: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectJobFilters);

  return (
    <BaseFilterSheetContent
      {...props}
      config={jobConfig}
      activeFilters={filters}
      onRemoveFilter={(field) => {
        dispatch(setJobFilters({ ...filters, [field]: "" }));
      }}
      onFilterChange={(field, value) => {
        dispatch(setJobFilters({ ...filters, [field]: value }));
      }}
      onSortChange={(sortBy, sortDir) => {
        dispatch(setJobSort({ sortBy, sortDir }));
      }}
    />
  );
};

export default JobFilterSheet;
