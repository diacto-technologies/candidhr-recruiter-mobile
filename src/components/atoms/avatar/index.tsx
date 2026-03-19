import React from "react";
import { View, Image, StyleSheet } from "react-native";
import Typography from "../typography";
import { colors } from "../../../theme/colors";
interface AvatarProps {
  imageUrl?: string;
  name?: string;
  size?: number;
  borderWidth?: number;
  borderColor?: string;
}

export const CustomAvatar: React.FC<AvatarProps> = ({
  imageUrl,
  name,
  size = 40,
  borderWidth = 1,
  borderColor = "rgba(0,0,0,0.08)",
}) => {
  const initial = (name?.trim()?.[0] ?? "?").toUpperCase();

  return (
    <View
      style={[
        styles.wrapper,
        {
          height: size,
          width: size,
          borderRadius: size / 2,
          borderWidth,
          borderColor,
        },
      ]}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{
            height: size,
            width: size,
            borderRadius: size / 2,
          }}
          resizeMode="cover"
        />
      ) : (
        <Typography variant="semiBoldTxtlg" color={colors.gray[700]}>
          {initial}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.gray[100],
    alignItems: "center",
    justifyContent: "center",
  },
});