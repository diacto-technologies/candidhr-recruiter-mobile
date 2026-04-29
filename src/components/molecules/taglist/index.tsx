import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Typography from "../../atoms/typography";
import { colors } from "../../../theme/colors";

interface TagListProps {
  data: string[];
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
  selectedColor?: {
    text: string;
    bg: string;
    border: string;
  };
  onSelect?: (selected: string[] | string, index: number) => void;
  multi?: boolean; // 🔥 NEW
  renderIcon?: (item: string, index: number) => React.ReactNode;
  /** Controlled selection for multi-select mode */
  selectedItems?: string[];
  /** Controlled selection for single-select mode */
  selectedItem?: string | null;
  /** Renders a remove control per tag; called with index */
  onRemove?: (index: number) => void;
}

const TagList: React.FC<TagListProps> = ({
  data = [],
  textColor = colors.success[700],
  bgColor = colors.success[50],
  borderColor = colors.success[200],
  selectedColor = {
    text: "#fff",
    bg: colors.brand[500],
    border: colors.brand[500],
  },
  onSelect,
  multi = false,
  renderIcon,
  selectedItems,
  selectedItem,
  onRemove,
}) => {
  const isSelectable = !!onSelect;
  const resolvedBg =
    bgColor === "" || bgColor == null ? colors.success[50] : bgColor;
  const resolvedText =
    textColor === "" || textColor == null ? colors.success[700] : textColor;
  const resolvedBorder =
    borderColor === "" || borderColor == null
      ? colors.success[200]
      : borderColor;

  // 🔥 state handles both modes
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  const controlledIndexes = useMemo(() => {
    if (multi) {
      if (!Array.isArray(selectedItems)) return null;
      const selectedSet = new Set(selectedItems.map((x) => String(x)));
      return data.reduce<number[]>((acc, item, idx) => {
        if (selectedSet.has(String(item))) acc.push(idx);
        return acc;
      }, []);
    }
    if (selectedItem == null) return null;
    const idx = data.findIndex((x) => String(x) === String(selectedItem));
    return idx >= 0 ? [idx] : [];
  }, [data, multi, selectedItem, selectedItems]);

  // If controlled selection is provided, keep internal state in sync.
  useEffect(() => {
    if (!controlledIndexes) return;
    setSelectedIndexes(controlledIndexes);
  }, [controlledIndexes]);

  const handlePress = (item: string, index: number) => {
    if (!isSelectable) return;

    if (multi) {
      let updated: number[];

      if (selectedIndexes.includes(index)) {
        // remove
        updated = selectedIndexes.filter((i) => i !== index);
      } else {
        // add
        updated = [...selectedIndexes, index];
      }

      setSelectedIndexes(updated);

      const selectedItems = updated.map((i) => data[i]);
      onSelect?.(selectedItems, index);
    } else {
      setSelectedIndexes([index]);
      onSelect?.(item, index);
    }
  };

  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        const isSelected = isSelectable && selectedIndexes.includes(index);

        const content = (
          <View
            style={[
              styles.tag,
              {
                backgroundColor: isSelected ? selectedColor.bg : resolvedBg,
                borderColor: isSelected ? selectedColor.border : resolvedBorder,
              },
            ]}
          >
            {renderIcon && (
              <View style={styles.iconContainer}>
                {renderIcon(item, index)}
              </View>
            )}

            <Typography
              variant="mediumTxtsm"
              color={isSelected ? selectedColor.text : resolvedText}
              style={styles.tagLabel}
            >
              {item}
            </Typography>
            {onRemove ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Remove"
                onPress={() => onRemove(index)}
                hitSlop={8}
                style={styles.remove}
              >
                <Typography
                  variant="mediumTxtsm"
                  color={
                    isSelected ? selectedColor.text : resolvedText
                  }
                >
                  ×
                </Typography>
              </Pressable>
            ) : null}
          </View>
        );

        return isSelectable ? (
          <Pressable
            key={`${item}-${index}`}
            onPress={() => handlePress(item, index)}
          >
            {content}
          </Pressable>
        ) : (
          <View key={`${item}-${index}`}>{content}</View>
        );
      })}
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
  tagLabel: {
    flexShrink: 1,
  },
  remove: {
    marginLeft: 4,
    paddingLeft: 2,
  },
  iconContainer: {
    marginRight: 6,
  },
});