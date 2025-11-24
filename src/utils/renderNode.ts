import { isValidElement } from 'react';

export const renderNode = (component?: React.ReactNode | (() => React.ReactNode)) => {
  if (typeof component === 'function') {
    const result = component();
    return isValidElement(result) ? result : null;
  }
  return isValidElement(component) ? component : null;
};
