import React, { Fragment } from 'react';
import { IButton } from './button';
import { ActivityIndicator, Pressable, View } from 'react-native';
import Typography from '../typography';
import { useStyles } from './styles';
import { renderNode } from '../../../utils/renderNode';
import { colors } from '../../../theme/colors';

const Button = (props: IButton) => {
  const styles = useStyles(props);

  const textcolor = {
    contain: props.textColor ? props.textColor : colors.common.white,
    text: props.textColor ? props.textColor : colors.mainColors.main,
    outline: props.textColor ? props.textColor : colors.mainColors.main,
  };

  const loaderColor = {
    contain: colors.common.white,
    text: colors.mainColors.main,
    outline: colors.mainColors.main,
  };

  const fontsize = {
    Large: 'H1B',
    Regular: 'P1M',   // Medium paragraph (you use this for highlighted text)
    Medium: 'H3',     // Normal body text
    Small: 'P2C',     // Caption/small text
    Tab: 'P1M',       // Tabs usually medium-weight (you use P1M for active tabs)
  };

  return (
    <Pressable {...props} style={[
      styles.button,
      props.borderRadius && { borderRadius: props.borderRadius },
    ]}>
      {props.isLoading ? (
        <ActivityIndicator color={loaderColor[props.variant || 'contain']} />
      ) : (
        <View style={styles.content}>
          {renderNode(props.startIcon)}

          <Typography
            variant={
              typeof props.size === 'number'
                ? (fontsize.Medium as 'H1')
                : (fontsize[props.size || 'Medium'] as 'H1')
            }
            color={props.textColor || textcolor[props.variant || 'contain']}
          >
            {props.children as string}
          </Typography>

          {renderNode(props.endIcon)}
        </View>
      )}
    </Pressable>
  );
};

export default Button;
