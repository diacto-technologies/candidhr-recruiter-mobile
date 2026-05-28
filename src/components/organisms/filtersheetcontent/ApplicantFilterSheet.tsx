import React from 'react';
import BaseFilterSheetContent from './index';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { selectApplicationsFilters } from '../../../features/applications/selectors';
import { setApplicationsFilters, setSort } from '../../../features/applications/slice';
import { applicantConfig } from './config';

interface Props {
  onCancel: () => void;
  onApply: () => void;
  onClearAll: () => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}


const ApplicantFilterSheet: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectApplicationsFilters);

  return (
    <BaseFilterSheetContent
      {...props}
      config={applicantConfig}
      activeFilters={filters}
      onRemoveFilter={(field) => {
        dispatch(setApplicationsFilters({ ...filters, [field]: "" }));
      }}
      onFilterChange={(field, value) => {
        dispatch(setApplicationsFilters({ ...filters, [field]: value }));
      }}
      onSortChange={(sortBy, sortDir) => {
        dispatch(setSort({ sortBy, sortDir }));
      }}
    />
  );
};

export default ApplicantFilterSheet;
