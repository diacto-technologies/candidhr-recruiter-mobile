import { Image, View } from 'react-native';
import Typography from '../../atoms/typography';
import Card from '../../atoms/card';
import React from 'react';
import { useStyles } from './styels';
import { colors } from '../../../theme/colors';
import Divider from '../../atoms/divider';
import { getStatusColor } from '../../organisms/applicantlist/helper';
import { horizontalThreedotIcon } from '../../../assets/svg/horizontalthreedoticon';
import { SvgXml } from 'react-native-svg';
import { navigate } from '../../../utils/navigationUtils';
import type {
  Assessment,
  AssessmentSharedUser,
} from '../../../features/assessments/types';

const formatDuration = (minutes: number): string => {
  const n = Number(minutes);
  if (Number.isNaN(n) || n < 0) return '—';
  if (n < 1) return '< 1 min';
  if (n < 60) return `${Math.round(n)} min`;
  const hrs = Math.floor(n / 60);
  const mins = Math.round(n % 60);
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
};

function getAvatarUris(item: Assessment): string[] {
  const uris: string[] = [];
  const creatorPic = item.created_by?.profile_pic;
  if (typeof creatorPic === 'string' && creatorPic.length > 0) {
    uris.push(creatorPic);
  }
  const shared = Array.isArray(item.users_shared_with) ? item.users_shared_with : [];
  for (let i = 0; i < Math.min(2, shared.length); i++) {
    const pic = (shared[i] as AssessmentSharedUser)?.profile_pic;
    if (typeof pic === 'string' && pic.length > 0) uris.push(pic);
  }
  return uris;
}

interface AssessmentCardProps {
  item: Assessment;
}

const AssessmentCard = ({ item }: AssessmentCardProps) => {
  const styles = useStyles();
  const status = item.is_published ? 'Published' : 'Draft';
  const createdByName =
    (item.created_by?.name && String(item.created_by.name).trim()) || 'Unknown';
  const avatarUris = getAvatarUris(item);
  const sharedLength = Array.isArray(item.users_shared_with)
    ? item.users_shared_with.length
    : 0;
  const extraCount = Math.max(0, sharedLength - 2);
  const durationMinutes =
    typeof item.time_duration_in_minutes === 'number' &&
    !Number.isNaN(item.time_duration_in_minutes)
      ? item.time_duration_in_minutes
      : 0;
  const questionCount =
    typeof item.total_question === 'number' && !Number.isNaN(item.total_question)
      ? item.total_question
      : 0;

  return (
    <Card style={styles.card} onPress={() => navigate('CompanyInfo')}>
      <View>
        <View style={styles.rowBetween}>
          <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
            {item.title}
          </Typography>
          <SvgXml xml={horizontalThreedotIcon} height={20} width={20} />
        </View>
        <Typography variant="regularTxtsm" color={colors.gray[500]}>
          Created by {createdByName}
        </Typography>
      </View>

      <View style={styles.metaRow}>
        <Typography variant="regularTxtsm" color={colors.gray[600]}>
          Question :{' '}
        </Typography>
        <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
          {questionCount}
        </Typography>
        <View style={{ marginRight: 10 }} />
        <Typography variant="regularTxtsm" color={colors.gray[600]}>
          Duration :{' '}
        </Typography>
        <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
          {formatDuration(durationMinutes)}
        </Typography>
      </View>

      <Divider />
      <View>
        <View style={styles.rowBetween}>
          <View style={styles.avatarGroup}>
            {avatarUris.length > 0 ? (
              avatarUris.slice(0, 3).map((uri, index) => (
                <Image
                  key={`${item.id}-avatar-${index}`}
                  source={{ uri }}
                  style={[styles.avatar, { marginLeft: index === 0 ? 0 : -12 }]}
                />
              ))
            ) : (
             <></>
            )}
            {extraCount > 0 && (
              <View style={[styles.avatar, styles.moreAvatar]}>
                <Typography variant="semiBoldTxtxs" color={colors.gray[600]}>
                  +{extraCount}
                </Typography>
              </View>
            )}
          </View>
          <View style={styles.statusBadge}>
            <View
              style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]}
            />
            <Typography variant="mediumTxtxs">{status}</Typography>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default AssessmentCard;

