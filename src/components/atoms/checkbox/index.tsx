import React from 'react';
import { ICheckBox } from './checkbox';
import { Pressable, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useStyles } from './styles';
import { getCheckboxChecked } from '../../../assets/svg/checkboxChecked';
import { colors } from '../../../theme/colors';

const CheckBox = (props: ICheckBox) => {
  const styles = useStyles(props.color);
  return props.type === 'round' ? (
    <Pressable
      onPress={() => {
        if (props.onChange) {
          props.onChange();
        }
      }}
      style={styles.checkBoxRound}
    >
      {props.checked && <View style={styles.checkBoxRoundActive} />}
    </Pressable>
  ) : (
    <Pressable
      onPress={() => {
        if (props.onChange) {
          props.onChange();
        }
      }}
      style={styles.checkBox}
    >
      {props.checked && <SvgXml xml={getCheckboxChecked(props.color || colors.brand[600])} />}
    </Pressable>
  );
};

export default CheckBox;
