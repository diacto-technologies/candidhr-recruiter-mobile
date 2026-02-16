import React from 'react';
import { PermissionCodename } from '../../../utils/permission.constants';
import { usePermission } from '../../../hooks/usePermission';

interface Props {
  permission: PermissionCodename;
  children: React.ReactNode;
}

const PermissionGate = ({ permission, children }: Props) => {
  const { can } = usePermission();

  if (!can(permission)) return null;

  return <>{children}</>;
};

export default PermissionGate;
