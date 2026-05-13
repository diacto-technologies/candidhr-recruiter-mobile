import {
    usersIcon,
    manageRolesIcon,
    companyInfoIcon,
    templatesIcon,
    privacyPolicyIcon,
    termsConditionsIcon,
    logoutIcon,
  } from '../../../assets/svg/settingsIcons';
  
  export const getProfileMenuSections = ({
    t,
    handleUsersPress,
    handleCompanyInfoPress,
    handleLogout,
  }: any) => [
    // {
    //   id: 'section1',
    //   items: [
    //     { id: 'users', title: t('screens.profile.users'), icon: usersIcon, onPress: handleUsersPress },
    //     { id: 'roles', title: t('screens.profile.manageRoles'), icon: manageRolesIcon },
    //     { id: 'company', title: t('screens.profile.companyInfo'), icon: companyInfoIcon, onPress: handleCompanyInfoPress },
    //   ],
    // },
    {
      id: 'section2',
      items: [
        // { id: 'templates', title: t('screens.profile.templates'), icon: templatesIcon },
        // { id: 'privacy', title: t('screens.profile.privacyPolicy'), icon: privacyPolicyIcon },
        // { id: 'terms', title: t('screens.profile.termsConditions'), icon: termsConditionsIcon },
        {
          id: 'logout',
          title: t('screens.profile.logout'),
          icon: logoutIcon,
          onPress: handleLogout,
          isLogout: true,
        },
      ],
    },
  ];
  