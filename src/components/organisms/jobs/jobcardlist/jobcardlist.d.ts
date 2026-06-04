import { Job } from '../../../../features/jobs';
import { useStyles } from './styles';

export interface JobCardListProps {
  tabs: string[];
  activeTab: string;
  jobsList: Job[];
  loading: boolean;
  isTabLoading: boolean;
  publishedCount: number;
  unpublishedCount: number;
  favouritesCount: number;
  isConnected: boolean;
  onChangeTab: (label: string) => void;
  onLoadMore: () => void;
  onJobPress: (jobId: string) => void;
  favouriteJobIds?: string[];
  onToggleFavourite?: (jobId: string) => void;
  hasMore?: boolean;
}

export interface JobCardRowProps {
  item: Job;
  cardStyles: ReturnType<typeof useStyles>;
  onJobPress: (jobId: string) => void;
  favouriteJobIds: string[];
  onToggleFavourite?: (jobId: string) => void;
}
