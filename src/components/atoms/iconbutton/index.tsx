import React from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import { IIconButton } from './iconbutton';
import { useStyles } from './styles';
import { colors } from '../../../theme/colors';

const IconButton = (props: IIconButton) => {
  const styles = useStyles(props);

  const loaderColor = {
    contain: colors.common.white,
    text: colors.mainColors.main,
    outline: colors.mainColors.main,
  };

  return (
    <Pressable {...props} style={styles.button}>
      {props.isLoading ? (
        <ActivityIndicator color={loaderColor[props.variant || 'contain']} />
      ) : (
        (props.children as string)
      )}
    </Pressable>
  );
};

export default IconButton;
