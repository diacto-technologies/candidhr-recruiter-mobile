import React, { Fragment, useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Header, ProfileAvatar } from '../../../../components';
import { goBack } from '../../../../utils/navigationUtils';
import { showToastMessage } from '../../../../utils/toast';
import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview';
import Typography from '../../../../components/atoms/typography';
import { TextField } from '../../../../components/atoms/textfield';
import Button from '../../../../components/atoms/button';
import { SvgXml } from 'react-native-svg';
import { colors } from '../../../../theme/colors';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import ImageCropPicker from 'react-native-image-crop-picker';
import { Asset } from 'react-native-image-picker';
import {
  selectProfile,
  selectProfileLoading,
} from '../../../../features/profile/selectors';
import { updateProfileRequestAction, getProfileRequestAction } from '../../../../features/profile/actions';
import { apiClient } from '../../../../api/client';
import { API_ENDPOINTS } from '../../../../api/endpoints';
import PhoneInput from '../../../../components/atoms/phonefield';
import { editAvatarIcon } from '../../../../assets/svg/editavatar';
import { SetProfilePhotoModal } from './SetProfilePhotoModal';
import { useStyles } from './styles';

const AccountInfo = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const loading = useAppSelector(selectProfileLoading);
  const styles = useStyles();

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);

  // Local loading state for image upload
  const [isUploading, setIsUploading] = useState(false);
  const [showSetProfileModal, setShowSetProfileModal] = useState(false);

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setFullName(profile.name || '');
      setEmail(profile.email || '');
      // Parse phone number if available
      if (profile.contact) {
        const contactStr = String(profile.contact);
        setPhoneNumber(contactStr);
      } else {
        setPhoneNumber('');
      }
      setCountry(profile.country || '');
      setLocation(profile.state || '');
      setRole(profile.role?.name || '');
      setJobTitle(profile.position || '');
    }
  }, [profile]);

  const phoneDigits = useMemo(
    () => phoneNumber.replace(/\D/g, ''),
    [phoneNumber]
  );
  const phoneIncomplete =
    phoneDigits.length > 0 && phoneDigits.length < 10;

  const handleSave = useCallback(async () => {
    const parsedContact =
      phoneNumber && phoneNumber.trim()
        ? parseInt(phoneNumber.replace(/\s/g, ''), 10)
        : null;

    if (phoneDigits.length > 0 && phoneDigits.length < 10) {
      showToastMessage('Contact number must be 10 digits', 'error');
      return;
    }

  // =========================
  // ✅ IMAGE CASE (FormData)
  // =========================
  if (selectedImage?.uri) {
    const formData = new FormData();

    // Basic fields
    formData.append('name', fullName?.trim() || '');
    formData.append('email', email?.trim() || '');

    // Country & State
    formData.append('country', country?.trim() || '');
    formData.append('state', location?.trim() || '');

    // Phone
    if (parsedContact && !isNaN(parsedContact)) {
      formData.append('contact', String(parsedContact));
    }

    formData.append('position', jobTitle?.trim() ?? '');

    // Image
    const imageUri =
      Platform.OS === 'ios'
        ? selectedImage.uri?.replace('file://', '')
        : selectedImage.uri;

    formData.append('profile_pic', {
      uri: imageUri,
      name: selectedImage.fileName || `profile_${Date.now()}.jpg`,
      type: selectedImage.type || 'image/jpeg',
    } as any);

    try {
      setIsUploading(true);

      await apiClient.patch(API_ENDPOINTS.PROFILE.UPDATE, formData);

      setSelectedImage(null);
      dispatch(getProfileRequestAction());
      showToastMessage('Profile updated successfully', 'success');
    } catch (error: any) {
      console.log('Upload error:', error);
      showToastMessage(error.message || 'Failed to update profile', 'error');
    } finally {
      setIsUploading(false);
    }
  }

  // =========================
  // ✅ NORMAL CASE (JSON)
  // =========================
  else {
    const updatePayload: Record<string, any> = {
      name: fullName?.trim() || null,
      email: email?.trim() || null,

      // Country & State
      country: country?.trim() || null,
      state: location?.trim() || null,

      position: jobTitle?.trim() || null,
      contact: parsedContact && !isNaN(parsedContact) ? parsedContact : null,
    };

    dispatch(updateProfileRequestAction(updatePayload));
  }
}, [
  dispatch,
  fullName,
  email,
  phoneNumber,
  phoneDigits,
  location,
  country,
  jobTitle,
  selectedImage,
]);

  const PROFILE_IMAGE_SIZE = 500;
  const getCropOptions = () => ({
    width: PROFILE_IMAGE_SIZE,
    height: PROFILE_IMAGE_SIZE,
    cropping: true,
    cropperCircleOverlay: true,
    aspectRatio: [1, 1] as [number, number],
    includeBase64: false,
  });

  const openGalleryWithCrop = useCallback(async () => {
    try {
      const result = await ImageCropPicker.openPicker({
        ...getCropOptions(),
        mediaType: 'photo',
      });
      setSelectedImage({
        uri: result.path,
        fileName: result.path.split('/').pop() || `profile_${Date.now()}.jpg`,
        type: result.mime || 'image/jpeg',
      } as Asset);
    } catch (error: any) {
      if (error?.code !== 'E_PICKER_CANCELLED') {
        showToastMessage(error?.message || 'Failed to pick image', 'error');
      }
    }
  }, []);

  const openCameraWithCrop = useCallback(async () => {
    try {
      const result = await ImageCropPicker.openCamera({
        ...getCropOptions(),
        mediaType: 'photo',
      });
      setSelectedImage({
        uri: result.path,
        fileName: result.path.split('/').pop() || `profile_${Date.now()}.jpg`,
        type: result.mime || 'image/jpeg',
      } as Asset);
    } catch (error: any) {
      if (error?.code !== 'E_PICKER_CANCELLED') {
        showToastMessage(error?.message || 'Failed to capture image', 'error');
      }
    }
  }, []);

  const handleEditAvatar = useCallback(() => {
    setShowSetProfileModal(true);
  }, []);

  const closeSetProfileModal = useCallback(() => {
    setShowSetProfileModal(false);
  }, []);

  return (
    <Fragment>
      <SetProfilePhotoModal
        visible={showSetProfileModal}
        onClose={closeSetProfileModal}
        onSelectGallery={openGalleryWithCrop}
        onSelectCamera={openCameraWithCrop}
      />
      <CustomSafeAreaView>
        <Header title="Account info" backNavigation={true} onBack={() => goBack()} />
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <ProfileAvatar
                  imageUrl={selectedImage?.uri || profile?.profile_pic}
                  name={profile?.name}
                  size={96}
                  fontVariant="semiBoldDxs"
                  outerSize={16}
                />
                <Pressable style={styles.editAvatarButton} onPress={handleEditAvatar}>
                  <SvgXml xml={editAvatarIcon} width={20} height={20} />
                </Pressable>
              </View>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              {/* Full Name */}
              <View style={styles.fieldContainer}>
                <Typography variant="mediumTxtsm" color={colors.gray[700]} style={styles.label}>
                  Full name
                </Typography>
                <TextField
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  size="Medium"
                  keyboardType="name-phone-pad"
                />
              </View>

              {/* Email */}
              <View style={styles.fieldContainer}>
                <Typography variant="mediumTxtsm" color={colors.gray[700]} style={styles.label}>
                  Email
                </Typography>
                <TextField
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={false}
                  style={styles.disabledField}
                  size="Medium"
                  disable={true}
                />
              </View>

              {/* Phone */}
              <View style={styles.fieldContainer}>
                <Typography variant="mediumTxtsm" color={colors.gray[700]} style={styles.label}>
                  Phone
                </Typography>
                <View style={styles.phoneContainer}>
                  <View style={styles.phoneInputContainer}>
                    <PhoneInput
                      onFocus={() => { }}
                      onBlur={() => { }}
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      isError={phoneIncomplete}
                      error={
                        phoneIncomplete
                          ? 'Contact number must be 10 digits'
                          : undefined
                      }
                    />
                  </View>
                </View>
              </View>

              {/* Location */}
              <View style={styles.fieldContainer}>
                <Typography variant="mediumTxtsm" color={colors.gray[700]} style={styles.label}>
                  Country
                </Typography>
                <TextField
                  value={country}
                  onChangeText={ setCountry }
                  placeholder="Enter your location"
                  keyboardType="default"
                  autoCapitalize="none"
                  size="Medium"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Typography variant="mediumTxtsm" color={colors.gray[700]} style={styles.label}>
                  State
                </Typography>
                <TextField
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Enter your location"
                  keyboardType="default"
                  autoCapitalize="none"
                  size="Medium"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Typography variant="mediumTxtsm" color={colors.gray[700]} style={styles.label}>
                  Job title
                </Typography>
                <TextField
                  value={jobTitle}
                  onChangeText={setJobTitle}
                  placeholder=""
                  keyboardType="default"
                  autoCapitalize="none"
                  size="Medium"
                />
              </View>

              {/* Role */}
              <View style={styles.fieldContainer}>
                <Typography variant="mediumTxtsm" color={colors.gray[700]} style={styles.label}>
                  Role
                </Typography>
                <TextField
                  value={role}
                  placeholder="Role"
                  size="Medium"
                  editable={false}
                  disable={true}
                />
              </View>
            </View>

             <View style={styles.buttonContainer}>
              <Button
                onPress={handleSave}
                isLoading={loading || isUploading}
                style={styles.saveButton}
              >
                Save
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </CustomSafeAreaView>
    </Fragment>
  );
};

export default AccountInfo;
