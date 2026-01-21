import React from 'react';
import { View, StyleSheet, Pressable, Linking, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';

import { colors } from '../../../theme/colors';
import { Shimmer, Typography, ProfileAvatar } from '../../atoms';
import Icon from '../../atoms/vectoricon';

import { jobIcon } from '../../../assets/svg/jobicon';
import { locationIcon } from '../../../assets/svg/location';
import { singleDotIcon } from '../../../assets/svg/singledot';

import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectApplicationsDetailLoading, selectSelectedApplication } from '../../../features/applications/selectors';
import { formatMonDDYYYY } from '../../../utils/dateformatter';
import { formatExperience } from '../../../utils/experienceformatter';
import { Button } from 'react-native-share';


const ProfileCardShimmer = () => {
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

const ProfileCart = () => {
  const application = useAppSelector(selectSelectedApplication);
  const isLoading = useAppSelector(selectApplicationsDetailLoading);

  if (isLoading) {
    return <ProfileCardShimmer />;
  }

  const candidate = application?.candidate;
  const location = candidate?.location;
  const job = application?.job;

  const hasLocation = location?.city || location?.state;
  const hasExperience = job?.score_weight?.work_experience;

  // GitHub → FORCE browser (100% reliable, prevents LinkedIn hijacking)
  const openGitHub = async (url: string) => {
    if (!url) return;

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http')) {
      finalUrl = `https://${finalUrl}`;
    }

    // FORCE browser on Android to avoid LinkedIn hijack
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

    // iOS & fallback
    try {
      await Linking.openURL(finalUrl);
    } catch (error) {
      // Silently fail
    }
  };

  // LinkedIn → Let OS decide (opens app correctly)
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

  // Website → Open in browser
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
          imageUrl={candidate?.profile_pic}
          name={candidate?.name}
          size={88}
          fontVariant="semiBoldDxs"
          outerSize={16}
        />
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <View style={{ gap: 4 }}>
          {/* Name OR Application ID */}
          <Typography variant="semiBoldDxs">
            {candidate?.name
              ? candidate.name
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
                    {formatExperience(job.score_weight.work_experience)}
                  </Typography>
                </>
              )}
            </View>
          )}
        </View>

        {/* Social Icons */}
        <View style={styles.iconRow}>
          {/* LinkedIn */}
          {application?.candidate?.linkedin && (
            <Pressable
              onPress={() => openLinkedIn(application.candidate.linkedin)}
              style={styles.iconBox}
            >
              <Icon name="logo-linkedin" size={20} color="#0A66C2" iconFamily="Ionicons" />
            </Pressable>
          )}
          {/* GitHub */}
          {application?.candidate?.github && (
            <Pressable
              onPress={() => openGitHub(application.candidate.github)}
              style={styles.iconBox}
            >
              <Icon name="logo-github" size={20} color="#000" iconFamily="Ionicons" />
            </Pressable>
          )}
          {/* Website */}
          {application?.resume?.personal_website && (
            <Pressable
              onPress={() => openWebsite(application.resume!.personal_website!)}
              style={styles.iconBox}
            >
              <Icon name="globe" size={20} color="#444" iconFamily="Entypo" />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.base.white,
    overflow: 'hidden',
  },
  header: {
    height: 90,
    borderRadius: 12,
    margin: 4
  },
  photoWrapper: {
    position: 'absolute',
    top: 35,
    left: 18,
    zIndex: 10,
  },
  shimmerBorder: {
    width: 105,
    height: 105,
    borderRadius: 999,
    backgroundColor: colors.base.white,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 16,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: colors.base.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
});

export default ProfileCart;