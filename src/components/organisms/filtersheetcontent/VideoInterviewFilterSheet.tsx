import React from 'react';
import BaseFilterSheetContent from './index';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { selectPersonalityScreeningFilters } from '../../../features/personalityScreening/selectors';
import { setFilters as setPersonalityScreeningFilters, setSort as setPersonalityScreeningSort } from '../../../features/personalityScreening/slice';
import { videoInterviewConfig } from './config';

interface Props {
  onCancel: () => void;
  onApply: () => void;
  onClearAll: () => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}


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
