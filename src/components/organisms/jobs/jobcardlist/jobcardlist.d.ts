export interface JobItem {
    id: string;
    title: string;
    applicants: number;
    date: string;
    author: string;
    status: 'Published' | 'Unpublished';
}

export interface JobCardListProps {
    tabs: string[];
    activeTab: string;
    jobsList: Job[];
    loading: boolean;
    isTabLoading: boolean;
    hasMore: boolean;
    publishedCount: number;
    unpublishedCount: number;
    isConnected: boolean | null;
    onChangeTab: (tab: string) => void;
    onLoadMore: () => void;
    onJobPress: (jobId: string) => void;
}
