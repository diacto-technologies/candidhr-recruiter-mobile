import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../theme/colors';
import Typography from '../../atoms/typography';
import { IBottomsheet } from './bottomsheet';
import IconButton from '../../atoms/iconbutton';
import { useStyles } from './styles';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';
import { screenHeight } from '../../../utils/devicelayout';
import { setApplicationsFilters } from '../../../features/applications/slice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import AppliedFor from '../filtersheetcontent/locationchip';

const BottomSheet = ({
  visible,
  onClose,
  children,
  title,
  subTitle,
  showHeadline,
  onClearAll
}: IBottomsheet) => {
  const { insetsTop } = useRNSafeAreaInsets();
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useAppDispatch();
  const styles = useStyles();

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
    } else {
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setModalVisible(false);
      });
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const isClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Fragment>
      {/* {visible &&
                <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
            } */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => {
          isClose();
        }}
      >
        <View style={styles.closeIcon}>
          <TouchableOpacity
            style={styles.touchableMask}
            activeOpacity={1}
            onPress={() => isClose()}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.sheetContainer, { maxHeight: screenHeight - (insetsTop + 20), marginBottom: 20 }]}
          >
            <View style={{
              flex: 1,
              marginTop: 5,
              borderTopWidth: 2,
              borderLeftWidth: 2,
              borderRightWidth: 2,
              borderTopRightRadius: 16,
              borderTopLeftRadius: 16,
              paddingTop: 10,
              marginHorizontal: 5,
              borderColor: colors.mainColors.borderColor,
            }}>
              <Pressable style={{ width: 40, borderWidth: 2, borderRadius: 8, borderColor: '#E9EAEB', alignSelf: 'center' }} onPress={onClose}></Pressable>
              <View style={styles.header}>
                <View style={styles.touchableMask}>
                  {title && showHeadline ? (
                    <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                      {title}
                    </Typography>
                  ) : (
                    <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                      {title}
                    </Typography>
                  )}
                  {subTitle && (
                    <Typography variant="semiBoldTxtmd" style={styles.subTitle}>
                      {subTitle}
                    </Typography>
                  )}
                </View>
                {/* <IconButton
                onPress={() => {
                  isClose();
                }}
                size={24}
                variant="text"
              >
                <Ionicons name="close-outline" size={20} />
              </IconButton> */}
                <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end' }} onPress={() => onClearAll?.()}>
                  <Typography variant="semiBoldTxtsm" color={colors.error[600]}>Clear all</Typography>
                </TouchableOpacity>
              </View>
            </View>
            {children}
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </Fragment>
  );
};

export default BottomSheet;
