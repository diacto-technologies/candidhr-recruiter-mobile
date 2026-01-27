import { GestureResponderEvent } from 'react-native';

export interface IHeader {
  title?: string; // optional (default "Checkout")
  onBack?: (event?: GestureResponderEvent) => void; // optional back press callback
  backNavigation?:boolean;
  edit?:boolean;
  threedot?:boolean;
  borderCondition?:boolean;
  showTitle?: boolean;
  // Simple search icon (just shows icon with callback, no dropdown)
  showSearchIcon?: boolean;
  onSearchIconPress?: () => void;
  // Job search related props (passed from parent component)
  enableJobSearch?: boolean;
  jobNameList?: any[];
  jobNameListLoading?: boolean;
  jobNameListNext?: string | null;
  searchText?: string;
  onSearchTextChange?: (text: string) => void;
  openSearch?: boolean;
  onSearchToggle?: (open: boolean) => void;
  onLoadMore?: () => void;
  onJobSelect?: (job: any) => void;
  onSearchClear?: () => void;
  selectedJob?: any;
  simpleSearch?: boolean;
  onSimpleSearch?: (text: string) => void;
  onSimpleClear?: () => void;
  simpleSearchPlaceholder?: string;
}
