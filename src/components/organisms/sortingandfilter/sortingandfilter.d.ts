export interface SortingAndFilterProps {
  title: string;
  options: string[];
  onPressFilter: () => void;
  selectedTab: string;
  setSelectedTab?: (tab: string) => void;
  onItemPress: (item: string) => void;
  containerStyle?: any;
  filterButtonStyle?: any;
  chipStyle?: any;
  activeChipStyle?: any;
}
