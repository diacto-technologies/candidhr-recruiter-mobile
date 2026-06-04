import React from "react";
import { View, Image } from "react-native";
import Typography from "../typography";
import { colors } from "../../../theme/colors";
import { AvatarProps } from "./avatar";
import { useStyles } from "./styles";

export const CustomAvatar: React.FC<AvatarProps> = ({
  imageUrl,
  name,
  size = 40,
  borderWidth = 1,
  borderColor = "rgba(0,0,0,0.08)",
}) => {
  const initial = (name?.trim()?.[0] ?? "?").toUpperCase();
  const styles = useStyles(size, borderWidth, borderColor);

  return (
    <View style={styles.wrapper}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
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