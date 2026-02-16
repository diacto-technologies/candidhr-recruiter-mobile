import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { View, Pressable, Image, ScrollView } from 'react-native';
import { Header, Shimmer } from '../../../components';
import { goBack, navigate, resetAndNavigate } from '../../../utils/navigationUtils';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import Typography from '../../../components/atoms/typography';
import { SvgXml } from 'react-native-svg';
import { colors } from '../../../theme/colors';
import { useTranslation } from 'react-i18next';
import i18n from '../../../config/i18n';
import {
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
import { setLanguage } from '../../../features/language/slice';
import { selectCurrentLanguage } from '../../../features/language/selectors';
import LanguageSelector from '../../../components/organisms/languageselector';
import { setThemeMode } from '../../../features/theme/slice';
import { selectThemeMode } from '../../../features/theme/selectors';
import DisplayPreferenceSelector from '../../../components/organisms/displaypreferenceselector';
import { ThemeMode } from '../../../features/theme/types';
import { getProfileMenuSections } from './profileMenu.config';
import { MenuItem, MenuSection } from './profile';

const Profile = () => {
  const dispatch = useAppDispatch();
  const styles = useStyles();
  const { t } = useTranslation();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [displayPreferenceModalVisible, setDisplayPreferenceModalVisible] = useState(false);

  const profile = useAppSelector(selectProfile);
  const loading = useAppSelector(selectProfileLoading);
  const currentLanguage = useAppSelector(selectCurrentLanguage);
  const currentThemeMode = useAppSelector(selectThemeMode);

  useEffect(() => {
    dispatch({ type: PROFILE_ACTION_TYPES.GET_PROFILE_REQUEST });
  }, [dispatch]);

  console.log(profile,"profileprofileprofileprofileprofile")
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

  const handleLanguagePress = useCallback(() => {
    setLanguageModalVisible(true);
  }, []);

  const handleLanguageSelect = useCallback(
    async (languageCode: string) => {
      dispatch(setLanguage(languageCode));
      await i18n.changeLanguage(languageCode);
    },
    [dispatch]
  );

  const handleDisplayPreferencePress = useCallback(() => {
    setDisplayPreferenceModalVisible(true);
  }, []);

  const handleThemeModeSelect = useCallback(
    (themeMode: ThemeMode) => {
      dispatch(setThemeMode(themeMode));
    },
    [dispatch]
  );

  const menuSections = getProfileMenuSections({
    t,
    handleUsersPress,
    handleCompanyInfoPress,
    handleLogout,
  });

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
        <Header title={t('screens.profile.setting')} backNavigation={true} onBack={() => goBack()} />

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

        <LanguageSelector
          visible={languageModalVisible}
          onClose={() => setLanguageModalVisible(false)}
          currentLanguage={currentLanguage}
          onSelectLanguage={handleLanguageSelect}
        />

        <DisplayPreferenceSelector
          visible={displayPreferenceModalVisible}
          onClose={() => setDisplayPreferenceModalVisible(false)}
          currentThemeMode={currentThemeMode}
          onSelectThemeMode={handleThemeModeSelect}
        />
      </CustomSafeAreaView>
    </Fragment>
  );
};

export default Profile;
