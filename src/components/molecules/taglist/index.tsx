import React from "react";
import { View } from "react-native";
import Typography from "../../atoms/typography";
import { colors } from "../../../theme/colors";
import { TagListProps } from "./taglist.d";
import { useStyles } from "./styles";

const TagList: React.FC<TagListProps> = ({
  data = [],
  textColor = colors.success[700],
  bgColor = colors.success[50],
  borderColor = colors.success[200],
  renderIcon,
  size = "md",
  textVariant,
  tagStyle,
  containerStyle,
}) => {
  const styles = useStyles(bgColor, borderColor, size);
  const resolvedTextVariant =
    textVariant ?? (size === "sm" ? "mediumTxtxs" : "mediumTxtsm");

  return (
    <View style={[styles.container, containerStyle]}>
      {data?.map((item, index) => (
        <View key={`${item}-${index}`} style={[styles.tag, tagStyle]}>
          {renderIcon && (
            <View style={styles.iconContainer}>
              {renderIcon(item, index)}
            </View>
          )}

          <Typography variant={resolvedTextVariant} color={textColor}>
            {item}
          </Typography>
        </View>
      ))}
    </View>
  );
};

export default TagList;