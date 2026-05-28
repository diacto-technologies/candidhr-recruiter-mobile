import React from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { selectJobFilters } from '../../../features/jobs/selectors';
import { setJobFilters, setJobSort } from '../../../features/jobs/slice';
import BaseFilterSheetContent from '../../../components/organisms/filtersheetcontent/index';
import { FilterConfig } from '../../../components/organisms/filtersheetcontent/types';

interface Props {
  onCancel: () => void;
  onApply: () => void;
  onClearAll: () => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const jobConfig: FilterConfig[] = [
  {
    tab: 'Sort',
    type: 'sort',
    defaultSortLabel: 'Close Date: New → Old',
    sortOptions: [
      { label: 'Job Title: A → Z', sortBy: 'Job Title', sortDir: 'asc' },
      { label: 'Job Title: Z → A', sortBy: 'Job Title', sortDir: 'desc' },
      { label: 'Location: A → Z', sortBy: 'Location', sortDir: 'asc' },
      { label: 'Location: Z → A', sortBy: 'Location', sortDir: 'desc' },
      { label: 'Close Date: Old → New', sortBy: 'Close Date', sortDir: 'asc' },
      { label: 'Close Date: New → Old', sortBy: 'Close Date', sortDir: 'desc' },
    ]
  },
  { tab: 'Title', type: 'text', field: 'title', placeholder: "Search by 'Title'" },
  { tab: 'Location', type: 'text', field: 'location', placeholder: "Search by 'Location'" },
  { 
    tab: 'Employment Type', 
    type: 'dropdown', 
    field: 'employmentType', 
    placeholder: "Search by 'Employee Type'", 
    options: [
      { label: "Full Time", value: "Full Time" },
      { label: "Part Time", value: "Part Time" },
      { label: "Contract", value: "Contract" },
    ] 
  },
  { tab: 'Created By', type: 'text', field: 'createdBy', placeholder: "Search by 'Created By'" },
];

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
