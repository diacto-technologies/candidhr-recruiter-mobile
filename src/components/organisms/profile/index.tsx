import React from 'react';
import { View, Pressable, Linking, Platform, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { colors } from '../../../theme/colors';
import { Shimmer, Typography, ProfileAvatar } from '../../atoms';
import Icon from '../../atoms/vectoricon';
import { jobIcon } from '../../../assets/svg/jobicon';
import { locationIcon } from '../../../assets/svg/location';
import { singleDotIcon } from '../../../assets/svg/singledot';
import { formatMonDDYYYY } from '../../../utils/dateformatter';
import { formatExperience } from '../../../utils/experienceformatter';
import { exportIcon } from '../../../assets/svg/export';
import { PERMISSIONS } from '../../../utils/permission.constants';
import { usePermission } from '../../../hooks/usePermission';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectSelectedApplication } from '../../../features/applications/selectors';
import { useStyles } from './styles';
import { ApplicationProfileDetails } from '../../../features/applications';

export interface Props {
  loading: boolean;
  onPressExport?: () => void; // download
  onPressPreview?: () => void; // preview
}

const ProfileCardShimmer = () => {
   const styles = useStyles();
  return (
    <View style={styles.container}>
      <Shimmer height={90} borderRadius={12} style={{ margin: 4 }} />

      <View style={styles.photoWrapper}>
        <View style={styles.shimmerBorder}>
          <Shimmer width={88} height={88} borderRadius={44} />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={{ gap: 8 }}>
          <Shimmer width="60%" height={18} />
          <Shimmer width="90%" height={14} />
          <Shimmer width="70%" height={14} />
        </View>

        <View style={styles.iconRow}>
          {[1, 2, 3].map(i => (
            <Shimmer key={i} width={40} height={40} borderRadius={8} />
          ))}
        </View>
      </View>
    </View>
  );
};

const ProfileCart: React.FC<Props> = ({loading, onPressExport, onPressPreview }) => {
  const { can } = usePermission();
   const styles = useStyles();
   const application = useAppSelector(selectSelectedApplication) as ApplicationProfileDetails | null;
  if (loading) {
    return <ProfileCardShimmer />;
  }

  const person = application?.applicant;
  const location = person?.location;
  const job = application?.job;
  const hasLocation = Boolean(location?.city || location?.state);
  const relevantExpMonths = application?.application_context?.relevant_experience_in_months;
  const relevantExpYears =
    typeof relevantExpMonths === 'number' ? relevantExpMonths / 12 : null;
  const hasExperience = typeof relevantExpYears === 'number' && relevantExpYears > 0;
  const personalWebsite = person?.personal_website ?? null;
  const openGitHub = async (url: string) => {
    if (!url) return;

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http')) {
      finalUrl = `https://${finalUrl}`;
    }

    if (Platform.OS === 'android') {
      const browserUrl = `intent://${finalUrl.replace(
        /^https?:\/\//,
        ''
      )}#Intent;scheme=https;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;end`;

      try {
        await Linking.openURL(browserUrl);
        return;
      } catch (e) {
        // Fall through to regular URL
      }
    }

    try {
      await Linking.openURL(finalUrl);
    } catch (error) {
      // Silently fail
    }
  };

  const openLinkedIn = async (url: string) => {
    if (!url) return;

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http')) {
      finalUrl = `https://${finalUrl}`;
    }

    try {
      await Linking.openURL(finalUrl);
    } catch (error) {
      // Silently fail
    }
  };

  const openWebsite = async (url: string) => {
    if (!url) return;

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http')) {
      finalUrl = `https://${finalUrl}`;
    }

    try {
      await Linking.openURL(finalUrl);
    } catch (error) {
      // Silently fail
    }
  };

  const handlePressExport = () => {
    if (onPressPreview && onPressExport) {
      Alert.alert('Export', 'Choose an option', [
        { text: 'Preview HTML', onPress: onPressPreview },
        { text: 'Download HTML', onPress: onPressExport },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }

    if (onPressPreview) return onPressPreview();
    return onPressExport?.();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.brand[100], '#E3E1FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      />

      {/* Profile Image */}
      <View style={styles.photoWrapper}>
        <ProfileAvatar
          imageUrl={person?.profile_pic}
          name={person?.name ?? `****${String(application?.id ?? '').slice(-4)}`}
          size={88}
          fontVariant="semiBoldDxs"
          outerSize={16}
        />
      </View>
      {/* Info */}
      <View style={styles.infoContainer}>
        {can(PERMISSIONS.EXPORT_APPLICATION_PROFILE) &&
          <TouchableOpacity
            onPress={handlePressExport}
            // disabled={!onPressExport && !onPressPreview}
            style={{ position: 'absolute', alignSelf: 'flex-end', margin: 10 }}
          >
            <SvgXml xml={exportIcon} color={colors.gray[400]} height={20} width={20} />
          </TouchableOpacity>
        }
        <View style={{ gap: 4 }}>
          {/* Name OR Application ID */}
          <Typography variant="semiBoldDxs">
            {person?.name
              ? person?.name
              : `Application ID: ****${String(application?.id ?? '').slice(-4)}`}
          </Typography>

          {/* Job Title */}
          {job?.title && (
            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              Applied on {formatMonDDYYYY(application?.applied_at)} for{' '}
              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                {job.title}
              </Typography>
            </Typography>
          )}

          {/* Location & Experience Row */}
          {(hasLocation || hasExperience) && (
            <View style={styles.row}>
              {hasLocation && (
                <>
                  <SvgXml xml={locationIcon} width={16} height={16} />
                  <Typography variant="regularTxtsm" color={colors.gray[600]}>
                    {location?.city ?? ''}
                    {location?.city && location?.state ? ', ' : ''}
                    {location?.state ?? ''}
                  </Typography>
                </>
              )}

              {hasLocation && hasExperience && <SvgXml xml={singleDotIcon} />}

              {hasExperience && (
                <>
                  <SvgXml xml={jobIcon} width={20} height={20} />
                  <Typography variant="regularTxtsm" color={colors.gray[600]}>
                    {formatExperience(relevantExpYears)}
                  </Typography>
                </>
              )}
            </View>
          )}
        </View>

        {/* Social Icons */}
        <View style={styles.iconRow}>
          {/* LinkedIn */}
          {person?.linkedin ? (
            <Pressable
              onPress={() => openLinkedIn(person.linkedin)}
              style={styles.iconBox}
            >
              <Icon name="logo-linkedin" size={20} color="#0A66C2" iconFamily="Ionicons" />
            </Pressable>
          ) : null}
          {/* GitHub */}
          {person?.github ? (
            <Pressable
              onPress={() => openGitHub(person.github)}
              style={styles.iconBox}
            >
              <Icon name="logo-github" size={20} color="#000" iconFamily="Ionicons" />
            </Pressable>
          ) : null}
          {/* Website */}
          {personalWebsite ? (
            <Pressable
              onPress={() => openWebsite(String(personalWebsite))}
              style={styles.iconBox}
            >
              <Icon name="globe" size={20} color="#444" iconFamily="Entypo" />
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
};
export default ProfileCart;