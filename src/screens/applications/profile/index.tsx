import React, { Fragment, useCallback, useEffect } from 'react';
import { View, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { Header, Shimmer } from '../../../components';
import { goBack, navigate, resetAndNavigate } from '../../../utils/navigationUtils';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import Typography from '../../../components/atoms/typography';
import { SvgXml } from 'react-native-svg';
import { colors } from '../../../theme/colors';
import { logoutRequestAction } from '../../../features/auth/actions';

import {
  usersIcon,
  manageRolesIcon,
  companyInfoIcon,
  templatesIcon,
  privacyPolicyIcon,
  termsConditionsIcon,
  logoutIcon,
  chevronRightIcon,
} from '../../../assets/svg/settingsIcons';

import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';

import {
  selectProfile,
  selectProfileLoading,
} from '../../../features/profile/selectors';
import { PROFILE_ACTION_TYPES } from '../../../features/profile/constants';
import { removeTokens } from '../../../utils/tokenUtils';
import { logoutSuccess } from '../../../features/auth/slice';
import { persistor } from '../../../store';
import Divider from '../../../components/atoms/divider';
import { useStyles } from './styles';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  onPress?: () => void;
  isLogout?: boolean;
}

interface MenuSection {
  id: string;
  items: MenuItem[];
}

const Profile = () => {
  const dispatch = useAppDispatch();
  const styles = useStyles();

  const profile = useAppSelector(selectProfile);
  const loading = useAppSelector(selectProfileLoading);

  useEffect(() => {
    dispatch({ type: PROFILE_ACTION_TYPES.GET_PROFILE_REQUEST });
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await removeTokens();
      dispatch(logoutSuccess());
      await persistor.purge();
    } catch (_) {
      // Ignore errors during cleanup
    }
    resetAndNavigate('GetStartedScreen');
  };

  const handleProfilePress = useCallback(() => {
    navigate('AccountInfo');
  }, []);

  const handleCompanyInfoPress = useCallback(() => {
    navigate('CompanyInfo');
  }, []);

  const handleUsersPress = useCallback(() => {
    navigate('Users');
  }, []);

  const menuSections: MenuSection[] = [
    {
      id: 'section1',
      items: [
        { id: 'users', title: 'Users', icon: usersIcon, onPress: handleUsersPress },
        { id: 'roles', title: 'Manage roles', icon: manageRolesIcon },
        { id: 'company', title: 'Company info', icon: companyInfoIcon, onPress: handleCompanyInfoPress },
      ],
    },
    {
      id: 'section2',
      items: [
        { id: 'templates', title: 'Templates', icon: templatesIcon },
        { id: 'privacy', title: 'Privacy policy', icon: privacyPolicyIcon },
        { id: 'terms', title: 'Terms & conditions', icon: termsConditionsIcon },
        {
          id: 'logout',
          title: 'Logout',
          icon: logoutIcon,
          onPress: handleLogout,
          isLogout: true,
        },
      ],
    },
  ];
  const renderProfileShimmer = () => {
    return (
      <View style={styles.profileCard}>
        <View style={styles.profileLeft}>
          <Shimmer width={44} height={44} borderRadius={22} />

          <View style={styles.profileInfo}>
            <Shimmer width={120} height={16} borderRadius={6} />
            <View style={{ height: 8 }} />
            <Shimmer width={180} height={12} borderRadius={6} />
          </View>
        </View>

        <Shimmer width={16} height={16} borderRadius={4} />
      </View>
    );
  };


  const renderMenuItem = (item: MenuItem, isLast: boolean) => {
    return (
      <View key={item.id} style={{ paddingHorizontal: 16, }}>
        <Pressable
          key={item.id}
          style={[styles.row]}
          onPress={item.onPress}
        >
          <View style={styles.rowLeft}>
            <View style={[styles.rowIconWrap, item.isLogout && styles.logoutIconWrap]}>
              <SvgXml xml={item.icon} width={16} height={16} />
            </View>

            <Typography
              variant="mediumTxtsm"
              color={item.isLogout ? colors.error[500] : colors.gray[900]}
            >
              {item.title}
            </Typography>
          </View>

          <SvgXml xml={chevronRightIcon} width={16} height={16} />
        </Pressable>
        {!isLast && <Divider height={1} />}
      </View>
    );
  };

  const renderSection = (section: MenuSection) => (
    <View key={section.id} style={styles.card}>
      {section.items.map((item, index) =>
        renderMenuItem(item, index === section.items.length - 1)
      )}
    </View>
  );

  return (
    <Fragment>
      <CustomSafeAreaView>
        <Header title="Setting" backNavigation={true} onBack={() => goBack()} />

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} bounces={false}>
          {/* ✅ Profile Card */}
          {loading ? (
            renderProfileShimmer()
          ) : (
            <Pressable style={styles.profileCard} onPress={handleProfilePress}>
              <View style={styles.profileLeft}>
                <View style={styles.avatarWrap}>
                  {profile?.profile_pic ? (
                    <Image source={{ uri: profile.profile_pic }} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Typography variant="semiBoldTxtmd" color={colors.gray[700]}>
                        {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </Typography>
                    </View>
                  )}
                </View>

                <View style={styles.profileInfo}>
                  <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
                    {profile?.name || 'User'}
                  </Typography>

                  <Typography variant="regularTxtsm" color={colors.gray[500]}>
                    {profile?.email || 'email@example.com'}
                  </Typography>
                </View>
              </View>

              <SvgXml xml={chevronRightIcon} width={16} height={16} />
            </Pressable>
          )}
          {menuSections.map(renderSection)}
        </ScrollView>
      </CustomSafeAreaView>
    </Fragment>
  );
};

export default Profile;
