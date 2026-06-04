import React from 'react';
import { View, Image } from 'react-native';
import { colors } from '../../../theme/colors';
import Typography from '../typography';
import { ProfileAvatarProps } from './profileavatar.d';
import { useStyles } from './styles';

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  imageUrl,
  name,
  size = 88,
  style,
  fontVariant = 'semiBoldDxs',
  outerSize = 8,
}) => {
  const getInitials = (fullName?: string | null): string => {
    if (!fullName?.trim()) return '';

    const words = fullName.trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return fullName.trim().substring(0, 2).toUpperCase();
  };

  const initials = getInitials(name);
  const styles = useStyles(size, outerSize);

  return (
    <View style={[styles.outerWrapper, style]}>
      <View style={styles.borderWrapper}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="stretch" />
        ) : (
          <View style={styles.initialCircle}>
            <Typography variant={fontVariant as any} color={colors.gray[500]}>
              {initials}
            </Typography>
          </View>
        )}
      </View>
    </View>
  );
};

export default ProfileAvatar;

