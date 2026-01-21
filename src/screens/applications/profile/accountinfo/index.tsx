import React, { Fragment, useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Image,
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
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import {
  selectProfile,
  selectProfileLoading,
} from '../../../../features/profile/selectors';
import { updateProfileRequestAction, getProfileRequestAction } from '../../../../features/profile/actions';
import { apiClient } from '../../../../api/client';
import { API_ENDPOINTS } from '../../../../api/endpoints';
import { Dropdown } from 'react-native-element-dropdown';
import PhoneInput from '../../../../components/atoms/phonefield';
import Profile from '..';
import { editAvatarIcon } from '../../../../assets/svg/editavatar';


interface LocationOption {
  label: string;
  value: string;
}

const AccountInfo = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const loading = useAppSelector(selectProfileLoading);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('');

  // Selected image state for avatar upload
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
  
  // Local loading state for image upload
  const [isUploading, setIsUploading] = useState(false);

  // Location options (can be fetched from API)
  const locationOptions: LocationOption[] = [
    { label: 'Pune, Maharashtra', value: 'pune_maharashtra' },
    { label: 'Mumbai, Maharashtra', value: 'mumbai_maharashtra' },
    { label: 'Bangalore, Karnataka', value: 'bangalore_karnataka' },
    { label: 'Delhi, NCR', value: 'delhi_ncr' },
    { label: 'Chennai, Tamil Nadu', value: 'chennai_tamilnadu' },
    { label: 'Hyderabad, Telangana', value: 'hyderabad_telangana' },
  ];

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setFullName(profile.name || '');
      setEmail(profile.email || '');
      // Parse phone number if available
      if (profile.contact) {
        const contactStr = String(profile.contact);
        setPhoneNumber(contactStr);
      }
      // Set location from country
      setLocation(profile.country || '');
      setRole(profile.role?.name || profile.position || '');
    }
  }, [profile]);

  const handleSave = useCallback(async () => {
    // Use FormData when there's an image to upload - call API directly to avoid Redux serialization issue
    if (selectedImage?.uri) {
      const formData = new FormData();
      
      // Append text fields - only append if they have values
      if (fullName?.trim()) {
        formData.append('name', fullName.trim());
      }
      
      if (location?.trim()) {
        formData.append('country', location.trim());
      }
      
      if (phoneNumber && phoneNumber.trim()) {
        const parsedContact = parseInt(phoneNumber.replace(/\s/g, ''), 10);
        if (!isNaN(parsedContact)) {
          formData.append('contact', String(parsedContact));
        }
      }

      // Append the image file
      const imageUri = Platform.OS === 'ios' 
        ? selectedImage.uri?.replace('file://', '') 
        : selectedImage.uri;
        
      formData.append('profile_pic', {
        uri: imageUri,
        name: selectedImage.fileName || `profile_${Date.now()}.jpg`,
        type: selectedImage.type || 'image/jpeg',
      } as any);

      if (__DEV__) {
        console.log('Uploading profile with image:', {
          uri: imageUri,
          name: selectedImage.fileName,
          type: selectedImage.type,
        });
      }

      try {
        setIsUploading(true);
        await apiClient.patch(API_ENDPOINTS.PROFILE.UPDATE, formData);
        // Clear selected image after successful upload
        setSelectedImage(null);
        // Refresh profile data
        dispatch(getProfileRequestAction());
        showToastMessage('Profile updated successfully', 'success');
      } catch (error: any) {
        console.log('Upload error:', error);
        showToastMessage(error.message || 'Failed to update profile', 'error');
      } finally {
        setIsUploading(false);
      }
    } else {
      // Regular JSON payload when no image - use Redux
      const updatePayload: Record<string, any> = {
        name: fullName || null,
      };

      if (phoneNumber && phoneNumber.trim()) {
        const parsedContact = parseInt(phoneNumber.replace(/\s/g, ''), 10);
        if (!isNaN(parsedContact)) {
          updatePayload.contact = parsedContact;
        }
      } else {
        updatePayload.contact = null;
      }
      updatePayload.country = location && location.trim() ? location.trim() : null;

      dispatch(updateProfileRequestAction(updatePayload));
    }
  }, [dispatch, fullName, phoneNumber, location, selectedImage]);

  const handleEditAvatar = useCallback(async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
        maxWidth: 500,
        maxHeight: 500,
      });

      // If user cancels
      if (result.didCancel) {
        return;
      }

      // If error
      if (result.errorCode) {
        showToastMessage(result.errorMessage || 'Image selection failed', 'error');
        return;
      }

      const asset = result.assets?.[0];
      if (asset?.uri) {
        setSelectedImage(asset);
      }
    } catch (error) {
      showToastMessage('Failed to open image picker', 'error');
    }
  }, []);

  return (
    <Fragment>
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
                {/* {profile?.profile_pic ? (
                  <Image
                    source={{ uri: profile.profile_pic }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Typography variant="semiBoldTxtxl" color={colors.gray[700]}>
                      {fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </Typography>
                  </View>
                )}
                <Pressable style={styles.editAvatarButton} onPress={handleEditAvatar}>
                  <SvgXml xml={editAvatarIcon} width={32} height={32} />
                </Pressable> */}
             
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
                    />
                  </View>
                </View>
              </View>

              {/* Location */}
              <View style={styles.fieldContainer}>
                <Typography variant="mediumTxtsm" color={colors.gray[700]} style={styles.label}>
                  Location
                </Typography>
                {/* <View style={styles.dropdownContainer}> */}
                {/* <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={locationOptions}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select location"
                    value={locationOptions.find(opt => opt.label === location)?.value}
                    onChange={(item) => {
                      setLocation(item.label);
                    }}
                    renderRightIcon={() => (
                      <SvgXml xml={chevronDownIcon} width={20} height={20} />
                    )}
                  /> */}
                <TextField
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Enter your location"
                  keyboardType="default"
                  autoCapitalize="none"
                  //editable={false}
                  //style={styles.disabledField}
                  size="Medium"
                />
                {/* </View> */}
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
                  //style={styles.disabledField}
                />
              </View>
            </View>

            {/* <View style={styles.bottomSpacer} /> */}
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
          {/* Save Button */}
        </KeyboardAvoidingView>
      </CustomSafeAreaView>
    </Fragment>
  );
};

export default AccountInfo;

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: colors.base.white,
    borderBottomColor: colors.gray[100],
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 5,
    right: 0,
    padding:8,
    borderRadius:100,
    backgroundColor: colors.base.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: colors.base.white,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
  },
  disabledField: {
    backgroundColor: colors.gray[50],
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneCodeContainer: {
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: colors.base.white,
  },
  phoneInputContainer: {
    flex: 1,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    backgroundColor: colors.base.white,
  },
  dropdown: {
    height: 44,
    paddingHorizontal: 16,
  },
  placeholderStyle: {
    fontSize: 16,
    color: colors.gray[500],
  },
  selectedTextStyle: {
    fontSize: 16,
    color: colors.gray[900],
  },
  buttonContainer: {
    paddingHorizontal: 16,
    // paddingVertical: 30,
  },
  saveButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.brand[600],
  },
});
