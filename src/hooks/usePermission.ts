import { useMemo, useCallback } from 'react';
import { useAppSelector } from '../store/hooks';
import { selectProfile } from '../features/profile/selectors';
import { PermissionCodename } from '../utils/permission.constants';

export const usePermission = () => {
  const profile = useAppSelector(selectProfile);

  const permissionSet = useMemo(() => {
    if (!profile?.role?.permissions)
      return new Set<PermissionCodename>();

    return new Set<PermissionCodename>(
      profile.role.permissions.map(
        (p) => p.codename as PermissionCodename
      )
    );
  }, [profile?.role?.permissions]);

  const can = useCallback(
    (permission: PermissionCodename) => {
      if (!profile) return false;

      if (profile.is_superadmin) return true;

      return permissionSet.has(permission);
    },
    [permissionSet, profile]
  );

  return { can };
};
