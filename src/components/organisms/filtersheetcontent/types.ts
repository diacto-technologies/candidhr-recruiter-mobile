import { CommonDropdownOption } from "../commondropdown/types";

export type FilterType = 'sort' | 'text' | 'dropdown';

export interface SortOption {
  label: string;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}

export interface FilterConfig {
  tab: string; // The label shown on the left tabs (e.g. "Sort", "Name", "Status")
  type: FilterType; // Which UI component to render
  
  // For 'sort' type
  sortOptions?: SortOption[];
  defaultSortLabel?: string;
  
  // For 'text' and 'dropdown' type
  field?: string; // The key in the Redux store (e.g. "name", "status")
  
  // For 'text' type
  placeholder?: string;
  
  // For 'dropdown' type
  options?: CommonDropdownOption[];
}
