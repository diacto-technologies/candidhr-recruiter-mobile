import React from "react";
import { View, StyleSheet } from "react-native";
import Typography from "../../atoms/typography";
import { colors } from "../../../theme/colors";

interface TagListProps {
  data: string[];
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
  renderIcon?: (item: string, index: number) => React.ReactNode;
}

const TagList: React.FC<TagListProps> = ({
  data = [],
  textColor = colors.success[700],
  bgColor = colors.success[50],
  borderColor = colors.success[200],
  renderIcon,
}) => {
  return (
    <View style={styles.container}>
      {data?.map((item, index) => (
        <View
          key={`${item}-${index}`}
          style={[
            styles.tag,
            {
              backgroundColor: bgColor,
              borderColor: borderColor,
            },
          ]}
        >
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  iconContainer: {
    marginRight: 6,
  },
});