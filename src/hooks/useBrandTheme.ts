import { useEffect, useMemo } from 'react';
import { useAppSelector } from './useAppSelector';
import { selectProfile } from '../features/profile/selectors';
import { selectBrandingData } from '../features/branding/selectors';
import { colors, setBrandColor } from '../theme/colors';

/**
 * Custom hook that monitors workspace branding / tenant primary_color
 * and synchronizes the dynamic brand color scale across the app.
 */
export const useBrandTheme = () => {
  const profile = useAppSelector(selectProfile);
  const brandingData = useAppSelector(selectBrandingData);

  const primaryColor = useMemo(() => {
    return (
      brandingData?.primary_color ||
      profile?.tenant?.primary_color ||
      colors.brand[600]
    );
  }, [brandingData?.primary_color, profile?.tenant?.primary_color]);

  useEffect(() => {
    if (primaryColor) {
      setBrandColor(primaryColor);
    }
  }, [primaryColor]);

  return {
    primaryColor,
    brandColors: colors.brand,
    mainColor: colors.mainColors.main,
  };
};
