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
import { capitalizeFirstLetter } from '../../../utils/stringUtils';

const formatDuration = (minutes: number): string => {
  const n = Number(minutes);
  if (Number.isNaN(n) || n < 0) return '—';
  return `${n.toFixed(2)} min`;
};

function getAvatarUris(item: Assessment): string[] {
  if (!Array.isArray(item.users_shared_with)) return [];

  return item.users_shared_with
    .map(user => user?.profile_pic)
    .filter((pic): pic is string => typeof pic === 'string' && pic.length > 0);
}

interface AssessmentCardProps {
  item: Assessment;
}

const AssessmentCard = ({ item }: AssessmentCardProps) => {
  const styles = useStyles();
  const status = item.is_published ? 'Published' : 'Draft';
  const type = item.test_type;
  const createdByName = item.created_by?.name?.trim() || 'Unknown';
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

   const getInitials = (name?: string) => {
        if (!name) return 'U';
      
        return name
          .trim()
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map(word => word.charAt(0).toUpperCase())
          .join('');
      };

  const avatarUsers =
    sharedLength > 0
      ? item.users_shared_with
      : item.created_by
      ? [
          {
            id: item.created_by.id,
            name: item.created_by.name,
            profile_pic: item.created_by.profile_pic,
          },
        ]
      : [];

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
            {avatarUsers.slice(0, 3).map((user, index) => (
              user.profile_pic ? (
                <Image
                  key={user.id ?? index}
                  source={{ uri: user.profile_pic }}
                  style={[styles.avatar, { marginLeft: index === 0 ? 0 : -12 }]}
                />
              ) : (
                <View
                  key={user.id ?? index}
                  style={[styles.avatar, styles.initialAvatar, { marginLeft: index === 0 ? 0 : -12 }]}
                >
                  <Typography variant="semiBoldTxtxs">
                   {getInitials(user.name)}
                  </Typography>
                </View>
              )
            ))}
            {extraCount > 0 && (
              <View style={[styles.avatar, styles.moreAvatar]}>
                <Typography variant="semiBoldTxtxs" color={colors.gray[600]}>
                  +{extraCount}
                </Typography>
              </View>
            )}
          </View>
          <View style={{flexDirection:'row',alignItems:'center', gap:15}}>
          <View style={styles.statusBadge}>
            <Typography variant="mediumTxtxs">{capitalizeFirstLetter(type)}</Typography>
          </View>
          <View style={styles.statusBadge}>
            <View
              style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]}
            />
            <Typography variant="mediumTxtxs">{status}</Typography>
          </View>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default AssessmentCard;

