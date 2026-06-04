import React from "react";
import { Pressable, View } from "react-native";
import { colors } from "../../../theme/colors";
import { Typography } from "../../atoms";
import { SortBottomSheetProps } from "./sortbottomsheet.d";
import { useStyles } from "./styles";

const SortBottomSheet: React.FC<SortBottomSheetProps> = ({
  options = [],
  selectedValue,
  onSelect,
  onApply,
}) => {
  const styles = useStyles();

  return (
    <View style={styles.sortSheetContent}>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            style={styles.sortRow}
          >
            <Typography variant="semiBoldTxtmd" color={colors.gray[700]}>
              {option.label}
            </Typography>

            <View
              style={[
                styles.radioOuter,
                isSelected && styles.radioOuterSelected,
              ]}
            >
              {isSelected && <View style={styles.radioInner} />}
            </View>
          </Pressable>
        );
      })}

      <Pressable style={styles.applyButton} onPress={onApply}>
        <Typography variant="semiBoldTxtmd" color={colors.base.white}>
          Apply
        </Typography>
      </Pressable>
    </View>
  );
};

export default SortBottomSheet;