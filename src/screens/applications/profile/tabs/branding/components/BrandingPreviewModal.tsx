import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { SvgXml, SvgUri } from 'react-native-svg';
import Typography from '../../../../../../components/atoms/typography';
import Shimmer from '../../../../../../components/atoms/shimmer';
import { colors } from '../../../../../../theme/colors';
import { usePreviewModalStyles } from './BrandingPreviewModal.styles';
import { eyeVisibleIcon } from '../../../../../../assets/svg/eyevisible';
import { closeIconSm } from '../../../../../../assets/svg/closeicon';
import { searchIcon } from '../../../../../../assets/svg/search';
import { filterIcon } from '../../../../../../assets/svg/filter';
import { dashboardIcon } from '../../../../../../assets/svg/dashboardicon';
import { getFocusedJobIcon } from '../../../../../../assets/svg/jobicon';
import { userApplicationIcon } from '../../../../../../assets/svg/userapplicationicon';
import { settingIcon } from '../../../../../../assets/svg/settingicon';
import { logoXML } from '../../../../../../assets/svg/logoxml';

const candidHrMarkSvg = `<svg width="18" height="21" viewBox="0 0 41 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="prevCandidHrBlueGrad" x1="0" y1="0" x2="31.5" y2="48" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#4F79F6"/>
      <stop offset="60%" stop-color="#6B90FB"/>
      <stop offset="100%" stop-color="#557EF5"/>
    </linearGradient>
    <linearGradient id="prevCandidHrPurpleGrad" x1="41" y1="0" x2="15" y2="38" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#7660EE"/>
      <stop offset="60%" stop-color="#9E80FA"/>
      <stop offset="100%" stop-color="#B393FB"/>
    </linearGradient>
    <linearGradient id="prevCandidHrCyanOverlap" x1="15" y1="17" x2="31" y2="27" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#A5EDFD"/>
      <stop offset="100%" stop-color="#80D8F9"/>
    </linearGradient>
  </defs>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0.767578L0.017692 14.797L13.0961 23.9369L0.017692 33.2743L0 47.9998L31.5046 23.4355L0 0.767578Z" fill="url(#prevCandidHrBlueGrad)"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M40.3175 0L40.3035 11.0318L30.0196 18.2188L40.3035 25.5615L40.3175 37.1404L15.5443 17.8247L40.3175 0Z" fill="url(#prevCandidHrPurpleGrad)"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M27.1204 26.8517L31.4995 23.4374L19.6222 14.8916L15.5443 17.8258L27.1204 26.8517Z" fill="url(#prevCandidHrCyanOverlap)"/>
</svg>`;

export interface BrandingPreviewModalProps {
  visible: boolean;
  onClose: () => void;
  primaryColor: string;
  productName: string;
  logoUrl?: string | null;
  secondaryLogoUrl?: string | null;
  autoInitials?: string;
  poweredByEnabled?: boolean;
}

