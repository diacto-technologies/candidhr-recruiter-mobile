import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { colors } from '../../../theme/colors';
import Typography from '../typography';
import { editAvatarIcon } from '../../../assets/svg/editavatar';
import { CompanyLogoAvatarProps } from './companylogoavatar.d';
import { useStyles } from './styles';

const CompanyLogoAvatar: React.FC<CompanyLogoAvatarProps> = ({
  imageUrl,
  name,
  size = 96,
  borderRadius = 16,
  style,
  fontVariant = 'semiBoldDxs',
  showEditBadge = true,
  onEditPress,
  badgeSize = 32,
  editIcon = editAvatarIcon,
  disabled = false,
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
  const imageSize = size * 0.78;

  const styles = useStyles(size, borderRadius, imageSize, badgeSize);

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.container}>
        {imageUrl ? (
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>
        ) : (
          <View style={styles.initialsContainer}>
            <Typography variant={fontVariant as any} color={colors.gray[500]}>
              {initials}
            </Typography>
          </View>
        )}
      </View>

      {showEditBadge && (
        <Pressable
          style={styles.editBadge}
          onPress={onEditPress}
          disabled={disabled}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <SvgXml xml={editIcon} width={badgeSize * 0.5} height={badgeSize * 0.5} />
        </Pressable>
      )}
    </View>
  );
};

export default CompanyLogoAvatar;

