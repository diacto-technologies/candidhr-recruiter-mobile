import React, { Fragment, useCallback } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Typography from '../../atoms/typography';
import Button from '../../atoms/button';
import { colors } from '../../../theme/colors';
import { useStyles } from './styles';
import { IConfirmModal } from './confirmmodal';
import { SvgXml } from 'react-native-svg';
import { deleteIcon } from '../../../assets/svg/deleteicon';
import { closeIcon } from '../../../assets/svg/closeicon';

const ConfirmModal = (props: IConfirmModal) => {
  const styles = useStyles();

  const handleClose = useCallback(() => {
    (props.onClose ?? props.onCancel)?.();
  }, [props]);

  const title = props.title ?? 'Confirm';
  const confirmText = props.confirmText ?? 'Remove';
  const cancelText = props.cancelText ?? 'Cancel';
  const headerIconName = props.headerIconName ?? 'alert-outline';
  const confirmIconName = props.confirmIconName ?? 'trash-outline';

  return (
    <Fragment>
      <Modal
        visible={props.visible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <KeyboardAvoidingView
          style={styles.backdrop}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {props.dismissOnBackdropPress ? (
            <Pressable style={{ ...StyleSheet.absoluteFillObject }} onPress={handleClose} />
          ) : null}

          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.headerIconWrap}>
                  <Ionicons name={headerIconName} size={20} color={colors.warning[800]} />
                </View>
                <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
                  {title}
                </Typography>
              </View>

              <Pressable onPress={handleClose} hitSlop={10}>
              <SvgXml xml={closeIcon}/>
              </Pressable>
            </View>

            <View style={styles.body}>
              {typeof props.message === 'string' ? (
                <Typography variant="semiBoldTxtlg" color={colors.gray[900]} style={styles.message}>
                  {props.message}
                </Typography>
              ) : (
                props.message
              )}
            </View>

            <View style={styles.footer}>
              <View style={{ flex: 1 }}>
                <Button
                  variant="contain"
                  buttonColor={colors.error[600]}
                  textColor={colors.base.white}
                  borderRadius={8}
                  startIcon={<SvgXml  xml={deleteIcon.replace(/(stroke)=".*?"/g, '$1="white"')} width={20} height={20}/>}
                  onPress={props.onConfirm}
                  {...props.confirmButtonProps}
                >
                  {confirmText}
                </Button>
              </View>

              <View style={{ flex: 1 }}>
                <Button
                  variant="contain"
                  buttonColor={colors.base.white}
                  textColor={colors.gray[700]}
                  borderRadius={8}
                  borderColor={colors.gray[300]}
                  borderWidth={1}
                  onPress={props.onCancel}
                  {...props.cancelButtonProps}
                >
                  {cancelText}
                </Button>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Fragment>
  );
};

export default ConfirmModal;

