import React, { Fragment, useState, useEffect, useCallback } from 'react';
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
import { editAvatarIcon } from '../../../../assets/svg/editavatar';
import { SetProfilePhotoModal } from './SetProfilePhotoModal';
import { useStyles } from './styles';

const AccountInfo = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const loading = useAppSelector(selectProfileLoading);
  const styles = useStyles();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [role, setRole] = useState('');

  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSetProfileModal, setShowSetProfileModal] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.name || '');
    setEmail(profile.email || '');
    setPhoneNumber(
      profile.contact !== null && profile.contact !== undefined
        ? String(profile.contact)
        : ''
    );
    setCountry(profile.country || '');
    setStateRegion(profile.state || '');
    setJobTitle(profile.position || '');
    setRole(profile.role?.name || '');
  }, [profile]);

  const appendProfileFormFields = useCallback(
    (formData: FormData) => {
      if (fullName?.trim()) formData.append('name', fullName.trim());
      formData.append('country', country.trim());
      formData.append('state', stateRegion.trim());
      formData.append('position', jobTitle.trim());
      if (phoneNumber?.trim()) {
        const parsedContact = parseInt(phoneNumber.replace(/\s/g, ''), 10);
        if (!Number.isNaN(parsedContact)) {
          formData.append('contact', String(parsedContact));
        }
      }
    },
    [fullName, country, stateRegion, jobTitle, phoneNumber]
  );

  const buildJsonUpdatePayload = useCallback(() => {
    const updatePayload: Record<string, unknown> = {
      name: fullName?.trim() ? fullName.trim() : null,
      country: country.trim() ? country.trim() : null,
      state: stateRegion.trim() ? stateRegion.trim() : null,
      position: jobTitle.trim() ? jobTitle.trim() : null,
    };
    if (phoneNumber?.trim()) {
      const parsedContact = parseInt(phoneNumber.replace(/\s/g, ''), 10);
      if (!Number.isNaN(parsedContact)) {
        updatePayload.contact = parsedContact;
      }
    } else {
      updatePayload.contact = null;
    }
    return updatePayload;
  }, [fullName, country, stateRegion, jobTitle, phoneNumber]);

  const handleSave = useCallback(async () => {
    if (selectedImage?.uri) {
      const formData = new FormData();
      appendProfileFormFields(formData);

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
        showToastMessage(error.message || 'Failed to update profile', 'error');
      } finally {
        setIsUploading(false);
      }
    } else {
      dispatch(updateProfileRequestAction(buildJsonUpdatePayload() as any));
    }
  }, [
    dispatch,
    selectedImage,
    appendProfileFormFields,
    buildJsonUpdatePayload,
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

  const displayName = fullName.trim() || profile?.name;

  const renderReadOnlyField = (label: string, value: string) => {
    const displayValue = value?.trim() ? value.trim() : '—';
    return (
      <View style={styles.fieldContainer}>
        <Typography variant="mediumTxtsm" color={colors.gray[700]} style={styles.label}>
          {label}
        </Typography>
        <View style={styles.readOnlyValueContainer}>
          <Typography variant="mediumTxtmd" color={colors.gray[900]} style={styles.readOnlyValueText}>
            {displayValue}
          </Typography>
        </View>
      </View>
    );
  };

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
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <ProfileAvatar
                  imageUrl={selectedImage?.uri || profile?.profile_pic}
                  name={displayName}
                  size={96}
                  fontVariant="semiBoldDxs"
                  outerSize={16}
                />
                <Pressable style={styles.editAvatarButton} onPress={handleEditAvatar}>
                  <SvgXml xml={editAvatarIcon} width={20} height={20} />
                </Pressable>
              </View>
            </View>

            <View style={styles.formContainer}>
              {renderReadOnlyField('Full name', fullName)}
              {renderReadOnlyField('Email', email)}
              {renderReadOnlyField('Phone', phoneNumber)}
              {renderReadOnlyField('Country', country)}
              {renderReadOnlyField('State', stateRegion)}
              {renderReadOnlyField('Job title', jobTitle)}
              {renderReadOnlyField('Role', role)}
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
