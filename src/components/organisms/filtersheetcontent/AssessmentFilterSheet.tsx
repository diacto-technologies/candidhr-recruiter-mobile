import React from 'react';
import BaseFilterSheetContent from './index';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { selectAssignedAssessmentFilters } from '../../../features/assessments/selectors';
import { setAssignedAssessmentFilters, setAssignedAssessmentSort } from '../../../features/assessments/slice';
import { assessmentConfig } from './config';

interface Props {
  onCancel: () => void;
  onApply: () => void;
  onClearAll: () => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}


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
