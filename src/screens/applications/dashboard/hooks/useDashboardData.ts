import { useEffect, useCallback } from 'react';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { 
    getAnalyticsRequestAction, 
    getFeatureConsumptionRequestAction, 
    getStageGraphOverviewRequestAction, 
    getStageGraphRequestAction 
} from '../../../../features/dashbaord/actions';
import { 
    selectAnalyticsData, 
    selectAnalyticsLoaded, 
    selectAnalyticsLoading,
    selectApplicantStageGraphLoading, 
    selectApplicantStageGraphResults, 
    selectFeatureConsumption, 
    selectFeatureConsumptionLoading, 
    selectStageGraphOverview, 
    selectStageGraphOverviewLoading 
} from '../../../../features/dashbaord/selectors';

export const useDashboardData = () => {
    const dispatch = useAppDispatch();
    
    const analyticsData = useAppSelector(selectAnalyticsData);
    const analyticsLoaded = useAppSelector(selectAnalyticsLoaded);
    const analyticsLoading = useAppSelector(selectAnalyticsLoading);
    const stageData = useAppSelector(selectApplicantStageGraphResults);
    const stageDataLoading = useAppSelector(selectApplicantStageGraphLoading);
    const featureData = useAppSelector(selectFeatureConsumption);
    const featureLoading = useAppSelector(selectFeatureConsumptionLoading);
    const stageGraphOverview = useAppSelector(selectStageGraphOverview);
    const stageGraphOverviewLoading = useAppSelector(selectStageGraphOverviewLoading);

    // Provide a unified dispatch mechanism to trigger all dashboard requests
    // Using a unified request action inside sagas is better, but this orchestrates it directly for now.
    const fetchDashboardData = useCallback((jobId?: string) => {
        dispatch(getAnalyticsRequestAction(jobId));
        dispatch(getStageGraphRequestAction(jobId));
        dispatch(getFeatureConsumptionRequestAction(jobId));
        dispatch(getStageGraphOverviewRequestAction(jobId));
    }, [dispatch]);

    useEffect(() => {
        if (!analyticsLoaded) {
            fetchDashboardData();
        }
    }, [analyticsLoaded, fetchDashboardData]);

    return {
        analyticsData,
        analyticsLoading,
        stageData,
        stageDataLoading,
        featureData,
        featureLoading,
        stageGraphOverview,
        stageGraphOverviewLoading,
        fetchDashboardData,
    };
};
