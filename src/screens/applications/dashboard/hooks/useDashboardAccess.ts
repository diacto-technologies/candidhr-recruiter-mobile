import { useEffect } from 'react';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { getProfileRequestAction } from '../../../../features/profile/actions';
import { selectProfile, selectProfileError, selectProfileLoading } from '../../../../features/profile';
import { usePermission } from '../../../../hooks/usePermission';
import { PERMISSIONS } from '../../../../utils/permission.constants';

export const useDashboardAccess = () => {
    const dispatch = useAppDispatch();
    
    const profile = useAppSelector(selectProfile);
    const profileLoading = useAppSelector(selectProfileLoading);
    const profileError = useAppSelector(selectProfileError);
    const { can } = usePermission();

    /** Until profile exists (or fetch failed), `can()` is unreliable — don’t show “no access” yet. */
    const dashboardAccessLoading = profileLoading || (profile === null && profileError === null);
    const hasDashboardAccess = can(PERMISSIONS.VIEW_DASHBOARD);

    // Initial Profile Fetch Effect
    useEffect(() => {
        if (!profile && !profileLoading && !profileError) {
            dispatch(getProfileRequestAction());
        }
    }, [profile, profileLoading, profileError, dispatch]);

    return {
        dashboardAccessLoading,
        hasDashboardAccess,
    };
};
