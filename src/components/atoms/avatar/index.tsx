import React, { useState } from "react";
import { View, Image } from "react-native";
import Typography from "../typography";
import { colors } from "../../../theme/colors";
import { AvatarProps } from "./avatar";
import { useStyles } from "./styles";
import { TypographyProps } from "../typography/typography.d";

export const getInitials = (fullName?: string | null): string => {
  if (!fullName?.trim()) return "";

  const words = fullName.trim().split(/[\s._-]+/).filter(Boolean);
  if (words.length >= 2) {
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  }
  return fullName.trim().substring(0, Math.min(2, fullName.trim().length)).toUpperCase();
};

export const CustomAvatar: React.FC<AvatarProps> = ({
  imageUrl,
  name,
  size = 40,
  borderWidth = 1,
  borderColor = "rgba(0,0,0,0.08)",
  fontVariant,
}) => {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);
  const styles = useStyles(size, borderWidth, borderColor);
  const showImage = Boolean(imageUrl && !imageError);
  const computedFontVariant: TypographyProps['variant'] =
    fontVariant ?? (size <= 28 ? "semiBoldTxtxs" : "semiBoldTxtmd");

  return (
    <View style={styles.wrapper}>
      {showImage ? (
        <Image
          source={{ uri: imageUrl as string }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <Typography variant={computedFontVariant} color={colors.gray[700]}>
          {initials}
        </Typography>
      )}
    </View>
  );
};