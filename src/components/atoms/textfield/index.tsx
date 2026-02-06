import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  Pressable,
  TextInput,
  TextInputFocusEventData,
  View,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { TextFieldProps } from './textfield';
import Typography from '../typography';
import { useStyles } from './styels';
import { useFocusEffect } from '@react-navigation/native';
import { renderNode } from '../../../utils/renderNode';

const TextField = forwardRef((props: TextFieldProps, ref) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocus, setInFocus] = useState<true | false>(false);

  const size = {
    Large: 128,
    Regular: 56,
    Medium: 44,
    Small: 40,
    Tab: 32,
  };
  const styles = useStyles(props, isFocus, size);
  useImperativeHandle(ref, () => inputRef.current);
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        inputRef.current?.blur();
        setInFocus(false);
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      {props.lable && (
        <View style={styles.labelRow}>
          <Typography variant="P1C">{props.lable}</Typography>
          {props.isRequired && (
            <Typography color={colors.mainColors.main} variant="P1C">
              *
            </Typography>
          )}
        </View>
      )}
      <Pressable
        onPress={(event) => {
          if (props.onPress) {
            props.onPress(event);
          }
        }}
        style={[styles.pressableBase, styles.pressableDynamic]}
      >
        {/* <View style={styles.topGlow} pointerEvents="none" /> */}
        {/* <View style={styles.bottomShadow} pointerEvents="none" /> */}
        {renderNode(props.startIcon)}
        {props.startIcon && props.showDivider && (
          <View style={styles.verticalDivider} />
        )}
        <TextInput
          {...props}
          ref={inputRef}
          placeholderTextColor={colors.gray[500]}
          style={[
            styles.inputBase,
            props.value ? styles.inputWithValue : styles.inputWithoutValue,
            styles.inputDynamic,
          ]}
          onFocus={(event: NativeSyntheticEvent<TextInputFocusEventData>) => {
            setInFocus(true);
            if (props.onFocus) {
              props.onFocus(event);
            }
          }}
          onBlur={(event: NativeSyntheticEvent<TextInputFocusEventData>) => {
            setInFocus(false);
            if (props.onBlur) {
              props.onBlur(event);
            }
          }}
          readOnly={props.disable ? true : props.readOnly}
          editable={props.disable ? true : props.editable}
        />
        {renderNode(props.endIcon)}
      </Pressable>
      {props.isError && props.error && (
        <Typography variant="regularTxtsm" color={colors.error[600]}>
          {props.error}
        </Typography>
      )}
    </View>
  );
});

export { TextField };
