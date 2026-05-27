import React from 'react';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { selectApplicationsFilters } from '../../../../features/applications/selectors';
import { setApplicationsFilters, setSort } from '../../../../features/applications/slice';
import BaseFilterSheetContent from '../../../../components/organisms/filtersheetcontent/index';
import { FilterConfig } from '../../../../components/organisms/filtersheetcontent/types';

interface Props {
  onCancel: () => void;
  onApply: () => void;
  onClearAll: () => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const applicantConfig: FilterConfig[] = [
  {
    tab: 'Sort',
    type: 'sort',
    defaultSortLabel: 'Applied On: New → Old',
    sortOptions: [
      { label: 'Applicant Name: A → Z', sortBy: 'Applicant name', sortDir: 'asc' },
      { label: 'Applicant Name: Z → A', sortBy: 'Applicant name', sortDir: 'desc' },
      { label: 'Resume Score: Low → High', sortBy: 'Resume Score', sortDir: 'asc' },
      { label: 'Resume Score: High → Low', sortBy: 'Resume Score', sortDir: 'desc' },
      { label: 'Applied On: Old → New', sortBy: 'Applied', sortDir: 'asc' },
      { label: 'Applied On: New → Old', sortBy: 'Applied', sortDir: 'desc' },
      { label: 'Last Updated: Old → New', sortBy: 'Last Update', sortDir: 'asc' },
      { label: 'Last Updated: New → Old', sortBy: 'Last Update', sortDir: 'desc' },
    ]
  },
  { tab: 'Name', type: 'text', field: 'name', placeholder: "Search by 'Name'" },
  { 
    tab: 'Source', 
    type: 'dropdown', 
    field: 'source', 
    placeholder: 'All', 
    options: [
      { label: "Form", value: "application_form" },
      { label: "Bulk Import", value: "imported_using_bulk_resume_upload" },
    ] 
  },
  { tab: 'Applied For', type: 'text', field: 'appliedFor', placeholder: "Search by 'Applied For'" },
  { 
    tab: 'Status', 
    type: 'dropdown', 
    field: 'status', 
    placeholder: 'All', 
    options: [
      { label: "Applied ", value: "applied" },
      { label: "In Progress", value: "in_progress" },
      { label: "Shortlisted", value: "shortlisted" },
      { label: "Rejected", value: "rejected" },
      { label: "On Hold", value: "on_hold" },
      { label: "Interview Scheduled", value: "interview_scheduled" },
      { label: "Final Interview", value: "final_interview" },
      { label: "Hired", value: "hired" },
      { label: "Offer Extended", value: "offer_extended" },
      { label: "Offer Accepted", value: "offer_accepted" },
      { label: "Offer Rejected", value: "offer_rejected" },
      { label: "Not Selected", value: "not_selected" },
      { label: "Withdrawn", value: "withdrawn" },
      { label: "Archived", value: "archived" },
    ] 
  },
  { 
    tab: 'Stage', 
    type: 'dropdown', 
    field: 'latestStageName', 
    placeholder: 'All', 
    options: [
      { label: "Resume Screening", value: "resume_screening" },
      { label: "Assessment", value: "assessment" },
      { label: "Automated Video Interview", value: "automated_video_interview" },
    ] 
  },
  { 
    tab: 'Approved', 
    type: 'dropdown', 
    field: 'latestStageStatus', 
    placeholder: 'All', 
    options: [
      { label: "Approved", value: "approved" },
      { label: "Not Approved", value: "not_approved" },
      { label: "Pending", value: "approval_pending" },
    ] 
  }
];

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
