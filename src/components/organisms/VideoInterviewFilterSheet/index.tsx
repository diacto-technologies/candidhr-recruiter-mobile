import React from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { selectPersonalityScreeningFilters } from '../../../features/personalityScreening/selectors';
import { setFilters as setPersonalityScreeningFilters, setSort as setPersonalityScreeningSort } from '../../../features/personalityScreening/slice';
import BaseFilterSheetContent from '../../../components/organisms/filtersheetcontent/index';
import { FilterConfig } from '../../../components/organisms/filtersheetcontent/types';

interface Props {
  onCancel: () => void;
  onApply: () => void;
  onClearAll: () => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const videoInterviewConfig: FilterConfig[] = [
  {
    tab: 'Sort',
    type: 'sort',
    defaultSortLabel: 'Assigned On: New → Old',
    sortOptions: [
      { label: 'Applicant: A → Z', sortBy: 'Applicant', sortDir: 'asc' },
      { label: 'Applicant: Z → A', sortBy: 'Applicant', sortDir: 'desc' },
      { label: 'Email: A → Z', sortBy: 'Email', sortDir: 'asc' },
      { label: 'Email: Z → A', sortBy: 'Email', sortDir: 'desc' },
      { label: 'Assigned On: Old → New', sortBy: 'Assigned On', sortDir: 'asc' },
      { label: 'Assigned On: New → Old', sortBy: 'Assigned On', sortDir: 'desc' },
      { label: 'Expires On: Old → New', sortBy: 'Expires On', sortDir: 'asc' },
      { label: 'Expires On: New → Old', sortBy: 'Expires On', sortDir: 'desc' },
    ]
  },
  { tab: 'Applicant', type: 'text', field: 'applicant_name__icontains', placeholder: "Search by 'Applicant'" },
  { tab: 'Email', type: 'text', field: 'candidate_email__icontains', placeholder: "Search by 'Email'" },
  { tab: 'Job Name', type: 'text', field: 'job__title__icontains', placeholder: "Search by 'Job Title'" },
  { tab: 'Assigned By', type: 'text', field: 'assigned_by__name__icontains', placeholder: "Search by 'Assigned By'" },
  { 
    tab: 'Status', 
    type: 'dropdown', 
    field: 'status_text', 
    placeholder: 'All', 
    options: [
      { label: "All", value: "" },
      { label: "Assigned", value: "Assigned" },
      { label: "Link Opened", value: "Link Opened" },
      { label: "Started", value: "Started" },
      { label: "Completed", value: "Completed" },
      { label: "Shortlisted", value: "Shortlisted" },
      { label: "Hired", value: "Hired" },
      { label: "Scheduled Final Interview", value: "Scheduled Final Interview" },
      { label: "Revoked", value: "Revoked" },
      { label: "Rejected", value: "Rejected" },
      { label: "On Hold", value: "On Hold" },
    ] 
  },
];

const VideoInterviewFilterSheet: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectPersonalityScreeningFilters);

  return (
    <BaseFilterSheetContent
      {...props}
      config={videoInterviewConfig}
      activeFilters={filters}
      onRemoveFilter={(field) => {
        dispatch(setPersonalityScreeningFilters({ [field]: "" }));
      }}
      onFilterChange={(field, value) => {
        dispatch(setPersonalityScreeningFilters({ [field]: value }));
      }}
      onSortChange={(sortBy, sortDir) => {
        dispatch(setPersonalityScreeningSort({ sortBy, sortDir }));
      }}
    />
  );
};

export default VideoInterviewFilterSheet;
