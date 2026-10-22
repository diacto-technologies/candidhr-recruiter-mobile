import React from 'react';
import { Pressable } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { checkMarkIcon } from '../../../../../../assets/svg/checkmark';
import { ColorSwatchProps } from '../branding.d';
import { useStyles } from '../styles';

export const ColorSwatch: React.FC<ColorSwatchProps> = React.memo(({
  color,
  isSelected,
  onSelect,
}) => {
  const styles = useStyles();

  return (
    <Pressable
      style={[
        styles.swatchBtn,
        { backgroundColor: color },
        isSelected && styles.swatchBtnSelected,
      ]}
      onPress={() => onSelect(color)}
      accessibilityRole="button"
      accessibilityLabel={`Select color ${color}`}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
      {isSelected && (
        <SvgXml xml={checkMarkIcon} width={14} height={14} />
      )}
    </Pressable>
  );
});
