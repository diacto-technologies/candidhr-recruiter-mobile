import React, { Fragment, useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Header, CompanyLogoAvatar } from '../../../../components';
import { goBack } from '../../../../utils/navigationUtils';
import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview';
import Typography from '../../../../components/atoms/typography';
import { TextField } from '../../../../components/atoms/textfield';
import { UrlInputField } from '../../../../components/atoms/urlinputfield';
import Button from '../../../../components/atoms/button';
import { colors } from '../../../../theme/colors';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { selectProfile } from '../../../../features/profile/selectors';
import PhoneInput from '../../../../components/atoms/phonefield';
import { SvgXml } from 'react-native-svg';
import { useStyles } from './styles';
import { companySizeOptions, countryOptions, industryOptions, locationOptions, organizationTierOptions } from './companyinfo.config';
import { editIcon } from '../../../../assets/svg/edit';

const CompanyInfo = () => {
  const profile = useAppSelector(selectProfile);
  const tenant = profile?.tenant;
  const styles = useStyles();

  // Form state
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [organizationTier, setOrganizationTier] = useState('');
  const [aboutUs, setAboutUs] = useState('');
  const [website, setWebsite] = useState('');
  const [country, setCountry] = useState('');
  const [location, setLocation] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [loading, setLoading] = useState(false);
  const [editable, setEditable] = useState<Record<string, boolean>>({});

  // Initialize form with tenant data
  useEffect(() => {
    if (tenant) {
      setCompanyName(tenant.org_name || '');
      setIndustry(tenant.industry || '');
      setCompanySize(tenant.size || '');
      setOrganizationTier(tenant.org_tier || '');
      setAboutUs(tenant.about_us || '');
      setWebsite(tenant.website || '');
      setCountry(tenant.country || '');
      setLocation(tenant.state || '');
      setCompanyEmail(tenant.contact_email || '');
      setSupportEmail(tenant.support_email || '');
      if (tenant.contact_phone) {
        setPhoneNumber(tenant.contact_phone);
      }
      setLinkedin(tenant.linkedin || '');
      setFacebook(tenant.facebook || '');
      setTwitter(tenant.twitter || '');
    }
  }, [tenant]);

  const handleSave = useCallback(() => {
    setLoading(true);
    // TODO: Implement company info update API
    console.log('Saving company info...', {
      companyName,
      industry,
      companySize,
      organizationTier,
      aboutUs,
      website,
      country,
      location,
      companyEmail,
      supportEmail,
      phoneNumber,
      linkedin,
      facebook,
      twitter,
    });
    setTimeout(() => setLoading(false), 1000);
  }, [
    companyName,
    industry,
    companySize,
    organizationTier,
    aboutUs,
    website,
    country,
    location,
    companyEmail,
    supportEmail,
    phoneNumber,
    linkedin,
    facebook,
    twitter,
  ]);

  const handleEditLogo = () => {
    // TODO: Implement image picker
    console.log('Edit logo pressed');
  };

  const toggleEditable = useCallback((key: string) => {
    setEditable((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const getOptionLabel = useCallback((value: string, options: { label: string; value: string }[]) => {
    if (!value?.trim()) return '';
    const v = value.toLowerCase();
    const matched = options.find((opt) => opt.value.toLowerCase() === v || opt.label.toLowerCase() === v);
    return matched?.label ?? value;
  }, []);

  const renderEditableTextField = (
    fieldKey: string,
    label: string,
    value: string,
    onChangeText: (next: string) => void,
    placeholder: string
  ) => (
    <View style={styles.fieldContainer}>
      <Typography variant="mediumTxtsm" color={colors.gray[700]} style={styles.label}>
        {label}
      </Typography>
      <View style={styles.fieldInputRow}>
        <View style={styles.fieldInputFlex}>
          <TextField
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            size="Medium"
            disable={!editable[fieldKey]}
          />
        </View>
        <View style={styles.editButtonWrap}>
          <Button
            onPress={() => toggleEditable(fieldKey)}
            type="Secondary"
            size="Small"
            style={styles.editButton}
          >
            <SvgXml xml={editIcon} width={18} height={18} />
          </Button>
        </View>
      </View>
    </View>
  );

  const renderUrlField = (
    fieldKey: string,
    label: string,
    value: string,
    onChange: (value: string) => void,
    placeholder: string
  ) => (
    <View style={styles.fieldContainer}>
      <Typography variant="mediumTxtsm" color={colors.gray[700]} style={styles.label}>
        {label}
      </Typography>
      <View style={styles.fieldInputRow}>
        <View style={styles.fieldInputFlex}>
          <UrlInputField
            label=""
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            showCopyIcon={true}
            disable={!editable[fieldKey]}
          />
        </View>
        <View style={styles.editButtonWrap}>
          <Button
            onPress={() => toggleEditable(fieldKey)}
            type="Secondary"
            size="Small"
            style={styles.editButton}
          >
            <SvgXml xml={editIcon} width={18} height={18} />
          </Button>
        </View>
      </View>
    </View>
  );

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
          >
            {/* Logo Section */}
            <View style={styles.logoSection}>
              {/* <View style={styles.avatarContainer}> */}
              <CompanyLogoAvatar
                imageUrl={profile?.tenant?.logo}
                name={companyName || profile?.tenant?.org_name}
                size={96}
                borderRadius={16}
                fontVariant="semiBoldDxs"
                showEditBadge={true}
                onEditPress={handleEditLogo}
              />
              {/* <ProfileAvatar
                imageUrl={profile?.tenant?.logo}
                name={profile?.tenant?.org_name}
                size={96}
                fontVariant="semiBoldDxs"
                outerSize={16}
              /> */}
              {/* <Pressable style={styles.editAvatarButton} onPress={()=>{}}>
                  <SvgXml xml={editAvatarIcon} width={20} height={20} />
                </Pressable> */}
              {/* </View> */}
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              {/* Company Name */}
              {renderEditableTextField(
                'companyName',
                'Company name',
                companyName,
                setCompanyName,
                'Enter company name'
              )}

              {/* Industry */}
              {renderEditableTextField(
                'industry',
                'Industry',
                editable.industry ? industry : getOptionLabel(industry, industryOptions),
                setIndustry,
                'Select industry'
              )}

              {/* Company Size */}
              {renderEditableTextField(
                'companySize',
                'Company size',
                editable.companySize ? companySize : getOptionLabel(companySize, companySizeOptions),
                setCompanySize,
                'Select company size'
              )}

              {/* Organization Tier */}
              {renderEditableTextField(
                'organizationTier',
                'Organization Tier',
                editable.organizationTier ? organizationTier : getOptionLabel(organizationTier, organizationTierOptions),
                setOrganizationTier,
                'Select tier'
              )}

              {/* About Us */}
              <View style={styles.fieldContainer}>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]} style={styles.label}>
                  About company
                </Typography>
                <View style={styles.fieldInputRow}>
                  <View style={styles.fieldInputFlex}>
                    <TextField
                      value={aboutUs}
                      onChangeText={setAboutUs}
                      placeholder={`Write about ${companyName || 'your company'}...`}
                      multiline
                      numberOfLines={4}
                      style={styles.textArea}
                      size="Large"
                      disable={!editable.aboutUs}
                    />
                  </View>
                  <View style={styles.editButtonWrap}>
                    <Button
                      onPress={() => toggleEditable('aboutUs')}
                      type="Secondary"
                      size="Small"
                      style={styles.editButton}
                    >
                      <SvgXml xml={editIcon} width={18} height={18} />
                    </Button>
                  </View>
                </View>
              </View>

              {/* Country */}
              {renderEditableTextField(
                'country',
                'Country',
                editable.country ? country : getOptionLabel(country, countryOptions),
                setCountry,
                'Search country'
              )}

              {/* Location */}
              {renderEditableTextField(
                'location',
                'State',
                editable.location ? location : getOptionLabel(location, locationOptions),
                setLocation,
                'Search location'
              )}

              {/* Company Email */}
              {renderEditableTextField(
                'companyEmail',
                'Company email',
                companyEmail,
                setCompanyEmail,
                'company@example.com'
              )}

              {/* Support Email */}
              {renderEditableTextField(
                'supportEmail',
                'Support email',
                supportEmail,
                setSupportEmail,
                'support@example.com'
              )}

              {/* Phone */}
              <View style={styles.fieldContainer}>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]} style={styles.label}>
                  Contact Phone
                </Typography>
                <View style={styles.fieldInputRow}>
                  <View style={styles.fieldInputFlex}>
                    <View style={styles.phoneContainer}>
                      <View style={styles.phoneInputContainer}>
                        <PhoneInput
                          onFocus={() => {}}
                          onBlur={() => {}}
                          value={phoneNumber}
                          onChangeText={setPhoneNumber}
                          size="Medium"
                          disabled={!editable.phoneNumber}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={styles.editButtonWrap}>
                    <Button
                      onPress={() => toggleEditable('phoneNumber')}
                      type="Secondary"
                      size="Small"
                      style={styles.editButton}
                    >
                      <SvgXml xml={editIcon} width={18} height={18} />
                    </Button>
                  </View>
                </View>
              </View>

              {renderUrlField('website', 'Company website', website, setWebsite, 'yourwebsite.com')}
              
              {/* LinkedIn */}
              {renderUrlField('linkedin', 'Linkedin', linkedin, setLinkedin, 'in.linkedin.com/company/...')}

              {/* Facebook */}
              {renderUrlField('facebook', 'Facebook', facebook, setFacebook, 'www.facebook.com/...')}

              {/* Twitter */}
              {renderUrlField('twitter', 'Twitter', twitter, setTwitter, 'x.com/...')}
            </View>
            <View style={styles.buttonContainer}>
              <Button onPress={() => { }} isLoading={loading} style={styles.saveButton}>
                Save
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </CustomSafeAreaView>
    </Fragment>
  );
};

export default CompanyInfo;
