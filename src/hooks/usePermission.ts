import { useMemo, useCallback } from 'react';
import { useAppSelector } from '../store/hooks';
import { selectProfile } from '../features/profile/selectors';
import { PermissionCodename, PERMISSIONS } from '../utils/permission.constants';

export const usePermission = () => {
  const profile = useAppSelector(selectProfile);

  const permissionSet = useMemo(() => {
    const set = new Set<PermissionCodename>();

    if (profile?.role?.permissions) {
      profile.role.permissions.forEach((p) => {
        set.add(p.codename as PermissionCodename);
      });
    }

    // 🔥 force enable
    set.add(PERMISSIONS.UPDATE_APPLICATION_STATUS);

    return set;
  }, [JSON.stringify(profile?.role?.permissions)]);

  const can = useCallback(
    (permission: PermissionCodename) => {
      if (profile?.is_superadmin) return true;
      return permissionSet.has(permission);
    },
    [permissionSet, profile?.is_superadmin]
  );

  return { can };
};