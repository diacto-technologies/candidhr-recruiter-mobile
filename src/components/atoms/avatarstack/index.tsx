import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { colors } from '../../../theme/colors';

export interface AvatarStackProps {
  images: string[]; // array of image URLs
  size?: number; // diameter of each avatar
  maxVisible?: number; // how many avatars to show before +N
}

const AvatarStack: React.FC<AvatarStackProps> = ({
  images,
  size = 28,
  maxVisible = 3,
}) => {
  const radius = size / 2;
  const visible = images.slice(0, maxVisible);
  const remainingCount = images.length - visible.length;

  if (!images.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      {visible.map((uri, index) => (
        <View
          key={`${uri}-${index}`}
          style={[
            styles.avatarWrapper,
            {
              width: size,
              height: size,
              borderRadius: radius,
              marginLeft: index === 0 ? 0 : -size * 0.3,
              zIndex: visible.length - index,
            },
          ]}
        >
          <Image
            source={{ uri }}
            style={{
              width: size,
              height: size,
              borderRadius: radius,
            }}
          />
        </View>
      ))}

      {remainingCount > 0 && (
        <View
          style={[
            styles.moreWrapper,
            {
              width: size,
              height: size,
              borderRadius: radius,
              marginLeft: -size * 0.3,
            },
          ]}
        >
          <Text style={styles.moreText}>{`+${remainingCount}`}</Text>
        </View>
      )}
    </View>
  );
};

export default AvatarStack;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    borderWidth: 1,
    borderColor: colors.base.white,
    overflow: 'hidden',
  },
  moreWrapper: {
    backgroundColor: colors.base.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray[700],
  },
});

