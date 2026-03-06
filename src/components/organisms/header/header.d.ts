import { GestureResponderEvent } from 'react-native';
import type { ChangeStatusModalProps } from '../changeStatusModal';

export interface IHeader {
  title?: string;
  onBack?: (event?: GestureResponderEvent) => void;
  backNavigation?: boolean;
  edit?: boolean;
  threedot?: boolean;
  borderCondition?: boolean;
  showTitle?: boolean;

  // Simple search icon
  showSearchIcon?: boolean;
  onSearchIconPress?: () => void;

  // Job search related props
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

  // ✅ Status Dropdown Props
  statusDropdown?: boolean;
  statusOptions?: any[];
  statusLabelKey?: string;
  statusValueKey?: string;
  statusValue?: string;
  onStatusSelect?: (item: any) => void;
  /** When true, selecting a status from dropdown opens ChangeStatusModal (with optional custom message / hide Add reason) */
  statusOpenModalOnSelect?: boolean;
  /** Props for ChangeStatusModal when opened from header (e.g. hideAddReason, initialEmailMessage) */
  statusChangeStatusModalProps?: Omit<ChangeStatusModalProps, 'visible' | 'onClose'>;
}