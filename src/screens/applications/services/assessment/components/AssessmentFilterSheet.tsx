import React from 'react';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { selectAssignedAssessmentFilters } from '../../../../../features/assessments/selectors';
import { setAssignedAssessmentFilters, setAssignedAssessmentSort } from '../../../../../features/assessments/slice';
import BaseFilterSheetContent from '../../../../../components/organisms/filtersheetcontent/index';
import { FilterConfig } from '../../../../../components/organisms/filtersheetcontent/types';

interface Props {
  onCancel: () => void;
  onApply: () => void;
  onClearAll: () => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const assessmentConfig: FilterConfig[] = [
  {
    tab: 'Sort',
    type: 'sort',
    defaultSortLabel: 'Assigned On: New → Old',
    sortOptions: [
      { label: 'Applicant: A → Z', sortBy: 'Applicant', sortDir: 'asc' },
      { label: 'Applicant: Z → A', sortBy: 'Applicant', sortDir: 'desc' },
      { label: 'Email: A → Z', sortBy: 'Email', sortDir: 'asc' },
      { label: 'Email: Z → A', sortBy: 'Email', sortDir: 'desc' },
      { label: 'Job Title: A → Z', sortBy: 'Job Title', sortDir: 'asc' },
      { label: 'Job Title: Z → A', sortBy: 'Job Title', sortDir: 'desc' },
      { label: 'Avg %: Low → High', sortBy: 'Avg %', sortDir: 'asc' },
      { label: 'Avg %: High → Low', sortBy: 'Avg %', sortDir: 'desc' },
      { label: 'Assigned At: Old → New', sortBy: 'Assigned At', sortDir: 'asc' },
      { label: 'Assigned At: New → Old', sortBy: 'Assigned At', sortDir: 'desc' },
      { label: 'Valid Till: Old → New', sortBy: 'Valid Till', sortDir: 'asc' },
      { label: 'Valid Till: New → Old', sortBy: 'Valid Till', sortDir: 'desc' },
    ]
  },
  { tab: 'Applicant', type: 'text', field: 'applicant_name__icontains', placeholder: "Search by 'Applicant'" },
  { tab: 'Email', type: 'text', field: 'candidate_email__icontains', placeholder: "Search by 'Email'" },
  { tab: 'Job Title', type: 'text', field: 'job__title__icontains', placeholder: "Search by 'Job Title'" },
  { tab: 'Avg Percentage', type: 'text', field: 'average_percentage__in', placeholder: "Search by 'Avg Percentage'" },
  { tab: 'Assigned By', type: 'text', field: 'assigned_by__name__icontains', placeholder: "Search by 'Assigned By'" },
  { 
    tab: 'Status', 
    type: 'dropdown', 
    field: 'status_text', 
    placeholder: 'All', 
    options: [
      { label: "All", value: "" },
      { label: "Assigned Successfully", value: "Assigned Successfully" },
      { label: "Link Opened", value: "Link Opened" },
      { label: "Started", value: "Started" },
      { label: "Assigned", value: "Assigned" },
      { label: "Completed", value: "Completed" },
      { label: "Shortlisted", value: "Shortlisted" },
      { label: "Rejected", value: "Rejected" },
      { label: "Scheduled Final Interview", value: "Scheduled Final Interview" },
      { label: "Hired", value: "Hired" },
      { label: "Disqualified", value: "Disqualified" },
      { label: "Shortlisted By WorkFlow", value: "Shortlisted By WorkFlow" },
      { label: "Not shortlisted By WorkFlow", value: "Not shortlisted By WorkFlow" },
    ] 
  },
];

const AssessmentFilterSheet: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectAssignedAssessmentFilters);

  return (
    <BaseFilterSheetContent
      {...props}
      config={assessmentConfig}
      activeFilters={filters}
      onRemoveFilter={(field) => {
        dispatch(setAssignedAssessmentFilters({ [field]: "" }));
      }}
      onFilterChange={(field, value) => {
        dispatch(setAssignedAssessmentFilters({ [field]: value }));
      }}
      onSortChange={(sortBy, sortDir) => {
        dispatch(setAssignedAssessmentSort({ sortBy, sortDir }));
      }}
    />
  );
};

export default AssessmentFilterSheet;
