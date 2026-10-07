import React from 'react';
import { View, Pressable, TouchableOpacity, Alert, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../theme/colors';
import { Shimmer, Typography, ProfileAvatar } from '../../atoms';
import Icon from '../../atoms/vectoricon';
import { jobIcon } from '../../../assets/svg/jobicon';
import { locationIcon } from '../../../assets/svg/location';
import { singleDotIcon } from '../../../assets/svg/singledot';
import { formatMonDDYYYY } from '../../../utils/dateformatter';
import { formatExperience } from '../../../utils/experienceformatter';
import { exportIcon } from '../../../assets/svg/export';
import { emailIcon } from '../../../assets/svg/email';
import { linkChainIcon } from '../../../assets/svg/linkChain';
import { eyeVisibleIcon } from '../../../assets/svg/eyevisible';
import { getStatusColor, getStatusLabel } from '../../../constants/applicantStatus';
import { PERMISSIONS } from '../../../utils/permission.constants';
import { usePermission } from '../../../hooks/usePermission';
import { useStyles } from './styles';
import {
  ApplicationProfileDetails,
  getApplicationShortLinkRequestAction,
} from '../../../features/applications';
import { openExternalLink } from '../../../utils/urlUtils';
import Clipboard from '@react-native-clipboard/clipboard';
import { showToastMessage } from '../../../utils/toast';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { organizationalOrigin } from '../../../features/auth';

export interface ProfileCardProps {
  application: ApplicationProfileDetails | null;
  loading: boolean;
  onPressExport?: () => void; // download
  onPressPreview?: () => void; // preview
  onPressEmail?: () => void;
  onPressViewers?: () => void;
  viewersCount?: number;
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

      <View style={styles.sideHeaderContent}>
        <Shimmer width={38} height={38} borderRadius={8} />
        <View style={styles.statusMetaBlock}>
          <Shimmer width="70%" height={14} borderRadius={4} />
          <Shimmer width="40%" height={12} borderRadius={8} />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoTextGroup}>
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

const ProfileCard: React.FC<ProfileCardProps> = ({
  application,
  loading,
  onPressExport,
  onPressPreview,
  onPressEmail,
  onPressViewers,
  viewersCount,
}) => {
  const { can } = usePermission();
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const origin = useAppSelector(organizationalOrigin);

  const handleCopyApplicantLink = () => {
    if (!application?.id) return;
    dispatch(getApplicationShortLinkRequestAction(String(application.id)));
  };

  if (loading) {
    return <ProfileCardShimmer />;
  }

  const person = application?.applicant ?? (application as any)?.candidate;
  const location = person?.location;
  const job = application?.job;
  const hasLocation = Boolean(location?.city || location?.state);
  const relevantExpMonths = application?.application_context?.relevant_experience_in_months;
  const relevantExpYears =
    typeof relevantExpMonths === 'number' ? relevantExpMonths / 12 : null;
  const hasExperience = typeof relevantExpYears === 'number' && relevantExpYears > 0;
  const viewCount =
    viewersCount ??
    application?.views?.distinct_viewer_count ??
    application?.views?.view_count ??
    (application as any)?.views_count ??
    0;
  const linkedin = (person?.linkedin || (application as any)?.candidate?.linkedin || (application as any)?.resume?.linkedin || '')?.trim();
  const github = (person?.github || (application as any)?.candidate?.github || (application as any)?.resume?.github || '')?.trim();
  const personalWebsite = (person?.personal_website || (application as any)?.candidate?.personal_website || (application as any)?.resume?.personal_website || '')?.trim();
  const hasSocialIcons = Boolean(linkedin || github || personalWebsite);

  const statusObj = application?.status;
  const statusValue = statusObj?.value ?? '';
  const statusLabel = statusValue ? getStatusLabel(statusValue) : '';
  const statusDotColor = statusValue ? getStatusColor(statusValue) : colors.success[500];
  const updatedBy =
    typeof statusObj?.changed_by === 'object' && statusObj?.changed_by?.name
      ? statusObj.changed_by.name
      : typeof statusObj?.changed_by === 'string'
        ? statusObj.changed_by
        : typeof statusObj?.updated_by === 'object' && (statusObj?.updated_by as any)?.name
          ? (statusObj.updated_by as any).name
          : typeof statusObj?.updated_by === 'string'
            ? statusObj.updated_by
            : '';
  const updatedAt = statusObj?.changed_at || statusObj?.updated_at || '';
  const isOverridden = Boolean(statusObj?.is_user_override ?? statusObj?.is_overridden_by_user);

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
      {can(PERMISSIONS.EXPORT_APPLICATION_PROFILE) && (
        <TouchableOpacity
          onPress={handlePressExport}
          style={styles.mailButton}
        >
          <SvgXml xml={exportIcon} color={colors.gray[600]} height={18} width={18} />
        </TouchableOpacity>
      )}
      {/* Profile Image (overlaps banner) */}
      <View style={styles.photoWrapper}>
        <ProfileAvatar
          imageUrl={person?.profile_pic}
          name={person?.name ?? `****${String(application?.id ?? '').slice(-4)}`}
          size={88}
          fontVariant="semiBoldDxs"
          outerSize={16}
        />
      </View>

      {/* Side Header Content (in white card area to right of avatar) */}
      <View style={styles.sideHeaderContent}>
        {/* 2. Status text & Overridden */}
        {statusValue ? (
          <View style={styles.statusMetaBlock}>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: statusDotColor },
                ]}
              />
              <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
                {statusLabel}
              </Typography>
              {updatedBy ? (
                <Typography variant="regularTxtxs" color={colors.gray[500]} numberOfLines={1}>
                  · {updatedBy}
                </Typography>
              ) : null}
              {updatedAt ? (
                <Typography variant="regularTxtxs" color={colors.gray[500]}>
                  {formatMonDDYYYY(updatedAt, 'DD MMM')}
                </Typography>
              ) : null}
            </View>

            {isOverridden ? (
              <View style={styles.overriddenBadge}>
                <Ionicons
                  name="return-up-back"
                  size={11}
                  color={colors.gray[600]}
                />
                <Typography variant="mediumTxtxs" color={colors.gray[600]}>
                  overridden
                </Typography>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <View style={styles.infoTextGroup}>
          {/* Name OR Application ID */}
          <View style={styles.nameRow}>
            <Typography variant="semiBoldDxs">
              {person?.name
                ? person?.name
                : `Application ID: ****${String(application?.id ?? '').slice(-4)}`}
            </Typography>
            {application?.id ? (
              <Pressable
                onPress={handleCopyApplicantLink}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.copyLinkButton}
              >
                <SvgXml xml={linkChainIcon} color={colors.gray[600]} width={18} height={18} />
              </Pressable>
            ) : null}
          </View>

          {/* Job Title */}
          {job?.title && (
            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              Applied on {formatMonDDYYYY(application?.applied_at, 'DD MMM YYYY')} for{' '}
              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                {job.title}
              </Typography>
            </Typography>
          )}

          {/* Location & Experience Row */}
          {(hasLocation || hasExperience || onPressViewers) && (
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

              {onPressViewers && (
                <TouchableOpacity
                  onPress={onPressViewers}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.eyeButton}
                  activeOpacity={0.7}
                >
                  <SvgXml xml={eyeVisibleIcon} width={18} height={18} />
                  <Typography variant="regularTxtsm" color={colors.gray[600]}>
                    {viewCount}
                  </Typography>
                </TouchableOpacity>
              )}

              {hasExperience && (
                <>
                  <SvgXml xml={singleDotIcon} />
                  <SvgXml xml={jobIcon} width={20} height={20} />
                  <Typography variant="regularTxtsm" color={colors.gray[600]}>
                    {formatExperience(relevantExpYears)}
                  </Typography>
                </>
              )}
            </View>
          )}
        </View>

        {/* Actions / Social Icons */}
        <View style={styles.iconRow}>
          {/* Email button (permanently visible) */}
          <Pressable
            onPress={() => {
              if (onPressEmail) {
                onPressEmail();
              } else if (person?.email) {
                Linking.openURL(`mailto:${person.email}`);
              }
            }}
            style={styles.iconBox}
          >
            <SvgXml xml={emailIcon} width={20} height={20} />
          </Pressable>

          {/* Vertical divider line - only visible when LinkedIn or other icon is visible */}
          {hasSocialIcons ? <View style={styles.verticalDivider} /> : null}

          {/* LinkedIn */}
          {linkedin ? (
            <Pressable
              onPress={() => openExternalLink(linkedin)}
              style={styles.iconBox}
            >
              <Icon name="logo-linkedin" size={20} color="#0A66C2" iconFamily="Ionicons" />
            </Pressable>
          ) : null}
          {/* GitHub */}
          {github ? (
            <Pressable
              onPress={() => openExternalLink(github)}
              style={styles.iconBox}
            >
              <Icon name="logo-github" size={20} color="#000" iconFamily="Ionicons" />
            </Pressable>
          ) : null}
          {/* Website */}
          {personalWebsite ? (
            <Pressable
              onPress={() => openExternalLink(personalWebsite)}
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

export default ProfileCard;