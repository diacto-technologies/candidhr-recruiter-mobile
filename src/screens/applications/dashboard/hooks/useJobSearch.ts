import { useState, useCallback, useEffect, useRef } from 'react';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { 
    getJobNameListRequestAction, 
    selectJobNameList, 
    selectJobNameListLoading, 
    selectJobNameListNext, 
    selectSelectedJob, 
    setSelectedJobAction 
} from '../../../../features/jobs';
import { JobNameItem } from '../../../../features/jobs/types';
import { useDebounce } from '../../../../hooks/useDebounce';
import { SEARCH_DEBOUNCE } from '../constants';

export const useJobSearch = (onJobSelectCallback: (jobId?: string) => void) => {
    const dispatch = useAppDispatch();
    
    const jobNameList = useAppSelector(selectJobNameList);
    const jobNameListNext = useAppSelector(selectJobNameListNext);
    const jobNameListLoading = useAppSelector(selectJobNameListLoading);
    const selectedJob = useAppSelector(selectSelectedJob);

    const [openSearch, setOpenSearch] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);

    const { debounce } = useDebounce();

    // Debounced search trigger
    const triggerSearch = useCallback(
        debounce((searchQuery: string) => {
            setPage(1);
            dispatch(
                getJobNameListRequestAction({
                    page: 1,
                    search: searchQuery,
                    append: false,
                })
            );
        }, SEARCH_DEBOUNCE),
        [dispatch, debounce]
    );

    // Initial search when opened
    useEffect(() => {
        if (openSearch && searchText === '') {
            setPage(1);
            dispatch(
                getJobNameListRequestAction({
                    page: 1,
                    search: '',
                    append: false,
                })
            );
        }
    }, [openSearch, dispatch, searchText]);

    const prevOpenSearchRef = useRef(false);
    useEffect(() => {
        if (openSearch && !prevOpenSearchRef.current && selectedJob?.title) {
            if (searchText === '') {
                setSearchText(selectedJob.title);
            }
        }
        prevOpenSearchRef.current = openSearch;
    }, [openSearch, selectedJob, searchText]);

    const handleLoadMore = useCallback(() => {
        if (!jobNameListNext || jobNameListLoading) return;

        const nextPage = page + 1;
        setPage(nextPage);

        dispatch(
            getJobNameListRequestAction({
                page: nextPage,
                search: searchText,
                append: true,
            })
        );
    }, [jobNameListNext, jobNameListLoading, page, searchText, dispatch]);

    const handleSelectJob = useCallback((item: JobNameItem) => {
        dispatch(setSelectedJobAction(item));
        if (item?.title) {
            setSearchText(item.title);
        }
        onJobSelectCallback(item.id);
        setOpenSearch(false);
    }, [dispatch, onJobSelectCallback]);

    const handleSearchClear = useCallback(() => {
        setSearchText('');
        setPage(1);
        setOpenSearch(false);
        dispatch(setSelectedJobAction(null));
        onJobSelectCallback();
    }, [dispatch, onJobSelectCallback]);

    const handleSearchTextChange = useCallback((text: string) => {
        if (text === '') {
            handleSearchClear();
            return;
        }
        setSearchText(text);
        // We trigger the debounced API call instead of an inline useEffect
        triggerSearch(text);
    }, [handleSearchClear, triggerSearch]);

    return {
        jobNameList,
        jobNameListLoading,
        jobNameListNext,
        selectedJob,
        openSearch,
        searchText,
        setOpenSearch,
        handleLoadMore,
        handleSelectJob,
        handleSearchClear,
        handleSearchTextChange,
    };
};
