export interface SortOption {
  label: string;
  value: string;
}

export interface SortBottomSheetProps {
  options?: SortOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onApply: () => void;
}
