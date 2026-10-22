import {
  usersIcon,
  manageRolesIcon,
  companyInfoIcon,
  templatesIcon,
  privacyPolicyIcon,
  termsConditionsIcon,
  logoutIcon,
  brandingIcon,
} from '../../../assets/svg/settingsIcons';
import { MenuSection } from './profile';

interface ProfileMenuParams {
  t: (key: string) => string;
  handleUsersPress: () => void;
  handleCompanyInfoPress: () => void;
  handleBrandingPress?: () => void;
  showBranding?: boolean;
  handleLogout: () => void;
}

export const getProfileMenuSections = ({
  t,
  handleUsersPress,
  handleCompanyInfoPress,
  handleBrandingPress,
  showBranding = false,
  handleLogout,
}: ProfileMenuParams): MenuSection[] => {
  const sections: MenuSection[] = [];

  if (showBranding && handleBrandingPress) {
    sections.push({
      id: 'brandingSection',
      items: [
        {
          id: 'branding',
          title: t('screens.profile.branding') || 'Branding',
          icon: brandingIcon,
          onPress: handleBrandingPress,
        },
      ],
    });
  }

  sections.push({
    id: 'section2',
    items: [
      {
        id: 'logout',
        title: t('screens.profile.logout'),
        icon: logoutIcon,
        onPress: handleLogout,
        isLogout: true,
      },
    ],
  });

  return sections;
};
  