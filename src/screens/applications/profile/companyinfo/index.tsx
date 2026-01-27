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
import { Header, CompanyLogoAvatar, ProfileAvatar } from '../../../../components';
import { goBack } from '../../../../utils/navigationUtils';
import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview';
import Typography from '../../../../components/atoms/typography';
import { TextField } from '../../../../components/atoms/textfield';
import { UrlInputField } from '../../../../components/atoms/urlinputfield';
import Button from '../../../../components/atoms/button';
import { SvgXml } from 'react-native-svg';
import { colors } from '../../../../theme/colors';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { selectProfile } from '../../../../features/profile/selectors';
import { Dropdown } from 'react-native-element-dropdown';
import { Text } from 'react-native-gesture-handler';
import PhoneInput from '../../../../components/atoms/phonefield';
import { Fonts } from '../../../../theme/fonts';
import { searchIcon } from '../../../../assets/svg/search';
import { editAvatarIcon } from '../../../../assets/svg/editavatar';
import { useRNSafeAreaInsets } from '../../../../hooks/useRNSafeAreaInsets';
import { useStyles } from './styles';
import { chevronDownIcon } from '../../../../assets/svg/chevrondownicon';
interface DropdownOption {
  label: string;
  value: string;
}

const industryOptions: DropdownOption[] = [
  { label: 'It consulting and services', value: 'it_consulting_services' },
  { label: 'Software Development', value: 'software_development' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Finance', value: 'finance' },
  { label: 'Education', value: 'education' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Retail', value: 'retail' },
  { label: 'Other', value: 'other' },
];

const companySizeOptions: DropdownOption[] = [
  { label: '1-10 employees', value: '1-10' },
  { label: '11-50 employees', value: '11-50' },
  { label: '51-200 employees', value: '51-200' },
  { label: '201-500 employees', value: '201-500' },
  { label: '501-1000 employees', value: '501-1000' },
  { label: '1000+ employees', value: '1000+' },
];

const organizationTierOptions: DropdownOption[] = [
  { label: 'Basic', value: 'basic' },
  { label: 'Standard', value: 'standard' },
  { label: 'Premium', value: 'premium' },
  { label: 'Enterprise', value: 'enterprise' },
];

const countryOptions: DropdownOption[] = [
  { label: 'India', value: 'india' },
  { label: 'United States', value: 'united_states' },
  { label: 'United Kingdom', value: 'united_kingdom' },
  { label: 'Canada', value: 'canada' },
  { label: 'Australia', value: 'australia' },
  { label: 'Germany', value: 'germany' },
  { label: 'France', value: 'france' },
  { label: 'Singapore', value: 'singapore' },
];

const locationOptions: DropdownOption[] = [
  { label: 'Pune, Maharashtra', value: 'pune_maharashtra' },
  { label: 'Mumbai, Maharashtra', value: 'mumbai_maharashtra' },
  { label: 'Bangalore, Karnataka', value: 'bangalore_karnataka' },
  { label: 'Delhi, NCR', value: 'delhi_ncr' },
  { label: 'Chennai, Tamil Nadu', value: 'chennai_tamilnadu' },
  { label: 'Hyderabad, Telangana', value: 'hyderabad_telangana' },
];

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
  const [phoneCode, setPhoneCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [loading, setLoading] = useState(false);
  const { insetsTop } = useRNSafeAreaInsets();

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

  const renderDropdownField = (
    label: string,
    value: string,
    options: DropdownOption[],
    onChange: (value: string) => void,
    placeholder: string
  ) => {
    // Find matching option by label or value
    const matchedOption = options.find(
      (opt) =>
        opt.label.toLowerCase() === value.toLowerCase() ||
        opt.value.toLowerCase() === value.toLowerCase() ||
        opt.label.toLowerCase().includes(value.toLowerCase()) ||
        value.toLowerCase().includes(opt.label.toLowerCase())
    );

    // Use selectedTextStyle for placeholder when value exists but no match
    const hasValue = value && value.trim() !== '';

    return (
      <View style={styles.fieldContainer}>
        <Typography variant="mediumTxtsm" color={colors.gray[700]} style={styles.label}>
          {label}
        </Typography>
        <View style={styles.dropdownContainer}>
          <Dropdown
            style={styles.dropdown}
            containerStyle={styles.dropdownListContainer}
            placeholderStyle={hasValue && !matchedOption ? styles.selectedTextStyle : styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={options}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={value || placeholder}
            value={matchedOption?.value || null}
            onChange={(item) => onChange(item.label)}
            renderRightIcon={() => <SvgXml xml={chevronDownIcon} width={20} height={20} />}
            disable={true}
          />
        </View>
      </View>
    );
  };

  const renderSearchField = (
    label: string,
    value: string,
    options: DropdownOption[],
    onChange: (value: string) => void,
    placeholder: string
  ) => {
    // Find matching option by label or value
    const matchedOption = options.find(
      (opt) =>
        opt.label.toLowerCase() === value.toLowerCase() ||
        opt.value.toLowerCase() === value.toLowerCase() ||
        opt.label.toLowerCase().includes(value.toLowerCase()) ||
        value.toLowerCase().includes(opt.label.toLowerCase())
    );

    // Use selectedTextStyle for placeholder when value exists but no match
    const hasValue = value && value.trim() !== '';

    return (
      <View style={styles.fieldContainer}>
        <Typography variant="mediumTxtsm" color={colors.gray[700]} style={styles.label}>
          {label}
        </Typography>
        <View style={styles.dropdownContainer}>
          <Dropdown
            style={[styles.dropdown]}
            containerStyle={styles.dropdownListContainer}
            placeholderStyle={hasValue && !matchedOption ? styles.selectedTextStyle : styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={options}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={value || placeholder}
            value={matchedOption?.value || null}
            onChange={(item) => onChange(item.label)}
            search
            searchPlaceholder="Search..."
            renderLeftIcon={() => (
              <View style={styles.searchIconContainer}>
                <SvgXml xml={searchIcon} width={20} height={20} />
              </View>
            )}
            renderRightIcon={() => null}
            disable={true}
          />
        </View>
      </View>
    );
  };

  const renderUrlField = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    placeholder: string
  ) => (
    <View style={styles.fieldContainer}>
      <UrlInputField
        label={label}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        showCopyIcon={true}
        disable={true}
      />
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
              <View style={styles.fieldContainer}>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]} style={styles.label}>
                  Company name
                </Typography>
                <TextField
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder="Enter company name"
                  size="Medium"
                  disable={true}
                  // showDivider={true}
                />
              </View>

              {/* Industry */}
              {renderDropdownField('Industry', industry, industryOptions, setIndustry, 'Select industry')}

              {/* Company Size */}
              {renderDropdownField('Company size', companySize, companySizeOptions, setCompanySize, 'Select company size')}

              {/* Organization Tier */}
              {renderDropdownField('Organization Tier', organizationTier, organizationTierOptions, setOrganizationTier, 'Select tier')}

              {/* About Us */}
              <View style={styles.fieldContainer}>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]} style={styles.label}>
                  About company
                </Typography>
                <TextField
                  value={aboutUs}
                  onChangeText={setAboutUs}
                  placeholder={`Write about ${companyName || 'your company'}...`}
                  multiline
                  numberOfLines={4}
                  style={styles.textArea}
                  size='Large'
                  disable={true}
                />
              </View>

              {/* Website */}
              {renderUrlField('Website', website, setWebsite, 'yourwebsite.com')}

              {/* Country */}
              {renderSearchField('Country', country, countryOptions, setCountry, 'Search country')}

              {/* Location */}
              {renderSearchField('Location', location, locationOptions, setLocation, 'Search location')}

              {/* Company Email */}
              <View style={styles.fieldContainer}>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]} style={styles.label}>
                  Company email
                </Typography>
                <TextField
                  value={companyEmail}
                  onChangeText={setCompanyEmail}
                  placeholder="company@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  size="Medium"
                  disable={true}
                />
              </View>

              {/* Support Email */}
              <View style={styles.fieldContainer}>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]} style={styles.label}>
                  Support email
                </Typography>
                <TextField
                  value={supportEmail}
                  onChangeText={setSupportEmail}
                  placeholder="support@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  size="Medium"
                  disable={true}
                />
              </View>

              {/* Phone */}
              <View style={styles.fieldContainer}>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]} style={styles.label}>
                  Phone
                </Typography>
                <View style={styles.phoneContainer}>
                  <View style={styles.phoneInputContainer}>
                     <PhoneInput
                      onFocus={() => { }}
                      onBlur={() => { }}
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                       size="Medium"
                       disabled={true}
                    />
                  </View>
                </View>
              </View>

              {/* LinkedIn */}
              {renderUrlField('Linkedin', linkedin, setLinkedin, 'in.linkedin.com/company/...')}

              {/* Facebook */}
              {renderUrlField('Facebook', facebook, setFacebook, 'www.facebook.com/...')}

              {/* Twitter */}
              {renderUrlField('Twitter', twitter, setTwitter, 'x.com/...')}
            </View>
            <View style={styles.buttonContainer}>
            <Button onPress={()=>{}} isLoading={loading} style={styles.saveButton}>
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
