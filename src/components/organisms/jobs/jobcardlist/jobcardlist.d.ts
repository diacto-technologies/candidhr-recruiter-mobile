export interface JobItem {
    id: string;
    title: string;
    applicants: number;
    date: string;
    author: string;
    status: 'Published' | 'Unpublished';
}