export interface SortOption {
  label: string;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}

export interface SortByPanelProps {
  options: SortOption[];
  currentSortBy?: string;
  currentSortDir?: 'asc' | 'desc';
  defaultLabel?: string;
  onSortChange: (sortBy: string, sortDir: 'asc' | 'desc') => void;
}
