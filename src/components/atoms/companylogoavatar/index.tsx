import React from 'react';
import { View, Image, StyleSheet, Pressable, ViewStyle, ImageStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { colors } from '../../../theme/colors';
import Typography from '../typography';
import { editAvatarIcon } from '../../../assets/svg/editavatar';

interface CompanyLogoAvatarProps {
  /** URL of the company logo image */
  imageUrl?: string | null;
  /** Company name for generating initials when no image */
  name?: string | null;
  /** Size of the logo (width and height) */
  size?: number;
  /** Border radius of the logo container */
  borderRadius?: number;
  /** Custom style for the container */
  style?: ViewStyle;
  /** Font variant for initials */
  fontVariant?: string;
  /** Whether to show the edit badge */
  showEditBadge?: boolean;
  /** Callback when edit badge is pressed */
  onEditPress?: () => void;
  /** Size of the edit badge */
  badgeSize?: number;
  /** Custom edit icon (SVG XML string) */
  editIcon?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
}

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

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: borderRadius,
  };

  // Circular image inside the square container (like Mailchimp logo)
  const imageSize = size * 0.78;
  const imageStyle: ImageStyle = {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2, // Makes it circular
  };

  const badgeStyle: ViewStyle = {
    width: badgeSize,
    height: badgeSize,
    borderRadius: badgeSize / 2,
  };

  return (
    <View style={[styles.wrapper, style]}>
      <View style={[styles.container, containerStyle]}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={imageStyle} resizeMode="stretch" />
        ) : (
          <View style={[styles.initialsContainer, containerStyle]}>
            <Typography variant={fontVariant as any} color={colors.gray[500]}>
              {initials}
            </Typography>
          </View>
        )}
      </View>

      {showEditBadge && (
        <Pressable
          style={[styles.editBadge, badgeStyle]}
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

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignSelf: 'center',
  },
  container: {
    backgroundColor: colors.base.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  initialsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray[100],
  },
  editBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: colors.base.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
});
