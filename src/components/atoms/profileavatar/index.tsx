import React from 'react';
import { View, Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { colors } from '../../../theme/colors';
import Typography from '../typography';

interface ProfileAvatarProps {
  imageUrl?: string | null;
  name?: string | null;
  size?: number;
  style?: ViewStyle;
  fontVariant?: string;

  /** extra padding outside avatar (gap/ring size) */
  outerSize?: number;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  imageUrl,
  name,
  size = 88,
  style,
  fontVariant = 'semiBoldDxs',
  outerSize = 8, // ✅ default outerSize
}) => {
  // ✅ total wrapper size = avatar size + outer gap
  const totalOuterSize = size + outerSize;

  const borderRadius = totalOuterSize / 2;
  const innerBorderRadius = size / 2;

  const getInitials = (fullName?: string | null): string => {
    if (!fullName?.trim()) return '';

    const words = fullName.trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return fullName.trim().substring(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  const outerStyle: ViewStyle = {
    width: totalOuterSize,
    height: totalOuterSize,
    borderRadius,
  };

  const innerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: innerBorderRadius,
  };

  const imageStyle: ImageStyle = {
    width: size,
    height: size,
    borderRadius: innerBorderRadius,
  };

  return (
    <View style={[styles.outerWrapper, outerStyle, style]}>
      <View style={[styles.borderWrapper, outerStyle]}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={imageStyle} resizeMode="stretch" />
        ) : (
          <View style={[styles.initialCircle, innerStyle]}>
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

const styles = StyleSheet.create({
  outerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderWrapper: {
    backgroundColor: colors.base.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    padding: 4,
  },
  initialCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray[100],
    shadowColor: '#0A0D12',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 8,
  },
});
