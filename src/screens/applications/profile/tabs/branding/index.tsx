import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import ImageCropPicker from 'react-native-image-crop-picker';
import { Button, Header, Shimmer } from '../../../../../components';
import CustomSafeAreaView from '../../../../../components/atoms/customsafeareaview';
import Typography from '../../../../../components/atoms/typography';
import CustomSwitch from '../../../../../components/atoms/switchbutton';
import { SetProfilePhotoModal } from '../../../../../components/organisms/SetProfilePhotoModal';
import { goBack } from '../../../../../utils/navigationUtils';
import { showToastMessage } from '../../../../../utils/toast';
import { colors, setBrandColor } from '../../../../../theme/colors';
import { checkMarkIcon } from '../../../../../assets/svg/checkmark';
import { closeIconSm } from '../../../../../assets/svg/closeicon';
import { resetIcon } from '../../../../../assets/svg/settingsIcons';
import FooterButtons from '../../../../../components/molecules/footerbuttons';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import {
  selectBrandingData,
  selectBrandingLoading,
  selectBrandingUpdating,
  selectBrandingUpdateSuccess,
  selectIsBrandingReset,
} from '../../../../../features/branding/selectors';
import {
  getBrandingRequestAction,
  updateBrandingRequestAction,
} from '../../../../../features/branding/actions';
import { resetUpdateStatus, setBrandingReset } from '../../../../../features/branding/slice';
import {
  BRAND_COLOR_PRESETS,
  DEFAULT_BRAND_COLOR,
  DEFAULT_PRODUCT_NAME,
  MAX_PRODUCT_NAME_LENGTH,
  isDefaultLogoUrl,
} from '../../../../../features/branding/constants';
import {
  validateHexColor,
  normalizeHexColor,
  validateProductName,
} from '../../../../../features/branding/validation';
import { UpdateBrandingRequest } from '../../../../../features/branding/types';
import { ImageFileAsset, LogoCardType } from './branding.d';
import { ColorSwatch } from './components/ColorSwatch';
import { LogoUploadCard } from './components/LogoUploadCard';
import { useStyles } from './styles';

type PendingPickerAction = 'gallery' | 'camera';

const infoCircleSvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33333 8 1.33333C4.3181 1.33333 1.33333 4.3181 1.33333 8C1.33333 11.6819 4.3181 14.6667 8 14.6667Z" stroke="#475467" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 5.33333V8" stroke="#475467" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 10.6667H8.00667" stroke="#475467" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const BrandingScreen = () => {
  const dispatch = useAppDispatch();

  const brandingData = useAppSelector(selectBrandingData);
  const loading = useAppSelector(selectBrandingLoading);
  const updating = useAppSelector(selectBrandingUpdating);
  const updateSuccess = useAppSelector(selectBrandingUpdateSuccess);
  const isBrandingReset = useAppSelector(selectIsBrandingReset);

  useEffect(() => {
    if (updateSuccess) {
      setIsResetAction(false);
    }
  }, [updateSuccess]);

  // Form State
  const [productName, setProductName] = useState(DEFAULT_PRODUCT_NAME);
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_BRAND_COLOR);
  const [customHexInput, setCustomHexInput] = useState(DEFAULT_BRAND_COLOR.replace('#', ''));
  const [poweredByEnabled, setPoweredByEnabled] = useState(true);

  const styles = useMemo(() => useStyles(primaryColor), [primaryColor]);

  // Local Logo files
  const [logoFile, setLogoFile] = useState<ImageFileAsset | null>(null);
  const [secondaryLogoFile, setSecondaryLogoFile] = useState<ImageFileAsset | null>(null);
  const [faviconFile, setFaviconFile] = useState<ImageFileAsset | null>(null);

  // Deleted flags
  const [logoDeleted, setLogoDeleted] = useState(false);
  const [secondaryLogoDeleted, setSecondaryLogoDeleted] = useState(false);
  const [faviconDeleted, setFaviconDeleted] = useState(false);

  // Tracks if the user explicitly uploaded a custom favicon
  const [hasCustomFavicon, setHasCustomFavicon] = useState(false);

  // Input focus
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isResetAction, setIsResetAction] = useState(false);

  // Picker Modal State
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [activePickingType, setActivePickingType] = useState<LogoCardType | null>(null);
  const pendingPickerRef = useRef<PendingPickerAction | null>(null);
  const pickerBusyRef = useRef(false);

  // Initial Fetch & unmount cleanup
  useEffect(() => {
    dispatch(getBrandingRequestAction());
    return () => {
      dispatch(resetUpdateStatus());
      ImageCropPicker.clean().catch(() => undefined);
    };
  }, [dispatch]);

  const getResolvedSavedProductName = useCallback((data: typeof brandingData): string => {
    if (!data) return '';
    if (isBrandingReset) return '';
    return data.product_name?.trim() || '';
  }, [isBrandingReset]);

  // Sync Form with Fetched Data
  useEffect(() => {
    if (brandingData) {
      const pName = getResolvedSavedProductName(brandingData);
      const pColor = brandingData.primary_color || DEFAULT_BRAND_COLOR;
      setProductName(pName);
      setPrimaryColor(pColor);
      setCustomHexInput(pColor.replace('#', ''));
      setPoweredByEnabled(brandingData.powered_by_enabled !== false);
      setLogoFile(null);
      setSecondaryLogoFile(null);
      setFaviconFile(null);
      setLogoDeleted(false);
      setSecondaryLogoDeleted(false);
      setFaviconDeleted(false);
      setHasCustomFavicon(
        Boolean(
          brandingData.favicon &&
          brandingData.secondary_logo &&
          brandingData.favicon !== brandingData.secondary_logo
        )
      );
    }
  }, [brandingData, getResolvedSavedProductName]);

  // Unsaved Changes Calculation
  const isDirty = useMemo(() => {
    if (isResetAction) {
      return true;
    }
    if (!brandingData) {
      return Boolean(productName.trim()) || Boolean(logoFile) || Boolean(secondaryLogoFile);
    }

    const currentSavedName = getResolvedSavedProductName(brandingData);
    const currentSavedColor = normalizeHexColor(brandingData.primary_color || DEFAULT_BRAND_COLOR);
    const currentSavedPoweredBy = brandingData.powered_by_enabled !== false;

    const nameChanged = productName.trim() !== currentSavedName;
    const colorChanged = normalizeHexColor(primaryColor) !== currentSavedColor;
    const poweredByChanged = poweredByEnabled !== currentSavedPoweredBy;
    const filesChanged = Boolean(logoFile) || Boolean(secondaryLogoFile) || Boolean(faviconFile);
    const hasSavedLogo = Boolean(brandingData?.logo && !isDefaultLogoUrl(brandingData.logo));
    const hasSavedSecondaryLogo = Boolean(brandingData?.secondary_logo && !isDefaultLogoUrl(brandingData.secondary_logo));
    const hasSavedFavicon = Boolean(brandingData?.favicon && !isDefaultLogoUrl(brandingData.favicon));
    const filesDeleted =
      (logoDeleted && hasSavedLogo) ||
      (secondaryLogoDeleted && hasSavedSecondaryLogo) ||
      (faviconDeleted && hasSavedFavicon);

    return nameChanged || colorChanged || poweredByChanged || filesChanged || filesDeleted;
  }, [
    isResetAction,
    brandingData,
    productName,
    primaryColor,
    poweredByEnabled,
    logoFile,
    secondaryLogoFile,
    faviconFile,
    logoDeleted,
    secondaryLogoDeleted,
    faviconDeleted,
    getResolvedSavedProductName,
  ]);

  // Color Swatch Selection Handler
  const handleSelectPresetColor = useCallback((color: string) => {
    setPrimaryColor(color);
    setCustomHexInput(color.replace('#', ''));
  }, []);

  // Custom Hex Input Handler
  const handleCustomHexChange = useCallback((text: string) => {
    const sanitized = text.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
    setCustomHexInput(sanitized);

    if (sanitized.length === 6 || sanitized.length === 3) {
      setPrimaryColor(`#${sanitized.toUpperCase()}`);
    }
  }, []);

  // Reset to Default Action
  const handleResetToDefault = useCallback(() => {
    setProductName('');
    setPrimaryColor(DEFAULT_BRAND_COLOR);
    setCustomHexInput(DEFAULT_BRAND_COLOR.replace('#', ''));
    setPoweredByEnabled(false);
    setLogoFile(null);
    setSecondaryLogoFile(null);
    setFaviconFile(null);
    setLogoDeleted(true);
    setSecondaryLogoDeleted(true);
    setFaviconDeleted(true);
    setHasCustomFavicon(false);
    setBrandColor(DEFAULT_BRAND_COLOR);
    setIsResetAction(true);
    dispatch(setBrandingReset(true));
    showToastMessage('Reset to default values', 'info');
  }, [dispatch]);

  // Discard Action
  const handleDiscard = useCallback(() => {
    setIsResetAction(false);
    if (brandingData) {
      const pName = getResolvedSavedProductName(brandingData);
      const pColor = brandingData.primary_color || DEFAULT_BRAND_COLOR;
      setProductName(pName);
      setPrimaryColor(pColor);
      setCustomHexInput(pColor.replace('#', ''));
      setPoweredByEnabled(brandingData.powered_by_enabled !== false);
      setLogoFile(null);
      setSecondaryLogoFile(null);
      setFaviconFile(null);
      setLogoDeleted(false);
      setSecondaryLogoDeleted(false);
      setFaviconDeleted(false);
      setHasCustomFavicon(
        Boolean(
          brandingData.favicon &&
          brandingData.secondary_logo &&
          brandingData.favicon !== brandingData.secondary_logo
        )
      );
    }
  }, [brandingData, getResolvedSavedProductName]);

  // Save Branding Action
  const handleSave = useCallback(() => {
    if (productName.trim()) {
      const nameValidation = validateProductName(productName);
      if (!nameValidation.isValid) {
        showToastMessage(nameValidation.error, 'error');
        return;
      }
    }

    if (!validateHexColor(primaryColor)) {
      showToastMessage('Please enter a valid hex color code (e.g. #2563EB)', 'error');
      return;
    }

    const normalizedColor = normalizeHexColor(primaryColor);
    const isResetting =
      isResetAction ||
      (!productName.trim() &&
        !logoFile &&
        !secondaryLogoFile &&
        !faviconFile &&
        (logoDeleted || !brandingData?.logo) &&
        (secondaryLogoDeleted || !brandingData?.secondary_logo));

    setIsResetAction(false);

    const shouldUseFormData = Boolean(
      logoFile ||
      secondaryLogoFile ||
      faviconFile
    );

    // Build payload: if binary files exist or files are being deleted, use FormData
    if (shouldUseFormData) {
      const formData = new FormData();
      formData.append('product_name', productName.trim());
      formData.append('primary_color', normalizedColor);
      formData.append('powered_by_enabled', String(poweredByEnabled));

      const getUploadUri = (uri: string) =>
        Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

      if (logoFile) {
        formData.append('logo', {
          uri: getUploadUri(logoFile.uri),
          type: logoFile.type || 'image/jpeg',
          name: logoFile.name || 'logo.jpg',
        } as unknown as Blob);
      } else if (logoDeleted) {
        formData.append('logo', '');
      }

      if (secondaryLogoFile) {
        formData.append('secondary_logo', {
          uri: getUploadUri(secondaryLogoFile.uri),
          type: secondaryLogoFile.type || 'image/jpeg',
          name: secondaryLogoFile.name || 'secondary_logo.jpg',
        } as unknown as Blob);
      } else if (secondaryLogoDeleted) {
        formData.append('secondary_logo', '');
      }

      // Favicon handling: upload explicit faviconFile or auto-use compact logo if not customized
      const effectiveFavicon =
        faviconFile ||
        (!hasCustomFavicon && !faviconDeleted && secondaryLogoFile ? secondaryLogoFile : null);

      if (effectiveFavicon) {
        formData.append('favicon', {
          uri: getUploadUri(effectiveFavicon.uri),
          type: effectiveFavicon.type || 'image/x-icon',
          name: effectiveFavicon.name || 'favicon.ico',
        } as unknown as Blob);
      } else if (faviconDeleted) {
        formData.append('favicon', '');
      }

      dispatch(updateBrandingRequestAction(formData, isResetting));
    } else {
      // Send regular JSON payload
      const jsonPayload: Record<string, unknown> = {
        product_name: productName.trim(),
        primary_color: normalizedColor,
        powered_by_enabled: poweredByEnabled,
      };

      if (logoDeleted) {
        jsonPayload.logo = null;
      }
      if (secondaryLogoDeleted) {
        jsonPayload.secondary_logo = null;
      }
      if (faviconDeleted) {
        jsonPayload.favicon = null;
      }

      dispatch(updateBrandingRequestAction(jsonPayload as unknown as UpdateBrandingRequest, isResetting));
    }
  }, [
    dispatch,
    productName,
    primaryColor,
    isResetAction,
    brandingData,
    poweredByEnabled,
    logoFile,
    secondaryLogoFile,
    faviconFile,
    logoDeleted,
    secondaryLogoDeleted,
    faviconDeleted,
    hasCustomFavicon,
  ]);

  // Image Picker Logic
  const handleOpenPickerFor = useCallback((type: LogoCardType) => {
    setActivePickingType(type);
    setShowPickerModal(true);
  }, []);

  const handleDeleteLogo = useCallback((type: LogoCardType) => {
    if (type === 'logo') {
      setLogoFile(null);
      setLogoDeleted(true);
    } else if (type === 'secondary_logo') {
      setSecondaryLogoFile(null);
      setSecondaryLogoDeleted(true);
      if (!hasCustomFavicon) {
        setFaviconFile(null);
        setFaviconDeleted(true);
      }
    } else if (type === 'favicon') {
      setFaviconFile(null);
      setFaviconDeleted(true);
      setHasCustomFavicon(false);
    }
  }, [hasCustomFavicon]);

  const applyPickerResult = useCallback(
    (result: { path: string; mime?: string; size?: number }) => {
      const fileName = result.path.split('/').pop() || `${activePickingType || 'image'}_${Date.now()}.jpg`;
      const normalizedUri = result.path.startsWith('file://') ? result.path : `file://${result.path}`;
      const fileAsset: ImageFileAsset = {
        uri: normalizedUri,
        name: fileName,
        type: result.mime || 'image/jpeg',
        size: result.size,
      };

      if (activePickingType === 'logo') {
        setLogoFile(fileAsset);
        setLogoDeleted(false);
      } else if (activePickingType === 'secondary_logo') {
        setSecondaryLogoFile(fileAsset);
        setSecondaryLogoDeleted(false);
        // Automatically set favicon to compact logo if no custom favicon exists
        if (!hasCustomFavicon) {
          const autoFaviconAsset: ImageFileAsset = {
            ...fileAsset,
            name: fileAsset.name || 'favicon.jpg',
          };
          setFaviconFile(autoFaviconAsset);
          setFaviconDeleted(false);
        }
      } else if (activePickingType === 'favicon') {
        setFaviconFile(fileAsset);
        setFaviconDeleted(false);
        setHasCustomFavicon(true);
      }
    },
    [activePickingType, hasCustomFavicon]
  );

  const runPendingPicker = useCallback(async () => {
    const action = pendingPickerRef.current;
    pendingPickerRef.current = null;

    if (!action || pickerBusyRef.current) return;

    pickerBusyRef.current = true;
    try {
      if (action === 'gallery') {
        const result = await ImageCropPicker.openPicker({
          mediaType: 'photo',
          cropping: false,
        });
        applyPickerResult(result);
      } else {
        const result = await ImageCropPicker.openCamera({
          mediaType: 'photo',
          cropping: false,
        });
        applyPickerResult(result);
      }
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err?.code !== 'E_PICKER_CANCELLED') {
        showToastMessage(err?.message || 'Failed to select image', 'error');
      }
    } finally {
      pickerBusyRef.current = false;
    }
  }, [applyPickerResult]);

  const handleProfilePhotoModalDismissed = useCallback(() => {
    void runPendingPicker();
  }, [runPendingPicker]);

  useEffect(() => {
    if (Platform.OS === 'ios' || showPickerModal) return;
    if (pendingPickerRef.current) {
      void runPendingPicker();
    }
  }, [showPickerModal, runPendingPicker]);

  const isPresetSelected = useCallback(
    (hex: string) => normalizeHexColor(primaryColor) === normalizeHexColor(hex),
    [primaryColor]
  );

  // Logo URL resolutions considering deletion state and default logos
  const currentLogoUrl = logoDeleted
    ? (logoFile?.uri ?? null)
    : logoFile?.uri || (isDefaultLogoUrl(brandingData?.logo) ? null : (brandingData?.logo ?? null));

  const currentSecondaryLogoUrl = secondaryLogoDeleted
    ? (secondaryLogoFile?.uri ?? null)
    : secondaryLogoFile?.uri || (isDefaultLogoUrl(brandingData?.secondary_logo) ? null : (brandingData?.secondary_logo ?? null));

  const currentFaviconUrl = faviconDeleted
    ? (faviconFile?.uri ?? null)
    : faviconFile?.uri ||
      (hasCustomFavicon && brandingData?.favicon && !isDefaultLogoUrl(brandingData.favicon)
        ? brandingData.favicon
        : currentSecondaryLogoUrl);

  const trimmedProductName = productName.trim();
  const firstLetter = trimmedProductName ? trimmedProductName[0].toUpperCase() : '';
  const displayProductName = trimmedProductName;

  const renderShimmerLoading = () => (
    <View style={styles.card}>
      <Shimmer width={140} height={18} borderRadius={6} />
      <View style={{ height: 8 }} />
      <Shimmer width={220} height={12} borderRadius={6} />
      <View style={{ height: 16 }} />
      <Shimmer width={'100%'} height={44} borderRadius={8} />
      <View style={{ height: 24 }} />
      <Shimmer width={100} height={18} borderRadius={6} />
      <View style={{ height: 8 }} />
      <Shimmer width={180} height={12} borderRadius={6} />
      <View style={{ height: 16 }} />
      <Shimmer width={'100%'} height={120} borderRadius={12} />
    </View>
  );

  return (
    <Fragment>
      <CustomSafeAreaView>
        <Header title="Branding" backNavigation={true} onBack={() => goBack()} />

        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Top Bar with Status & Action Buttons */}
            <View style={styles.topBar}>
                <Typography variant="regularTxtsm" color={colors.gray[500]} style={styles.headerSubtitle}>
                  Your name, logos and colour, across the app and every candidate page.
                </Typography>
                <Button
                  size={36}
                  variant="outline"
                  buttonColor={colors.base.white}
                  textColor={colors.gray[700]}
                  borderColor={colors.gray[300]}
                  borderWidth={1}
                  borderRadius={8}
                  paddingHorizontal={12}
                  textVariant="mediumTxtxs"
                  startIcon={<SvgXml xml={resetIcon} width={14} height={14} />}
                  onPress={handleResetToDefault}
                  style={{alignSelf: 'flex-end'}}
                >
                  Reset to default
                </Button>
            </View>

            {loading && !brandingData ? (
              renderShimmerLoading()
            ) : (
              <>
                {/* 1. Product Name Section */}
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                      Product name
                    </Typography>
                    <Typography variant="regularTxtsm" color={colors.gray[600]}>
                      Shown in the browser tab and next to your logo.
                    </Typography>
                  </View>

                  <View style={[styles.inputWrap, isInputFocused && styles.inputWrapFocused]}>
                    <TextInput
                      style={styles.textInput}
                      value={productName}
                      onChangeText={(val) => setProductName(val.slice(0, MAX_PRODUCT_NAME_LENGTH))}
                      placeholder="e.g. Acme Careers"
                      placeholderTextColor={colors.gray[400]}
                      maxLength={MAX_PRODUCT_NAME_LENGTH}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                    />
                    <Typography variant="regularTxtxs" color={colors.gray[400]} style={styles.charCounter}>
                      {`${productName.length}/${MAX_PRODUCT_NAME_LENGTH}`}
                    </Typography>
                  </View>
                </View>

                {/* 2. Logos Section */}
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                      Logos
                    </Typography>
                    <Typography variant="regularTxtsm" color={colors.gray[600]}>
                      Shown in the sidebar and browser tab. Empty ones are filled from your name and other logos.
                    </Typography>
                  </View>

                  {/* Logo Card */}
                  <LogoUploadCard
                    type="logo"
                    title="Logo"
                    specs="PNG, SVG, JPG · max 2 MB"
                    currentUrl={currentLogoUrl}
                    localFile={logoFile}
                    isAutoBadge={!logoFile && !currentLogoUrl}
                    autoBadgeText="AUTO"
                    productName={productName}
                    brandColor={primaryColor}
                    autoSubText={trimmedProductName ? 'Auto: compact logo + name' : undefined}
                    onReplace={() => handleOpenPickerFor('logo')}
                    onDelete={() => handleDeleteLogo('logo')}
                  />

                  {/* Compact Logo Card */}
                  <LogoUploadCard
                    type="secondary_logo"
                    title="Compact logo"
                    specs="PNG, SVG, JPG · max 1 MB"
                    currentUrl={currentSecondaryLogoUrl}
                    localFile={secondaryLogoFile}
                    isAutoBadge={!secondaryLogoFile && !currentSecondaryLogoUrl}
                    autoBadgeText="AUTO"
                    productName={productName}
                    brandColor={primaryColor}
                    autoSubText={firstLetter ? `Auto: "${firstLetter}" from product name` : undefined}
                    onReplace={() => handleOpenPickerFor('secondary_logo')}
                    onDelete={() => handleDeleteLogo('secondary_logo')}
                  />

                  {/* Favicon Card */}
                  <LogoUploadCard
                    type="favicon"
                    title="Favicon"
                    specs="PNG, SVG, ICO · max 512 KB"
                    currentUrl={currentFaviconUrl}
                    localFile={faviconFile}
                    isAutoBadge={!hasCustomFavicon && !faviconFile}
                    autoBadgeText="AUTO"
                    productName={productName}
                    brandColor={primaryColor}
                    autoSubText={
                      currentSecondaryLogoUrl
                        ? 'Auto: uses your compact logo'
                        : firstLetter
                        ? `Auto: "${firstLetter}" from product name`
                        : undefined
                    }
                    onReplace={() => handleOpenPickerFor('favicon')}
                    onDelete={() => handleDeleteLogo('favicon')}
                  />

                  {/* Info Banner */}
                  {!currentSecondaryLogoUrl && !currentFaviconUrl && (
                    <View style={styles.infoBanner}>
                      <SvgXml xml={infoCircleSvg} width={16} height={16} />
                      <Typography variant="regularTxtxs" color={colors.gray[600]} style={styles.infoBannerText}>
                        {firstLetter
                          ? `Your compact logo and favicon will show "${firstLetter}", the first letter of your product name "${displayProductName}". Upload them to change this.`
                          : 'Your compact logo and favicon will show the first letter of your product name. Upload them to change this.'}
                      </Typography>
                    </View>
                  )}
                </View>

                {/* 3. Brand Color Section */}
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                      Brand color
                    </Typography>
                    <Typography variant="regularTxtsm" color={colors.gray[500]} style={styles.cardSubtitle}>
                      Select or customize your brand color.
                    </Typography>
                  </View>

                  {/* 7 Preset Color Swatches */}
                  <View style={styles.colorPresetsRow}>
                    {BRAND_COLOR_PRESETS.map((color) => (
                      <ColorSwatch
                        key={color}
                        color={color}
                        isSelected={isPresetSelected(color)}
                        onSelect={handleSelectPresetColor}
                      />
                    ))}
                  </View>

                  {/* Custom Color Input Row */}
                  <View style={styles.customColorRow}>
                    <View style={styles.customColorLeft}>
                      <Typography variant="mediumTxtsm" color={colors.gray[700]}>
                        Custom color:
                      </Typography>
                      <View style={styles.customColorInputWrap}>
                        <Typography variant="mediumTxtsm" color={colors.gray[500]} style={styles.hashPrefix}>
                          #
                        </Typography>
                        <TextInput
                          style={styles.customColorInput}
                          value={customHexInput}
                          onChangeText={handleCustomHexChange}
                          placeholder="2563EB"
                          placeholderTextColor={colors.gray[400]}
                          maxLength={6}
                          autoCapitalize="characters"
                        />
                      </View>
                    </View>

                    {/* Color Preview Swatch */}
                    <View
                      style={[
                        styles.colorPreviewCircle,
                        { backgroundColor: validateHexColor(primaryColor) ? primaryColor : colors.gray[200] },
                      ]}
                    >
                      <SvgXml xml={checkMarkIcon} width={14} height={14} />
                    </View>
                  </View>
                </View>

                {/* 4. Powered by CandidHR Section */}
                <View style={styles.card}>
                  <View style={styles.poweredByRow}>
                    <View style={styles.poweredByLeft}>
                      <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                        Powered by CandidHR
                      </Typography>
                      <Typography variant="regularTxtsm" color={colors.gray[500]} style={styles.cardSubtitle}>
                        Credit on candidate pages.
                      </Typography>
                    </View>

                    <CustomSwitch
                      value={poweredByEnabled}
                      onValueChange={setPoweredByEnabled}
                      backgroundActive={primaryColor}
                      backgroundInactive={colors.gray[300]}
                    />
                  </View>
                </View>
              </>
            )}
          </ScrollView>

          {/* Footer using custom FooterButtons component */}
          <FooterButtons
            leftButtonProps={{
              children: 'Discard',
              variant: 'outline',
              buttonColor: colors.base.white,
              textColor: colors.gray[700],
              borderColor: colors.gray[300],
              borderWidth: 1,
              borderRadius: 8,
              size: 40,
              textVariant: 'mediumTxtxs',
              startIcon: <SvgXml xml={closeIconSm(colors.gray[700])} width={16} height={16} />,
              disabled: !isDirty || updating,
              onPress: handleDiscard,
            }}
            rightButtonProps={{
              children: 'Save branding',
              variant: 'contain',
              buttonColor: primaryColor || colors.brand[600],
              textColor: colors.base.white,
              borderRadius: 8,
              size: 40,
              textVariant: 'semiBoldTxtxs',
              startIcon: <SvgXml xml={checkMarkIcon} width={14} height={14} />,
              isLoading: updating,
              disabled: !isDirty || updating,
              onPress: handleSave,
            }}
          />
        </KeyboardAvoidingView>

        {/* Image Picker Modal */}
        <SetProfilePhotoModal
          visible={showPickerModal}
          onClose={() => {
            pendingPickerRef.current = null;
            setShowPickerModal(false);
          }}
          onDismiss={handleProfilePhotoModalDismissed}
          onSelectGallery={() => {
            pendingPickerRef.current = 'gallery';
            setShowPickerModal(false);
          }}
          onSelectCamera={() => {
            pendingPickerRef.current = 'camera';
            setShowPickerModal(false);
          }}
        />
      </CustomSafeAreaView>
    </Fragment>
  );
};

export default BrandingScreen;
