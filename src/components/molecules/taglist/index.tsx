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
}) => {
  const styles = useStyles(bgColor, borderColor);

  return (
    <View style={styles.container}>
      {data?.map((item, index) => (
        <View key={`${item}-${index}`} style={styles.tag}>
          {renderIcon && (
            <View style={styles.iconContainer}>
              {renderIcon(item, index)}
            </View>
          )}

          <Typography variant="mediumTxtsm" color={textColor}>
            {item}
          </Typography>
        </View>
      ))}
    </View>
  );
};

export default TagList;