export const BrandingPreviewModal: React.FC<BrandingPreviewModalProps> = React.memo(({
  visible,
  onClose,
  primaryColor,
  productName,
  logoUrl,
  secondaryLogoUrl,
  autoInitials,
}) => {
  const styles = usePreviewModalStyles(primaryColor);
  const screenHeight = Dimensions.get('window').height;
  const [imageError, setImageError] = useState(false);

  const rawProductName = (productName || '').trim();
  const isExactDefaultCandidHr = rawProductName === 'CandidHR' || rawProductName === '';
  const uploadedLogoCandidate = secondaryLogoUrl || logoUrl || null;
  const isCustomProduct = Boolean(!isExactDefaultCandidHr || uploadedLogoCandidate);

  const displayName = rawProductName || 'CandidHR';
  const firstLetter = autoInitials || (displayName ? displayName[0].toUpperCase() : 'C');

  const formattedLogoUri = useMemo(() => {
    const uri = uploadedLogoCandidate;
    if (!uri) return null;
    if (
      uri.startsWith('http://') ||
      uri.startsWith('https://') ||
      uri.startsWith('file://') ||
      uri.startsWith('data:') ||
      uri.startsWith('content://')
    ) {
      return uri;
    }
    return `file://${uri}`;
  }, [uploadedLogoCandidate]);

  const isSvgLogo = Boolean(
    formattedLogoUri &&
      (formattedLogoUri.endsWith('.svg') || formattedLogoUri.includes('.svg?'))
  );

  const renderLogoBadge = () => {
    if (formattedLogoUri && !imageError) {
      if (isSvgLogo) {
        return <SvgUri uri={formattedLogoUri} width={26} height={26} />;
      }
      return (
        <Image
          source={{ uri: formattedLogoUri }}
          style={styles.mobileLogoImage}
          resizeMode="contain"
          onError={() => setImageError(true)}
        />
      );
    }
    if (isCustomProduct) {
      return (
        <View style={[styles.mobileAutoLetterBadge, { backgroundColor: primaryColor }]}>
          <Text style={styles.mobileAutoLetterText}>{firstLetter}</Text>
        </View>
      );
    }
    return <SvgXml xml={candidHrMarkSvg} width={18} height={21} />;
  };

  const renderJobsTabPreview = () => {
    return (
      <View style={styles.phoneFrame}>
        {/* Notch / Dynamic Island */}
        <View style={styles.phoneNotchWrap}>
          <View style={styles.phoneIsland} />
        </View>

        {/* Mobile Brand Bar with Logo & Product Name */}
        <View style={styles.mobileBrandBar}>
          {renderLogoBadge()}
          <Text style={styles.mobileBrandTitle} numberOfLines={1}>
            {displayName}
          </Text>
        </View>

        {/* Mobile Screen Header */}
        <View style={styles.mobileHeader}>
          <Text style={styles.mobileHeaderTitle}>Jobs</Text>
          <View style={styles.mobileSearchBtn}>
            <SvgXml xml={searchIcon} width={18} height={18} />
          </View>
        </View>

        {/* Status Tabs */}
        <View style={styles.mobileTabsRow}>
          <View style={[styles.mobileTabItem, styles.mobileTabItemActive]}>
            <Text style={styles.mobileTabTextActive}>Published</Text>
            <View style={styles.mobileBadgeActive}>
              <Text style={styles.mobileBadgeActiveText}>29</Text>
            </View>
          </View>

          <View style={styles.mobileTabItem}>
            <Text style={styles.mobileTabTextInactive}>Draft</Text>
            <View style={styles.mobileBadgeInactive}>
              <Text style={styles.mobileBadgeInactiveText}>290</Text>
            </View>
          </View>

          <View style={styles.mobileTabItem}>
            <Text style={styles.mobileTabTextInactive}>Favourites</Text>
            <View style={styles.mobileBadgeInactive}>
              <Text style={styles.mobileBadgeInactiveText}>0</Text>
            </View>
          </View>
        </View>

        {/* Job Cards with Shimmer Effect */}
        <View style={styles.mobileCardList}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.mobileJobCard}>
              {/* Header row: title shimmer + menu shimmer */}
              <View style={styles.mobileCardTop}>
                <Shimmer width={item === 2 ? '75%' : '60%'} height={13} borderRadius={4} />
                <Shimmer width={18} height={12} borderRadius={4} />
              </View>

              {/* Date subtitle shimmer */}
              <Shimmer width={item === 1 ? '45%' : '40%'} height={10} borderRadius={4} />

              {/* Tags row shimmer */}
              <View style={styles.mobileTagsRow}>
                <View style={styles.mobileTagsLeft}>
                  <Shimmer width={item === 2 ? 60 : 76} height={18} borderRadius={4} />
                  <Shimmer width={38} height={18} borderRadius={4} />
                </View>
                <Shimmer width={14} height={16} borderRadius={3} />
              </View>

              {/* Footer row: stats shimmer + author shimmer */}
              <View style={styles.mobileCardFooter}>
                <View style={styles.mobileStatsGroup}>
                  <Shimmer width={28} height={12} borderRadius={4} />
                  <Shimmer width={28} height={12} borderRadius={4} />
                </View>
                <View style={styles.mobileAuthorGroup}>
                  <Shimmer width={18} height={18} borderRadius={9} />
                  <Shimmer width={88} height={11} borderRadius={4} />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Floating Filter Chips Bar */}
        <View style={styles.mobileFloatingFilterBar}>
          <View style={styles.mobileFilterButton}>
            <SvgXml xml={filterIcon} width={14} height={14} />
            <Text style={styles.mobileFilterButtonText}>Filters</Text>
          </View>
          <View style={styles.mobileChipActive}>
            <Text style={styles.mobileChipActiveText}>Sort</Text>
          </View>
          <View style={styles.mobileChipInactive}>
            <Text style={styles.mobileChipInactiveText}>Title</Text>
          </View>
          <View style={styles.mobileChipInactive}>
            <Text style={styles.mobileChipInactiveText}>Type</Text>
          </View>
          <View style={styles.mobileChipInactive}>
            <Text style={styles.mobileChipInactiveText}>Loc</Text>
          </View>
        </View>

        {/* Bottom Tab Bar */}
        <View style={styles.mobileBottomNav}>
          <View style={styles.mobileNavItem}>
            <SvgXml xml={dashboardIcon} width={20} height={20} />
          </View>
          <View style={styles.mobileNavItem}>
            <SvgXml xml={getFocusedJobIcon(primaryColor)} width={20} height={20} />
          </View>
          <View style={styles.mobileNavItem}>
            <SvgXml xml={userApplicationIcon} width={20} height={20} />
          </View>
          <View style={styles.mobileNavItem}>
            <SvgXml xml={settingIcon} width={20} height={20} />
          </View>
        </View>

        {/* Bottom Home Indicator */}
        <View style={styles.mobileHomeBarWrap}>
          <View style={styles.mobileHomeBar} />
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      supportedOrientations={[
        'portrait',
        'portrait-upside-down',
        'landscape',
        'landscape-left',
        'landscape-right',
      ]}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.headerTopRow}>
              <View style={styles.headerTitleRow}>
                <View style={styles.eyeIconContainer}>
                  <SvgXml xml={eyeVisibleIcon} width={18} height={18} />
                </View>
                <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
                  Preview
                </Typography>
              </View>

              {/* Close Button */}
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <SvgXml xml={closeIconSm(colors.gray[700])} width={16} height={16} />
              </TouchableOpacity>
            </View>

            <Typography
              variant="regularTxtxs"
              color={colors.gray[500]}
              style={styles.headerSubtitle}
            >
              How your workspace will look. Nothing changes for your team until you save.
            </Typography>
          </View>

          {/* Scrollable Preview Area for Jobs Tab */}
          <ScrollView
            style={[styles.previewScroll, { maxHeight: screenHeight * 0.74 }]}
            contentContainerStyle={styles.previewScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderJobsTabPreview()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
});

export default BrandingPreviewModal;
